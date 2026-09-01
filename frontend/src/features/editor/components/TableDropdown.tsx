import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import {
  Table as TableIcon,
  CaretDown,
  Trash,
  Plus,
  Rows,
  Columns,
} from '@phosphor-icons/react';

interface TableDropdownProps {
  editor: Editor;
}

const MAX_ROWS = 8;
const MAX_COLS = 8;

export const TableDropdown: React.FC<TableDropdownProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [hovered, setHovered] = useState<{ rows: number; cols: number } | null>(null);

  const isInTable = editor.isActive('table');

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
      setIsOpen(true);
      setHovered(null);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => setIsOpen(false);

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Menu Tabel"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleToggle}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
          isInTable
            ? 'bg-ink text-canvas font-bold'
            : isOpen
            ? 'bg-muted text-ink'
            : 'text-ink-muted hover:text-ink hover:bg-muted'
        }`}
      >
        <TableIcon size={16} weight="bold" />
        <CaretDown size={11} weight="bold" className="opacity-70" />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed rounded-2xl bg-card border border-line shadow-2xl p-3 z-50 flex flex-col gap-2 animate-scaleIn text-xs select-none min-w-[200px]"
          >
            {!isInTable ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span className="font-semibold uppercase tracking-wider">Sisipkan Tabel</span>
                  <span className="font-bold text-ink">
                    {hovered ? `${hovered.rows} × ${hovered.cols}` : 'Ukuran'}
                  </span>
                </div>

                {/* 8x8 Interactive Visual Grid Matrix */}
                <div
                  className="grid grid-cols-8 gap-1 p-1 bg-muted/40 rounded-xl border border-line/60"
                  onMouseLeave={() => setHovered(null)}
                >
                  {Array.from({ length: MAX_ROWS }).map((_, rowIndex) =>
                    Array.from({ length: MAX_COLS }).map((_, colIndex) => {
                      const isHighlighted =
                        hovered !== null &&
                        rowIndex < hovered.rows &&
                        colIndex < hovered.cols;

                      return (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          type="button"
                          className={`w-4 h-4 rounded-xs border transition-all cursor-pointer ${
                            isHighlighted
                              ? 'bg-brand/30 border-brand scale-105'
                              : 'bg-canvas border-line/70 hover:border-ink-muted'
                          }`}
                          onMouseEnter={() =>
                            setHovered({ rows: rowIndex + 1, cols: colIndex + 1 })
                          }
                          onClick={() => insertTable(rowIndex + 1, colIndex + 1)}
                          aria-label={`Tabel ${rowIndex + 1} baris kali ${colIndex + 1} kolom`}
                        />
                      );
                    })
                  )}
                </div>

                <div className="text-[11px] font-mono text-center text-ink-muted pt-1">
                  {hovered ? (
                    <span className="text-ink font-semibold">
                      Klik untuk membuat tabel {hovered.rows} × {hovered.cols}
                    </span>
                  ) : (
                    'Arahkan mouse ke kotak grid'
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 w-52">
                <div className="px-1 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                  Columns
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addColumnBefore().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" /> Insert column left
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addColumnAfter().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" /> Insert column right
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteColumn().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-danger/10 text-danger transition-colors cursor-pointer text-left font-medium"
                >
                  <Trash size={13} weight="bold" /> Delete column
                </button>

                <div className="my-1 border-t border-line-subtle" />

                <div className="px-1 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                  Rows
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addRowBefore().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" /> Insert row above
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addRowAfter().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" /> Insert row below
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteRow().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-danger/10 text-danger transition-colors cursor-pointer text-left font-medium"
                >
                  <Trash size={13} weight="bold" /> Delete row
                </button>

                <div className="my-1 border-t border-line-subtle" />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().mergeOrSplit().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Columns size={13} /> Merge / Split cells
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().toggleHeaderRow().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Rows size={13} /> Toggle header row
                </button>

                <div className="my-1 border-t border-line-subtle" />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-danger/10 hover:bg-danger/20 text-danger transition-colors cursor-pointer text-left font-semibold"
                >
                  <Trash size={13} weight="bold" /> Delete table
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
