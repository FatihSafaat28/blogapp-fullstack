import React, { useId } from 'react';
import { X } from '@phosphor-icons/react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
  onClear?: () => void;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      error,
      helperText,
      iconPrefix,
      iconSuffix,
      onClear,
      className = '',
      containerClassName = '',
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const inputName = name || inputId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center w-full h-11 bg-canvas rounded-lg transition-all duration-150 ${
            error
              ? 'border border-danger ring-1 ring-danger'
              : 'border border-line focus-within:ring-1 focus-within:ring-ink'
          }`}
        >
          {iconPrefix && (
            <div className="pl-3.5 flex items-center shrink-0">
              {iconPrefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={inputName}
            value={value}
            className={`w-full h-full text-sm bg-transparent border-none outline-none ${
              iconPrefix ? 'pl-2' : 'pl-3.5'
            } ${iconSuffix || onClear ? 'pr-2' : 'pr-3.5'} ${className}`}
            {...props}
          />
          {onClear && value ? (
            <button
              type="button"
              onClick={onClear}
              className="pr-3.5 flex items-center text-ink-muted hover:text-ink transition-colors cursor-pointer"
              aria-label="Hapus teks"
            >
              <X size={16} />
            </button>
          ) : (
            iconSuffix && (
              <div className="pr-3.5 flex items-center shrink-0">
                {iconSuffix}
              </div>
            )
          )}
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

Input.displayName = 'Input';
