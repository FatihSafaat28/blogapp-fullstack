import React from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import {
  MagnifyingGlass,
  CaretUp,
  CaretDown,
  X,
} from '@phosphor-icons/react';
import { useSearchReplace } from '../hooks/useSearchReplace';

interface SearchReplacePopoverProps {
  editor: Editor | null;
}

export const SearchReplacePopover: React.FC<SearchReplacePopoverProps> = ({ editor }) => {
  const {
    triggerRef,
    popoverRef,
    isOpen,
    coords,
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    matchCase,
    setMatchCase,
    wholeWord,
    setWholeWord,
    matches,
    currentIndex,
    handleToggle,
    handleNext,
    handlePrev,
    handleReplace,
    handleReplaceAll,
    setIsOpen,
  } = useSearchReplace(editor);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-muted transition-colors cursor-pointer ${
          isOpen ? 'bg-muted text-ink font-semibold' : ''
        }`}
        title="Cari & Ganti (Ctrl+F)"
        aria-label="Cari & Ganti"
      >
        <MagnifyingGlass size={16} weight={isOpen ? 'bold' : 'regular'} />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="absolute z-50 w-72 rounded-2xl bg-card border border-line shadow-2xl p-3 text-xs text-ink flex flex-col gap-2.5 animate-scaleIn select-none"
          >
            {/* Header: Title & Close */}
            <div className="flex items-center justify-between pb-1 border-b border-line-subtle">
              <span className="font-semibold text-xs text-ink">Cari & Ganti</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup cari dan ganti"
                className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={12} weight="bold" />
              </button>
            </div>

            {/* Row 1: Search Input & Match Nav */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 bg-muted/50 border border-line-subtle rounded-xl px-2 py-1 focus-within:border-ink">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kata..."
                  aria-label="Cari kata"
                  className="w-full bg-transparent border-none outline-none text-xs text-ink placeholder:text-ink-muted/60"
                  autoFocus
                />
                <span className="text-[10px] text-ink-muted whitespace-nowrap px-1">
                  {matches.length > 0 ? `${currentIndex}/${matches.length}` : '0/0'}
                </span>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={matches.length === 0}
                    aria-label="Hasil sebelumnya"
                    className="p-0.5 rounded text-ink-muted hover:text-ink disabled:opacity-30 cursor-pointer"
                  >
                    <CaretUp size={12} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={matches.length === 0}
                    aria-label="Hasil berikutnya"
                    className="p-0.5 rounded text-ink-muted hover:text-ink disabled:opacity-30 cursor-pointer"
                  >
                    <CaretDown size={12} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Options: Match Case & Whole Word */}
              <div className="flex items-center gap-3 px-1 text-[11px] text-ink-muted">
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={matchCase}
                    onChange={(e) => setMatchCase(e.target.checked)}
                    className="rounded border-line"
                  />
                  <span>Aa (Case)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wholeWord}
                    onChange={(e) => setWholeWord(e.target.checked)}
                    className="rounded border-line"
                  />
                  <span>[ab] (Kata utuh)</span>
                </label>
              </div>
            </div>

            {/* Row 2: Replace Input & Action Buttons */}
            <div className="flex flex-col gap-1.5 pt-1 border-t border-line-subtle">
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Ganti dengan..."
                aria-label="Ganti dengan kata"
                className="w-full bg-muted/50 border border-line-subtle rounded-xl px-2 py-1 text-xs text-ink placeholder:text-ink-muted/60 outline-none focus:border-ink"
              />

              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleReplace}
                  disabled={matches.length === 0}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-line hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleReplaceAll}
                  disabled={matches.length === 0}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-ink text-canvas hover:bg-ink/90 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Ganti Semua
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
