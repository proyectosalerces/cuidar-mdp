'use client';

/**
 * ThemeContext — gestión global del tema claro / oscuro / sistema.
 *
 * Persiste la preferencia en localStorage ('cuidar-mdp-theme').
 * Aplica el atributo `data-theme="dark"` en <html> para que los
 * CSS custom properties se actualicen sin tocar los CSS Modules.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/* ── Types ─────────────────────────────────────────────────────────────── */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** Chosen mode ('light' | 'dark' | 'system') */
  theme: ThemeMode;
  /** Effective visual theme after resolving 'system' */
  resolvedTheme: ResolvedTheme;
  /** Set an explicit mode */
  setTheme: (mode: ThemeMode) => void;
  /** Cycle: light → dark → system → light … */
  toggleTheme: () => void;
}

/* ── Constants ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'cuidar-mdp-theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

/* ── Helpers ───────────────────────────────────────────────────────────── */

function getSystemPreference(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') return getSystemPreference();
  return mode;
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  const html = document.documentElement;
  if (resolved === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }
}

/* ── Context ───────────────────────────────────────────────────────────── */

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/* ── Provider ──────────────────────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /* Always start with 'system' to match SSR — real value loaded in useEffect */
  const [theme, setThemeRaw] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  const [systemPref, setSystemPref] = useState<ResolvedTheme>('light');

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? systemPref : theme;

  /* Hydrate from localStorage + system preference after mount */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored) setThemeRaw(stored);
    setSystemPref(getSystemPreference());
    setMounted(true);
  }, []);

  /* Apply to DOM whenever the resolved value changes */
  useEffect(() => {
    if (!mounted) return;
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme, mounted]);

  /* Listen for OS theme changes */
  useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERY);
    const handler = (e: MediaQueryListEvent) => {
      setSystemPref(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  /* Persist & set */
  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeRaw(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  /* Cycle: light → dark → system */
  const toggleTheme = useCallback(() => {
    setThemeRaw((prev) => {
      const next: ThemeMode =
        prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────────────────────────────────── */

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de un <ThemeProvider>');
  }
  return ctx;
}
