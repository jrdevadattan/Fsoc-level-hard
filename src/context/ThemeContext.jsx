/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'app_theme_preference';

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  preference: 'system',
  setPreference: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const raw = localStorage.getItem(THEME_KEY);
      if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
    } catch (error) {
      console.error('Error reading theme preference:', error);
    }
    return 'system';
  });

  const systemPrefersDark = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  const resolveTheme = useCallback(() => {
    if (preference === 'system') return systemPrefersDark() ? 'dark' : 'light';
    return preference === 'dark' ? 'dark' : 'light';
  }, [preference, systemPrefersDark]);

  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
      if (stored === 'system') {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (error) {
      console.error('Error reading theme:', error);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const resolved = resolveTheme();
    setThemeState(resolved);
    if (typeof document !== 'undefined') {
      if (resolved === 'dark') {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [preference, resolveTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (!mq || preference !== 'system') return;
    
    const onChange = () => {
      const resolved = resolveTheme();
      setThemeState(resolved);
      if (typeof document !== 'undefined') {
        if (resolved === 'dark') {
          document.documentElement.classList.add('theme-dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('theme-dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    };
    
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
    } else if (mq.addListener) {
      mq.addListener(onChange);
    }
    
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', onChange);
      } else if (mq.removeListener) {
        mq.removeListener(onChange);
      }
    };
  }, [preference, resolveTheme]);

  const setPreferenceSafe = useCallback((value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
    setPreference(value);
  }, []);

  const context = useMemo(() => ({
    theme,
    setTheme: (t) => {
      const normalized = t === 'system' ? 'system' : t === 'dark' ? 'dark' : 'light';
      setPreferenceSafe(normalized);
    },
    preference,
    setPreference: setPreferenceSafe,
  }), [theme, setPreferenceSafe, preference]);

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
};