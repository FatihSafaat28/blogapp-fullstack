import React from 'react';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconPrefix,
      iconSuffix,
      onClear,
      className = '',
      value,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {label}
          </label>
        )}
        <div
          className={`flex items-center w-full bg-white dark:bg-slate-900 border rounded-lg transition-all duration-150 ${
            error
              ? 'border-red-500 ring-2 ring-red-500/10'
              : 'border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          {iconPrefix && (
            <div className="pl-3 flex items-center text-slate-400 dark:text-slate-500">
              {iconPrefix}
            </div>
          )}
          <input
            ref={ref}
            value={value}
            className="w-full px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent border-none outline-none"
            {...props}
          />
          {onClear && value ? (
            <button
              type="button"
              onClick={onClear}
              className="pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Hapus teks"
            >
              <X size={16} />
            </button>
          ) : (
            iconSuffix && (
              <div className="pr-3 flex items-center text-slate-400 dark:text-slate-500">
                {iconSuffix}
              </div>
            )
          )}
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

Input.displayName = 'Input';
