import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

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
        return <CheckCircle size={18} className="text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info size={18} className="text-indigo-500 shrink-0" />;
    }
  };

  const typeBorder = {
    success: 'border-l-4 border-l-emerald-500',
    error: 'border-l-4 border-l-red-500',
    warning: 'border-l-4 border-l-amber-500',
    info: 'border-l-4 border-l-indigo-500',
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl min-w-[280px] max-w-md text-sm text-slate-800 dark:text-slate-200 animate-slideUp ${typeBorder}`}
    >
      {getIcon()}
      <span className="flex-1 font-medium leading-snug">{toast.message}</span>
      <button
        type="button"
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
      >
        <X size={15} />
      </button>
    </div>
  );
};
