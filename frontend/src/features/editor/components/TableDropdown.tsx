import React from 'react';
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
import {
  useTableDropdown,
  MAX_TABLE_ROWS,
  MAX_TABLE_COLS,
} from '../hooks/useTableDropdown';

interface TableDropdownProps {
  editor: Editor;
}

export const TableDropdown: React.FC<TableDropdownProps> = ({ editor }) => {
  const {
    triggerRef,
    menuRef,
    isOpen,
    coords,
    hovered,
    setHovered,
    isInTable,
    handleToggle,
    insertTable,
    handleAction,
  } = useTableDropdown(editor);

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
            className="absolute rounded-2xl bg-card border border-line shadow-2xl p-3 z-50 flex flex-col gap-2 animate-scaleIn text-xs select-none min-w-[200px]"
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
                  {Array.from({ length: MAX_TABLE_ROWS }).map((_, rowIndex) =>
                    Array.from({ length: MAX_TABLE_COLS }).map((_, colIndex) => {
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

                <div className="text-[10px] text-ink-muted text-center pt-0.5">
                  Klik ukuran kotak yang diinginkan
                </div>
              </div>
            ) : (
              /* In-Table Operations Menu */
              <div className="flex flex-col gap-1 min-w-[190px]">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted border-b border-line-subtle">
                  Kelola Tabel
                </div>

                {/* Columns */}
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().addColumnBefore().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" />
                  <span>Tambah Kolom Kiri</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().addColumnAfter().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" />
                  <span>Tambah Kolom Kanan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().deleteColumn().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-danger/10 text-danger transition-colors cursor-pointer text-left"
                >
                  <Columns size={13} weight="bold" />
                  <span>Hapus Kolom Ini</span>
                </button>

                <div className="my-1 border-t border-line-subtle" />

                {/* Rows */}
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().addRowBefore().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" />
                  <span>Tambah Baris Atas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().addRowAfter().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
                >
                  <Plus size={13} weight="bold" />
                  <span>Tambah Baris Bawah</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().deleteRow().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-danger/10 text-danger transition-colors cursor-pointer text-left"
                >
                  <Rows size={13} weight="bold" />
                  <span>Hapus Baris Ini</span>
                </button>

                <div className="my-1 border-t border-line-subtle" />

                {/* Delete Table */}
                <button
                  type="button"
                  onClick={() => handleAction(() => editor.chain().focus().deleteTable().run())}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger font-semibold transition-colors cursor-pointer text-left"
                >
                  <Trash size={13} weight="bold" />
                  <span>Hapus Tabel</span>
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
