import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '../Form/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FileQuestion size={28} />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 max-w-lg mx-auto my-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
