import type { ClassId } from './course';

export type UserRole = 'student' | 'instructor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAtMs: number;
  lastLoginAtMs: number;
}

export type ExamQuestionType = 'mcq' | 'multi-select' | 'short-answer';

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  prompt: string;
  options: string[]; // Empty array for short-answer
  correctIndices: number[]; // Single-element for mcq, 2+ for multi-select, empty for short-answer
  hint: string;
  reviewSlideNumber: number; // 1-based slide number in that class
  explanationEn: string;
  explanationBanglish: string;
  rubricGuide?: string; // Shown to instructor when reviewing short-answer
}

export interface ClassExamDefinition {
  classId: ClassId;
  examVersion: string;
  title: string;
  subtitle: string;
  passPercent: number; // 80
  estimatedMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamAnswerSnapshot {
  questionId: string;
  questionType: ExamQuestionType;
  prompt: string;
  options: string[];
  selectedIndices: number[];
  correctIndices: number[];
  shortAnswerText: string;
  isCorrect: boolean;
  hint: string;
  reviewSlideNumber: number;
  explanationEn: string;
  explanationBanglish: string;
}

export interface ExamAttemptRecord {
  attemptId: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  classId: ClassId;
  classTitle: string;
  examVersion: string;
  attemptNumber: number;
  autoGradedCorrect: number;
  autoGradedTotal: number;
  scorePercent: number;
  passed: boolean;
  answersUnlocked: boolean;
  answers: ExamAnswerSnapshot[];
  submittedAtMs: number;
  updatedAtMs: number;
  reviewStatus: 'pending' | 'reviewed';
  teacherFeedback: string;
  shortAnswerScore: number; // 0..2
  reviewedBy: string;
}

export interface ClassAttemptSummary {
  classId: ClassId;
  totalAttempts: number;
  firstAttemptScore: number | null;
  bestScore: number | null;
  latestScore: number | null;
  passed: boolean;
  unlockedByHistory: boolean;
  latestAttempt: ExamAttemptRecord | null;
}

export interface InstructorDashboardMetrics {
  uniqueStudents: number;
  totalAttempts: number;
  avgFirstTryScore: number;
  avgBestScore: number;
  pendingReviews: number;
}
