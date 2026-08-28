import React from 'react';
import { Check } from '@phosphor-icons/react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', checked, disabled, ...props }, ref) => {
    return (
      <label
        className={`inline-flex items-center gap-2 select-none text-sm text-ink-secondary ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all duration-150 ${
              checked
                ? 'bg-brand border-brand text-ink-inverse'
                : 'bg-canvas border-line hover:border-ink'
            }`}
          >
            {checked && <Check size={12} weight="bold" />}
          </div>
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
