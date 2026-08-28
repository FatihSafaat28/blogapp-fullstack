import React from 'react';

export interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className = '' }) => {
  if (!label) {
    return (
      <hr
        className={`border-t border-line my-6 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center w-full my-6 ${className}`}>
      <hr className="flex-1 border-t border-line" />
      <span className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted whitespace-nowrap">
        {label}
      </span>
      <hr className="flex-1 border-t border-line" />
    </div>
  );
};
