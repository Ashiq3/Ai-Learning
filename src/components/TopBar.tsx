import { BookOpen, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AppView } from '../types/course';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  activeView: AppView;
  pendingReviewCount?: number;
  onSelectView: (view: AppView) => void;
}

export function TopBar({
  activeView,
  pendingReviewCount = 0,
  onSelectView,
}: TopBarProps) {
  const { user, profile, isInstructor, authBusy, signInWithGoogle, signOutUser } = useAuth();

  const navItems: { id: AppView; label: string; badge?: number }[] = user
    ? [
        { id: 'roadmap', label: 'Curriculum' },
        { id: 'deck', label: 'Lesson Player' },
        { id: 'exam', label: 'Exams' },
        { id: 'results', label: 'My Progress' },
        ...(isInstructor
          ? [
              {
                id: 'instructor' as AppView,
                label: 'Instructor',
                badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
              },
            ]
          : []),
        { id: 'toolkit', label: 'Tools' },
      ]
    : [{ id: 'roadmap', label: 'Curriculum' }];

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || '';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8">
        {/* Left: Calm Editorial Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView(user ? 'deck' : 'roadmap')}
          className="inline-flex items-center gap-2 sm:gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 rounded-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8] text-white">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-[14.5px] sm:text-[15px] font-bold tracking-[-0.02em] text-slate-900">
            AI Backend Course
          </span>
        </button>

        {/* Center: Clean Single-Line Text Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-[14px]"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative inline-flex items-center gap-1.5 py-5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded ${
                  isActive
                    ? 'font-semibold text-[#1D4ED8]'
                    : 'font-medium text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.id === 'instructor' && (
                  <ShieldCheck className="h-4 w-4 text-amber-600" aria-hidden="true" />
                )}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-0.5 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-800 leading-none tabular-nums">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#1D4ED8]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Toggle + Account Profile & Action */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2.5 pr-1">
                {profile?.photoURL || user.photoURL ? (
                  <img
                    src={profile?.photoURL || user.photoURL || ''}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="leading-tight">
                  <span className="block max-w-[140px] truncate text-[13px] font-semibold text-slate-900">
                    {displayName}
                  </span>
                  <span className="block text-[11px] font-medium text-slate-500">
                    {isInstructor ? 'Instructor' : 'Student'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={authBusy}
                onClick={() => void signOutUser()}
                aria-label="Sign out"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={authBusy}
              onClick={() => void signInWithGoogle()}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#1D4ED8] px-3 py-2 sm:px-4 text-[13px] font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors whitespace-nowrap shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="sm:hidden">{authBusy ? 'Signing in…' : 'Sign in'}</span>
              <span className="hidden sm:inline">
                {authBusy ? 'Signing in…' : 'Sign in with Google'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Strip (Only when signed in) */}
      {user && (
        <nav
          aria-label="Mobile navigation"
          className="flex lg:hidden items-center gap-1 overflow-x-auto border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-[13px]"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap shrink-0 rounded-md transition-colors ${
                  isActive
                    ? 'bg-white font-semibold text-[#1D4ED8] shadow-2xs ring-1 ring-slate-200/80'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {item.badge !== undefined && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
