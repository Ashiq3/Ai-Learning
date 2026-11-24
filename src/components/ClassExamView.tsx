import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ClipboardCheck,
  History,
  RotateCcw,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COURSE_DECKS, READY_CLASS_IDS } from '../data/allClasses';
import { CLASS_EXAMS } from '../data/classExams';
import { submitExamAttempt } from '../services/examService';
import type { ClassId } from '../types/course';
import type { ExamAttemptRecord } from '../types/exam';
import {
  BLUEPRINT_LIMITS,
  computeStudentClassSummary,
  validateExamDraftComplete,
} from '../utils/examLogic';
import { ExamAttemptBreakdown } from './ExamAttemptBreakdown';
import { InlineCodeText } from './InlineCodeText';

interface ClassExamViewProps {
  classId: ClassId;
  myAttempts: ExamAttemptRecord[];
  onSelectClass: (classId: ClassId) => void;
  onJumpToSlide: (classId: ClassId, slideNumber1Based: number) => void;
  onOpenResults: () => void;
}

export function ClassExamView({
  classId,
  myAttempts,
  onSelectClass,
  onJumpToSlide,
  onOpenResults,
}: ClassExamViewProps) {
  const { user, isInstructor } = useAuth();
  const exam = CLASS_EXAMS[classId];
  const deck = COURSE_DECKS[classId];

  const [selections, setSelections] = useState<Record<string, number[]>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState<ExamAttemptRecord | null>(null);

  const summary = useMemo(
    () => computeStudentClassSummary(myAttempts, classId),
    [myAttempts, classId]
  );

  const nextAttemptNumber = summary.totalAttempts + 1;

  const handleClassSwitch = (nextCid: ClassId) => {
    setSelections({});
    setShortAnswers({});
    setValidationError(null);
    setSubmitError(null);
    setJustSubmitted(null);
    onSelectClass(nextCid);
  };

  const toggleOption = (qId: string, optIdx: number, isMulti: boolean) => {
    setValidationError(null);
    setSelections((prev) => {
      const current = prev[qId] ?? [];
      if (!isMulti) {
        return { ...prev, [qId]: [optIdx] };
      }
      const exists = current.includes(optIdx);
      const next = exists ? current.filter((i) => i !== optIdx) : [...current, optIdx];
      return { ...prev, [qId]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const check = validateExamDraftComplete(exam, { selections, shortAnswers });
    if (!check.valid) {
      setValidationError(
        `Please complete Question${check.missingQuestionNumbers.length > 1 ? 's' : ''} #${check.missingQuestionNumbers.join(', #')} before submitting (written answers need at least 8 characters).`
      );
      return;
    }

    setSubmitting(true);
    setValidationError(null);
    setSubmitError(null);

    try {
      const saved = await submitExamAttempt({
        user,
        exam,
        classTitle: deck.title,
        draft: { selections, shortAnswers },
        attemptNumber: nextAttemptNumber,
      });
      setJustSubmitted(saved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not save your exam attempt. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartRetake = () => {
    setSelections({});
    setShortAnswers({});
    setValidationError(null);
    setSubmitError(null);
    setJustSubmitted(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 space-y-10">
      {/* Header + Class Switcher + Attempt Metrics */}
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4 max-w-2xl">
          <div
            role="tablist"
            aria-label="Choose class exam"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {READY_CLASS_IDS.map((cid) => {
              const clsSum = computeStudentClassSummary(myAttempts, cid);
              const active = cid === classId;
              return (
                <button
                  key={cid}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleClassSwitch(cid)}
                  className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-[13px] transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                      : 'font-medium text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Class 0{cid} Exam</span>
                  {clsSum.totalAttempts > 0 && (
                    <span
                      className={`font-mono text-[11px] font-semibold tabular-nums ${
                        clsSum.passed ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {clsSum.bestScore}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold tracking-[-0.025em] text-slate-900 sm:text-3xl">
              {exam.title}
            </h1>
            <p className="text-[15px] leading-[1.6] text-slate-600">{exam.subtitle}</p>
          </div>
        </div>

        <dl className="flex items-center gap-6 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] tabular-nums shrink-0">
          <div>
            <dt className="text-[11px] font-medium text-slate-500">Attempt</dt>
            <dd className="font-mono text-lg font-semibold text-[#1D4ED8]">
              #{justSubmitted ? justSubmitted.attemptNumber : nextAttemptNumber}
            </dd>
          </div>
          <div aria-hidden="true" className="h-8 w-px bg-slate-200" />
          <div>
            <dt className="text-[11px] font-medium text-slate-500">Best Score</dt>
            <dd className="font-mono text-lg font-semibold text-slate-900">
              {summary.bestScore !== null ? `${summary.bestScore}%` : '—'}
            </dd>
          </div>
          <div aria-hidden="true" className="h-8 w-px bg-slate-200" />
          <div>
            <dt className="text-[11px] font-medium text-slate-500">Saved</dt>
            <dd className="font-mono text-lg font-semibold text-slate-900">
              {summary.totalAttempts}
            </dd>
          </div>
        </dl>
      </header>

      {/* Submitted Result Screen OR Active Exam Form */}
      {justSubmitted ? (
        <section className="space-y-7">
          <div
            className={`flex flex-wrap items-center justify-between gap-6 rounded-xl border p-6 sm:p-7 ${
              justSubmitted.passed
                ? 'border-emerald-200 bg-emerald-50/70'
                : 'border-amber-200 bg-amber-50/70'
            }`}
          >
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold">
                {justSubmitted.passed ? (
                  <>
                    <Award className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    <span className="text-emerald-800">
                      Attempt #{justSubmitted.attemptNumber} saved · Passed
                    </span>
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="h-4 w-4 text-amber-700" aria-hidden="true" />
                    <span className="text-amber-800">
                      Attempt #{justSubmitted.attemptNumber} saved · Keep practicing
                    </span>
                  </>
                )}
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                Auto-graded score: {justSubmitted.autoGradedCorrect} / {justSubmitted.autoGradedTotal} ({justSubmitted.scorePercent}%)
              </h2>
              <p className="text-[14px] text-slate-600">
                Saved permanently to your account. Your written response is queued for instructor review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartRetake}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Retake Exam (#{justSubmitted.attemptNumber + 1})
              </button>
              <button
                type="button"
                onClick={onOpenResults}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <History className="h-4 w-4 text-slate-500" aria-hidden="true" />
                View All Results
              </button>
            </div>
          </div>

          <ExamAttemptBreakdown
            attempt={justSubmitted}
            isInstructor={isInstructor}
            unlockedByClassHistory={summary.unlockedByHistory}
            onJumpToSlide={onJumpToSlide}
          />
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {exam.questions.map((q, idx) => {
            const picked = selections[q.id] ?? [];
            const isMulti = q.type === 'multi-select';
            const isShort = q.type === 'short-answer';
            const textVal = shortAnswers[q.id] ?? '';

            return (
              <fieldset
                key={q.id}
                className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                  <div className="flex flex-wrap items-center gap-2 text-slate-500">
                    <span className="font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums">
                      Question {idx + 1} of {exam.questions.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {isMulti
                        ? 'Select all that apply'
                        : isShort
                          ? 'Short written answer · Instructor reviewed'
                          : 'Single choice'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onJumpToSlide(classId, q.reviewSlideNumber)}
                    className="text-xs font-medium text-slate-500 hover:text-[#1D4ED8] transition-colors"
                  >
                    Slide {String(q.reviewSlideNumber).padStart(2, '0')}
                  </button>
                </div>

                <legend className="font-display text-[17px] font-semibold leading-snug text-slate-900 sm:text-[18px]">
                  <InlineCodeText text={q.prompt} />
                </legend>

                {isShort ? (
                  <div className="space-y-2">
                    <label htmlFor={`short-${q.id}`} className="sr-only">
                      Your written answer for Question {idx + 1}
                    </label>
                    <textarea
                      id={`short-${q.id}`}
                      rows={4}
                      maxLength={BLUEPRINT_LIMITS.shortAnswerMax}
                      value={textVal}
                      onChange={(ev) => {
                        setValidationError(null);
                        setShortAnswers((prev) => ({ ...prev, [q.id]: ev.target.value }));
                      }}
                      placeholder="Write 2–4 clear sentences in your own words (English or Banglish is welcome)…"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 focus:outline-none transition-shadow"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                      <span>Saved permanently for instructor review and written feedback.</span>
                      <span>
                        {textVal.trim().length} / {BLUEPRINT_LIMITS.shortAnswerMax} chars
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {q.options.map((opt, optIdx) => {
                      const active = picked.includes(optIdx);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleOption(q.id, optIdx, isMulti)}
                          aria-pressed={active}
                          className={`flex items-start gap-3 rounded-lg border p-4 text-left text-[14px] leading-relaxed transition-all ${
                            active
                              ? 'border-[#1D4ED8] bg-[#EFF6FF] text-slate-900 ring-1 ring-[#1D4ED8]/20'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-[11px] font-semibold ${
                              isMulti ? 'rounded' : 'rounded-full'
                            } ${
                              active
                                ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                                : 'border-slate-300 text-slate-500 bg-white'
                            }`}
                          >
                            {active ? (
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              String.fromCharCode(65 + optIdx)
                            )}
                          </span>
                          <span className="flex-1">
                            <InlineCodeText text={opt} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            );
          })}

          {validationError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900"
            >
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{validationError}</span>
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-900"
            >
              <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-600">
              Submitting records <strong className="font-semibold text-slate-900">Attempt #{nextAttemptNumber}</strong> permanently in your course transcript.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors whitespace-nowrap shadow-xs"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {submitting ? 'Saving to Cloud…' : `Submit Attempt #${nextAttemptNumber}`}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
