import React from 'react';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'current';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label = 'Memuat...',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  }[size];

  const colorStyles = color === 'primary' ? 'text-brand' : 'text-current';

  return (
    <svg
      role="status"
      aria-label={label}
      className={`animate-spin ${sizeStyles} ${colorStyles} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.415, 31.415"
        strokeDashoffset="10"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="20, 42.8"
      />
    </svg>
  );
};
