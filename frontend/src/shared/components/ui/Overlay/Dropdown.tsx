import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isDanger?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute top-[calc(100%+6px)] min-w-45 p-1 bg-card border border-line rounded-xl shadow-xl z-50 animate-scaleIn ${
            align === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              type="button"
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer ${
                item.isDanger
                  ? 'text-danger hover:bg-danger-bg'
                  : 'text-ink-secondary hover:bg-muted hover:text-ink'
              }`}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
