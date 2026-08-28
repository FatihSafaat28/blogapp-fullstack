import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${maxWidth} h-full bg-card border-l border-line shadow-2xl flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="font-heading text-lg font-bold text-ink">
            {title}
          </h3>
          <button
            type="button"
            className="p-1 text-ink-muted hover:text-ink rounded-lg hover:bg-muted transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Tutup panel"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5 text-ink">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-line">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
