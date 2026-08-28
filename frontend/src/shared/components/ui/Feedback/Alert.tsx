import React from 'react';
import {
  Info,
  CheckCircle,
  Warning,
  WarningCircle,
} from '@phosphor-icons/react';

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
        return <CheckCircle size={18} weight="fill" className="shrink-0 mt-0.5 text-success" />;
      case 'warning':
        return <Warning size={18} weight="fill" className="shrink-0 mt-0.5 text-warning" />;
      case 'danger':
        return <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5 text-danger" />;
      case 'info':
      default:
        return <Info size={18} weight="fill" className="shrink-0 mt-0.5 text-info" />;
    }
  };

  const variantStyles = {
    info: 'bg-info-bg border-info-border text-info',
    success: 'bg-success-bg border-success-border text-success',
    warning: 'bg-warning-bg border-warning-border text-warning',
    danger: 'bg-danger-bg border-danger-border text-danger',
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
