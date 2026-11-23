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
    border: 'border-[#60e0c0]/55',
    bg: 'bg-[#133238]',
    text: 'text-[#60e0c0]',
    pill: 'bg-[#60e0c0] text-[#09181d]',
  },
  orange: {
    border: 'border-[#ffad70]/55',
    bg: 'bg-[#31231b]',
    text: 'text-[#ffad70]',
    pill: 'bg-[#ffad70] text-[#1c120a]',
  },
  blue: {
    border: 'border-[#80b6ff]/55',
    bg: 'bg-[#17283f]',
    text: 'text-[#80b6ff]',
    pill: 'bg-[#80b6ff] text-[#0a1624]',
  },
  rose: {
    border: 'border-[#ff8585]/55',
    bg: 'bg-[#361c22]',
    text: 'text-[#ff8585]',
    pill: 'bg-[#ff8585] text-[#220a0f]',
  },
} as const;

/* ---------- 1. HERO STAGE ---------- */
export function HeroStage({ visual }: { visual: SlideVisualConfig }) {
  const [l1, l2, l3] = visual.heroLines ?? ['A click.', 'A request.', 'A reply.'];
  return (
    <div className="grid w-full max-w-[1060px] grid-cols-1 items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6 space-y-5">
        <div className="inline-block rounded-full border border-[#60e0c0]/40 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.12em] text-[#60e0c0]">
          {visual.heroBadge ?? '20-CLASS MASTER COURSE'}
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.04em] text-[#f1f5f4] sm:text-6xl">
          <span className="block">{l1}</span>
          <span className="block text-[#60e0c0]">{l2}</span>
          <span className="block">{l3}</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-[#9db0bc] sm:text-[15px]">
          <InlineCodeText text={visual.heroSubtext ?? ''} />
        </p>
        {visual.heroQuote && (
          <div className="rounded-xl border border-white/10 bg-[#132433]/90 p-3.5 text-xs leading-relaxed text-[#b8cdd6]">
            <span className="block font-mono text-[10px] tracking-[0.12em] text-[#60e0c0] mb-1 uppercase">
              {visual.heroQuoteLabel ?? 'WHY THIS CLASS MATTERS'}
            </span>
            {visual.heroQuote}
          </div>
        )}
      </div>

      {/* Animated Orbital Diagram */}
      <div className="lg:col-span-6 relative hidden min-h-[340px] items-center justify-center sm:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[230px] w-[420px] -rotate-[20deg] rounded-full border border-[#89b7c5]/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[290px] w-[490px] rotate-[22deg] rounded-full border border-[#89b7c5]/10"
        />

        <div className="relative z-10 flex w-full items-center justify-between gap-4 px-2">
          <div className="w-[195px] rounded-2xl border border-[#94afc4]/25 bg-gradient-to-br from-[#1a2c3d] to-[#111b29] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
            <span className="block font-mono text-[9px] tracking-[0.15em] text-[#8ba0b1] uppercase">
              {visual.heroLeftLabel ?? 'YOUR SCREEN'}
            </span>
            <div className="mt-3 space-y-2.5 rounded-lg bg-[#0d1722] p-3">
              <div className="text-[10px] font-semibold text-[#8299a8]">Live App UI</div>
              <div className="ml-4 rounded-lg bg-[#234b51] px-2.5 py-1.5 text-[11px] text-[#aff6dd]">
                Send request →
              </div>
              <div className="mr-4 rounded-lg bg-[#253346] px-2.5 py-1.5 text-[11px] text-[#c8d8e0]">
                200 OK Reply!
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-4">
            <div className="w-full space-y-1.5 text-center">
              <span className="inline-block rounded bg-[#112734] px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-[#60e0c0]">
                REQUEST →
              </span>
              <svg viewBox="0 0 120 8" className="h-2 w-full" aria-hidden="true">
                <line
                  x1="2"
                  y1="4"
                  x2="118"
                  y2="4"
                  stroke="#60e0c0"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-flow-dash"
                />
              </svg>
            </div>
            <div className="flex h-16 w-20 flex-col items-center justify-center rounded-2xl border border-[#60e0c0]/40 bg-[#15343a] text-[#60e0c0] shadow-lg">
              <span className="font-mono text-[10px] font-bold">
                {visual.heroCenterBadge ?? 'HTTPS'}
              </span>
              <span className="font-mono text-[8px] tracking-widest text-[#9aabba]">LIVE FLOW</span>
            </div>
            <div className="w-full space-y-1.5 text-center">
              <svg viewBox="0 0 120 8" className="h-2 w-full" aria-hidden="true">
                <line
                  x1="118"
                  y1="4"
                  x2="2"
                  y2="4"
                  stroke="#ffad70"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-flow-dash"
                />
              </svg>
              <span className="inline-block rounded bg-[#112734] px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-[#ffad70]">
                ← RESPONSE
              </span>
            </div>
          </div>

          <div className="w-[170px] rounded-2xl border border-[#94afc4]/25 bg-gradient-to-br from-[#1a2c3d] to-[#111b29] p-4 text-center shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
            <div className="mx-auto my-2 grid gap-2">
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  className="relative h-6 rounded border border-[#4f7f90] bg-[#20394a]"
                >
                  <span className="absolute right-2.5 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#60e0c0] shadow-[0_0_8px_#60e0c0]" />
                </div>
              ))}
            </div>
            <span className="mt-3 block font-mono text-[9px] tracking-[0.15em] text-[#8ba0b1] uppercase">
              {visual.heroRightLabel ?? 'CLOUD BACKEND'}
            </span>
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
    <div className="grid w-full max-w-[1020px] grid-cols-1 gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-white/12 bg-[#132433] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="font-mono text-xs font-bold tracking-[0.14em] text-[#60e0c0]">
            PART 1 · CORE FOUNDATIONS
          </span>
          <span className="font-mono text-[11px] text-[#8ba2b0]">~90 min</span>
        </div>
        <div className="space-y-3">
          {part1.map((b) => (
            <div
              key={b.time}
              className="flex items-start gap-3.5 rounded-xl border border-white/8 bg-[#0e1b27] p-3.5"
            >
              <span className="rounded bg-[#143238] px-2 py-1 font-mono text-[11px] font-semibold text-[#60e0c0] tabular-nums shrink-0">
                {b.time}
              </span>
              <div>
                <p className="text-sm font-bold text-[#f1f5f4]">{b.title}</p>
                <p className="mt-0.5 text-xs text-[#9cb0bc]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="rounded-2xl border border-[#ffad70]/45 bg-[#2a201a] px-5 py-3.5 text-center">
          <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#ffad70]">
            {visual.routeBreakLabel ?? 'MID-CLASS 15-MINUTE LIVE COUNTDOWN BREAK'}
          </span>
        </div>

        <div className="flex-1 rounded-2xl border border-white/12 bg-[#132433] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold tracking-[0.14em] text-[#80b6ff]">
              PART 2 · TOOLS &amp; PRACTICE LABS
            </span>
            <span className="font-mono text-[11px] text-[#8ba2b0]">~75 min</span>
          </div>
          <div className="space-y-3">
            {part2.map((b) => (
              <div
                key={b.time}
                className="flex items-start gap-3.5 rounded-xl border border-white/8 bg-[#0e1b27] p-3.5"
              >
                <span className="rounded bg-[#182940] px-2 py-1 font-mono text-[11px] font-semibold text-[#80b6ff] tabular-nums shrink-0">
                  {b.time}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#f1f5f4]">{b.title}</p>
                  <p className="mt-0.5 text-xs text-[#9cb0bc]">{b.desc}</p>
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
    <div className="w-full max-w-[1040px] space-y-5">
      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            setAutoPlaying(false);
            setActiveIndex((i) => (i + 1) % steps.length);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-[#60e0c0]/55 bg-[#15353a] px-4 py-2 font-mono text-xs font-semibold text-[#60e0c0] hover:bg-[#1a4349] transition-colors whitespace-nowrap"
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
          className="inline-flex items-center gap-2 rounded-lg border border-[#ffad70]/55 bg-[#33231a] px-4 py-2 font-mono text-xs font-semibold text-[#ffad70] hover:bg-[#412c20] transition-colors whitespace-nowrap"
        >
          {autoPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              Pause Animation
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Auto-Play Live Workflow
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setAutoPlaying(false);
            setActiveIndex(0);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-[#132433] px-3.5 py-2 font-mono text-xs text-[#9cb0bc] hover:text-[#edf4f5] transition-colors whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Animated Node Pipeline */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isVisited = idx < activeIndex;
          const accent = ACCENT_MAP[step.accent ?? 'teal'];
          return (
            <div key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoPlaying(false);
                  setActiveIndex(idx);
                }}
                className={`min-w-[118px] rounded-xl border px-3.5 py-3 text-left transition-all ${
                  isActive
                    ? `${accent.border} ${accent.bg} shadow-[0_0_24px_rgba(96,224,192,0.18)] scale-[1.03]`
                    : isVisited
                      ? 'border-[#60e0c0]/30 bg-[#122533] text-[#c7dce4]'
                      : 'border-white/10 bg-[#101d2a] text-[#8ba0ae] hover:border-white/25'
                }`}
              >
                <span
                  className={`block font-mono text-[9px] tracking-[0.12em] uppercase ${
                    isActive ? accent.text : 'text-[#7690a0]'
                  }`}
                >
                  {step.badge}
                </span>
                <span className="mt-1 block text-xs font-bold text-[#f1f5f4]">
                  {step.title}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-[#8ca3b1]">
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
                    stroke={idx < activeIndex ? '#60e0c0' : '#354d5e'}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className={idx === activeIndex - 1 || idx === activeIndex ? 'animate-flow-dash' : ''}
                  />
                  <polygon
                    points="20,2 27,6 20,10"
                    fill={idx < activeIndex ? '#60e0c0' : '#354d5e'}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Inspector Card for Active Step */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-white/12 bg-[#132433] p-5 space-y-2">
          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#60e0c0] uppercase">
            STOP {activeIndex + 1} OF {steps.length} · {current.title}
          </span>
          <h3 className="font-display text-lg font-bold text-[#f1f5f4]">
            {current.subtitle}
          </h3>
          <p className="text-sm leading-relaxed text-[#b9cdd6]">
            <InlineCodeText text={current.explanation} />
          </p>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-[#60e0c0]/25 bg-[#0a131d] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#ffad70] uppercase">
              {current.payloadLabel}
            </span>
            <span className="font-mono text-[10px] text-[#60e0c0]">
              {visual.workflowFlowLabel ?? 'LIVE DATA SNAPSHOT'}
            </span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#d7ebe8]">
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
    <div className="grid w-full max-w-[1060px] grid-cols-1 items-start gap-5 lg:grid-cols-12">
      {/* Real Fetched Tool Screenshot with Interactive Numbered Hotspots */}
      <div className="lg:col-span-8 space-y-2.5">
        <div className="relative overflow-hidden rounded-2xl border border-white/16 bg-[#0b141f] shadow-[0_18px_48px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#12202e] px-3.5 py-2 sm:px-4">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff8585]/80" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ffad70]/80" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#60e0c0]/80" />
              <span className="ml-1.5 truncate font-mono text-[11px] font-semibold text-[#dbe8ee]">
                REAL TOOL UI · {visual.toolName}
              </span>
            </div>
            {visual.toolSourceUrl && (
              <a
                href={visual.toolSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-semibold text-[#60e0c0] hover:underline whitespace-nowrap"
              >
                Open Live Tool
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="relative bg-[#0f1a26]">
            {visual.toolImageSrc && (
              <img
                src={visual.toolImageSrc}
                alt={visual.toolImageAlt ?? visual.toolName ?? 'Tool UI screenshot'}
                className="max-h-[380px] w-full object-contain bg-[#0d1722]"
              />
            )}

            {/* Numbered Interactive Callout Pins */}
            {hotspots.map((spot, idx) => {
              const isSelected = idx === selectedPin;
              return (
                <button
                  key={spot.number}
                  type="button"
                  onClick={() => setSelectedPin(idx)}
                  aria-label={`Inspect ${spot.label}`}
                  style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-xs font-extrabold shadow-[0_4px_16px_rgba(0,0,0,0.75)] transition-transform ${
                    isSelected
                      ? 'scale-125 border-white bg-[#60e0c0] text-[#08171c] ring-4 ring-[#60e0c0]/35'
                      : 'border-[#0b1119] bg-[#ffad70] text-[#1a1109] hover:scale-110'
                  }`}
                >
                  {spot.number}
                </button>
              );
            })}
          </div>
        </div>

        {visual.toolOpenTip && (
          <p className="text-center font-mono text-[11px] text-[#8ca3b1]">
            Click pins <strong className="text-[#60e0c0]">1–{hotspots.length}</strong> on the actual {visual.toolName} screenshot · {visual.toolOpenTip}
          </p>
        )}
      </div>

      {/* Right Callout Inspector */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {hotspots.map((spot, idx) => (
            <button
              key={spot.number}
              type="button"
              onClick={() => setSelectedPin(idx)}
              className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-colors whitespace-nowrap ${
                idx === selectedPin
                  ? 'border-[#60e0c0] bg-[#15353a] text-[#60e0c0]'
                  : 'border-white/10 bg-[#12202e] text-[#9cb0bc] hover:border-white/25'
              }`}
            >
              #{spot.number} {spot.label}
            </button>
          ))}
        </div>

        {active && (
          <div className="rounded-2xl border border-[#60e0c0]/40 bg-[#132433] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#60e0c0] font-mono text-xs font-extrabold text-[#08171c]">
                {active.number}
              </span>
              <h3 className="font-display text-base font-bold text-[#f1f5f4]">
                {active.label}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#c6dae3]">
              <InlineCodeText text={active.detail} />
            </p>
            <div className="rounded-xl border border-[#ffad70]/30 bg-[#2a211b] p-3 text-xs leading-relaxed text-[#f7d8be]">
              <span className="block font-mono text-[10px] font-bold tracking-[0.1em] text-[#ffad70] uppercase mb-1">
                VIBE-CODER PRACTICE TIP
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
    <div className="w-full max-w-[1040px] space-y-4">
      <div className={`grid grid-cols-1 gap-4 ${colClass}`}>
        {sides.map((side) => {
          const accent = ACCENT_MAP[side.accent];
          return (
            <div
              key={side.title}
              className={`flex flex-col justify-between rounded-2xl border ${accent.border} bg-[#122230] p-5 space-y-3`}
            >
              <div className="space-y-2">
                <span
                  className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.1em] uppercase ${accent.pill}`}
                >
                  {side.badge}
                </span>
                <h3 className="font-display text-lg font-extrabold text-[#f1f5f4]">
                  {side.title}
                </h3>
                <p className="text-xs text-[#9eb2be]">{side.subtitle}</p>
                <ul className="space-y-2 pt-2 text-xs leading-relaxed text-[#d3e2e8]">
                  {side.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${accent.pill}`} />
                      <span>
                        <InlineCodeText text={pt} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {side.codeOrExample && (
                <div className="rounded-xl bg-[#0a131d] px-3 py-2.5 font-mono text-[11px] leading-relaxed text-[#cfe7e4] border border-white/8">
                  {side.codeOrExample}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visual.comparisonTakeaway && (
        <div className="rounded-xl border border-white/10 bg-[#132433] px-5 py-3 text-center text-xs text-[#c7dce4]">
          <strong className="font-mono text-[#60e0c0] mr-2">RULE OF THUMB:</strong>
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
    <div className="w-full max-w-[980px] space-y-5">
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item, idx) => (
          <button
            key={item.appName}
            type="button"
            onClick={() => setSelected(idx)}
            className={`rounded-xl border px-4 py-2 font-mono text-xs font-semibold transition-all whitespace-nowrap ${
              idx === selected
                ? 'border-[#60e0c0] bg-[#15353a] text-[#60e0c0]'
                : 'border-white/12 bg-[#12202e] text-[#9eb2be] hover:border-white/30'
            }`}
          >
            {item.appName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#60e0c0]/40 bg-[#132934] p-6 space-y-2.5">
          <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#60e0c0] uppercase">
            WHAT YOU SEE ({active.appName})
          </span>
          <p className="text-sm leading-relaxed text-[#e6f1f3]">{active.userSees}</p>
        </div>

        <div className="rounded-2xl border border-[#ffad70]/40 bg-[#261f1d] p-6 space-y-2.5">
          <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#ffad70] uppercase">
            HIDDEN BACKEND ENGINE
          </span>
          <p className="text-sm leading-relaxed text-[#f7e2d0]">{active.behindTheScenes}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#111f2d] px-5 py-3.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-[#80b6ff] uppercase">
            REAL-WORLD STACK:
          </span>
          {active.realTools.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/12 bg-[#182b3d] px-2.5 py-0.5 font-mono text-[11px] text-[#dbe8ee]"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="font-mono text-[11px] font-semibold text-[#60e0c0]">
          {active.highlightMetric}
        </span>
      </div>
    </div>
  );
}

/* ---------- 7. HANDS-ON PRACTICE TEST STAGE (INSTRUCTOR SELF-TEST + STUDENT QUIZ) ---------- */
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
    <div className="w-full max-w-[920px] rounded-2xl border border-white/14 bg-[#122231] p-6 space-y-5 shadow-[0_18px_45px_rgba(0,0,0,0.4)]">
      {/* Header + Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md bg-[#60e0c0] px-2.5 py-1 font-mono text-[10px] font-extrabold text-[#08171c] uppercase">
            {visual.practiceMode === 'capstone' ? 'SELF-CHECK EXAM' : 'PRACTICE TEST'}
          </span>
          <span className="font-mono text-xs text-[#9cb0bc]">
            Question {qIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-[#60e0c0] tabular-nums">
            Score: {score} / {questions.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setQIndex(0);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-white/12 bg-[#172a3b] px-2.5 py-1 font-mono text-[11px] text-[#b4c8d3] hover:text-white"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>

      {/* Scenario Prompt */}
      <div className="space-y-4">
        <p className="font-display text-lg font-bold leading-snug text-[#f1f5f4] sm:text-xl">
          <InlineCodeText text={current.scenario} />
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {current.options.map((opt, idx) => {
            const picked = chosen === idx;
            const correctOpt = idx === current.correctIndex;
            let style = 'border-white/12 bg-[#0d1a26] text-[#d5e4ea] hover:border-[#60e0c0]/55';
            if (isAnswered) {
              if (correctOpt) {
                style = 'border-[#60e0c0] bg-[#14373a] text-[#dffaf3]';
              } else if (picked) {
                style = 'border-[#ff8585] bg-[#361b21] text-[#ffd6d6]';
              } else {
                style = 'border-white/8 bg-[#0c1620] text-[#7c94a5] opacity-70';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: idx }))}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-left text-xs leading-relaxed transition-all ${style}`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current font-mono text-[10px] font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Explanation (English + Banglish for Instructor Mastery!) */}
      {isAnswered && (
        <div
          className={`rounded-xl border p-4 space-y-2 ${
            isCorrect
              ? 'border-[#60e0c0]/45 bg-[#123035]'
              : 'border-[#ffad70]/45 bg-[#2d211b]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#60e0c0]" aria-hidden="true" />
                  <span className="text-[#60e0c0]">SPOT ON! YOU NAILED IT</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-[#ffad70]" aria-hidden="true" />
                  <span className="text-[#ffad70]">NOT QUITE — HERE IS WHY:</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowBangla((b) => !b)}
              className="rounded border border-white/15 bg-black/25 px-2.5 py-0.5 font-mono text-[10px] text-[#dbe8ee]"
            >
              {showBangla ? 'Hide Banglish Note' : 'Show Banglish Note'}
            </button>
          </div>

          <p className="text-xs leading-relaxed text-[#e4f0f2]">
            <InlineCodeText text={current.explanationEn} />
          </p>
          {showBangla && (
            <p className="rounded-lg bg-black/25 px-3 py-2 text-xs leading-relaxed text-[#ffe0bf]">
              <strong className="font-mono text-[10px] text-[#ffad70] mr-1.5">BANGLISH:</strong>
              <InlineCodeText
                text={current.explanationBanglish}
                codeClassName="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#ffad70]"
              />
            </p>
          )}
        </div>
      )}

      {/* Question Selector Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            const dotStyle =
              idx === qIndex
                ? 'border-[#60e0c0] bg-[#60e0c0] text-[#08171c]'
                : ans === q.correctIndex
                  ? 'border-[#60e0c0]/50 bg-[#15353a] text-[#60e0c0]'
                  : ans !== undefined
                    ? 'border-[#ff8585]/50 bg-[#361b21] text-[#ff8585]'
                    : 'border-white/15 bg-[#101e2b] text-[#8ca3b1]';
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setQIndex(idx)}
                className={`h-7 w-7 rounded-lg border font-mono text-xs font-bold transition-colors ${dotStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {answeredCount === questions.length && (
            <span className="font-mono text-xs font-semibold text-[#60e0c0]">
              {score === questions.length ? '100% Ready to Teach!' : `Completed (${score}/${questions.length})`}
            </span>
          )}
          {qIndex < questions.length - 1 && (
            <button
              type="button"
              onClick={() => setQIndex((i) => i + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#60e0c0] px-3.5 py-1.5 font-mono text-xs font-bold text-[#08171c] hover:bg-[#7ae8cc]"
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
            ? 'lg:col-span-6 space-y-3'
            : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {cards.map((card) => {
          const accent = ACCENT_MAP[card.accent ?? 'teal'];
          return (
            <div
              key={card.title}
              className={`rounded-2xl border ${accent.border} bg-[#132433] p-4 space-y-1.5`}
            >
              <span className={`font-mono text-[10px] font-bold tracking-[0.12em] uppercase ${accent.text}`}>
                {card.label}
              </span>
              <h3 className="font-display text-base font-bold text-[#f1f5f4]">{card.title}</h3>
              <p className="text-xs leading-relaxed text-[#b2c7d1]">{card.detail}</p>
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
    <div className="grid w-full max-w-[1020px] grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="lg:col-span-7 rounded-2xl border border-white/14 bg-[#0b131e] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#12202f] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTab('primary');
                setSelectedLine(0);
              }}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold ${
                tab === 'primary'
                  ? 'bg-[#60e0c0] text-[#08171c]'
                  : 'text-[#8ca3b1] hover:text-white'
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
                className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold ${
                  tab === 'secondary'
                    ? 'bg-[#ffad70] text-[#1a1109]'
                    : 'text-[#8ca3b1] hover:text-white'
                }`}
              >
                {visual.secondaryCodeFilename}
              </button>
            )}
          </div>
          <span className="font-mono text-[10px] text-[#7c94a5]">Click any line to translate</span>
        </div>

        <div className="p-3 space-y-1">
          {lines.map((line, idx) => (
            <button
              key={`${tab}-${idx}`}
              type="button"
              onClick={() => setSelectedLine(idx)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors ${
                idx === selectedLine
                  ? 'bg-[#16383e] text-[#9ff4dd] border border-[#60e0c0]/50'
                  : 'text-[#bfd2db] hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="w-5 text-right text-[10px] text-[#607a8a] select-none">
                {idx + 1}
              </span>
              <code className="whitespace-pre-wrap break-all">{line.code}</code>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="lg:col-span-5 flex flex-col justify-center gap-4 rounded-2xl border border-[#60e0c0]/35 bg-[#132433] p-6">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#60e0c0] uppercase">
              LINE {selectedLine + 1} IN PLAIN ENGLISH
            </span>
            <p className="mt-2 font-display text-lg font-bold leading-snug text-[#f1f5f4]">
              {active.plainEnglish}
            </p>
          </div>
          <div className="rounded-xl border border-[#ffad70]/30 bg-[#2a211b] p-4 text-xs leading-relaxed text-[#f7d8be]">
            <span className="block font-mono text-[10px] font-bold tracking-[0.1em] text-[#ffad70] uppercase mb-1">
              BANGLISH TRANSLATION
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
    <div className="w-full max-w-[980px] space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/14 bg-[#0b131d] p-5 font-mono text-sm sm:text-base">
        {segments.map((seg, idx) => {
          const accent = ACCENT_MAP[seg.accent];
          const isSelected = idx === activeIdx;
          return (
            <button
              key={seg.part}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`rounded-lg border px-3 py-2 font-bold transition-all ${
                isSelected
                  ? `${accent.border} ${accent.bg} ${accent.text} scale-105`
                  : 'border-white/10 bg-[#12202e] text-[#c7dae2] hover:border-white/30'
              }`}
            >
              {seg.part}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="rounded-2xl border border-[#60e0c0]/40 bg-[#132433] p-6 text-center max-w-[680px] mx-auto space-y-2">
          <span className="font-mono text-xs font-bold tracking-[0.14em] text-[#60e0c0] uppercase">
            {active.label}
          </span>
          <p className="text-sm sm:text-base leading-relaxed text-[#e6f1f3]">{active.meaning}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- 11. STATUS CODES TRAFFIC LIGHT STAGE ---------- */
export function StatusCodesStage({ visual }: { visual: SlideVisualConfig }) {
  const codes = visual.statusCodes ?? [];
  const [selected, setSelected] = useState(0);
  const active = codes[selected] ?? codes[0];

  return (
    <div className="w-full max-w-[980px] space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {codes.map((c, idx) => {
          const accent = ACCENT_MAP[c.accent];
          const isSelected = idx === selected;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelected(idx)}
              className={`rounded-2xl border p-4 text-center transition-all ${
                isSelected
                  ? `${accent.border} ${accent.bg} scale-[1.03]`
                  : 'border-white/10 bg-[#111f2d] hover:border-white/25'
              }`}
            >
              <div className={`font-mono text-2xl font-extrabold ${accent.text}`}>{c.code}</div>
              <div className="mt-1 text-[11px] font-semibold text-[#dbe8ee]">{c.label}</div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 rounded-2xl border border-white/12 bg-[#132433] p-6">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#60e0c0] uppercase">
              {active.family} · HTTP {active.code}
            </span>
            <h3 className="font-display text-xl font-extrabold text-[#f1f5f4]">
              {active.code} {active.label}
            </h3>
            <p className="text-sm leading-relaxed text-[#c6dae3]">{active.meaning}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0b131d] p-4 space-y-1.5">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#ffad70] uppercase">
              REAL-WORLD EXAMPLE YOU WILL SEE
            </span>
            <p className="text-xs leading-relaxed text-[#d9e7ec]">{active.realExample}</p>
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
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-[#ffad70]/45 bg-[#152534] px-12 py-9 text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      <span className="font-mono text-[11px] tracking-[0.16em] text-[#60e0c0]">
        LIVE BREAK COUNTDOWN · GRAB TEA / WATER
      </span>
      <div className="font-mono text-6xl font-bold tracking-wider text-[#ffad70] tabular-nums sm:text-7xl">
        {mins}:{secs}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-lg bg-[#60e0c0] px-5 py-2.5 font-mono text-xs font-bold text-[#0b171d] hover:bg-[#77ebd0] transition-colors whitespace-nowrap"
        >
          {running ? 'Pause Timer' : 'Start 15-Min Timer'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(900);
          }}
          className="rounded-lg border border-white/15 bg-[#142333] px-4 py-2.5 font-mono text-xs text-[#b7c9d4] hover:border-[#60e0c0] transition-colors whitespace-nowrap"
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
    <div className="w-full max-w-[1000px] space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.step}
            className="rounded-2xl border border-white/12 bg-[#132433] p-4 space-y-1.5"
          >
            <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#60e0c0] uppercase">
              {item.step}
            </span>
            <p className="text-xs leading-relaxed text-[#d4e3e8]">{item.takeaway}</p>
          </div>
        ))}
      </div>

      {next && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#60e0c0]/45 bg-[#133037] p-5">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#60e0c0] uppercase">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              UP NEXT · CLASS {String(next.classNumber).padStart(2, '0')} (3 HOURS)
            </div>
            <h3 className="font-display text-lg font-extrabold text-[#f1f5f4]">
              {next.title}
            </h3>
            <p className="text-xs text-[#b7cfd8]">{next.hook}</p>
          </div>

          {onSelectClass && (next.classNumber === 2 || next.classNumber === 3) && (
            <button
              type="button"
              onClick={() => onSelectClass(next.classNumber as ClassId)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#60e0c0] px-5 py-3 font-mono text-xs font-bold text-[#08171c] hover:bg-[#7ae8cc] transition-colors whitespace-nowrap"
            >
              Start Class 0{next.classNumber} Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
