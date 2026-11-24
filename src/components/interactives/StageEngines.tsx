import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { ClassId, SlideVisualConfig } from '../../types/course';
import { InlineCodeText } from '../InlineCodeText';
import { IllustratedFrame } from './IllustratedFrame';

const ACCENT_MAP = {
  teal: {
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-600',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-700',
    dot: 'bg-emerald-600',
    tag: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  orange: {
    border: 'border-amber-200',
    activeBorder: 'border-amber-600',
    bg: 'bg-amber-50/70',
    text: 'text-amber-700',
    dot: 'bg-amber-600',
    tag: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  blue: {
    border: 'border-blue-200',
    activeBorder: 'border-[#1D4ED8]',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    dot: 'bg-[#1D4ED8]',
    tag: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  rose: {
    border: 'border-red-200',
    activeBorder: 'border-red-600',
    bg: 'bg-red-50/70',
    text: 'text-red-700',
    dot: 'bg-red-600',
    tag: 'bg-red-50 text-red-800 border-red-200',
  },
} as const;

/* ---------- 1. HERO STAGE ---------- */
export function HeroStage({ visual }: { visual: SlideVisualConfig }) {
  const [l1, l2, l3] = visual.heroLines ?? ['A click.', 'A request.', 'A reply.'];
  return (
    <div className="grid w-full max-w-[1060px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div className="lg:col-span-6 space-y-5">
        <p className="text-[13px] font-semibold text-[#1D4ED8]">
          {visual.heroBadge ?? '20-Class Master Course'}
        </p>
        <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-[-0.035em] text-slate-900 sm:text-[54px]">
          <span className="block">{l1}</span>
          <span className="block text-[#1D4ED8]">{l2}</span>
          <span className="block">{l3}</span>
        </h1>
        <p className="max-w-lg text-[15.5px] leading-[1.65] text-slate-600">
          <InlineCodeText text={visual.heroSubtext ?? ''} />
        </p>
        {visual.heroQuote && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-[13.5px] leading-relaxed text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <span className="block text-xs font-semibold text-slate-900 mb-1">
              {visual.heroQuoteLabel ?? 'Why this class matters'}
            </span>
            {visual.heroQuote}
          </div>
        )}
      </div>

      {/* Clean Architectural Flow Diagram */}
      <div className="lg:col-span-6 relative hidden min-h-[340px] items-center justify-center sm:flex">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex w-full items-center justify-between gap-4">
            {/* Left Node: Screen */}
            <div className="w-[185px] rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="block text-[11px] font-semibold text-slate-500">
                {visual.heroLeftLabel ?? 'Your Screen'}
              </span>
              <div className="mt-3 space-y-2 rounded-lg border border-slate-200/80 bg-white p-2.5">
                <div className="text-[11px] font-semibold text-slate-700">Live App UI</div>
                <div className="ml-3 rounded-md bg-[#EFF6FF] border border-blue-200/80 px-2.5 py-1.5 text-[11px] font-medium text-[#1E40AF]">
                  Send request →
                </div>
                <div className="mr-3 rounded-md bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-700">
                  200 OK reply
                </div>
              </div>
            </div>

            {/* Center Animated Flow */}
            <div className="flex flex-1 flex-col items-center gap-4">
              <div className="w-full space-y-1.5 text-center">
                <span className="font-mono text-[10px] font-semibold text-[#1D4ED8]">
                  REQUEST →
                </span>
                <svg viewBox="0 0 120 8" className="h-2 w-full" aria-hidden="true">
                  <line
                    x1="2"
                    y1="4"
                    x2="118"
                    y2="4"
                    stroke="#1D4ED8"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="animate-flow-dash"
                  />
                </svg>
              </div>
              <div className="flex h-14 w-20 flex-col items-center justify-center rounded-xl border border-blue-200 bg-[#EFF6FF] text-[#1D4ED8]">
                <span className="font-mono text-xs font-semibold">
                  {visual.heroCenterBadge ?? 'HTTPS'}
                </span>
                <span className="text-[10px] font-medium text-slate-500">Live flow</span>
              </div>
              <div className="w-full space-y-1.5 text-center">
                <svg viewBox="0 0 120 8" className="h-2 w-full" aria-hidden="true">
                  <line
                    x1="118"
                    y1="4"
                    x2="2"
                    y2="4"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="animate-flow-dash"
                  />
                </svg>
                <span className="font-mono text-[10px] font-semibold text-emerald-700">
                  ← RESPONSE
                </span>
              </div>
            </div>

            {/* Right Node: Cloud Backend */}
            <div className="w-[165px] rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <div className="mx-auto my-2 grid gap-2">
                {[0, 1, 2].map((r) => (
                  <div
                    key={r}
                    className="flex h-7 items-center justify-between rounded-md border border-slate-200 bg-white px-2.5"
                  >
                    <span className="h-1.5 w-10 rounded bg-slate-200" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
              <span className="mt-3 block text-[11px] font-semibold text-slate-600">
                {visual.heroRightLabel ?? 'Cloud Backend'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. 180-MINUTE ROUTE STAGE ---------- */
export function TimelineRouteStage({ visual }: { visual: SlideVisualConfig }) {
  const part1 = visual.routePart1 ?? [];
  const part2 = visual.routePart2 ?? [];

  return (
    <div className="grid w-full max-w-[1040px] grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <span className="font-display text-[15px] font-bold text-slate-900">
            Part 1 · Core Foundations
          </span>
          <span className="font-mono text-xs text-slate-500 tabular-nums">~90 min</span>
        </div>
        <div className="divide-y divide-slate-100">
          {part1.map((b) => (
            <div key={b.time} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
              <span className="w-20 font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums shrink-0 pt-0.5">
                {b.time}
              </span>
              <div>
                <p className="text-[14.5px] font-semibold text-slate-900">{b.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5">
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-5 py-3.5 text-center">
          <span className="text-[13px] font-semibold text-amber-900">
            {visual.routeBreakLabel ?? 'Mid-Class 15-Minute Live Countdown Break'}
          </span>
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <span className="font-display text-[15px] font-bold text-slate-900">
              Part 2 · Tools &amp; Practice Labs
            </span>
            <span className="font-mono text-xs text-slate-500 tabular-nums">~75 min</span>
          </div>
          <div className="divide-y divide-slate-100">
            {part2.map((b) => (
              <div key={b.time} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
                <span className="w-20 font-mono text-xs font-semibold text-emerald-700 tabular-nums shrink-0 pt-0.5">
                  {b.time}
                </span>
                <div>
                  <p className="text-[14.5px] font-semibold text-slate-900">{b.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. ANIMATED WORKFLOW STAGE ---------- */
export function AnimatedWorkflowStage({ visual }: { visual: SlideVisualConfig }) {
  const steps = visual.workflowSteps ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);

  useEffect(() => {
    if (!autoPlaying || steps.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= steps.length - 1) {
          setAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, [autoPlaying, steps.length]);

  const current = steps[activeIndex] ?? steps[0];
  if (!current) return null;

  return (
    <div className="w-full max-w-[1040px] space-y-6">
      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            setAutoPlaying(false);
            setActiveIndex((i) => (i + 1) % steps.length);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
        >
          Step Forward ({activeIndex + 1} / {steps.length})
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (autoPlaying) {
              setAutoPlaying(false);
            } else {
              if (activeIndex >= steps.length - 1) setActiveIndex(0);
              setAutoPlaying(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          {autoPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />
              Auto-Play Flow
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setAutoPlaying(false);
            setActiveIndex(0);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Node Pipeline */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isVisited = idx < activeIndex;
          const accent = ACCENT_MAP[step.accent ?? 'blue'];
          return (
            <div key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoPlaying(false);
                  setActiveIndex(idx);
                }}
                className={`min-w-[128px] rounded-xl border px-4 py-3 text-left transition-all ${
                  isActive
                    ? `${accent.activeBorder} ${accent.bg} shadow-sm ring-2 ring-[#1D4ED8]/10`
                    : isVisited
                      ? 'border-slate-300 bg-white text-slate-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span
                  className={`block font-mono text-[10px] font-semibold ${
                    isActive ? accent.text : 'text-slate-400'
                  }`}
                >
                  {step.badge}
                </span>
                <span className="mt-1 block text-[13px] font-bold text-slate-900">
                  {step.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {step.subtitle}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <svg
                  viewBox="0 0 28 12"
                  className="hidden sm:block h-3 w-7 shrink-0"
                  aria-hidden="true"
                >
                  <line
                    x1="2"
                    y1="6"
                    x2="22"
                    y2="6"
                    stroke={idx < activeIndex ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className={idx === activeIndex - 1 || idx === activeIndex ? 'animate-flow-dash' : ''}
                  />
                  <polygon
                    points="20,2 27,6 20,10"
                    fill={idx < activeIndex ? '#1D4ED8' : '#CBD5E1'}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Inspector Card + Intentional Dark Code Snapshot */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6 space-y-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="text-xs font-semibold text-[#1D4ED8] tabular-nums">
            Step {activeIndex + 1} of {steps.length} · {current.title}
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900">
            {current.subtitle}
          </h3>
          <p className="text-[14.5px] leading-[1.65] text-slate-600">
            <InlineCodeText text={current.explanation} />
          </p>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0F172A] p-6 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-blue-300">
              {current.payloadLabel}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {visual.workflowFlowLabel ?? 'Live data snapshot'}
            </span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-100">
            {current.payloadPreview}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. REAL TOOL SCREENSHOT SPOTLIGHT STAGE ---------- */
export function ToolSpotlightStage({ visual }: { visual: SlideVisualConfig }) {
  const hotspots = visual.toolHotspots ?? [];
  const [selectedPin, setSelectedPin] = useState(0);
  const active = hotspots[selectedPin] ?? hotspots[0];

  return (
    <div className="grid w-full max-w-[1060px] grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* Real Tool Screenshot with Numbered Hotspots */}
      <div className="lg:col-span-8 space-y-2.5">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
              <span className="ml-1.5 truncate text-xs font-semibold text-slate-700">
                {visual.toolName}
              </span>
            </div>
            {visual.toolSourceUrl && (
              <a
                href={visual.toolSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline whitespace-nowrap"
              >
                Open live tool
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="relative bg-slate-100">
            {visual.toolImageSrc && (
              <img
                src={visual.toolImageSrc}
                alt={visual.toolImageAlt ?? visual.toolName ?? 'Tool UI screenshot'}
                className="max-h-[390px] w-full object-contain bg-white"
              />
            )}

            {/* Numbered Callout Pins */}
            {hotspots.map((spot, idx) => {
              const isSelected = idx === selectedPin;
              return (
                <button
                  key={spot.number}
                  type="button"
                  onClick={() => setSelectedPin(idx)}
                  aria-label={`Inspect ${spot.label}`}
                  style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-md transition-transform ${
                    isSelected
                      ? 'scale-125 border-white bg-[#1D4ED8] text-white ring-4 ring-[#1D4ED8]/25'
                      : 'border-white bg-slate-900 text-white hover:scale-110'
                  }`}
                >
                  {spot.number}
                </button>
              );
            })}
          </div>
        </div>

        {visual.toolOpenTip && (
          <p className="text-center text-xs text-slate-500">
            Click pins <strong className="font-semibold text-slate-700">1–{hotspots.length}</strong> on the screenshot · {visual.toolOpenTip}
          </p>
        )}
      </div>

      {/* Right Callout Inspector */}
      <div className="lg:col-span-4 space-y-3.5">
        <div className="flex flex-wrap gap-1.5">
          {hotspots.map((spot, idx) => (
            <button
              key={spot.number}
              type="button"
              onClick={() => setSelectedPin(idx)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                idx === selectedPin
                  ? 'border-[#1D4ED8] bg-[#EFF6FF] font-semibold text-[#1D4ED8]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {spot.number}. {spot.label}
            </button>
          ))}
        </div>

        {active && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1D4ED8] font-mono text-xs font-bold text-white shrink-0">
                {active.number}
              </span>
              <h3 className="font-display text-[16px] font-bold text-slate-900">
                {active.label}
              </h3>
            </div>
            <p className="text-[14px] leading-[1.6] text-slate-600">
              <InlineCodeText text={active.detail} />
            </p>
            <div className="border-t border-slate-100 pt-3 text-[13px] leading-relaxed text-slate-700">
              <span className="block text-xs font-semibold text-amber-800 mb-1">
                Practice tip
              </span>
              <InlineCodeText text={active.vibeNote} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- 5. COMPARISON SPLIT STAGE ---------- */
export function ComparisonSplitStage({ visual }: { visual: SlideVisualConfig }) {
  const sides = visual.comparisonSides ?? [];
  const colClass =
    sides.length === 3
      ? 'md:grid-cols-3'
      : sides.length === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'md:grid-cols-2';

  return (
    <div className="w-full max-w-[1040px] space-y-5">
      <div className={`grid grid-cols-1 gap-5 ${colClass}`}>
        {sides.map((side) => {
          const accent = ACCENT_MAP[side.accent];
          return (
            <div
              key={side.title}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="space-y-3">
                <span className={`block text-xs font-semibold ${accent.text}`}>
                  {side.badge}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {side.title}
                  </h3>
                  <p className="mt-0.5 text-[13.5px] text-slate-500">{side.subtitle}</p>
                </div>
                <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-[13.5px] leading-relaxed text-slate-700">
                  {side.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <span className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${accent.dot}`} />
                      <span>
                        <InlineCodeText text={pt} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {side.codeOrExample && (
                <div className="rounded-lg bg-[#0F172A] px-3.5 py-2.5 font-mono text-xs leading-relaxed text-slate-100">
                  {side.codeOrExample}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visual.comparisonTakeaway && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-center text-[14px] text-slate-700">
          <strong className="font-semibold text-slate-900 mr-2">Rule of thumb:</strong>
          <InlineCodeText text={visual.comparisonTakeaway} />
        </div>
      )}
    </div>
  );
}

/* ---------- 6. REAL-WORLD USE CASE GALLERY ---------- */
export function UseCaseGalleryStage({ visual }: { visual: SlideVisualConfig }) {
  const items = visual.useCases ?? [];
  const [selected, setSelected] = useState(0);
  const active = items[selected] ?? items[0];
  if (!active) return null;

  return (
    <div className="w-full max-w-[980px] space-y-6">
      <div className="flex flex-wrap justify-center">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
          {items.map((item, idx) => (
            <button
              key={item.appName}
              type="button"
              onClick={() => setSelected(idx)}
              className={`rounded-md px-4 py-1.5 text-[13px] transition-all whitespace-nowrap ${
                idx === selected
                  ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.appName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="text-xs font-semibold text-[#1D4ED8]">
            What the user sees ({active.appName})
          </span>
          <p className="text-[14.5px] leading-[1.65] text-slate-700">{active.userSees}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="text-xs font-semibold text-amber-700">
            Hidden backend engine
          </span>
          <p className="text-[14.5px] leading-[1.65] text-slate-700">{active.behindTheScenes}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-[13px]">
        <div className="flex flex-wrap items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-900">Production stack:</span>
          <span>{active.realTools.join(' · ')}</span>
        </div>
        <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
          {active.highlightMetric}
        </span>
      </div>
    </div>
  );
}

/* ---------- 7. HANDS-ON PRACTICE TEST STAGE ---------- */
export function PracticeTestStage({ visual }: { visual: SlideVisualConfig }) {
  const questions = visual.questions ?? [];
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showBangla, setShowBangla] = useState(true);

  const current = questions[qIndex];
  if (!current) return null;

  const chosen = answers[current.id];
  const isAnswered = chosen !== undefined;
  const isCorrect = chosen === current.correctIndex;
  const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="w-full max-w-[900px] rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      {/* Header + Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5 text-[13px]">
          <span className="font-semibold text-[#1D4ED8]">
            {visual.practiceMode === 'capstone' ? 'Self-Check Exam' : 'Practice Check'}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500 tabular-nums">
            Question {qIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
            Score: {score} / {questions.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setQIndex(0);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>

      {/* Scenario Prompt */}
      <div className="space-y-4">
        <p className="font-display text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          <InlineCodeText text={current.scenario} />
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {current.options.map((opt, idx) => {
            const picked = chosen === idx;
            const correctOpt = idx === current.correctIndex;
            let style =
              'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
            if (isAnswered) {
              if (correctOpt) {
                style = 'border-emerald-500 bg-emerald-50/80 text-emerald-950';
              } else if (picked) {
                style = 'border-red-400 bg-red-50/80 text-red-950';
              } else {
                style = 'border-slate-200 bg-slate-50/50 text-slate-400';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: idx }))}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left text-[14px] leading-relaxed transition-all ${style}`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current font-mono text-[11px] font-semibold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Explanation */}
      {isAnswered && (
        <div
          className={`rounded-xl border p-4 sm:p-5 space-y-2.5 ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50/60'
              : 'border-amber-200 bg-amber-50/60'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  <span className="text-emerald-800">Correct</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  <span className="text-amber-900">Not quite — here is why</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowBangla((b) => !b)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {showBangla ? 'Hide Banglish note' : 'Show Banglish note'}
            </button>
          </div>

          <p className="text-[14px] leading-relaxed text-slate-800">
            <InlineCodeText text={current.explanationEn} />
          </p>
          {showBangla && (
            <p className="rounded-lg border border-slate-200/80 bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-slate-700">
              <strong className="font-semibold text-slate-900 mr-1.5">Banglish:</strong>
              <InlineCodeText text={current.explanationBanglish} />
            </p>
          )}
        </div>
      )}

      {/* Question Selector Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            const dotStyle =
              idx === qIndex
                ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                : ans === q.correctIndex
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : ans !== undefined
                    ? 'border-red-300 bg-red-50 text-red-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300';
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setQIndex(idx)}
                className={`h-8 w-8 rounded-lg border font-mono text-xs font-semibold transition-colors ${dotStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {answeredCount === questions.length && (
            <span className="text-xs font-semibold text-emerald-700 tabular-nums">
              {score === questions.length
                ? 'All answers correct'
                : `Completed (${score}/${questions.length})`}
            </span>
          )}
          {qIndex < questions.length - 1 && (
            <button
              type="button"
              onClick={() => setQIndex((i) => i + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E40AF] transition-colors"
            >
              Next Question
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- 8. VISUAL DIAGRAM + CARDS STAGE ---------- */
export function VisualDiagramStage({ visual }: { visual: SlideVisualConfig }) {
  const cards = visual.diagramCards ?? [];
  const hasImage = Boolean(visual.diagramImageSrc);

  return (
    <div
      className={`grid w-full max-w-[1040px] grid-cols-1 items-center gap-6 ${
        hasImage ? 'lg:grid-cols-12' : ''
      }`}
    >
      {hasImage && (
        <div className="lg:col-span-6">
          <IllustratedFrame
            src={visual.diagramImageSrc!}
            alt={visual.diagramImageAlt ?? 'Concept visual'}
            caption={visual.diagramCaption ?? ''}
          />
        </div>
      )}

      <div
        className={`${
          hasImage
            ? 'lg:col-span-6 space-y-4'
            : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {cards.map((card) => {
          const accent = ACCENT_MAP[card.accent ?? 'blue'];
          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <span className={`block text-xs font-semibold ${accent.text}`}>
                {card.label}
              </span>
              <h3 className="font-display text-[16px] font-bold text-slate-900">
                {card.title}
              </h3>
              <p className="text-[14px] leading-[1.6] text-slate-600">{card.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 9. CODE-TO-ENGLISH LIVE TRANSLATOR STAGE ---------- */
export function CodeTranslatorStage({ visual }: { visual: SlideVisualConfig }) {
  const [tab, setTab] = useState<'primary' | 'secondary'>('primary');
  const lines =
    tab === 'secondary' && visual.secondaryCodeLines
      ? visual.secondaryCodeLines
      : visual.codeLines ?? [];
  const [selectedLine, setSelectedLine] = useState(0);
  const active = lines[selectedLine] ?? lines[0];

  return (
    <div className="grid w-full max-w-[1020px] grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Intentional Dark Code Editor Block */}
      <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0F172A] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTab('primary');
                setSelectedLine(0);
              }}
              className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                tab === 'primary'
                  ? 'bg-[#1D4ED8] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {visual.codeFilename ?? 'server.py'}
            </button>
            {visual.secondaryCodeFilename && (
              <button
                type="button"
                onClick={() => {
                  setTab('secondary');
                  setSelectedLine(0);
                }}
                className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                  tab === 'secondary'
                    ? 'bg-[#1D4ED8] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {visual.secondaryCodeFilename}
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-400">Click any line to inspect</span>
        </div>

        <div className="p-3 space-y-1">
          {lines.map((line, idx) => (
            <button
              key={`${tab}-${idx}`}
              type="button"
              onClick={() => setSelectedLine(idx)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors ${
                idx === selectedLine
                  ? 'bg-[#1E3A8A]/70 text-blue-100 border border-blue-400/40'
                  : 'text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="w-5 text-right text-[11px] text-slate-500 select-none tabular-nums">
                {idx + 1}
              </span>
              <code className="whitespace-pre-wrap break-all">{line.code}</code>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="lg:col-span-5 flex flex-col justify-center gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div>
            <span className="text-xs font-semibold text-[#1D4ED8] tabular-nums">
              Line {selectedLine + 1} in plain English
            </span>
            <p className="mt-2 font-display text-lg font-bold leading-snug text-slate-900">
              {active.plainEnglish}
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 text-[14px] leading-relaxed text-slate-700">
            <span className="block text-xs font-semibold text-amber-800 mb-1">
              Banglish explanation
            </span>
            {active.banglish}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 10. URL ANATOMY DISSECTOR ---------- */
export function UrlDissectorStage({ visual }: { visual: SlideVisualConfig }) {
  const segments = visual.urlSegments ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = segments[activeIdx] ?? segments[0];

  return (
    <div className="w-full max-w-[960px] space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-6 font-mono text-sm sm:text-base shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {segments.map((seg, idx) => {
          const accent = ACCENT_MAP[seg.accent];
          const isSelected = idx === activeIdx;
          return (
            <button
              key={seg.part}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`rounded-lg border px-3.5 py-2 font-semibold transition-all ${
                isSelected
                  ? `${accent.activeBorder} ${accent.bg} ${accent.text} shadow-xs`
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {seg.part}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center max-w-[680px] mx-auto space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="text-xs font-semibold text-[#1D4ED8]">{active.label}</span>
          <p className="text-[15px] leading-[1.65] text-slate-700">{active.meaning}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- 11. STATUS CODES STAGE ---------- */
export function StatusCodesStage({ visual }: { visual: SlideVisualConfig }) {
  const codes = visual.statusCodes ?? [];
  const [selected, setSelected] = useState(0);
  const active = codes[selected] ?? codes[0];

  return (
    <div className="w-full max-w-[980px] space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {codes.map((c, idx) => {
          const accent = ACCENT_MAP[c.accent];
          const isSelected = idx === selected;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelected(idx)}
              className={`rounded-xl border p-4 text-center transition-all ${
                isSelected
                  ? `${accent.activeBorder} ${accent.bg} shadow-xs`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`font-mono text-2xl font-bold tabular-nums ${accent.text}`}>
                {c.code}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-700">{c.label}</div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-[#1D4ED8]">
              {active.family} · HTTP {active.code}
            </span>
            <h3 className="font-display text-xl font-bold text-slate-900">
              {active.code} {active.label}
            </h3>
            <p className="text-[14.5px] leading-[1.65] text-slate-600">{active.meaning}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1.5">
            <span className="text-xs font-semibold text-slate-800">
              Real-world example
            </span>
            <p className="text-[14px] leading-relaxed text-slate-700">{active.realExample}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 12. 15-MINUTE LIVE BREAK TIMER ---------- */
export function BreakTimerStage() {
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white px-12 py-10 text-center shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <span className="text-[13px] font-semibold text-amber-700">
        Mid-Class Break · Stretch &amp; Recharge
      </span>
      <div className="font-mono text-6xl font-bold tracking-wider text-slate-900 tabular-nums sm:text-7xl">
        {mins}:{secs}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
        >
          {running ? 'Pause Timer' : 'Start 15-Min Timer'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(900);
          }}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/* ---------- 13. RECAP & NEXT CLASS BRIDGE STAGE ---------- */
export function RecapBridgeStage({
  visual,
  onSelectClass,
}: {
  visual: SlideVisualConfig;
  onSelectClass?: (classId: ClassId) => void;
}) {
  const items = visual.recapItems ?? [];
  const next = visual.nextClassPreview;

  return (
    <div className="w-full max-w-[1000px] space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.step}
            className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <span className="text-xs font-semibold text-[#1D4ED8]">
              {item.step}
            </span>
            <p className="text-[13.5px] leading-relaxed text-slate-700">{item.takeaway}</p>
          </div>
        ))}
      </div>

      {next && (
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Up next · Class {String(next.classNumber).padStart(2, '0')} (3 hours)
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {next.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600">{next.hook}</p>
          </div>

          {onSelectClass && (next.classNumber === 2 || next.classNumber === 3) && (
            <button
              type="button"
              onClick={() => onSelectClass(next.classNumber as ClassId)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
            >
              Start Class 0{next.classNumber}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
