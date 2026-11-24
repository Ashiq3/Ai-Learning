import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Save,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveInstructorFeedback } from '../services/examService';
import type { ClassId } from '../types/course';
import type { ExamAttemptRecord } from '../types/exam';
import { BLUEPRINT_LIMITS, computeInstructorMetrics } from '../utils/examLogic';
import { ExamAttemptBreakdown } from './ExamAttemptBreakdown';

interface InstructorDashboardViewProps {
  allAttempts: ExamAttemptRecord[];
  loading: boolean;
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

export function InstructorDashboardView({
  allAttempts,
  loading,
  onJumpToSlide,
}: InstructorDashboardViewProps) {
  const { user, isInstructor } = useAuth();
  const [filterClass, setFilterClass] = useState<'all' | ClassId>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [searchStudent, setSearchStudent] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [draftFeedback, setDraftFeedback] = useState<Record<string, string>>({});
  const [draftScore, setDraftScore] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const metrics = useMemo(() => computeInstructorMetrics(allAttempts), [allAttempts]);

  const filtered = useMemo(() => {
    const q = searchStudent.trim().toLowerCase();
    return allAttempts.filter((att) => {
      if (filterClass !== 'all' && att.classId !== filterClass) return false;
      if (filterStatus !== 'all' && att.reviewStatus !== filterStatus) return false;
      if (
        q &&
        !att.studentName.toLowerCase().includes(q) &&
        !att.studentEmail.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allAttempts, filterClass, filterStatus, searchStudent]);

  if (!isInstructor) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20 text-center space-y-3">
        <h1 className="font-display text-2xl font-bold text-slate-900">Instructor Access Only</h1>
        <p className="text-[15px] text-slate-600">
          This dashboard is restricted to the verified course instructor account.
        </p>
      </main>
    );
  }

  const handleOpenAttempt = (att: ExamAttemptRecord) => {
    if (expandedId === att.attemptId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(att.attemptId);
    setDraftFeedback((prev) => ({
      ...prev,
      [att.attemptId]: prev[att.attemptId] ?? att.teacherFeedback,
    }));
    setDraftScore((prev) => ({
      ...prev,
      [att.attemptId]: prev[att.attemptId] ?? att.shortAnswerScore,
    }));
    setSaveError(null);
  };

  const handleSaveReview = async (att: ExamAttemptRecord) => {
    if (!user?.email) return;
    setSavingId(att.attemptId);
    setSaveError(null);
    setSavedNoticeId(null);
    try {
      await saveInstructorFeedback({
        attemptId: att.attemptId,
        reviewerEmail: user.email,
        feedback: draftFeedback[att.attemptId] ?? att.teacherFeedback,
        shortAnswerScore: draftScore[att.attemptId] ?? att.shortAnswerScore,
      });
      setSavedNoticeId(att.attemptId);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save feedback.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 space-y-10">
      {/* Header */}
      <header className="border-b border-slate-200 pb-8 space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-700">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Instructor Dashboard · Live Cloud Submissions
        </div>
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-slate-900">
          Student Exam Results &amp; Grading
        </h1>
        <p className="text-[15px] leading-[1.6] text-slate-600">
          Review every student’s 1st-try and best scores, inspect exact question choices, grade short written responses, and publish permanent written feedback.
        </p>
      </header>

      {/* Clean Single-Elevation Metric Strip */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 tabular-nums">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            Students
          </span>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {metrics.uniqueStudents}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="block text-xs font-medium text-slate-500">Total Attempts</span>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {metrics.totalAttempts}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="block text-xs font-medium text-slate-500">Avg 1st-Try Score</span>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {metrics.avgFirstTryScore}%
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="block text-xs font-medium text-slate-500">Avg Best Score</span>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-700">
            {metrics.avgBestScore}%
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-amber-200 bg-amber-50/70 p-5">
          <span className="block text-xs font-semibold text-amber-800">Pending Reviews</span>
          <p className="mt-2 font-display text-2xl font-bold text-amber-800">
            {metrics.pendingReviews}
          </p>
        </div>
      </section>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['all', 1, 2, 3] as const).map((cid) => (
              <button
                key={String(cid)}
                type="button"
                onClick={() => setFilterClass(cid)}
                className={`rounded-md px-3 py-1 text-[13px] transition-all ${
                  filterClass === cid
                    ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                {cid === 'all' ? 'All Classes' : `Class 0${cid}`}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['all', 'pending', 'reviewed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`rounded-md px-3 py-1 text-[13px] transition-all ${
                  filterStatus === st
                    ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All Status' : st === 'pending' ? 'Needs Review' : 'Reviewed'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Filter by student name or email"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Search student or email…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/15"
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Syncing live student exam attempts…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-2">
          <p className="font-display text-lg font-semibold text-slate-900">
            No submissions match this filter
          </p>
          <p className="text-[14.5px] text-slate-600">
            As soon as a student submits a Class 01, 02, or 03 exam, their complete attempt record will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((att) => {
            const isOpen = expandedId === att.attemptId;
            const fbVal = draftFeedback[att.attemptId] ?? att.teacherFeedback;
            const scVal = draftScore[att.attemptId] ?? att.shortAnswerScore;

            return (
              <article
                key={att.attemptId}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <button
                  type="button"
                  onClick={() => handleOpenAttempt(att)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-[#1D4ED8] tabular-nums">
                        Class 0{att.classId} · Attempt #{att.attemptNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold ${
                          att.reviewStatus === 'reviewed'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {att.reviewStatus === 'reviewed'
                          ? `Reviewed (${att.shortAnswerScore}/2)`
                          : 'Pending review'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(att.submittedAtMs)}
                      </span>
                    </div>
                    <p className="text-[15px] font-semibold text-slate-900">
                      {att.studentName}{' '}
                      <span className="text-[13px] font-normal text-slate-500">
                        ({att.studentEmail})
                      </span>
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
                  <div className="border-t border-slate-200 bg-slate-50/70 p-6 space-y-6">
                    {/* Instructor Review & Grading Card */}
                    <div className="rounded-xl border border-blue-200 bg-white p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-display text-[15px] font-bold text-slate-900">
                          Grade short answer &amp; write feedback
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-slate-600">Score:</span>
                          {[0, 1, 2].map((pts) => (
                            <button
                              key={pts}
                              type="button"
                              onClick={() =>
                                setDraftScore((prev) => ({ ...prev, [att.attemptId]: pts }))
                              }
                              className={`rounded-md border px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                                scVal === pts
                                  ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              {pts} / 2
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        aria-label={`Teacher feedback for ${att.studentName}`}
                        rows={3}
                        maxLength={BLUEPRINT_LIMITS.teacherFeedbackMax}
                        value={fbVal}
                        onChange={(e) =>
                          setDraftFeedback((prev) => ({
                            ...prev,
                            [att.attemptId]: e.target.value,
                          }))
                        }
                        placeholder="Write helpful feedback for the student (English or Banglish) — they will see this permanently in their My Results transcript…"
                        className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-[14.5px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/15"
                      />

                      {saveError && (
                        <p className="text-xs font-medium text-red-700" role="alert">
                          {saveError}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          {fbVal.length} / {BLUEPRINT_LIMITS.teacherFeedbackMax} chars
                        </span>

                        <div className="flex items-center gap-3">
                          {savedNoticeId === att.attemptId && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                              Feedback saved
                            </span>
                          )}
                          <button
                            type="button"
                            disabled={savingId === att.attemptId}
                            onClick={() => handleSaveReview(att)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
                          >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {savingId === att.attemptId ? 'Saving…' : 'Save Instructor Feedback'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Full Question Breakdown */}
                    <ExamAttemptBreakdown
                      attempt={att}
                      isInstructor={true}
                      onJumpToSlide={onJumpToSlide}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
