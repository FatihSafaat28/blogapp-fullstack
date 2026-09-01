import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { useTableController } from '../../hooks/useTableController';
import { TableExtendButtons } from './TableExtendButtons';
import { TableSelectionOverlay } from './TableSelectionOverlay';
import { TableContextMenu } from './TableContextMenu';

interface TableNodeControllerProps {
  editor: Editor | null;
}

export const TableNodeController: React.FC<TableNodeControllerProps> = ({ editor }) => {
  const { tableRect, cellRect, isTableActive } = useTableController(editor);
  const [contextMenuPos, setContextMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Listen to right-click (contextmenu) event inside table cells
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cell = target.closest('td, th');
      if (cell) {
        e.preventDefault();
        setContextMenuPos({ top: e.clientY, left: e.clientX });
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener('contextmenu', handleContextMenu);

    return () => {
      dom.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [editor]);

  if (!editor || !isTableActive) return null;

  return (
    <>
      {/* 1. Purple Cell Border with Corner Dot Handle */}
      <TableSelectionOverlay
        cellRect={cellRect}
        isTableActive={isTableActive}
      />

      {/* 2. Right (+) & Bottom (+) Table Extend Buttons */}
      <TableExtendButtons
        editor={editor}
        tableRect={tableRect}
        isTableActive={isTableActive}
      />

      {/* 3. Right-Click Context Menu with Flyout Submenus */}
      {contextMenuPos &&
        createPortal(
          <TableContextMenu
            editor={editor}
            position={contextMenuPos}
            onClose={() => setContextMenuPos(null)}
          />,
          document.body
        )}
    </>
  );
};
