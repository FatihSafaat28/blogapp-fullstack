import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} /> Sebelumnya
      </button>

      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 px-3">
        Halaman <strong className="text-slate-900 dark:text-slate-100">{currentPage}</strong> dari{' '}
        <strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
      </span>

      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Selanjutnya <ChevronRight size={16} />
      </button>
    </div>
  );
};
