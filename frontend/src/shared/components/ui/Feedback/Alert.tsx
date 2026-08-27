import React from 'react';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />;
      case 'danger':
        return <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />;
      case 'info':
      default:
        return <Info size={18} className="shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" />;
    }
  };

  const variantStyles = {
    info: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50 text-sky-900 dark:text-sky-200',
    success:
      'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200',
    warning:
      'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200',
    danger:
      'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-200',
  }[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm leading-relaxed ${variantStyles} ${className}`}
    >
      {getIcon()}
      <div className="flex-1">
        {title && <div className="font-bold mb-0.5">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
