import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Plus,
  Trash,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  AlignTop,
  AlignCenterVertical,
  AlignBottom,
  ArrowsMerge,
  CaretRight,
  BoundingBox,
  Rows,
  Columns,
} from '@phosphor-icons/react';

interface TableContextMenuProps {
  editor: Editor;
  position: { top: number; left: number };
  onClose: () => void;
}

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  editor,
  position,
  onClose,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<'insert' | 'delete' | 'align' | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleAction = (fn: () => void) => {
    fn();
    onClose();
  };

  // Check if flyout should open to the left if near screen right boundary
  const openLeft = position.left > window.innerWidth - 380;
  const submenuClass = `absolute top-0 ${
    openLeft ? 'right-full mr-1.5' : 'left-full ml-1.5'
  } rounded-2xl bg-card border border-line shadow-2xl p-1.5 min-w-[190px] flex flex-col gap-0.5 text-xs animate-fadeIn`;

  return (
    <div
      ref={menuRef}
      style={{
        top: `${Math.min(position.top, window.innerHeight - 240)}px`,
        left: `${Math.min(position.left, window.innerWidth - 220)}px`,
      }}
      className="fixed z-50 rounded-2xl bg-card border border-line shadow-2xl p-1.5 min-w-[200px] text-xs text-ink animate-scaleIn select-none"
    >
      {/* 1. Insert Submenu */}
      <div
        className="relative"
        onMouseEnter={() => setActiveSubmenu('insert')}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <Plus size={14} weight="bold" className="text-brand" />
            <span>Insert</span>
          </div>
          <CaretRight size={12} weight="bold" className="text-ink-muted" />
        </button>

        {activeSubmenu === 'insert' && (
          <div className={submenuClass} onMouseLeave={() => setActiveSubmenu(null)}>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().addColumnBefore().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <Columns size={13} weight="bold" />
              <span>Insert column left</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().addColumnAfter().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <Columns size={13} weight="bold" />
              <span>Insert column right</span>
            </button>
            <div className="my-0.5 border-t border-line-subtle" />
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().addRowBefore().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <Rows size={13} weight="bold" />
              <span>Insert row above</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().addRowAfter().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <Rows size={13} weight="bold" />
              <span>Insert row below</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Alignment Submenu */}
      <div
        className="relative"
        onMouseEnter={() => setActiveSubmenu('align')}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <BoundingBox size={14} weight="bold" />
            <span>Alignment</span>
          </div>
          <CaretRight size={12} weight="bold" className="text-ink-muted" />
        </button>

        {activeSubmenu === 'align' && (
          <div className={submenuClass} onMouseLeave={() => setActiveSubmenu(null)}>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().setTextAlign('left').run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <TextAlignLeft size={13} weight="bold" />
              <span>Align left</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().setTextAlign('center').run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <TextAlignCenter size={13} weight="bold" />
              <span>Align center</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().setTextAlign('right').run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <TextAlignRight size={13} weight="bold" />
              <span>Align right</span>
            </button>
            <div className="my-0.5 border-t border-line-subtle" />
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <AlignTop size={13} weight="bold" />
              <span>Align top</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <AlignCenterVertical size={13} weight="bold" />
              <span>Align middle</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer"
            >
              <AlignBottom size={13} weight="bold" />
              <span>Align bottom</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Merge / Split Cells */}
      <button
        type="button"
        onClick={() => handleAction(() => editor.chain().focus().mergeOrSplit().run())}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
      >
        <ArrowsMerge size={14} weight="bold" />
        <span>Merge / Split cells</span>
      </button>

      {/* 4. Toggle Header Row */}
      <button
        type="button"
        onClick={() => handleAction(() => editor.chain().focus().toggleHeaderRow().run())}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted text-ink transition-colors cursor-pointer text-left"
      >
        <Rows size={14} weight="bold" />
        <span>Toggle header row</span>
      </button>

      <div className="my-1 border-t border-line-subtle" />

      {/* 5. Delete Submenu (Positioned at the very bottom) */}
      <div
        className="relative"
        onMouseEnter={() => setActiveSubmenu('delete')}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted text-danger transition-colors cursor-pointer text-left font-medium"
        >
          <div className="flex items-center gap-2.5">
            <Trash size={14} weight="bold" />
            <span>Delete</span>
          </div>
          <CaretRight size={12} weight="bold" className="text-danger/60" />
        </button>

        {activeSubmenu === 'delete' && (
          <div className={submenuClass} onMouseLeave={() => setActiveSubmenu(null)}>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().deleteColumn().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-danger/10 text-danger transition-colors cursor-pointer"
            >
              <Trash size={13} weight="bold" />
              <span>Delete column</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().deleteRow().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-danger/10 text-danger transition-colors cursor-pointer"
            >
              <Trash size={13} weight="bold" />
              <span>Delete row</span>
            </button>
            <div className="my-0.5 border-t border-line-subtle" />
            <button
              type="button"
              onClick={() => handleAction(() => editor.chain().focus().deleteTable().run())}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger font-semibold transition-colors cursor-pointer"
            >
              <Trash size={13} weight="bold" />
              <span>Delete table</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
