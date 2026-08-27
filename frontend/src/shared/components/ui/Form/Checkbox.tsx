import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', checked, disabled, ...props }, ref) => {
    return (
      <label
        className={`inline-flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700 dark:text-slate-300 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
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
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-500'
            }`}
          >
            {checked && <Check size={12} strokeWidth={3} />}
          </div>
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
