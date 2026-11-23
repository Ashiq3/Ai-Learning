import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  LayoutGrid,
  Plus,
  X,
} from 'lucide-react';
import { COURSE_DECKS, READY_CLASS_IDS } from '../data/allClasses';
import type { AppView, ClassDeck, ClassId, SlideData } from '../types/course';
import type { ClassPacingSummary, SlidePacingItem } from '../utils/courseLogic';
import { InlineCodeText } from './InlineCodeText';
import {
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
  pacing: ClassPacingSummary;
  pacingItem: SlidePacingItem;
  showTeacherCue: boolean;
  showGrid: boolean;
  onSelectClass: (classId: ClassId) => void;
  onToggleTeacherCue: () => void;
  onCloseTeacherCue: () => void;
  onToggleGrid: () => void;
  onCloseGrid: () => void;
  onSelectSlide: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectView: (view: AppView) => void;
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

export function SlideWorkspace({
  deck,
  currentIndex,
  pacing,
  pacingItem,
  showTeacherCue,
  showGrid,
  onSelectClass,
  onToggleTeacherCue,
  onCloseTeacherCue,
  onToggleGrid,
  onCloseGrid,
  onSelectSlide,
  onPrev,
  onNext,
  onSelectView,
}: SlideWorkspaceProps) {
  const [cueTab, setCueTab] = useState<'script' | 'bangla'>('script');

  const slides = deck.slides;
  const slide = slides[currentIndex];
  const totalSlides = slides.length;
  const progressPct = ((currentIndex + 1) / totalSlides) * 100;
  const paddedCurrent = String(currentIndex + 1).padStart(2, '0');
  const paddedTotal = String(totalSlides).padStart(2, '0');

  return (
    <div className="deck-surface relative flex min-h-[100dvh] w-full flex-col justify-between overflow-x-clip text-[#edf4f5]">
      {/* Fixed 3px Top Gradient Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-[3px] bg-white/8"
      >
        <div
          className="h-full bg-gradient-to-r from-[#60e0c0] to-[#80b6ff] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Minimalist Top Keynote Chrome + Clean Class 01/02/03 Switcher */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 pt-5 pb-2 sm:px-9">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
          <button
            type="button"
            onClick={() => onSelectSlide(0)}
            className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#b4c8d3] hover:text-[#60e0c0] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] rounded"
          >
            AI BACKEND COURSE
          </button>

          {/* Clean Class 01 / 02 / 03 Selector */}
          <div
            role="group"
            aria-label="Select 3-hour class"
            className="flex items-center gap-1 rounded-lg border border-white/12 bg-[#111e2b] p-0.5"
          >
            {READY_CLASS_IDS.map((cid) => {
              const active = cid === deck.classId;
              return (
                <button
                  key={cid}
                  type="button"
                  onClick={() => onSelectClass(cid)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#60e0c0] text-[#08171c]'
                      : 'text-[#8ea5b4] hover:text-[#edf4f5]'
                  }`}
                >
                  Class 0{cid}
                </button>
              );
            })}
          </div>

          <nav
            aria-label="Course views"
            className="flex items-center gap-3.5 text-xs"
          >
            <button
              type="button"
              onClick={() => onSelectView('roadmap')}
              className="text-[#8ba2b0] hover:text-[#edf4f5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] rounded"
            >
              20-Class Roadmap
            </button>
            <button
              type="button"
              onClick={() => onSelectView('toolkit')}
              className="text-[#8ba2b0] hover:text-[#edf4f5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] rounded"
            >
              Tool Reference
            </button>
          </nav>
        </div>

        {/* Center Quiet Keyboard Hint (Wide Desktop) */}
        <p className="hidden 2xl:block font-mono text-[11px] tracking-[0.06em] text-[#6d8595] whitespace-nowrap">
          ← → navigate · T teacher cue · G all slides
        </p>

        {/* Right Slide Eyebrow + Minute Stamp */}
        <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums whitespace-nowrap shrink-0">
          <span className="hidden md:inline tracking-[0.12em] text-[#8ba2b0]">
            {slide.eyebrow}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 font-semibold ${
              slide.isBreakSlide
                ? 'border-[#ffad70]/45 bg-[#34251c] text-[#ffad70]'
                : 'border-[#60e0c0]/35 bg-[#122a33] text-[#60e0c0]'
            }`}
          >
            {pacingItem.shortStamp} min
          </span>
        </div>
      </header>

      {/* Centered Spacious Keynote Stage */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-1 flex-col items-center justify-center px-5 pt-3 pb-24 sm:px-10">
        <div
          key={`${deck.classId}-${slide.id}`}
          className="animate-slide-enter flex w-full flex-col items-center"
        >
          {slide.stageType !== 'hero' && (
            <div className="mb-6 w-full max-w-[900px] text-center sm:mb-7">
              <div
                className={`mb-2 font-mono text-[11px] font-semibold tracking-[0.16em] uppercase ${
                  slide.isBreakSlide ? 'text-[#ffad70]' : 'text-[#60e0c0]'
                }`}
              >
                {slide.eyebrow}
              </div>
              <h1 className="font-display text-2xl font-extrabold leading-[1.1] tracking-[-0.03em] text-[#f1f5f4] sm:text-4xl lg:text-[40px]">
                {slide.headline}
              </h1>
              <p className="mx-auto mt-2.5 max-w-[740px] text-sm leading-relaxed text-[#a5b7c1] sm:text-[15px]">
                <InlineCodeText text={slide.oneLineSummary} />
              </p>
            </div>
          )}

          {/* 80% Visual Interactive Canvas */}
          <div className="flex w-full justify-center">
            {renderStage(slide, onSelectClass)}
          </div>

          {/* Subtle Compact Real-World Tool Strip */}
          {slide.realWorldTools && slide.realWorldTools.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-[#8ca3b2]">
              <span className="font-mono tracking-[0.12em] text-[#60e0c0] uppercase">
                Real-World Tools:
              </span>
              {slide.realWorldTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  title={`${tool.role} — ${tool.useCase}`}
                  className="inline-flex items-center gap-1 text-[#c6dae3] hover:text-[#60e0c0] transition-colors whitespace-nowrap"
                >
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-[#7891a1]">({tool.role})</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-70" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Floating Deck Bar */}
      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 bg-gradient-to-t from-[#0b1119] via-[#0b1119]/90 to-transparent px-4 pt-6 pb-4 sm:bg-none sm:px-9 sm:pt-0 sm:pb-6">
        {/* Bottom-Left: Floating Teacher Cue Button + Warm Cream Paper Popover */}
        <div className="pointer-events-auto relative">
          {showTeacherCue && (
            <aside
              role="dialog"
              aria-label="Instructor Teacher Cue"
              className="absolute bottom-14 left-0 z-40 w-[min(430px,calc(100vw-32px))] rounded-2xl border border-[#d6d0bc] bg-[#f4f2e9] p-5 text-[#17232f] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
            >
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#dad4c2] pb-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCueTab('script')}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors whitespace-nowrap ${
                      cueTab === 'script'
                        ? 'bg-[#17232f] text-[#f4f2e9]'
                        : 'text-[#4c5c68] hover:bg-[#e7e2d1]'
                    }`}
                  >
                    Live Script
                  </button>
                  <button
                    type="button"
                    onClick={() => setCueTab('bangla')}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors whitespace-nowrap ${
                      cueTab === 'bangla'
                        ? 'bg-[#17232f] text-[#f4f2e9]'
                        : 'text-[#4c5c68] hover:bg-[#e7e2d1]'
                    }`}
                  >
                    Bangla Prep
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onCloseTeacherCue}
                  aria-label="Close Teacher Cue"
                  className="rounded-md p-1 text-[#50616d] hover:bg-[#e5e0cf] hover:text-[#17232f] transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {cueTab === 'script' ? (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#0d6e5c] uppercase">
                      Say Out Loud
                    </span>
                    <p className="mt-0.5 text-[13px] text-[#17232f]">
                      <InlineCodeText
                        text={slide.teacherCue.sayThis}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#0b5c4d]"
                      />
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#eae6d6] px-3 py-2">
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#9b4f1b] uppercase">
                      Real-World Analogy
                    </span>
                    <p className="mt-0.5 text-[#273847]">
                      <InlineCodeText
                        text={slide.teacherCue.realWorldAnalogy}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#0b5c4d]"
                      />
                    </p>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#285a8f] uppercase">
                      Live Click Action
                    </span>
                    <p className="mt-0.5 text-[#273847]">
                      <InlineCodeText
                        text={slide.teacherCue.liveDemoStep}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#0b5c4d]"
                      />
                    </p>
                  </div>
                  <div className="border-t border-[#dad4c2] pt-2.5">
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#17232f] uppercase">
                      Ask Your Student
                    </span>
                    <p className="mt-0.5 font-medium text-[#17232f]">
                      <InlineCodeText
                        text={slide.teacherCue.checkQuestion}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#0b5c4d]"
                      />
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="rounded-lg border border-[#d6ccb4] bg-[#ebe6d4] p-3.5">
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#9b4f1b] uppercase mb-1">
                      Vibe-Coder Instructor Prep (Banglish)
                    </span>
                    <p className="text-[13px] leading-relaxed text-[#17232f]">
                      <InlineCodeText
                        text={slide.teacherCue.banglaPrepNote}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#8a4314]"
                      />
                    </p>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#0d6e5c] uppercase">
                      Live Demo Reminder
                    </span>
                    <p className="mt-0.5 text-[#273847]">
                      <InlineCodeText
                        text={slide.teacherCue.liveDemoStep}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#0b5c4d]"
                      />
                    </p>
                  </div>
                  <div className="border-t border-[#dad4c2] pt-2.5">
                    <span className="block font-mono text-[10px] font-bold tracking-[0.12em] text-[#17232f] uppercase">
                      Student Check Question
                    </span>
                    <p className="mt-0.5 font-medium text-[#17232f]">
                      <InlineCodeText
                        text={slide.teacherCue.checkQuestion}
                        codeClassName="rounded bg-[#17232f]/10 px-1 py-0.5 font-mono text-[0.9em] text-[#0b5c4d]"
                      />
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
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 sm:gap-2 sm:px-4 font-mono text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] ${
              showTeacherCue
                ? 'border-[#f4f2e9] bg-[#f4f2e9] text-[#17232f]'
                : 'border-[#60e0c0]/45 bg-[#152637]/90 text-[#60e0c0] hover:border-[#60e0c0] hover:bg-[#193044]'
            }`}
          >
            {showTeacherCue ? (
              <>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Close Cue
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Teacher Cue
              </>
            )}
          </button>
        </div>

        {/* Bottom-Center: Quiet Section Stamp */}
        <div className="hidden lg:block pb-2 font-mono text-[10px] tracking-[0.18em] text-[#6d8595] uppercase whitespace-nowrap">
          {slide.sectionTag}
        </div>

        {/* Bottom-Right: Slide Grid + Prev / Counter / Next */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/14 bg-[#12202f]/90 p-1.5 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={onToggleGrid}
            aria-label={`Open all ${totalSlides} slides grid`}
            title="All Slides (G)"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9eb4c2] hover:bg-white/10 hover:text-[#60e0c0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0]"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </button>

          <span aria-hidden="true" className="h-4 w-px bg-white/12 mx-0.5" />

          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#dbe8ee] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="px-2 font-mono text-xs font-semibold text-[#d3e2e8] tabular-nums whitespace-nowrap">
            {paddedCurrent} <span className="text-[#698292]">/</span> {paddedTotal}
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex === totalSlides - 1}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#60e0c0] text-[#09181d] hover:bg-[#7ae8cc] disabled:bg-white/10 disabled:text-[#698292] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0]"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </footer>

      {/* Full-Screen Slide Grid Overlay (G or Grid Button) */}
      {showGrid && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`All Class 0${deck.classId} Slides`}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#070e16]/95 p-5 backdrop-blur-md sm:p-10"
        >
          <div className="mx-auto max-w-[1260px] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#60e0c0] uppercase">
                  CLASS 0{deck.classId} · {totalSlides} SLIDES · {pacing.totalClassMinutes} MIN (3 HOURS)
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-[#f1f5f4]">
                  {deck.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {READY_CLASS_IDS.map((cid) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => onSelectClass(cid)}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-colors whitespace-nowrap ${
                      cid === deck.classId
                        ? 'border-[#60e0c0] bg-[#15353a] text-[#60e0c0]'
                        : 'border-white/12 bg-[#12202e] text-[#9eb2be] hover:text-white'
                    }`}
                  >
                    {COURSE_DECKS[cid].shortTitle}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onCloseGrid}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#132130] px-3.5 py-2 font-mono text-xs font-semibold text-[#d3e2e8] hover:border-[#60e0c0] transition-colors whitespace-nowrap"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Close (Esc)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] ${
                      isActive
                        ? 'border-[#60e0c0] bg-[#15353a] shadow-[0_0_0_1px_rgba(96,224,192,0.3)]'
                        : s.isBreakSlide
                          ? 'border-[#ffad70]/35 bg-[#231f20] hover:border-[#ffad70]'
                          : 'border-white/10 bg-[#12202e] hover:border-[#60e0c0]/50 hover:bg-[#162839]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 font-mono text-[10px] tabular-nums">
                        <span
                          className={
                            isActive
                              ? 'font-bold text-[#60e0c0]'
                              : s.isBreakSlide
                                ? 'font-bold text-[#ffad70]'
                                : isPractice
                                  ? 'font-bold text-[#ffad70]'
                                  : isTool
                                    ? 'font-bold text-[#80b6ff]'
                                    : 'text-[#7e98a8]'
                          }
                        >
                          SLIDE {String(s.id).padStart(2, '0')}
                          {isPractice ? ' · TEST' : isTool ? ' · TOOL UI' : ''}
                        </span>
                        <span className="text-[#8ba2b0]">{item.shortStamp} min</span>
                      </div>
                      <p className="mt-2 font-display text-sm font-bold leading-snug text-[#f1f5f4]">
                        {s.keyword}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#9cb0bc]">
                        {s.headline.toLowerCase() === s.keyword.toLowerCase()
                          ? s.oneLineSummary
                          : s.headline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/8 font-mono text-[10px] text-[#738d9e]">
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
