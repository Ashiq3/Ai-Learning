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
    <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 space-y-9">
      <div className="border-b border-white/12 pb-7 space-y-2 max-w-3xl">
        <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#60e0c0] uppercase">
          Practical Software, Tools &amp; Frameworks · Vibe-Coder Field Guide
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#f1f5f4] sm:text-4xl">
          Real-World AI Backend Tool Reference
        </h1>
        <p className="text-sm leading-relaxed text-[#a5b7c1]">
          Bookmark this reference for both instructor prep and live student demos. Every tool maps directly to real production use cases introduced in Class 1.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#12202e] p-1.5 w-fit max-w-full">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-[#60e0c0] text-[#09181d] font-bold'
                : 'text-[#9db2bf] hover:text-[#edf4f5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <article
            key={tool.name}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#12202e] p-5 gap-4 hover:border-[#60e0c0]/40 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#839cab]">
                <span>{tool.category}</span>
                <span className="tabular-nums text-[#60e0c0]">
                  Class {String(tool.introducedInClass).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-[#f1f5f4]">
                  {tool.name}
                </h2>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#60e0c0] hover:underline whitespace-nowrap shrink-0"
                >
                  Official Site
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <p className="text-xs font-semibold text-[#d2e2e9]">{tool.role}</p>
              <p className="text-sm leading-relaxed text-[#9eb2be]">{tool.useCase}</p>
            </div>

            <div className="rounded-xl border border-[#ffad70]/30 bg-[#2a221c] p-3.5 text-xs leading-relaxed text-[#f7d8be]">
              <strong className="font-mono text-[10px] tracking-[0.1em] text-[#ffad70] uppercase block mb-1">
                Vibe Coder Tip
              </strong>
              {tool.vibeCoderTip}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
