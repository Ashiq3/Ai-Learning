import type { AppView } from '../types/course';

interface TopBarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onJumpToLiveFlow: () => void;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'deck', label: 'Class 1 Deck' },
  { id: 'roadmap', label: '20-Class Roadmap' },
  { id: 'toolkit', label: 'Tool Reference' },
];

export function TopBar({
  activeView,
  onSelectView,
  onJumpToLiveFlow,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1119]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('deck')}
          className="font-mono text-xs font-semibold tracking-[0.16em] text-[#edf4f5] hover:text-[#60e0c0] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] rounded"
        >
          AI BACKEND MASTER COURSE
        </button>

        {/* Clean Single-Line Nav */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0] rounded ${
                  isActive
                    ? 'text-[#60e0c0] font-semibold'
                    : 'text-[#9bb0bd] hover:text-[#edf4f5]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[15px] h-0.5 bg-[#60e0c0]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* 1 Primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onJumpToLiveFlow}
            className="rounded-lg bg-[#60e0c0] px-4 py-2 font-mono text-xs font-bold text-[#09181d] hover:bg-[#77ebd0] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60e0c0]"
          >
            Live Flow Demo
          </button>
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <nav
        aria-label="Mobile navigation"
        className="flex md:hidden items-center justify-between gap-2 overflow-x-auto border-t border-white/8 px-5 py-2 text-xs font-medium"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`px-2.5 py-1 whitespace-nowrap shrink-0 rounded ${
                isActive
                  ? 'text-[#60e0c0] font-semibold bg-[#15353a]'
                  : 'text-[#9bb0bd]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
