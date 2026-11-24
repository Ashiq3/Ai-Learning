import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'matte';

const STORAGE_KEY = 'ai-backend-course-theme';

interface ThemeContextValue {
  theme: ThemeMode;
  isMatte: boolean;
  setTheme: (next: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'matte' || saved === 'light') return saved;
  } catch {
    // Ignore storage read errors in restricted iframes
  }
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'matte') {
      root.classList.add('theme-matte');
      root.dataset.theme = 'matte';
    } else {
      root.classList.remove('theme-matte');
      root.dataset.theme = 'light';
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isMatte: theme === 'matte',
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((prev) => (prev === 'matte' ? 'light' : 'matte')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
