import React from 'react';
import {
  CheckCircle,
  WarningCircle,
  Warning,
  Info,
  X,
} from '@phosphor-icons/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={18} weight="fill" className="text-success shrink-0" />;
      case 'error':
        return <WarningCircle size={18} weight="fill" className="text-danger shrink-0" />;
      case 'warning':
        return <Warning size={18} weight="fill" className="text-warning shrink-0" />;
      case 'info':
      default:
        return <Info size={18} weight="fill" className="text-info shrink-0" />;
    }
  };

  const typeBorder = {
    success: 'border-l-4 border-l-success',
    error: 'border-l-4 border-l-danger',
    warning: 'border-l-4 border-l-warning',
    info: 'border-l-4 border-l-info',
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 p-4 bg-card border border-line rounded-xl shadow-xl min-w-70 max-w-md text-sm text-ink animate-slideUp ${typeBorder}`}
    >
      {getIcon()}
      <span className="flex-1 font-medium leading-snug">{toast.message}</span>
      <button
        type="button"
        className="p-1 text-ink-muted hover:text-ink rounded-md hover:bg-muted transition-colors cursor-pointer"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
      >
        <X size={15} weight="bold" />
      </button>
    </div>
  );
};
