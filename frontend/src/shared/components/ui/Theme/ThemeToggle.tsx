import React, { useState, useEffect } from 'react';
import { Sun, Moon } from '@phosphor-icons/react';

export const ThemeToggle: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const updateTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    updateTheme(isDark);

    const handleThemeChange = (e: CustomEvent<{ isDark: boolean }>) => {
      setIsDark(e.detail.isDark);
    };

    window.addEventListener('theme-changed' as any, handleThemeChange);
    return () => {
      window.removeEventListener('theme-changed' as any, handleThemeChange);
    };
  }, [isDark]);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    updateTheme(next);
    window.dispatchEvent(
      new CustomEvent('theme-changed', { detail: { isDark: next } })
    );
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted border border-line text-ink-secondary hover:text-ink hover:border-ink-muted transition-colors cursor-pointer ${className}`}
      onClick={toggle}
      aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      title={isDark ? 'Tema Terang' : 'Tema Gelap'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};
