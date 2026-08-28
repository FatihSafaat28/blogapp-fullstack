import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  ariaLabel = 'Tab Navigasi',
}) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 p-1 bg-muted rounded-full border border-line select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-card text-ink shadow-xs border border-line'
                : 'text-ink-secondary hover:text-ink'
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-muted text-ink'
                    : 'bg-card text-ink-secondary border border-line'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
