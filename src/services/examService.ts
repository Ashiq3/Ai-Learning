import type { User } from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { OperationType, db, handleFirestoreError } from '../firebase';
import type { ClassId } from '../types/course';
import type {
  ClassExamDefinition,
  ExamAnswerSnapshot,
  ExamAttemptRecord,
  UserProfile,
  UserRole,
} from '../types/exam';
import {
  BLUEPRINT_LIMITS,
  evaluateExamSubmission,
  isInstructorEmail,
  sanitizeDocumentId,
  sanitizeTeacherFeedback,
  truncateString,
  type StudentDraftAnswers,
} from '../utils/examLogic';

function toMillis(ts: unknown): number {
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts && typeof ts === 'object' && 'seconds' in ts) {
    const secs = Number((ts as { seconds: unknown }).seconds);
    if (Number.isFinite(secs)) return secs * 1000;
  }
  return Date.now();
}

function mapAttemptDoc(data: Record<string, unknown>, fallbackId: string): ExamAttemptRecord {
  return {
    attemptId: String(data.attemptId ?? fallbackId),
    studentUid: String(data.studentUid ?? ''),
    studentName: String(data.studentName ?? 'Student'),
    studentEmail: String(data.studentEmail ?? ''),
    classId: (Number(data.classId) || 1) as ClassId,
    classTitle: String(data.classTitle ?? ''),
    examVersion: String(data.examVersion ?? 'v1'),
    attemptNumber: Number(data.attemptNumber ?? 1),
    autoGradedCorrect: Number(data.autoGradedCorrect ?? 0),
    autoGradedTotal: Number(data.autoGradedTotal ?? 1),
    scorePercent: Number(data.scorePercent ?? 0),
    passed: Boolean(data.passed),
    answersUnlocked: Boolean(data.answersUnlocked),
    answers: Array.isArray(data.answers) ? (data.answers as ExamAnswerSnapshot[]) : [],
    submittedAtMs: toMillis(data.submittedAt),
    updatedAtMs: toMillis(data.updatedAt),
    reviewStatus: data.reviewStatus === 'reviewed' ? 'reviewed' : 'pending',
    teacherFeedback: String(data.teacherFeedback ?? ''),
    shortAnswerScore: Number(data.shortAnswerScore ?? 0),
    reviewedBy: String(data.reviewedBy ?? ''),
  };
}

/**
 * Ensures /users/{uid} exists with strict blueprint parity and server timestamps.
 */
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const safeUid = sanitizeDocumentId(user.uid);
  const path = `users/${safeUid}`;
  const ref = doc(db, 'users', safeUid);
  const email = truncateString(user.email ?? '', BLUEPRINT_LIMITS.emailMax);
  const displayName = truncateString(
    user.displayName || email.split('@')[0] || 'Course Learner',
    BLUEPRINT_LIMITS.displayNameMax
  );
  const photoURL = truncateString(user.photoURL ?? '', BLUEPRINT_LIMITS.photoUrlMax);
  const expectedRole: UserRole = isInstructorEmail(user.email, user.emailVerified)
    ? 'instructor'
    : 'student';

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: safeUid,
        email,
        displayName,
        photoURL,
        role: expectedRole,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
      const now = Date.now();
      return {
        uid: safeUid,
        email,
        displayName,
        photoURL,
        role: expectedRole,
        createdAtMs: now,
        lastLoginAtMs: now,
      };
    }

    const existing = snap.data();
    await updateDoc(ref, {
      displayName,
      photoURL,
      lastLoginAt: serverTimestamp(),
    });

    return {
      uid: safeUid,
      email: String(existing.email ?? email),
      displayName,
      photoURL,
      role: expectedRole,
      createdAtMs: toMillis(existing.createdAt),
      lastLoginAtMs: Date.now(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserAttempts(
  studentUid: string,
  onData: (attempts: ExamAttemptRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'examAttempts';
  const q = query(collection(db, path), where('studentUid', '==', studentUid));

  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs
        .map((d) => mapAttemptDoc(d.data() as Record<string, unknown>, d.id))
        .sort((a, b) => b.submittedAtMs - a.submittedAtMs);
      onData(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

export function subscribeAllAttempts(
  onData: (attempts: ExamAttemptRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'examAttempts';
  const q = query(collection(db, path));

  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs
        .map((d) => mapAttemptDoc(d.data() as Record<string, unknown>, d.id))
        .sort((a, b) => b.submittedAtMs - a.submittedAtMs);
      onData(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

export async function submitExamAttempt(params: {
  user: User;
  exam: ClassExamDefinition;
  classTitle: string;
  draft: StudentDraftAnswers;
  attemptNumber: number;
}): Promise<ExamAttemptRecord> {
  const { user, exam, classTitle, draft, attemptNumber } = params;

  // Guarantee user profile exists before writing attempt (Global Consistency Invariant)
  await ensureUserProfile(user);

  const safeUid = sanitizeDocumentId(user.uid);
  const clampedAttemptNumber = Math.max(1, Math.min(500, Math.round(attemptNumber)));
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const attemptId = sanitizeDocumentId(
    `c${exam.classId}_${safeUid.slice(0, 12)}_a${clampedAttemptNumber}_${Date.now()}_${randomSuffix}`
  );
  const path = `examAttempts/${attemptId}`;

  const evaluated = evaluateExamSubmission(exam, draft, clampedAttemptNumber);
  const studentEmail = truncateString(user.email ?? '', BLUEPRINT_LIMITS.emailMax);
  const studentName = truncateString(
    user.displayName || studentEmail.split('@')[0] || 'Student',
    BLUEPRINT_LIMITS.displayNameMax
  );
  const safeClassTitle = truncateString(classTitle, BLUEPRINT_LIMITS.classTitleMax);
  const safeExamVersion = truncateString(exam.examVersion, BLUEPRINT_LIMITS.examVersionMax);

  const firestorePayload = {
    attemptId,
    studentUid: safeUid,
    studentName,
    studentEmail,
    classId: exam.classId,
    classTitle: safeClassTitle,
    examVersion: safeExamVersion,
    attemptNumber: clampedAttemptNumber,
    autoGradedCorrect: evaluated.autoGradedCorrect,
    autoGradedTotal: evaluated.autoGradedTotal,
    scorePercent: evaluated.scorePercent,
    passed: evaluated.passed,
    answersUnlocked: evaluated.answersUnlocked,
    answers: evaluated.answers,
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reviewStatus: 'pending' as const,
    teacherFeedback: '',
    shortAnswerScore: 0,
    reviewedBy: '',
  };

  try {
    await setDoc(doc(db, 'examAttempts', attemptId), firestorePayload);
    const now = Date.now();
    return {
      ...firestorePayload,
      submittedAtMs: now,
      updatedAtMs: now,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveInstructorFeedback(params: {
  attemptId: string;
  reviewerEmail: string;
  feedback: string;
  shortAnswerScore: number;
}): Promise<void> {
  const safeId = sanitizeDocumentId(params.attemptId);
  const path = `examAttempts/${safeId}`;
  const clean = sanitizeTeacherFeedback(params.feedback, params.shortAnswerScore);
  const reviewedBy = truncateString(params.reviewerEmail, BLUEPRINT_LIMITS.emailMax);

  try {
    await updateDoc(doc(db, 'examAttempts', safeId), {
      reviewStatus: 'reviewed',
      teacherFeedback: clean.teacherFeedback,
      shortAnswerScore: clean.shortAnswerScore,
      reviewedBy,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
