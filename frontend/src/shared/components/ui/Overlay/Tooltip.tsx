import React, { useState } from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-medium rounded-md shadow-lg pointer-events-none z-50 whitespace-nowrap animate-fadeIn">
          {content}
        </div>
      )}
    </div>
  );
};
