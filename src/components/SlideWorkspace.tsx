import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Coffee,
  ExternalLink,
  FlaskConical,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Monitor,
  PanelLeft,
  PanelLeftClose,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { COURSE_DECKS, READY_CLASS_IDS } from '../data/allClasses';
import type { AppView, ClassDeck, ClassId, SlideData } from '../types/course';
import {
  computeClassProgress,
  groupSlidesByPart,
  type ClassPacingSummary,
  type SlideLessonKind,
  type SlidePacingItem,
} from '../utils/courseLogic';
import { InlineCodeText } from './InlineCodeText';
import { ThemeToggle } from './ThemeToggle';
import {
  BackendJobsLab,
  DatabaseMemoryLab,
  FrontendXrayLab,
  JsonDoctorLab,
  PostmanMiniLab,
  ServerStressLab,
  TokenizerContextLab,
} from './interactives/InteractiveLabs';
import {
  AnimatedWorkflowStage,
  BreakTimerStage,
  CodeTranslatorStage,
  ComparisonSplitStage,
  HeroStage,
  PracticeTestStage,
  RecapBridgeStage,
  StatusCodesStage,
  TimelineRouteStage,
  ToolSpotlightStage,
  UrlDissectorStage,
  UseCaseGalleryStage,
  VisualDiagramStage,
} from './interactives/StageEngines';

interface SlideWorkspaceProps {
  deck: ClassDeck;
  currentIndex: number;
  visitedSlideIds: number[];
  pacing: ClassPacingSummary;
  pacingItem: SlidePacingItem;
  showTeacherCue: boolean;
  showGrid: boolean;
  isInstructor: boolean;
  pendingReviewCount?: number;
  onSelectClass: (classId: ClassId) => void;
  onOpenExam: (classId: ClassId) => void;
  onToggleTeacherCue: () => void;
  onCloseTeacherCue: () => void;
  onToggleGrid: () => void;
  onCloseGrid: () => void;
  onSelectSlide: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectView: (view: AppView) => void;
  onSignOut: () => void;
}

function renderStage(
  slide: SlideData,
  onSelectClass: (classId: ClassId) => void
) {
  switch (slide.stageType) {
    case 'hero':
      return <HeroStage visual={slide.visual} />;
    case 'route':
      return <TimelineRouteStage visual={slide.visual} />;
    case 'animated-workflow':
      return <AnimatedWorkflowStage visual={slide.visual} />;
    case 'tool-spotlight':
      return <ToolSpotlightStage visual={slide.visual} />;
    case 'comparison':
      return <ComparisonSplitStage visual={slide.visual} />;
    case 'use-case-gallery':
      return <UseCaseGalleryStage visual={slide.visual} />;
    case 'practice-test':
      return <PracticeTestStage visual={slide.visual} />;
    case 'visual-diagram':
      return <VisualDiagramStage visual={slide.visual} />;
    case 'break-timer':
      return <BreakTimerStage />;
    case 'frontend-xray':
      return <FrontendXrayLab />;
    case 'backend-jobs-lab':
      return <BackendJobsLab />;
    case 'server-stress':
      return <ServerStressLab />;
    case 'postman-lab':
      return <PostmanMiniLab />;
    case 'json-doctor':
      return <JsonDoctorLab />;
    case 'database-memory':
      return <DatabaseMemoryLab />;
    case 'tokenizer-context':
      return <TokenizerContextLab variant={slide.visual.labVariant} />;
    case 'code-translator':
      return <CodeTranslatorStage visual={slide.visual} />;
    case 'url-dissector':
      return <UrlDissectorStage visual={slide.visual} />;
    case 'status-codes':
      return <StatusCodesStage visual={slide.visual} />;
    case 'recap-bridge':
      return <RecapBridgeStage visual={slide.visual} onSelectClass={onSelectClass} />;
  }
}

function LessonKindIcon({ kind, active }: { kind: SlideLessonKind; active: boolean }) {
  const cls = `h-3.5 w-3.5 shrink-0 ${
    active
      ? 'text-[#1D4ED8]'
      : kind === 'lab'
        ? 'text-indigo-600'
        : kind === 'quiz'
          ? 'text-emerald-600'
          : kind === 'break'
            ? 'text-amber-600'
            : 'text-slate-400'
  }`;

  switch (kind) {
    case 'lab':
      return <FlaskConical className={cls} aria-hidden="true" />;
    case 'tool':
      return <Monitor className={cls} aria-hidden="true" />;
    case 'quiz':
      return <HelpCircle className={cls} aria-hidden="true" />;
    case 'break':
      return <Coffee className={cls} aria-hidden="true" />;
    default:
      return <BookOpen className={cls} aria-hidden="true" />;
  }
}

export function SlideWorkspace({
  deck,
  currentIndex,
  visitedSlideIds,
  pacing,
  pacingItem,
  showTeacherCue,
  showGrid,
  isInstructor,
  pendingReviewCount = 0,
  onSelectClass,
  onOpenExam,
  onToggleTeacherCue,
  onCloseTeacherCue,
  onToggleGrid,
  onCloseGrid,
  onSelectSlide,
  onPrev,
  onNext,
  onSelectView,
  onSignOut,
}: SlideWorkspaceProps) {
  const [cueTab, setCueTab] = useState<'script' | 'bangla'>('script');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [collapsedParts, setCollapsedParts] = useState<Record<string, boolean>>({});

  const slides = deck.slides;
  const slide = slides[currentIndex];
  const totalSlides = slides.length;
  const progressPct = ((currentIndex + 1) / totalSlides) * 100;
  const paddedCurrent = String(currentIndex + 1).padStart(2, '0');
  const paddedTotal = String(totalSlides).padStart(2, '0');

  const chapters = useMemo(() => groupSlidesByPart(slides), [slides]);
  const visitedSet = useMemo(() => new Set(visitedSlideIds), [visitedSlideIds]);
  const classProgress = useMemo(
    () => computeClassProgress(visitedSlideIds, totalSlides),
    [visitedSlideIds, totalSlides]
  );

  const togglePart = (partTitle: string) => {
    setCollapsedParts((prev) => ({ ...prev, [partTitle]: !prev[partTitle] }));
  };

  const outlineContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Sidebar Header: Class Switcher + Progress */}
      <div className="border-b border-slate-200 p-4 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div
            role="group"
            aria-label="Switch course class"
            className="inline-flex flex-1 items-center gap-0.5 rounded-lg bg-slate-100 p-0.5"
          >
            {READY_CLASS_IDS.map((cid) => {
              const active = cid === deck.classId;
              return (
                <button
                  key={cid}
                  type="button"
                  onClick={() => onSelectClass(cid)}
                  className={`flex-1 rounded-md px-2 py-1 text-xs transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                      : 'font-medium text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Class 0{cid}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close course outline"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 xl:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div>
          <p className="font-display text-[13.5px] font-bold leading-snug text-slate-900">
            {deck.title}
          </p>
          <div className="mt-2.5 space-y-1">
            <div className="flex items-center justify-between text-[11.5px] tabular-nums">
              <span className="font-medium text-slate-500">
                {classProgress.visitedCount} of {totalSlides} lessons viewed
              </span>
              <span className="font-mono font-semibold text-[#1D4ED8]">
                {classProgress.percent}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#1D4ED8] transition-all duration-300"
                style={{ width: `${classProgress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Chapter-Grouped Lesson List */}
      <nav
        aria-label="Course lessons outline"
        className="flex-1 overflow-y-auto px-2.5 py-3 space-y-2"
      >
        {chapters.map((chapter) => {
          const isCollapsed = collapsedParts[chapter.partTitle] ?? false;
          const chapterHasCurrent = chapter.slides.some((s) => s.index === currentIndex);

          return (
            <div key={chapter.partTitle} className="space-y-0.5">
              <button
                type="button"
                onClick={() => togglePart(chapter.partTitle)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50 transition-colors"
              >
                <span
                  className={`truncate text-[11.5px] font-semibold ${
                    chapterHasCurrent ? 'text-[#1D4ED8]' : 'text-slate-500'
                  }`}
                >
                  {chapter.partTitle}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                    isCollapsed ? '-rotate-90' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {!isCollapsed && (
                <ul className="space-y-0.5">
                  {chapter.slides.map(({ slide: s, index: idx, kind }) => {
                    const isActive = idx === currentIndex;
                    const isDone = visitedSet.has(s.id) && !isActive;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSlide(idx);
                            setMobileDrawerOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            isActive
                              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2
                              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                              aria-hidden="true"
                            />
                          ) : (
                            <LessonKindIcon kind={kind} active={isActive} />
                          )}
                          <span className="min-w-0 flex-1 truncate text-[12.5px] leading-snug">
                            <span className="font-mono text-[11px] opacity-65 mr-1.5 tabular-nums">
                              {String(s.id).padStart(2, '0')}
                            </span>
                            {s.keyword}
                          </span>
                          <span className="font-mono text-[10.5px] text-slate-400 tabular-nums shrink-0">
                            {s.durationMinutes}m
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Pinned Exam Action at Bottom of Outline */}
      <div className="border-t border-slate-200 p-3.5">
        <button
          type="button"
          onClick={() => onOpenExam(deck.classId)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-blue-100/70 transition-colors"
        >
          <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Take Class 0{deck.classId} Official Exam
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-canvas relative flex min-h-[100dvh] w-full flex-col overflow-x-clip text-slate-900">
      {/* Subtle 2px Top Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-[2px] bg-slate-200/80"
      >
        <div
          className="h-full bg-[#1D4ED8] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Focused LMS Lesson Player Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left: Back to Curriculum + Outline Toggle + Lesson Breadcrumb */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onSelectView('roadmap')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Curriculum</span>
            </button>

            {/* Desktop Sidebar Focus Mode Toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? 'Hide course outline' : 'Show course outline'}
              title={sidebarOpen ? 'Focus mode (hide outline)' : 'Show course outline'}
              className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{sidebarOpen ? 'Focus' : 'Outline'}</span>
            </button>

            {/* Mobile / Tablet Outline Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open course outline"
              className="inline-flex xl:hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Lessons</span>
            </button>

            <span aria-hidden="true" className="hidden md:block h-4 w-px bg-slate-200" />

            <div className="hidden md:flex min-w-0 items-center gap-2 text-[13px]">
              <span className="font-mono text-xs font-semibold text-[#1D4ED8] whitespace-nowrap">
                Class 0{deck.classId}
              </span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span className="truncate font-medium text-slate-700">
                {slide.keyword}
              </span>
            </div>
          </div>

          {/* Right: Quick Views, Pacing, Grid, Theme & Account */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <nav aria-label="Course shortcuts" className="hidden lg:flex items-center gap-4 mr-1 text-xs">
              <button
                type="button"
                onClick={() => onOpenExam(deck.classId)}
                className="inline-flex items-center gap-1 font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap"
              >
                <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Exam
              </button>
              <button
                type="button"
                onClick={() => onSelectView('results')}
                className="font-medium text-slate-600 hover:text-slate-950 whitespace-nowrap"
              >
                Results
              </button>
              <button
                type="button"
                onClick={() => onSelectView('toolkit')}
                className="font-medium text-slate-600 hover:text-slate-950 whitespace-nowrap"
              >
                Tools
              </button>
              {isInstructor && (
                <button
                  type="button"
                  onClick={() => onSelectView('instructor')}
                  className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 whitespace-nowrap"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Instructor
                  {pendingReviewCount > 0 && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800 leading-none tabular-nums">
                      {pendingReviewCount}
                    </span>
                  )}
                </button>
              )}
            </nav>

            <span
              className={`hidden sm:inline font-mono text-xs font-medium tabular-nums ${
                slide.isBreakSlide ? 'text-amber-700' : 'text-slate-500'
              }`}
            >
              {pacingItem.shortStamp} min
            </span>

            <button
              type="button"
              onClick={onToggleGrid}
              aria-label={`Open all ${totalSlides} slides grid`}
              title="All Lessons Grid (G)"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors"
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <ThemeToggle compact />

            <button
              type="button"
              onClick={onSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Split LMS Player Body: Left Outline Sidebar + Right Lesson Canvas */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Collapsible Course Outline Sidebar */}
        {sidebarOpen && (
          <aside
            aria-label="Course outline sidebar"
            className="hidden xl:block w-[308px] shrink-0 border-r border-slate-200 bg-white sticky top-14 h-[calc(100dvh-3.5rem)]"
          >
            {outlineContent}
          </aside>
        )}

        {/* Mobile / Tablet Slide-Over Outline Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex xl:hidden">
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Course lessons outline"
              className="relative z-10 h-full w-[min(320px,86vw)] border-r border-slate-200 bg-white shadow-2xl"
            >
              {outlineContent}
            </aside>
          </div>
        )}

        {/* Right Primary Lesson Column */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col items-center justify-center px-4 py-8 sm:px-10 sm:py-10">
            <div
              key={`${deck.classId}-${slide.id}`}
              className="animate-slide-enter flex w-full flex-col items-center"
            >
              {slide.stageType !== 'hero' && (
                <div className="mb-8 w-full max-w-[820px] text-center">
                  <p
                    className={`mb-2 text-[13px] font-medium ${
                      slide.isBreakSlide ? 'text-amber-700' : 'text-[#1D4ED8]'
                    }`}
                  >
                    {slide.eyebrow}
                  </p>
                  <h1 className="font-display text-2xl font-bold leading-[1.16] tracking-[-0.03em] text-slate-900 sm:text-[34px]">
                    {slide.headline}
                  </h1>
                  <p className="mx-auto mt-3 max-w-[660px] text-[15px] leading-[1.65] text-slate-600 sm:text-[16px]">
                    <InlineCodeText text={slide.oneLineSummary} />
                  </p>
                </div>
              )}

              {/* Main Interactive Visual Stage */}
              <div className="flex w-full justify-center">
                {renderStage(slide, onSelectClass)}
              </div>

              {/* Quiet Real-World Tool Links */}
              {slide.realWorldTools && slide.realWorldTools.length > 0 && (
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-slate-500">
                  <span className="font-medium text-slate-700">Tools referenced:</span>
                  {slide.realWorldTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      title={`${tool.role} — ${tool.useCase}`}
                      className="inline-flex items-center gap-1 text-slate-700 hover:text-[#1D4ED8] transition-colors whitespace-nowrap"
                    >
                      <span className="font-medium">{tool.name}</span>
                      <span className="text-slate-400">({tool.role})</span>
                      <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}

              {/* End-of-Class Official Exam Card */}
              {currentIndex >= totalSlides - 3 && (
                <div className="mt-8 flex w-full max-w-[840px] flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-200 bg-white px-6 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
                  <div className="text-left space-y-1">
                    <span className="block text-xs font-semibold text-[#1D4ED8]">
                      Official Class 0{deck.classId} Assessment · Saved to Cloud
                    </span>
                    <p className="text-sm text-slate-600">
                      Complete the graded MCQs, multi-select checks, and short written question — all attempts remain archived permanently.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenExam(deck.classId)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
                  >
                    <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                    Take Class 0{deck.classId} Exam
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Dedicated Sticky LMS Lesson Player Footer */}
          <footer className="sticky bottom-0 z-20 border-t border-slate-200/90 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-3 sm:px-10">
              {/* Left: Previous Lesson + Optional Instructor Teacher Cue */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white transition-colors whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {isInstructor && (
                  <div className="relative">
                    {showTeacherCue && (
                      <aside
                        role="dialog"
                        aria-label="Instructor Teacher Cue"
                        className="absolute bottom-12 left-0 z-40 w-[min(440px,calc(100vw-32px))] rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.16)]"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                            <button
                              type="button"
                              onClick={() => setCueTab('script')}
                              className={`rounded-md px-3 py-1 text-xs transition-all whitespace-nowrap ${
                                cueTab === 'script'
                                  ? 'bg-white font-semibold text-slate-900 shadow-2xs'
                                  : 'font-medium text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Live Script
                            </button>
                            <button
                              type="button"
                              onClick={() => setCueTab('bangla')}
                              className={`rounded-md px-3 py-1 text-xs transition-all whitespace-nowrap ${
                                cueTab === 'bangla'
                                  ? 'bg-white font-semibold text-slate-900 shadow-2xs'
                                  : 'font-medium text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Bangla Prep
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={onCloseTeacherCue}
                            aria-label="Close Teacher Cue"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        {cueTab === 'script' ? (
                          <div className="space-y-3.5 text-[13.5px] leading-relaxed">
                            <div>
                              <span className="block text-xs font-semibold text-[#1D4ED8]">
                                Say out loud
                              </span>
                              <p className="mt-0.5 text-slate-800">
                                <InlineCodeText text={slide.teacherCue.sayThis} />
                              </p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200/80 px-3.5 py-2.5">
                              <span className="block text-xs font-semibold text-amber-800">
                                Real-world analogy
                              </span>
                              <p className="mt-0.5 text-slate-700">
                                <InlineCodeText text={slide.teacherCue.realWorldAnalogy} />
                              </p>
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-slate-700">
                                Live click action
                              </span>
                              <p className="mt-0.5 text-slate-700">
                                <InlineCodeText text={slide.teacherCue.liveDemoStep} />
                              </p>
                            </div>
                            <div className="border-t border-slate-100 pt-3">
                              <span className="block text-xs font-semibold text-emerald-800">
                                Ask your student
                              </span>
                              <p className="mt-0.5 font-medium text-slate-900">
                                <InlineCodeText text={slide.teacherCue.checkQuestion} />
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3.5 text-[13.5px] leading-relaxed">
                            <div className="rounded-lg border border-amber-200/90 bg-amber-50/70 p-3.5">
                              <span className="block text-xs font-semibold text-amber-900 mb-1">
                                Instructor prep note (Banglish)
                              </span>
                              <p className="text-slate-800">
                                <InlineCodeText text={slide.teacherCue.banglaPrepNote} />
                              </p>
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-slate-700">
                                Live demo reminder
                              </span>
                              <p className="mt-0.5 text-slate-700">
                                <InlineCodeText text={slide.teacherCue.liveDemoStep} />
                              </p>
                            </div>
                            <div className="border-t border-slate-100 pt-3">
                              <span className="block text-xs font-semibold text-emerald-800">
                                Student check question
                              </span>
                              <p className="mt-0.5 font-medium text-slate-900">
                                <InlineCodeText text={slide.teacherCue.checkQuestion} />
                              </p>
                            </div>
                          </div>
                        )}
                      </aside>
                    )}

                    <button
                      type="button"
                      onClick={onToggleTeacherCue}
                      aria-expanded={showTeacherCue}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-all whitespace-nowrap ${
                        showTeacherCue
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {showTeacherCue ? (
                        <>
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="hidden sm:inline">Close Cue</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
                          <span className="hidden sm:inline">Teacher Cue</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Center: Quiet Lesson Progress Stamp */}
              <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                <span className="font-mono font-semibold text-slate-700">
                  Lesson {paddedCurrent} / {paddedTotal}
                </span>
                <span aria-hidden="true" className="hidden md:inline text-slate-300">·</span>
                <span className="hidden md:inline truncate max-w-[220px]">{slide.sectionTag}</span>
              </div>

              {/* Right: Complete & Continue OR Official Exam */}
              {currentIndex < totalSlides - 1 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shadow-xs"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenExam(deck.classId)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-xs"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Take Class 0{deck.classId} Exam</span>
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>

      {/* Clean Airy Slide Grid Overlay (G Shortcut) */}
      {showGrid && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`All Class 0${deck.classId} Slides`}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#F8FAFC]/97 p-5 backdrop-blur-sm sm:p-10"
        >
          <div className="mx-auto max-w-[1240px] space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-medium text-[#1D4ED8] tabular-nums">
                  Class 0{deck.classId} · {totalSlides} lessons · {pacing.totalClassMinutes} min (3 hours)
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
                  {deck.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                  {READY_CLASS_IDS.map((cid) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => onSelectClass(cid)}
                      className={`rounded-md px-3 py-1.5 text-xs transition-all whitespace-nowrap ${
                        cid === deck.classId
                          ? 'bg-white font-semibold text-slate-900 shadow-2xs'
                          : 'font-medium text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {COURSE_DECKS[cid].shortTitle}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onCloseGrid}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Close (Esc)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {slides.map((s, idx) => {
                const isActive = idx === currentIndex;
                const item = pacing.items[idx];
                const isPractice = s.stageType === 'practice-test';
                const isTool = s.stageType === 'tool-spotlight';
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectSlide(idx);
                      onCloseGrid();
                    }}
                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                      isActive
                        ? 'border-[#1D4ED8] bg-[#EFF6FF]/60 ring-1 ring-[#1D4ED8]/20'
                        : s.isBreakSlide
                          ? 'border-amber-200 bg-amber-50/50 hover:border-amber-300'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums">
                        <span
                          className={
                            isActive
                              ? 'font-semibold text-[#1D4ED8]'
                              : s.isBreakSlide
                                ? 'font-semibold text-amber-700'
                                : isPractice
                                  ? 'font-semibold text-emerald-700'
                                  : isTool
                                    ? 'font-semibold text-indigo-700'
                                    : 'text-slate-500'
                          }
                        >
                          Lesson {String(s.id).padStart(2, '0')}
                          {isPractice ? ' · Quiz' : isTool ? ' · Tool UI' : ''}
                        </span>
                        <span className="text-slate-400">{item.shortStamp}m</span>
                      </div>
                      <p className="mt-2 font-display text-[15px] font-bold leading-snug text-slate-900">
                        {s.keyword}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-600">
                        {s.headline.toLowerCase() === s.keyword.toLowerCase()
                          ? s.oneLineSummary
                          : s.headline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                      {s.part}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
