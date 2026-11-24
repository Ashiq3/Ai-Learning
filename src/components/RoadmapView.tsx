import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FlaskConical,
  HelpCircle,
  Layers,
  Lock,
  LogIn,
  Play,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COURSE_DECKS, READY_CLASS_IDS } from '../data/allClasses';
import { CURRICULUM_CLASSES, CURRICULUM_PHASES } from '../data/roadmapData';
import type { ClassId } from '../types/course';
import type { ExamAttemptRecord } from '../types/exam';
import {
  computeClassProgress,
  getCurriculumTotals,
  groupSlidesByPart,
} from '../utils/courseLogic';
import { computeStudentClassSummary } from '../utils/examLogic';
import type { StoredLearningProgress } from '../utils/progressStorage';
import { HeroCoursePreviewArt, ModuleCoverArt } from './CourseArtwork';
import { InlineCodeText } from './InlineCodeText';

interface RoadmapViewProps {
  myAttempts: ExamAttemptRecord[];
  learningProgress: StoredLearningProgress;
  onOpenClass: (classId: ClassId, initialSlide?: number) => void;
  onOpenExam: (classId: ClassId) => void;
  onOpenResults: () => void;
  onRequestSignInForClass: (classId: ClassId) => void;
}

const LEARNING_OUTCOMES = [
  'Trace live Frontend, DNS, and Cloud Backend traffic in Chrome DevTools',
  'Design & debug REST APIs, JSON envelopes, status codes, and .env secrets',
  'Read Python FastAPI & Node.js Express backends connected to PostgreSQL',
  'Master AI Tokens, Context Windows, Vector RAG, and production Agent loops',
];

export function RoadmapView({
  myAttempts,
  learningProgress,
  onOpenClass,
  onOpenExam,
  onOpenResults,
  onRequestSignInForClass,
}: RoadmapViewProps) {
  const { user, authBusy, authError, clearAuthError, signInWithGoogle } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  });
  const [expandedClassNum, setExpandedClassNum] = useState<number | null>(1);

  const totals = useMemo(() => getCurriculumTotals(CURRICULUM_CLASSES), []);

  const visiblePhases =
    selectedPhase === 'all'
      ? CURRICULUM_PHASES
      : CURRICULUM_PHASES.filter((p) => p.phase === selectedPhase);

  const allVisiblePhasesExpanded = visiblePhases.every((p) => openPhases[p.phase]);

  const togglePhase = (phaseNum: number) => {
    setOpenPhases((prev) => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  const toggleAllPhases = () => {
    const target = !allVisiblePhasesExpanded;
    setOpenPhases((prev) => {
      const next = { ...prev };
      for (const p of visiblePhases) {
        next[p.phase] = target;
      }
      return next;
    });
  };

  // Compute live learner progress across all 3 ready classes (108 slides total)
  const liveProgressSummary = useMemo(() => {
    let totalVisited = 0;
    let totalSlides = 0;
    let passedExams = 0;
    let totalLiveLabs = 0;

    const perClass = READY_CLASS_IDS.map((cid) => {
      const deck = COURSE_DECKS[cid];
      const visited = learningProgress.visitedByClass[cid] ?? [];
      const prog = computeClassProgress(visited, deck.slides.length);
      const examSum = computeStudentClassSummary(myAttempts, cid);
      const chapters = groupSlidesByPart(deck.slides);
      const labTotal = chapters.reduce((acc, g) => acc + g.labCount, 0);
      const quizTotal = chapters.reduce((acc, g) => acc + g.quizCount, 0);
      totalVisited += prog.visitedCount;
      totalSlides += prog.totalSlides;
      totalLiveLabs += labTotal;
      if (examSum.passed) passedExams += 1;
      return { cid, deck, prog, examSum, labTotal, quizTotal };
    });

    const overallPercent =
      totalSlides > 0 ? Math.min(100, Math.round((totalVisited / totalSlides) * 100)) : 0;

    const resumeClassId = learningProgress.lastClassId ?? 1;
    const resumeDeck = COURSE_DECKS[resumeClassId];
    const resumeSlideIdx = Math.min(
      Math.max(0, learningProgress.lastSlideIndexByClass[resumeClassId] ?? 0),
      resumeDeck.slides.length - 1
    );
    const resumeSlide = resumeDeck.slides[resumeSlideIdx];
    const hasStarted = totalVisited > 0;

    return {
      perClass,
      totalVisited,
      totalSlides,
      totalLiveLabs,
      overallPercent,
      passedExams,
      resumeClassId,
      resumeSlideIdx,
      resumeSlide,
      hasStarted,
    };
  }, [learningProgress, myAttempts]);

  const scrollToSyllabus = () => {
    document.getElementById('curriculum-syllabus')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 sm:py-12 space-y-14">
      {/* =====================================================================
          SECTION 1: TWO-COLUMN MODERN LMS COURSE HERO
         ===================================================================== */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Course Promise, Outcomes & Primary Action */}
        <div className="flex flex-col justify-between lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-[#1D4ED8]">
              <span>Structured Engineering Track</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">20 Classes</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">60 Hours</span>
            </div>

            <h1 className="font-display text-[32px] font-bold leading-[1.12] tracking-[-0.03em] text-slate-900 sm:text-[42px]">
              AI Backend Master Course
            </h1>

            <p className="max-w-[60ch] text-[15.5px] leading-[1.65] text-slate-600">
              Master how modern web &amp; AI applications actually work behind the screen — through visual architecture walkthroughs, interactive browser &amp; API sandboxes, and cloud-graded mastery exams.
            </p>

            {/* What You'll Master (Classic LMS Outcome Checklist) */}
            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold text-slate-500">
                What you will learn in this track
              </p>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {LEARNING_OUTCOMES.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-slate-700"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Primary & Secondary Action Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenClass(
                        liveProgressSummary.resumeClassId,
                        liveProgressSummary.resumeSlideIdx
                      )
                    }
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shadow-xs"
                  >
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    {liveProgressSummary.hasStarted
                      ? `Continue Class 0${liveProgressSummary.resumeClassId} · Lesson ${String(
                          liveProgressSummary.resumeSlideIdx + 1
                        ).padStart(2, '0')}`
                      : 'Start Class 01 · Lesson 01'}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenResults}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors whitespace-nowrap"
                  >
                    <Award className="h-4 w-4 text-slate-500" aria-hidden="true" />
                    Exam Transcript
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={() => void signInWithGoogle()}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors whitespace-nowrap shadow-xs"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    {authBusy ? 'Connecting to Google…' : 'Sign in with Google to Start'}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToSyllabus}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors whitespace-nowrap"
                  >
                    <BookOpen className="h-4 w-4 text-slate-500" aria-hidden="true" />
                    Explore Full Syllabus
                  </button>
                </>
              )}
            </div>

            {!user && (
              <p className="text-xs text-slate-500">
                Full 20-class syllabus is open to preview · Sign in with Google to unlock interactive slides, labs &amp; cloud exam history.
              </p>
            )}

            {authError && (
              <div
                role="alert"
                className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <span>{authError}</span>
                <button
                  type="button"
                  onClick={clearAuthError}
                  className="text-xs font-semibold text-red-700 underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Preview & Progress Card */}
        <aside className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] lg:col-span-5">
          <HeroCoursePreviewArt />

          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-5">
            {user ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Your Live Track Progress
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums">
                      {liveProgressSummary.overallPercent}% complete
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#1D4ED8] transition-all duration-300"
                      style={{ width: `${Math.max(liveProgressSummary.overallPercent, 3)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                    <span>
                      {liveProgressSummary.totalVisited} / {liveProgressSummary.totalSlides} live lessons explored
                    </span>
                    <span>
                      {liveProgressSummary.passedExams} / 3 exams passed
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {liveProgressSummary.hasStarted ? 'Resume where you left off' : 'Recommended first lesson'}
                  </span>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[14.5px] font-bold text-slate-900">
                        Class 0{liveProgressSummary.resumeClassId}: {liveProgressSummary.resumeSlide.keyword}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Lesson {String(liveProgressSummary.resumeSlideIdx + 1).padStart(2, '0')} · {liveProgressSummary.resumeSlide.part}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenClass(
                          liveProgressSummary.resumeClassId,
                          liveProgressSummary.resumeSlideIdx
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-[#1D4ED8]/40 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors whitespace-nowrap shrink-0"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-slate-900">
                    Inside This Learning Track
                  </span>
                  <span className="font-mono text-xs font-medium text-emerald-700">
                    Classes 01–03 Live
                  </span>
                </div>

                <ul className="space-y-2.5 text-[13.5px] text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                    <span>108 visual interactive lessons across Classes 01–03</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaskConical className="h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                    <span>
                      {liveProgressSummary.totalLiveLabs} live sandboxes (DevTools, Backend Jobs, Postman, SQL, Tokens)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ClipboardCheck className="h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                    <span>Official cloud-graded exams with unlimited retakes</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </aside>
      </section>

      {/* =====================================================================
          SECTION 2: FULL-WIDTH 4-COLUMN CURRICULUM FACTS STRIP
         ===================================================================== */}
      <dl className="grid grid-cols-2 gap-4 border-y border-slate-200 py-6 sm:grid-cols-4 sm:gap-8">
        <div>
          <dt className="text-xs font-medium text-slate-500">Complete Track</dt>
          <dd className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
            {totals.totalClasses} Classes
          </dd>
          <p className="mt-0.5 text-xs text-slate-500">{totals.totalHours} hours · 4 phases</p>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Available Today</dt>
          <dd className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
            {totals.readyCount} Modules
          </dd>
          <p className="mt-0.5 text-xs text-slate-500">
            {liveProgressSummary.totalSlides} interactive visual lessons
          </p>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Interactive Labs</dt>
          <dd className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
            {liveProgressSummary.totalLiveLabs} Sandboxes
          </dd>
          <p className="mt-0.5 text-xs text-slate-500">Run directly inside your browser</p>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Assessment</dt>
          <dd className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
            Cloud Exams
          </dd>
          <p className="mt-0.5 text-xs text-slate-500">Smart answer reveal &amp; history</p>
        </div>
      </dl>

      {/* =====================================================================
          SECTION 3: FEATURED LIVE MODULES (3-COLUMN VISUAL COURSE CARDS)
         ===================================================================== */}
      <section aria-labelledby="live-modules-heading" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#1D4ED8]">
              Available Now · Phase 1 Foundations
            </p>
            <h2
              id="live-modules-heading"
              className="font-display text-2xl font-bold tracking-[-0.025em] text-slate-900 sm:text-[28px]"
            >
              Start Learning Live Modules
            </h2>
          </div>
          <p className="text-[13.5px] text-slate-500">
            Each class includes 36 visual lessons, live labs, and a graded exam.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liveProgressSummary.perClass.map(({ cid, prog, examSum, labTotal, quizTotal }) => {
            const meta = CURRICULUM_CLASSES.find((c) => c.classNumber === cid)!;
            const lastSlideIdx = learningProgress.lastSlideIndexByClass[cid] ?? 0;

            return (
              <article
                key={cid}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300"
              >
                {/* Bespoke 16:9 Module Cover Art */}
                <ModuleCoverArt classId={cid} />

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-5">
                  <div className="space-y-3">
                    {/* Unboxed Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-semibold text-slate-500 tabular-nums">
                        Class 0{cid} · 3h · 36 lessons
                      </span>
                      {user && examSum.totalAttempts > 0 ? (
                        <span
                          className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                            examSum.passed ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          <Award className="h-3.5 w-3.5" aria-hidden="true" />
                          {examSum.bestScore}% {examSum.passed ? 'Passed' : `(${examSum.totalAttempts}x)`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Live
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-[18px] font-bold leading-snug tracking-[-0.015em] text-slate-900">
                      {meta.title}
                    </h3>

                    <p className="line-clamp-3 text-[13.5px] leading-[1.6] text-slate-600">
                      <InlineCodeText text={meta.goal} />
                    </p>

                    {/* Lesson Content Breakdown or Live Progress Bar */}
                    {user ? (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs tabular-nums">
                          <span className="font-medium text-slate-600">
                            {prog.visitedCount} / {prog.totalSlides} lessons
                          </span>
                          <span className="font-mono font-semibold text-slate-700">
                            {prog.percent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              prog.percent === 100 ? 'bg-emerald-600' : 'bg-[#1D4ED8]'
                            }`}
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <FlaskConical className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          {labTotal} live labs
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          {quizTotal} practice checks
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Graded exam</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center gap-2.5 border-t border-slate-100 pt-4">
                    {user ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onOpenClass(cid, prog.visitedCount > 0 ? lastSlideIdx : 0)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
                        >
                          {prog.visitedCount > 0 ? 'Continue' : 'Start Class'}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenExam(cid)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors whitespace-nowrap"
                        >
                          <ClipboardCheck className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                          Exam
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={authBusy}
                        onClick={() => onRequestSignInForClass(cid)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-semibold text-slate-800 hover:border-[#1D4ED8]/40 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] disabled:opacity-50 transition-colors whitespace-nowrap"
                      >
                        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                        Sign in to start Class 0{cid}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: COLLAPSIBLE 20-CLASS MASTER CURRICULUM SYLLABUS (LMS ACCORDION)
         ===================================================================== */}
      <section id="curriculum-syllabus" aria-labelledby="syllabus-heading" className="space-y-6 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#1D4ED8]">
              Complete Learning Path · 4 Phases · 60 Hours
            </p>
            <h2
              id="syllabus-heading"
              className="font-display text-2xl font-bold tracking-[-0.025em] text-slate-900 sm:text-[28px]"
            >
              Master Curriculum Syllabus
            </h2>
          </div>

          <button
            type="button"
            onClick={toggleAllPhases}
            className="text-[13px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors whitespace-nowrap"
          >
            {allVisiblePhasesExpanded ? 'Collapse all phases' : 'Expand all phases'}
          </button>
        </div>

        {/* Phase Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter syllabus by phase"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {(
              [
                ['all', 'All Phases (20)'],
                [1, 'Phase 1 · 1–5'],
                [2, 'Phase 2 · 6–10'],
                [3, 'Phase 3 · 11–15'],
                [4, 'Phase 4 · 16–20'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={String(val)}
                type="button"
                role="tab"
                aria-selected={selectedPhase === val}
                onClick={() => {
                  setSelectedPhase(val);
                  if (val !== 'all') {
                    setOpenPhases((prev) => ({ ...prev, [val]: true }));
                  }
                }}
                className={`rounded-md px-3.5 py-1.5 text-[13px] whitespace-nowrap transition-all ${
                  selectedPhase === val
                    ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-[13px] text-slate-500">
            Click any class row to inspect lessons, labs &amp; tools
          </p>
        </div>

        {/* Phase Accordion Containers */}
        <div className="space-y-4">
          {visiblePhases.map((phase) => {
            const classes = CURRICULUM_CLASSES.filter((c) => c.phase === phase.phase);
            const isPhaseOpen = openPhases[phase.phase];
            const readyInPhase = classes.filter((c) => c.status === 'ready').length;

            return (
              <div
                key={phase.phase}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                {/* Phase Header Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => togglePhase(phase.phase)}
                  aria-expanded={isPhaseOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors sm:px-6 sm:py-5"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                      <span className="font-mono font-semibold text-[#1D4ED8]">
                        Phase 0{phase.phase}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{phase.classRange}</span>
                      <span aria-hidden="true">·</span>
                      <span>{phase.totalHours} hours</span>
                      {readyInPhase > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-emerald-700">
                            {readyInPhase} live now
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-[17px] font-bold tracking-[-0.015em] text-slate-900 sm:text-[19px]">
                      {phase.title.replace(/^Phase \d+:\s*/, '')}
                    </h3>
                    <p className="text-[13.5px] text-slate-600">{phase.subtitle}</p>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isPhaseOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Phase Classes List */}
                {isPhaseOpen && (
                  <div className="divide-y divide-slate-100 border-t border-slate-200">
                    {classes.map((cls) => {
                      const isReady =
                        cls.status === 'ready' &&
                        (cls.classNumber === 1 || cls.classNumber === 2 || cls.classNumber === 3);
                      const isExpanded = expandedClassNum === cls.classNumber;
                      const examSummary =
                        user && isReady
                          ? computeStudentClassSummary(myAttempts, cls.classNumber as ClassId)
                          : null;
                      const chapters = isReady
                        ? groupSlidesByPart(COURSE_DECKS[cls.classNumber as ClassId].slides)
                        : [];

                      return (
                        <div key={cls.classNumber} className="bg-white">
                          {/* Scannable Class Row */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedClassNum(isExpanded ? null : cls.classNumber)
                            }
                            aria-expanded={isExpanded}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors sm:px-6"
                          >
                            <div className="flex min-w-0 items-start gap-3.5 sm:items-center sm:gap-4">
                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold tabular-nums ${
                                  isReady
                                    ? 'border-blue-200 bg-[#EFF6FF] text-[#1D4ED8]'
                                    : 'border-slate-200 bg-slate-50 text-slate-500'
                                }`}
                              >
                                {String(cls.classNumber).padStart(2, '0')}
                              </span>

                              <div className="min-w-0 space-y-0.5">
                                <p className="font-display text-[15px] font-bold leading-snug text-slate-900 sm:text-[15.5px]">
                                  {cls.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500">
                                  <span className="tabular-nums">{cls.durationHours}h session</span>
                                  <span aria-hidden="true">·</span>
                                  <span>
                                    {isReady
                                      ? `36 visual lessons · ${chapters.length} chapters`
                                      : cls.tools.slice(0, 3).join(', ')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              {examSummary && examSummary.totalAttempts > 0 ? (
                                <span
                                  className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
                                    examSummary.passed ? 'text-emerald-700' : 'text-amber-700'
                                  }`}
                                >
                                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                                  {examSummary.bestScore}%
                                </span>
                              ) : isReady ? (
                                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                  Live
                                </span>
                              ) : (
                                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400">
                                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                  Upcoming
                                </span>
                              )}

                              <ChevronRight
                                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90 text-slate-700' : ''
                                }`}
                                aria-hidden="true"
                              />
                            </div>
                          </button>

                          {/* Expanded Class Syllabus Preview */}
                          {isExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6 sm:pl-[76px] space-y-5">
                              <p className="max-w-3xl text-[14px] leading-[1.65] text-slate-700">
                                <InlineCodeText text={cls.goal} />
                              </p>

                              {/* Structured Spec Grid */}
                              <dl className="grid grid-cols-1 gap-4 text-[13px] sm:grid-cols-3">
                                <div>
                                  <dt className="font-semibold text-slate-800">Key concepts</dt>
                                  <dd className="mt-1 leading-relaxed text-slate-600">
                                    {cls.keywords.join(' · ')}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-semibold text-slate-800">Hands-on lab</dt>
                                  <dd className="mt-1 leading-relaxed text-slate-600">
                                    {cls.handsOnProject}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-semibold text-slate-800">Tools covered</dt>
                                  <dd className="mt-1 leading-relaxed text-slate-600">
                                    {cls.tools.join(' · ')}
                                  </dd>
                                </div>
                              </dl>

                              {/* Live Chapter Breakdown for Classes 01–03 */}
                              {isReady && chapters.length > 0 && (
                                <div className="space-y-2.5 border-t border-slate-200/80 pt-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-700">
                                      Lesson Chapters Inside Class 0{cls.classNumber}
                                    </span>
                                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                                      36 lessons · 180 min
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {chapters.map((chapter) => {
                                      const firstSlideIndex = chapter.slides[0]?.index ?? 0;
                                      return (
                                        <button
                                          key={chapter.partTitle}
                                          type="button"
                                          onClick={() => {
                                            if (user) {
                                              onOpenClass(
                                                cls.classNumber as ClassId,
                                                firstSlideIndex
                                              );
                                            } else {
                                              onRequestSignInForClass(cls.classNumber as ClassId);
                                            }
                                          }}
                                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left hover:border-[#1D4ED8]/40 hover:bg-[#EFF6FF]/40 transition-colors"
                                        >
                                          <div className="min-w-0">
                                            <p className="truncate text-[13px] font-semibold text-slate-800">
                                              {chapter.partTitle}
                                            </p>
                                            <p className="text-[11.5px] text-slate-500 tabular-nums">
                                              {chapter.slides.length} lessons · {chapter.totalMinutes} min
                                              {chapter.labCount > 0
                                                ? ` · ${chapter.labCount} lab${chapter.labCount > 1 ? 's' : ''}`
                                                : ''}
                                            </p>
                                          </div>
                                          {user ? (
                                            <Play
                                              className="h-3.5 w-3.5 shrink-0 text-[#1D4ED8]"
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <Lock
                                              className="h-3.5 w-3.5 shrink-0 text-slate-400"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Direct Action Footer for Live Classes */}
                              {isReady ? (
                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                  {user ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => onOpenClass(cls.classNumber as ClassId, 0)}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
                                      >
                                        Open Class 0{cls.classNumber} Player
                                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => onOpenExam(cls.classNumber as ClassId)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
                                      >
                                        <ClipboardCheck
                                          className="h-3.5 w-3.5 text-slate-500"
                                          aria-hidden="true"
                                        />
                                        {examSummary && examSummary.totalAttempts > 0
                                          ? 'Retake Official Exam'
                                          : 'Take Official Exam'}
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={authBusy}
                                      onClick={() =>
                                        onRequestSignInForClass(cls.classNumber as ClassId)
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors whitespace-nowrap"
                                    >
                                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                                      Sign in with Google to open Class 0{cls.classNumber}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Sparkles className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                  <span>
                                    Scheduled in upcoming release — complete Classes 01–03 first to build the foundation.
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
