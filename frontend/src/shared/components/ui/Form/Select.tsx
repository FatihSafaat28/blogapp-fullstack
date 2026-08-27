import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center w-full bg-white dark:bg-slate-900 border rounded-lg transition-all duration-150 ${
            error
              ? 'border-red-500 ring-2 ring-red-500/10'
              : 'border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          <select
            ref={ref}
            className="w-full py-2 pl-3 pr-8 text-sm text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none appearance-none cursor-pointer"
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
        </div>
        {error && <span className="text-xs font-medium text-red-500">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
