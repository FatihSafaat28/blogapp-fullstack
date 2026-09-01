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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${maxWidth} max-h-[88vh] flex flex-col bg-card border border-line rounded-2xl shadow-2xl overflow-hidden animate-scaleIn my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky/Fixed Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-line bg-card">
          <h3 className="font-heading text-lg font-bold text-ink">
            {title}
          </h3>
          <button
            type="button"
            className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-muted transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-ink-secondary leading-relaxed overscroll-contain">
          {children}
        </div>

        {/* Sticky/Fixed Footer */}
        {footer && (
          <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-3.5 bg-muted/50 border-t border-line">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
