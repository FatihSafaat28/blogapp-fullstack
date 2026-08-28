import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-center gap-2 mt-8 select-none ${className}`}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-line text-sm font-medium text-ink-secondary hover:text-ink hover:border-ink-muted disabled:opacity-40 transition-all duration-150 shadow-xs cursor-pointer"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <CaretLeft size={16} weight="bold" /> Sebelumnya
      </button>

      <span className="text-sm font-medium text-ink-secondary px-3">
        Halaman <strong className="text-ink">{currentPage}</strong> dari{' '}
        <strong className="text-ink">{totalPages}</strong>
      </span>

      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-line text-sm font-medium text-ink-secondary hover:text-ink hover:border-ink-muted disabled:opacity-40 transition-all duration-150 shadow-xs cursor-pointer"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Selanjutnya <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );
};
