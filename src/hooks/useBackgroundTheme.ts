import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'prompt-manager-bg';

export type BackgroundTheme = 'default' | 'cream' | 'green' | 'sepia';

const THEME_LABELS: Record<BackgroundTheme, string> = {
  default: '기본 (흰색)',
  cream: '크림 (눈 편한)',
  green: '녹색 톤 (시력 보호)',
  sepia: '세피아',
};

function loadTheme(): BackgroundTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'cream' || stored === 'green' || stored === 'sepia' || stored === 'default') {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'default';
}

function applyTheme(theme: BackgroundTheme) {
  document.documentElement.setAttribute('data-bg', theme === 'default' ? '' : theme);
}

export function useBackgroundTheme() {
  const [theme, setThemeState] = useState<BackgroundTheme>(loadTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((value: BackgroundTheme) => {
    setThemeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    applyTheme(value);
  }, []);

  return { theme, setTheme, themeLabels: THEME_LABELS };
}
