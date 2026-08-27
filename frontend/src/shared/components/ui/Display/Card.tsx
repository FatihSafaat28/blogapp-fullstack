import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverLift?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverLift = false,
  header,
  footer,
  className = '',
  ...props
}) => {
  const baseStyles = 'border rounded-2xl p-5 shadow-sm transition-all duration-200';
  const surfaceStyles = glass
    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80'
    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';
  const hoverStyles = hoverLift
    ? 'hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/40 dark:hover:border-indigo-500/40'
    : '';

  return (
    <div
      className={`${baseStyles} ${surfaceStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {header && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          {footer}
        </div>
      )}
    </div>
  );
};
