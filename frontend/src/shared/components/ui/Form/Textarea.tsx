import React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
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
          <textarea
            ref={ref}
            className="w-full p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent border-none outline-none min-h-[100px] resize-y"
            {...props}
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

Textarea.displayName = 'Textarea';
