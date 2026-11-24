import type { ClassId } from '../types/course';
import type {
  ClassAttemptSummary,
  ClassExamDefinition,
  ExamAnswerSnapshot,
  ExamAttemptRecord,
  InstructorDashboardMetrics,
} from '../types/exam';

export const INSTRUCTOR_EMAIL = 'ashiqebinrahman@gmail.com';
export const PASS_SCORE_PERCENT = 80;
export const UNLOCK_ATTEMPT_THRESHOLD = 3;

export const BLUEPRINT_LIMITS = {
  uidMax: 128,
  emailMax: 200,
  displayNameMax: 120,
  photoUrlMax: 500,
  classTitleMax: 180,
  examVersionMax: 32,
  shortAnswerMax: 1200,
  teacherFeedbackMax: 2000,
  maxAnswers: 20,
} as const;

export function truncateString(value: string, maxLen: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen);
}

export function sanitizeDocumentId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, BLUEPRINT_LIMITS.uidMax);
  return cleaned.length > 0 ? cleaned : `id_${Date.now()}`;
}

export function isInstructorEmail(email?: string | null, emailVerified?: boolean): boolean {
  if (!email) return false;
  if (emailVerified === false) return false;
  return email.toLowerCase() === INSTRUCTOR_EMAIL;
}

/**
 * Compares two index arrays as sets (order-insensitive, deduplicated).
 */
export function areIndexSetsEqual(selected: number[], expected: number[]): boolean {
  const uniqueSelected = Array.from(new Set(selected)).sort((a, b) => a - b);
  const uniqueExpected = Array.from(new Set(expected)).sort((a, b) => a - b);
  if (uniqueSelected.length !== uniqueExpected.length) return false;
  return uniqueSelected.every((val, idx) => val === uniqueExpected[idx]);
}

/**
 * Option A Smart Reveal Rule:
 * - Instructor ALWAYS sees exact correct answers & explanations.
 * - If student answered THIS specific question correctly -> show confirmation + explanation.
 * - If student answered THIS question WRONG:
 *   - Attempt #1 & #2 (and score < 80%): show ONLY Hint + Review Slide link (NO spoiler answer!).
 *   - Attempt #3+ OR score >= 80% (or already unlocked in class history): unlock full Correct Answer + Explanation.
 */
export function shouldRevealCorrectAnswer(params: {
  attemptNumber: number;
  scorePercent: number;
  isInstructor: boolean;
  isQuestionCorrect: boolean;
  unlockedByClassHistory?: boolean;
}): boolean {
  if (params.isInstructor) return true;
  if (params.isQuestionCorrect) return true;
  if (params.unlockedByClassHistory) return true;
  return (
    params.attemptNumber >= UNLOCK_ATTEMPT_THRESHOLD ||
    params.scorePercent >= PASS_SCORE_PERCENT
  );
}

export interface StudentDraftAnswers {
  selections: Record<string, number[]>;
  shortAnswers: Record<string, string>;
}

export interface EvaluatedExamSubmission {
  autoGradedCorrect: number;
  autoGradedTotal: number;
  scorePercent: number;
  passed: boolean;
  answersUnlocked: boolean;
  answers: ExamAnswerSnapshot[];
}

export function evaluateExamSubmission(
  exam: ClassExamDefinition,
  draft: StudentDraftAnswers,
  attemptNumber: number
): EvaluatedExamSubmission {
  let autoGradedCorrect = 0;
  let autoGradedTotal = 0;

  const answers: ExamAnswerSnapshot[] = exam.questions
    .slice(0, BLUEPRINT_LIMITS.maxAnswers)
    .map((q) => {
      if (q.type === 'short-answer') {
        const text = truncateString(draft.shortAnswers[q.id] ?? '', BLUEPRINT_LIMITS.shortAnswerMax);
        return {
          questionId: q.id,
          questionType: q.type,
          prompt: q.prompt,
          options: [],
          selectedIndices: [],
          correctIndices: [],
          shortAnswerText: text,
          isCorrect: false,
          hint: q.hint,
          reviewSlideNumber: q.reviewSlideNumber,
          explanationEn: q.explanationEn,
          explanationBanglish: q.explanationBanglish,
        };
      }

      autoGradedTotal += 1;
      const rawSelected = draft.selections[q.id] ?? [];
      const boundedSelected = Array.from(
        new Set(rawSelected.filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < q.options.length))
      ).sort((a, b) => a - b);

      const isCorrect = areIndexSetsEqual(boundedSelected, q.correctIndices);
      if (isCorrect) autoGradedCorrect += 1;

      return {
        questionId: q.id,
        questionType: q.type,
        prompt: q.prompt,
        options: q.options,
        selectedIndices: boundedSelected,
        correctIndices: [...q.correctIndices].sort((a, b) => a - b),
        shortAnswerText: '',
        isCorrect,
        hint: q.hint,
        reviewSlideNumber: q.reviewSlideNumber,
        explanationEn: q.explanationEn,
        explanationBanglish: q.explanationBanglish,
      };
    });

  const safeTotal = Math.max(1, autoGradedTotal);
  const scorePercent = Math.round((autoGradedCorrect / safeTotal) * 100);
  const passed = scorePercent >= exam.passPercent;
  const answersUnlocked = attemptNumber >= UNLOCK_ATTEMPT_THRESHOLD || passed;

  return {
    autoGradedCorrect,
    autoGradedTotal: safeTotal,
    scorePercent,
    passed,
    answersUnlocked,
    answers,
  };
}

export function validateExamDraftComplete(
  exam: ClassExamDefinition,
  draft: StudentDraftAnswers
): { valid: boolean; missingQuestionNumbers: number[] } {
  const missingQuestionNumbers: number[] = [];
  exam.questions.forEach((q, idx) => {
    if (q.type === 'short-answer') {
      const text = (draft.shortAnswers[q.id] ?? '').trim();
      if (text.length < 8) {
        missingQuestionNumbers.push(idx + 1);
      }
    } else {
      const picked = draft.selections[q.id] ?? [];
      if (picked.length === 0) {
        missingQuestionNumbers.push(idx + 1);
      }
    }
  });
  return {
    valid: missingQuestionNumbers.length === 0,
    missingQuestionNumbers,
  };
}

export function computeStudentClassSummary(
  attempts: ExamAttemptRecord[],
  classId: ClassId
): ClassAttemptSummary {
  const forClass = attempts
    .filter((a) => a.classId === classId)
    .sort((a, b) => a.attemptNumber - b.attemptNumber);

  if (forClass.length === 0) {
    return {
      classId,
      totalAttempts: 0,
      firstAttemptScore: null,
      bestScore: null,
      latestScore: null,
      passed: false,
      unlockedByHistory: false,
      latestAttempt: null,
    };
  }

  const firstAttemptScore = forClass[0].scorePercent;
  const bestScore = Math.max(...forClass.map((a) => a.scorePercent));
  const latestAttempt = forClass[forClass.length - 1];
  const passed = forClass.some((a) => a.passed);
  const unlockedByHistory = forClass.some((a) => a.answersUnlocked) || forClass.length >= UNLOCK_ATTEMPT_THRESHOLD;

  return {
    classId,
    totalAttempts: forClass.length,
    firstAttemptScore,
    bestScore,
    latestScore: latestAttempt.scorePercent,
    passed,
    unlockedByHistory,
    latestAttempt,
  };
}

export function computeInstructorMetrics(
  attempts: ExamAttemptRecord[]
): InstructorDashboardMetrics {
  if (attempts.length === 0) {
    return {
      uniqueStudents: 0,
      totalAttempts: 0,
      avgFirstTryScore: 0,
      avgBestScore: 0,
      pendingReviews: 0,
    };
  }

  const studentSet = new Set(attempts.map((a) => a.studentUid));
  const pendingReviews = attempts.filter((a) => a.reviewStatus === 'pending').length;

  // Group by (studentUid, classId) to compute true first-try vs best score per student-class
  const groups = new Map<string, ExamAttemptRecord[]>();
  for (const att of attempts) {
    const key = `${att.studentUid}::${att.classId}`;
    const list = groups.get(key) ?? [];
    list.push(att);
    groups.set(key, list);
  }

  let firstSum = 0;
  let bestSum = 0;
  for (const list of groups.values()) {
    list.sort((a, b) => a.attemptNumber - b.attemptNumber);
    firstSum += list[0].scorePercent;
    bestSum += Math.max(...list.map((a) => a.scorePercent));
  }

  const groupCount = Math.max(1, groups.size);
  return {
    uniqueStudents: studentSet.size,
    totalAttempts: attempts.length,
    avgFirstTryScore: Math.round(firstSum / groupCount),
    avgBestScore: Math.round(bestSum / groupCount),
    pendingReviews,
  };
}

export function sanitizeTeacherFeedback(feedback: string, score: number): {
  teacherFeedback: string;
  shortAnswerScore: number;
} {
  const clampedScore = Math.max(0, Math.min(2, Math.round(Number.isFinite(score) ? score : 0)));
  return {
    teacherFeedback: truncateString(feedback, BLUEPRINT_LIMITS.teacherFeedbackMax),
    shortAnswerScore: clampedScore,
  };
}
