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
      'bg-success-bg text-success border border-success-border',
    draft:
      'bg-muted text-ink-muted border border-line',
    accent:
      'bg-muted text-ink border border-line',
    tag:
      'bg-muted text-ink-secondary border border-line hover:border-ink hover:text-ink cursor-pointer transition-colors duration-150',
  }[variant];

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {icon}
      {children}
    </span>
  );
};
