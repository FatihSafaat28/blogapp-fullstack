import React, { useId } from 'react';
import { CaretDown } from '@phosphor-icons/react';

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
  ({ id, name, label, options, error, helperText, className = '', ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const selectName = name || selectId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center w-full bg-canvas rounded-lg transition-all duration-150 ${
            error
              ? 'border border-danger ring-1 ring-danger'
              : 'border border-line focus-within:ring-1 focus-within:ring-ink'
          }`}
        >
          <select
            ref={ref}
            id={selectId}
            name={selectName}
            className="w-full py-2 pl-3 pr-8 text-sm text-ink bg-transparent border-none outline-none appearance-none cursor-pointer"
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-card text-ink"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <CaretDown
            size={16}
            className="absolute right-3 text-ink-muted pointer-events-none"
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

Select.displayName = 'Select';
