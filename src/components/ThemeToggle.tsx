import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { isMatte, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isMatte}
      aria-label={isMatte ? 'Switch to light theme' : 'Switch to matte black theme'}
      title={isMatte ? 'Switch to Light theme' : 'Switch to Matte Black theme'}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
        compact ? 'h-8 w-8 p-0' : 'px-3 py-1.5'
      }`}
    >
      {isMatte ? (
        <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
      )}
      {!compact && (
        <span className="hidden md:inline">{isMatte ? 'Light' : 'Matte Black'}</span>
      )}
    </button>
  );
}
