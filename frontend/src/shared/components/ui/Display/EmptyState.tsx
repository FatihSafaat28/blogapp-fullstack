import React from 'react';
import { FileText } from '@phosphor-icons/react';
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
  icon = <FileText size={28} />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 max-w-lg mx-auto my-8 bg-card/60 backdrop-blur-xs border border-dashed border-line rounded-3xl ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted text-ink mb-4">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-bold text-ink mb-2">
        {title}
      </h3>
      <p className="text-sm text-ink-secondary max-w-sm mb-6 leading-relaxed">
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
