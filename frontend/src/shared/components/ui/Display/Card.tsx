import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverLift?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  hoverLift = false,
  header,
  footer,
  className = '',
  ...props
}) => {
  const baseStyles = 'border rounded-2xl p-5 shadow-xs transition-all duration-200';
  const surfaceStyles = glass
    ? 'bg-glass backdrop-blur-md border-line'
    : 'bg-card border-line';
  const hoverStyles = hoverLift
    ? 'hover:-translate-y-0.5 hover:shadow-md hover:border-ink-muted'
    : '';

  return (
    <div
      className={`${baseStyles} ${surfaceStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {header && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-line-subtle">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-line-subtle">
          {footer}
        </div>
      )}
    </div>
  );
};
