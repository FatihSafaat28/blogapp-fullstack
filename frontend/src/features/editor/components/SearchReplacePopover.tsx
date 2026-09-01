import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import {
  MagnifyingGlass,
  CaretUp,
  CaretDown,
  X,
} from '@phosphor-icons/react';

interface SearchReplacePopoverProps {
  editor: Editor | null;
}

interface MatchPosition {
  from: number;
  to: number;
}

export const SearchReplacePopover: React.FC<SearchReplacePopoverProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matches, setMatches] = useState<MatchPosition[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(10, Math.min(rect.right - 280, window.innerWidth - 300)),
      });
    }
  };

  // Find all matches in document
  const performSearch = useCallback(() => {
    if (!editor || !searchTerm.trim()) {
      setMatches([]);
      setCurrentIndex(0);
      return;
    }

    const { doc } = editor.state;
    const results: MatchPosition[] = [];
    const flags = matchCase ? 'g' : 'gi';

    let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      return;
    }

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          results.push({
            from: pos + match.index,
            to: pos + match.index + match[0].length,
          });
        }
      }
    });

    setMatches(results);
    setCurrentIndex(results.length > 0 ? 1 : 0);

    if (results.length > 0) {
      editor.commands.setTextSelection({ from: results[0].from, to: results[0].to });
    }
  }, [editor, searchTerm, matchCase, wholeWord]);

  useEffect(() => {
    if (isOpen) {
      performSearch();
    }
  }, [searchTerm, matchCase, wholeWord, isOpen, performSearch]);

  const handleNext = () => {
    if (matches.length === 0 || !editor) return;
    const nextIndex = currentIndex >= matches.length ? 1 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    const target = matches[nextIndex - 1];
    editor.commands.setTextSelection({ from: target.from, to: target.to });
  };

  const handlePrev = () => {
    if (matches.length === 0 || !editor) return;
    const prevIndex = currentIndex <= 1 ? matches.length : currentIndex - 1;
    setCurrentIndex(prevIndex);
    const target = matches[prevIndex - 1];
    editor.commands.setTextSelection({ from: target.from, to: target.to });
  };

  const handleReplace = () => {
    if (matches.length === 0 || !editor || currentIndex === 0) return;
    const currentMatch = matches[currentIndex - 1];
    editor
      .chain()
      .focus()
      .insertContentAt({ from: currentMatch.from, to: currentMatch.to }, replaceTerm)
      .run();
    performSearch();
  };

  const handleReplaceAll = () => {
    if (matches.length === 0 || !editor) return;
    let transaction = editor.state.tr;
    // Replace in reverse order so positions don't shift
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      transaction = transaction.replaceWith(
        match.from,
        match.to,
        editor.schema.text(replaceTerm)
      );
    }
    editor.view.dispatch(transaction);
    performSearch();
  };

  const handleToggle = () => {
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => setIsOpen(false);

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  if (!editor) return null;

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Cari dan Ganti Teks"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleToggle}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isOpen
            ? 'bg-ink text-canvas font-bold'
            : 'text-ink-muted hover:text-ink hover:bg-muted'
        }`}
      >
        <MagnifyingGlass size={16} weight="bold" />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed w-72 rounded-2xl bg-card/98 backdrop-blur-md border border-line shadow-2xl p-3 z-50 animate-scaleIn flex flex-col gap-2.5 text-xs"
          >
            {/* Header: Counter & Navigator */}
            <div className="flex items-center justify-between pb-1 border-b border-line">
              <span className="font-mono text-[11px] text-ink-muted">
                {matches.length > 0 ? `${currentIndex} dari ${matches.length}` : '0 / 0'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={matches.length === 0}
                  className="p-1 rounded hover:bg-muted text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Sebelumnya"
                >
                  <CaretUp size={13} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={matches.length === 0}
                  className="p-1 rounded hover:bg-muted text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Berikutnya"
                >
                  <CaretDown size={13} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-muted text-ink-muted hover:text-ink transition-colors ml-1"
                  title="Tutup"
                >
                  <X size={13} weight="bold" />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kata..."
                autoFocus
                className="w-full px-2.5 py-1.5 rounded-lg bg-muted/60 border border-line focus:border-brand outline-none text-ink text-xs transition-colors"
              />
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Ganti dengan..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-muted/60 border border-line focus:border-brand outline-none text-ink text-xs transition-colors"
              />
            </div>

            {/* Options */}
            <div className="flex items-center gap-3 text-[11px] text-ink-muted">
              <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-ink">
                <input
                  type="checkbox"
                  checked={matchCase}
                  onChange={(e) => setMatchCase(e.target.checked)}
                  className="rounded border-line accent-ink cursor-pointer"
                />
                <span>Aa Huruf Besar/Kecil</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-ink">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="rounded border-line accent-ink cursor-pointer"
                />
                <span>Kata Utuh</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-line">
              <button
                type="button"
                onClick={handleReplace}
                disabled={matches.length === 0}
                className="px-2.5 py-1 rounded-lg border border-line text-ink hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[11px] font-semibold"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleReplaceAll}
                disabled={matches.length === 0}
                className="px-2.5 py-1 rounded-lg bg-ink text-canvas font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity text-[11px]"
              >
                Ganti Semua
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
