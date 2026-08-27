import React from 'react';

export interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className = '' }) => {
  if (!label) {
    return (
      <hr
        className={`border-t border-slate-200 dark:border-slate-800 my-6 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center w-full my-6 ${className}`}>
      <hr className="flex-1 border-t border-slate-200 dark:border-slate-800" />
      <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
        {label}
      </span>
      <hr className="flex-1 border-t border-slate-200 dark:border-slate-800" />
    </div>
  );
};
