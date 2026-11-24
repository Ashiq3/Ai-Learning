import assert from 'node:assert/strict';
import test from 'node:test';
import type { ClassExamDefinition, ExamAttemptRecord } from '../types/exam.ts';
import {
  areIndexSetsEqual,
  computeInstructorMetrics,
  computeStudentClassSummary,
  evaluateExamSubmission,
  isInstructorEmail,
  sanitizeTeacherFeedback,
  shouldRevealCorrectAnswer,
  validateExamDraftComplete,
} from './examLogic.ts';

const SAMPLE_EXAM: ClassExamDefinition = {
  classId: 1,
  examVersion: 'v1',
  title: 'Class 01 Official Exam',
  subtitle: 'Test',
  passPercent: 80,
  estimatedMinutes: 15,
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      prompt: 'Where does Frontend run?',
      options: ['User browser', 'Postgres', 'DNS', 'GPU'],
      correctIndices: [0],
      hint: 'Check Slide 7',
      reviewSlideNumber: 7,
      explanationEn: 'Frontend runs inside the user browser.',
      explanationBanglish: 'Frontend user er browser e chole.',
    },
    {
      id: 'q2',
      type: 'multi-select',
      prompt: 'Pick all backend duties',
      options: ['Verify payment', 'Store API keys', 'Render CSS button', 'Run DB queries'],
      correctIndices: [0, 1, 3],
      hint: 'Check Slide 15',
      reviewSlideNumber: 15,
      explanationEn: 'Backend handles payments, secrets, and databases.',
      explanationBanglish: 'Payment, secret key ar database backend er kaj.',
    },
    {
      id: 'q3',
      type: 'short-answer',
      prompt: 'Explain DNS in 1 sentence.',
      options: [],
      correctIndices: [],
      hint: 'Think phonebook',
      reviewSlideNumber: 23,
      explanationEn: 'DNS translates domain names to IP addresses.',
      explanationBanglish: 'DNS domain name ke IP address e convert kore.',
    },
  ],
};

test('Option A Smart Reveal hides correct answers on wrong Attempt #1 and #2, unlocks on Attempt #3 or >=80%', () => {
  // Attempt 1, wrong, score 40% -> hidden
  assert.equal(
    shouldRevealCorrectAnswer({
      attemptNumber: 1,
      scorePercent: 40,
      isInstructor: false,
      isQuestionCorrect: false,
    }),
    false
  );

  // Attempt 2, wrong, score 60% -> still hidden
  assert.equal(
    shouldRevealCorrectAnswer({
      attemptNumber: 2,
      scorePercent: 60,
      isInstructor: false,
      isQuestionCorrect: false,
    }),
    false
  );

  // Attempt 3, wrong, score 40% -> UNLOCKED!
  assert.equal(
    shouldRevealCorrectAnswer({
      attemptNumber: 3,
      scorePercent: 40,
      isInstructor: false,
      isQuestionCorrect: false,
    }),
    true
  );

  // Attempt 1, wrong on 1 question, but total score 80% -> UNLOCKED!
  assert.equal(
    shouldRevealCorrectAnswer({
      attemptNumber: 1,
      scorePercent: 80,
      isInstructor: false,
      isQuestionCorrect: false,
    }),
    true
  );

  // Instructor always sees answers even on Attempt 1 with 0%
  assert.equal(
    shouldRevealCorrectAnswer({
      attemptNumber: 1,
      scorePercent: 0,
      isInstructor: true,
      isQuestionCorrect: false,
    }),
    true
  );
});

test('evaluateExamSubmission grades MCQ + Multi-Select accurately and keeps short-answer snapshot', () => {
  assert.equal(areIndexSetsEqual([3, 0, 1], [0, 1, 3]), true);
  assert.equal(areIndexSetsEqual([0, 1], [0, 1, 3]), false);

  const partial = evaluateExamSubmission(
    SAMPLE_EXAM,
    {
      selections: { q1: [0], q2: [0, 1] }, // q1 right, q2 missing index 3
      shortAnswers: { q3: 'DNS turns google.com into an IP address.' },
    },
    1
  );

  assert.equal(partial.autoGradedCorrect, 1);
  assert.equal(partial.autoGradedTotal, 2);
  assert.equal(partial.scorePercent, 50);
  assert.equal(partial.passed, false);
  assert.equal(partial.answersUnlocked, false);
  assert.equal(partial.answers[2].shortAnswerText, 'DNS turns google.com into an IP address.');

  const passed = evaluateExamSubmission(
    SAMPLE_EXAM,
    {
      selections: { q1: [0], q2: [3, 1, 0] },
      shortAnswers: { q3: 'Phonebook of the internet' },
    },
    2
  );
  assert.equal(passed.scorePercent, 100);
  assert.equal(passed.passed, true);
  assert.equal(passed.answersUnlocked, true);
});

test('validateExamDraftComplete catches missing selections or too-short written answers', () => {
  const incomplete = validateExamDraftComplete(SAMPLE_EXAM, {
    selections: { q1: [0] },
    shortAnswers: { q3: 'short' },
  });
  assert.equal(incomplete.valid, false);
  assert.deepEqual(incomplete.missingQuestionNumbers, [2, 3]);

  const complete = validateExamDraftComplete(SAMPLE_EXAM, {
    selections: { q1: [0], q2: [0, 1, 3] },
    shortAnswers: { q3: 'DNS translates domain names into server IP addresses.' },
  });
  assert.equal(complete.valid, true);
  assert.deepEqual(complete.missingQuestionNumbers, []);
});

test('computeStudentClassSummary and computeInstructorMetrics track first-try vs best score', () => {
  const base: Omit<ExamAttemptRecord, 'attemptId' | 'attemptNumber' | 'scorePercent' | 'passed' | 'answersUnlocked' | 'reviewStatus'> = {
    studentUid: 'stu1',
    studentName: 'Nadia',
    studentEmail: 'nadia@example.com',
    classId: 1,
    classTitle: 'Class 01',
    examVersion: 'v1',
    autoGradedCorrect: 2,
    autoGradedTotal: 5,
    answers: [],
    submittedAtMs: 1000,
    updatedAtMs: 1000,
    teacherFeedback: '',
    shortAnswerScore: 0,
    reviewedBy: '',
  };

  const attempts: ExamAttemptRecord[] = [
    { ...base, attemptId: 'a1', attemptNumber: 1, scorePercent: 40, passed: false, answersUnlocked: false, reviewStatus: 'pending' },
    { ...base, attemptId: 'a2', attemptNumber: 2, scorePercent: 80, passed: true, answersUnlocked: true, reviewStatus: 'reviewed' },
  ];

  const summary = computeStudentClassSummary(attempts, 1);
  assert.equal(summary.totalAttempts, 2);
  assert.equal(summary.firstAttemptScore, 40);
  assert.equal(summary.bestScore, 80);
  assert.equal(summary.passed, true);
  assert.equal(summary.unlockedByHistory, true);

  const metrics = computeInstructorMetrics(attempts);
  assert.equal(metrics.uniqueStudents, 1);
  assert.equal(metrics.totalAttempts, 2);
  assert.equal(metrics.avgFirstTryScore, 40);
  assert.equal(metrics.avgBestScore, 80);
  assert.equal(metrics.pendingReviews, 1);
});

test('isInstructorEmail requires exact email and verified flag; feedback clamps cleanly', () => {
  assert.equal(isInstructorEmail('ashiqebinrahman@gmail.com', true), true);
  assert.equal(isInstructorEmail('ashiqebinrahman@gmail.com', false), false);
  assert.equal(isInstructorEmail('student@gmail.com', true), false);

  const fb = sanitizeTeacherFeedback('  Great explanation!  ', 9);
  assert.equal(fb.teacherFeedback, 'Great explanation!');
  assert.equal(fb.shortAnswerScore, 2);
});
