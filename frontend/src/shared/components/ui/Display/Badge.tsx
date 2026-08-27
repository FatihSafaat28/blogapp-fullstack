import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'published' | 'draft' | 'accent' | 'tag';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'accent',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none leading-normal';

  const variantStyles = {
    published:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50',
    draft:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
    accent:
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50',
    tag:
      'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-150',
  }[variant];

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {icon}
      {children}
    </span>
  );
};
