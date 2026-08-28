import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${maxWidth} bg-card border border-line rounded-2xl shadow-2xl overflow-hidden animate-scaleIn`}
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
            aria-label="Tutup dialog"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="p-6 text-sm text-ink-secondary leading-relaxed">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 bg-muted/50 border-t border-line">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
