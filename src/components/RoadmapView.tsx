import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { CURRICULUM_CLASSES, CURRICULUM_PHASES } from '../data/roadmapData';
import type { ClassId } from '../types/course';
import { getCurriculumTotals } from '../utils/courseLogic';

interface RoadmapViewProps {
  onOpenClass: (classId: ClassId) => void;
}

export function RoadmapView({ onOpenClass }: RoadmapViewProps) {
  const [selectedPhase, setSelectedPhase] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const totals = getCurriculumTotals(CURRICULUM_CLASSES);

  const visiblePhases =
    selectedPhase === 'all'
      ? CURRICULUM_PHASES
      : CURRICULUM_PHASES.filter((p) => p.phase === selectedPhase);

  return (
    <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 space-y-9">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/12 pb-7">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#60e0c0] uppercase">
            Strict Easy → Deep Hierarchy · 20 Classes · 3 Hours Each · Classes 01–03 Ready Now!
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#f1f5f4] sm:text-4xl">
            20-Class AI Backend Master Curriculum
          </h1>
          <p className="text-sm leading-relaxed text-[#a5b7c1]">
            One deep, unhurried 3-hour class per core layer — complete with real fetched tool screenshots, live animated workflows, Banglish instructor prep cues, and hands-on practice tests.
          </p>
        </div>

        <div className="flex items-center gap-7 font-mono text-xs tabular-nums">
          <div>
            <span className="block text-[#7e98a8]">Ready Now</span>
            <span className="text-2xl font-bold text-[#60e0c0]">{totals.readyCount} / 20</span>
          </div>
          <div>
            <span className="block text-[#7e98a8]">Per Class</span>
            <span className="text-2xl font-bold text-[#f1f5f4]">3 hrs</span>
          </div>
          <div>
            <span className="block text-[#7e98a8]">Total Course</span>
            <span className="text-2xl font-bold text-[#f1f5f4]">{totals.totalHours} hrs</span>
          </div>
        </div>
      </div>

      {/* Phase Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#12202e] p-1.5 w-fit max-w-full">
        {(
          [
            ['all', 'All 4 Phases (20 Classes)'],
            [1, 'Phase 1 (1–5)'],
            [2, 'Phase 2 (6–10)'],
            [3, 'Phase 3 (11–15)'],
            [4, 'Phase 4 (16–20)'],
          ] as const
        ).map(([val, label]) => (
          <button
            key={String(val)}
            type="button"
            onClick={() => setSelectedPhase(val)}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-medium whitespace-nowrap transition-colors ${
              selectedPhase === val
                ? 'bg-[#60e0c0] text-[#09181d] font-bold'
                : 'text-[#9db2bf] hover:text-[#edf4f5]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Phase Sections */}
      <div className="space-y-12">
        {visiblePhases.map((phase) => {
          const classes = CURRICULUM_CLASSES.filter((c) => c.phase === phase.phase);
          return (
            <section key={phase.phase} className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#f1f5f4]">
                    {phase.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#9cb0bc]">{phase.subtitle}</p>
                </div>
                <span className="font-mono text-xs text-[#60e0c0] tabular-nums">
                  {phase.classRange} · {phase.totalHours} Hours
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {classes.map((cls) => {
                  const isReady = cls.status === 'ready' && (cls.classNumber === 1 || cls.classNumber === 2 || cls.classNumber === 3);
                  return (
                    <article
                      key={cls.classNumber}
                      className={`flex flex-col justify-between rounded-2xl border p-6 transition-colors ${
                        isReady
                          ? 'border-[#60e0c0]/55 bg-[#132c35]'
                          : 'border-white/10 bg-[#12202e]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-mono font-semibold text-[#60e0c0] tabular-nums">
                            Class {String(cls.classNumber).padStart(2, '0')} · {cls.durationHours} Hours
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium ${
                              isReady ? 'text-[#60e0c0]' : 'text-[#89a0ae]'
                            }`}
                          >
                            {isReady ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                36-Slide Interactive Deck Ready
                              </>
                            ) : (
                              <>
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                Upcoming Syllabus
                              </>
                            )}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-[#f1f5f4]">
                          {cls.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#a6b9c4]">{cls.goal}</p>

                        <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs">
                          <p className="text-[#c8dae2]">
                            <strong className="text-[#f1f5f4]">Dedicated Keywords:</strong>{' '}
                            {cls.keywords.join(' · ')}
                          </p>
                          <p className="text-[#c8dae2]">
                            <strong className="text-[#f1f5f4]">Hands-On Labs &amp; Tests:</strong>{' '}
                            {cls.handsOnProject}
                          </p>
                          <p className="text-[#8ea5b3]">
                            <strong className="text-[#b8ccd6]">Real-World Tools:</strong>{' '}
                            {cls.tools.join(' · ')}
                          </p>
                        </div>
                      </div>

                      {isReady && (
                        <div className="mt-5 pt-4 border-t border-[#60e0c0]/20">
                          <button
                            type="button"
                            onClick={() => onOpenClass(cls.classNumber as ClassId)}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#60e0c0] px-4 py-2.5 font-mono text-xs font-bold text-[#09181d] hover:bg-[#77ebd0] transition-colors whitespace-nowrap"
                          >
                            Open Class 0{cls.classNumber} Deck (36 Slides · 3 Hours)
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
