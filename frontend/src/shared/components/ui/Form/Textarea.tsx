import React, { useId } from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, name, label, error, helperText, className = '', ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const textareaName = name || textareaId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center w-full bg-canvas rounded-lg transition-all duration-150 ${
            error
              ? 'border border-danger ring-1 ring-danger'
              : 'border border-line focus-within:ring-1 focus-within:ring-ink'
          }`}
        >
          <textarea
            ref={ref}
            id={textareaId}
            name={textareaName}
            className={`w-full p-3 text-sm bg-transparent border-none outline-none min-h-25 resize-y ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-ink-muted">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
