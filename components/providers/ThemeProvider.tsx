'use client';

import * as React from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'smartlms:theme';

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('dark');

  React.useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;

    if (stored === 'dark' || stored === 'light') {
      setThemeState(stored);
      applyThemeToDocument(stored);
      return;
    }

    // Default: dark (matches our design system)
    applyThemeToDocument('dark');
  }, []);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyThemeToDocument(nextTheme);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}


