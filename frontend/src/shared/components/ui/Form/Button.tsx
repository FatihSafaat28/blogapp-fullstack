import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  iconPrefix,
  iconSuffix,
  disabled,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-lg transition-all duration-150 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-2.5 text-base rounded-lg',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand hover:bg-brand-hover text-ink-inverse border border-transparent shadow-xs',
    secondary:
      'bg-muted hover:bg-line text-ink border border-line',
    outline:
      'border border-line text-ink hover:bg-muted bg-transparent',
    ghost:
      'text-ink-secondary hover:bg-muted hover:text-ink bg-transparent',
    danger:
      'bg-danger hover:opacity-90 text-white shadow-xs',
  }[variant];

  return (
    <button
      type={type}
      aria-busy={isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <CircleNotch
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
          className="animate-spin"
          role="status"
          aria-label="Memuat..."
        />
      ) : (
        iconPrefix
      )}
      <span>{children}</span>
      {!isLoading && iconSuffix}
    </button>
  );
};
