import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COURSE_DECKS, READY_CLASS_IDS } from '../data/allClasses';
import type { ClassId } from '../types/course';
import type { ExamAttemptRecord } from '../types/exam';
import { computeStudentClassSummary } from '../utils/examLogic';
import { ExamAttemptBreakdown } from './ExamAttemptBreakdown';

interface StudentResultsViewProps {
  myAttempts: ExamAttemptRecord[];
  loading: boolean;
  onStartExam: (classId: ClassId) => void;
  onJumpToSlide: (classId: ClassId, slideNumber1Based: number) => void;
}

function formatDate(ms: number): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

export function StudentResultsView({
  myAttempts,
  loading,
  onStartExam,
  onJumpToSlide,
}: StudentResultsViewProps) {
  const { isInstructor, profile, user } = useAuth();
  const [filterClass, setFilterClass] = useState<'all' | ClassId>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const classSummaries = useMemo(
    () => READY_CLASS_IDS.map((cid) => computeStudentClassSummary(myAttempts, cid)),
    [myAttempts]
  );

  const visibleAttempts = useMemo(
    () =>
      filterClass === 'all'
        ? myAttempts
        : myAttempts.filter((a) => a.classId === filterClass),
    [myAttempts, filterClass]
  );

  return (
    <main className="mx-auto max-w-[1160px] px-5 py-12 sm:px-8 space-y-12">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-[13px] font-medium text-[#1D4ED8]">
            Permanent Exam Transcript · Synced Across Devices
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-slate-900">
            My Exam Results
          </h1>
          <p className="text-[15px] leading-[1.6] text-slate-600">
            Signed in as{' '}
            <strong className="font-semibold text-slate-900">
              {profile?.displayName ?? user?.displayName ?? user?.email}
            </strong>{' '}
            — every attempt, study hint, unlocked answer key, and instructor comment remains archived here.
          </p>
        </div>

        <div className="text-right tabular-nums">
          <span className="block text-xs font-medium text-slate-500">Saved Attempts</span>
          <span className="font-display text-2xl font-bold text-slate-900">
            {myAttempts.length}
          </span>
        </div>
      </header>

      {/* Per-Class Summary Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {classSummaries.map((sum) => {
          const deck = COURSE_DECKS[sum.classId];
          return (
            <div
              key={sum.classId}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 space-y-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold text-slate-500">
                    Class 0{sum.classId}
                  </span>
                  {sum.passed ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      Passed
                    </span>
                  ) : sum.totalAttempts > 0 ? (
                    <span className="font-semibold text-amber-700">In progress</span>
                  ) : (
                    <span className="text-slate-400">Not attempted</span>
                  )}
                </div>

                <h2 className="font-display text-[17px] font-bold leading-snug text-slate-900">
                  {deck.title}
                </h2>

                <dl className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 tabular-nums">
                  <div>
                    <dt className="text-[11px] text-slate-500">Attempts</dt>
                    <dd className="mt-0.5 font-mono text-base font-semibold text-slate-900">
                      {sum.totalAttempts}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-slate-500">1st Try</dt>
                    <dd className="mt-0.5 font-mono text-base font-semibold text-slate-700">
                      {sum.firstAttemptScore !== null ? `${sum.firstAttemptScore}%` : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-slate-500">Best</dt>
                    <dd
                      className={`mt-0.5 font-mono text-base font-semibold ${
                        sum.passed ? 'text-emerald-700' : 'text-[#1D4ED8]'
                      }`}
                    >
                      {sum.bestScore !== null ? `${sum.bestScore}%` : '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                onClick={() => onStartExam(sum.classId)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors"
              >
                {sum.totalAttempts > 0
                  ? `Retake Class 0${sum.classId} (#${sum.totalAttempts + 1})`
                  : `Take Class 0${sum.classId} Exam`}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </section>

      {/* Filter & Chronological Attempt List */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-slate-900">
            Attempt Archive
          </h2>

          <div
            role="tablist"
            aria-label="Filter attempts by class"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {(['all', 1, 2, 3] as const).map((val) => (
              <button
                key={String(val)}
                type="button"
                role="tab"
                aria-selected={filterClass === val}
                onClick={() => setFilterClass(val)}
                className={`rounded-md px-3 py-1.5 text-[13px] transition-all ${
                  filterClass === val
                    ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                {val === 'all' ? 'All Classes' : `Class 0${val}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading your exam history…
          </div>
        ) : visibleAttempts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-2">
            <p className="font-display text-lg font-semibold text-slate-900">
              No exam attempts saved yet
            </p>
            <p className="mx-auto max-w-md text-[14.5px] leading-relaxed text-slate-600">
              Complete any class and choose <strong>Take Exam</strong> above. Every attempt is saved permanently so you can track improvement months later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAttempts.map((att) => {
              const isOpen = expandedId === att.attemptId;
              const clsSummary = classSummaries.find((s) => s.classId === att.classId);

              return (
                <article
                  key={att.attemptId}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : att.attemptId)}
                    aria-expanded={isOpen}
                    className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-[#1D4ED8] tabular-nums">
                          Class 0{att.classId} · Attempt #{att.attemptNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(att.submittedAtMs)}
                        </span>
                        {att.reviewStatus === 'reviewed' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-medium text-[#1D4ED8]">
                              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                              Reviewed ({att.shortAnswerScore}/2)
                            </span>
                          </>
                        )}
                      </div>
                      <p className="font-display text-[15.5px] font-semibold text-slate-900">
                        {att.classTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right font-mono tabular-nums">
                        <span
                          className={`block text-base font-bold ${
                            att.passed ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {att.scorePercent}%
                        </span>
                        <span className="text-xs text-slate-500">
                          {att.autoGradedCorrect}/{att.autoGradedTotal} MCQ
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-6">
                      <ExamAttemptBreakdown
                        attempt={att}
                        isInstructor={isInstructor}
                        unlockedByClassHistory={clsSummary?.unlockedByHistory ?? false}
                        onJumpToSlide={onJumpToSlide}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
