import React from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { Plus } from '@phosphor-icons/react';

interface TableExtendButtonsProps {
  editor: Editor;
  tableRect: DOMRect | null;
  isTableActive: boolean;
}

export const TableExtendButtons: React.FC<TableExtendButtonsProps> = ({
  editor,
  tableRect,
  isTableActive,
}) => {
  if (!isTableActive || !tableRect) return null;

  // Right vertical bar style
  const rightBarStyle: React.CSSProperties = {
    top: `${tableRect.top}px`,
    left: `${tableRect.right + 4}px`,
    height: `${tableRect.height}px`,
  };

  // Bottom horizontal bar style
  const bottomBarStyle: React.CSSProperties = {
    top: `${tableRect.bottom + 4}px`,
    left: `${tableRect.left}px`,
    width: `${tableRect.width}px`,
  };

  return createPortal(
    <>
      {/* 1. Right Column Extend Bar (+) */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        style={rightBarStyle}
        className="fixed z-40 w-4 bg-muted/40 hover:bg-muted text-ink-muted hover:text-ink rounded-r-md flex items-center justify-center transition-all cursor-pointer group"
        title="Tambah Kolom"
        aria-label="Tambah Kolom"
      >
        <Plus size={11} weight="bold" className="group-hover:scale-125 transition-transform" />
      </button>

      {/* 2. Bottom Row Extend Bar (+) */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().addRowAfter().run()}
        style={bottomBarStyle}
        className="fixed z-40 h-4 bg-muted/40 hover:bg-muted text-ink-muted hover:text-ink rounded-b-md flex items-center justify-center transition-all cursor-pointer group"
        title="Tambah Baris"
        aria-label="Tambah Baris"
      >
        <Plus size={11} weight="bold" className="group-hover:scale-125 transition-transform" />
      </button>
    </>,
    document.body
  );
};
