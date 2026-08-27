import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500 hover:rotate-12 transition-all duration-200 cursor-pointer shadow-sm ${className}`}
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      title={isDark ? 'Tema Terang' : 'Tema Gelap'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
