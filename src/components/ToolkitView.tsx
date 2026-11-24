import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { TOOL_DIRECTORY } from '../data/roadmapData';
import type { ToolReference } from '../types/course';

const CATEGORIES: ('All' | ToolReference['category'])[] = [
  'All',
  'Frontend',
  'Backend & Server',
  'APIs',
  'Languages & Frameworks',
  'Databases',
  'ML & Neural Networks',
];

export function ToolkitView() {
  const [category, setCategory] = useState<'All' | ToolReference['category']>('All');

  const filtered =
    category === 'All'
      ? TOOL_DIRECTORY
      : TOOL_DIRECTORY.filter((tool) => tool.category === category);

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-14 space-y-10">
      <header className="max-w-3xl space-y-3 border-b border-slate-200 pb-8">
        <p className="text-[13px] font-medium text-[#1D4ED8]">
          Practical Software &amp; Frameworks · Field Reference
        </p>
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
          AI Backend Tool Reference
        </h1>
        <p className="text-[15px] leading-[1.65] text-slate-600">
          Every production tool demonstrated across the course, paired with when it is introduced and how to use it effectively during builds.
        </p>
      </header>

      {/* Segmented Category Filter */}
      <div
        role="tablist"
        aria-label="Filter tools by category"
        className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            onClick={() => setCategory(cat)}
            className={`rounded-md px-3.5 py-1.5 text-[13px] whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                : 'font-medium text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <article
            key={tool.name}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 gap-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
                <span>{tool.category}</span>
                <span className="font-mono tabular-nums text-slate-500">
                  Class {String(tool.introducedInClass).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-bold tracking-[-0.015em] text-slate-900">
                  {tool.name}
                </h2>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] hover:underline whitespace-nowrap shrink-0"
                >
                  Official site
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <p className="text-[13px] font-semibold text-slate-700">{tool.role}</p>
              <p className="text-[14px] leading-[1.6] text-slate-600">{tool.useCase}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 text-[13px] leading-relaxed text-slate-600">
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Practical tip
              </span>
              {tool.vibeCoderTip}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
