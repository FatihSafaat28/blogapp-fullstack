import { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export interface TableRects {
  tableRect: DOMRect | null;
  cellRect: DOMRect | null;
  isTableActive: boolean;
}

export const useTableController = (editor: Editor | null) => {
  const [rects, setRects] = useState<TableRects>({
    tableRect: null,
    cellRect: null,
    isTableActive: false,
  });

  const updateRects = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.isActive('table')) {
      setRects((prev) => (prev.isTableActive ? { tableRect: null, cellRect: null, isTableActive: false } : prev));
      return;
    }

    const { view } = editor;
    const { selection } = view.state;

    // Find cell DOM node using selection from position
    let cellDom: HTMLElement | null = null;
    try {
      const domNode = view.nodeDOM(selection.$from.before());
      if (domNode instanceof HTMLElement) {
        cellDom = domNode.closest('td, th');
      }
    } catch {
      // Fallback: check active element inside editor view
    }

    if (!cellDom) {
      const activeEl = document.activeElement;
      if (activeEl && view.dom.contains(activeEl)) {
        cellDom = activeEl.closest('td, th');
      }
    }

    if (!cellDom) {
      // Search from selection coordinates
      try {
        const coords = view.coordsAtPos(selection.from);
        const elAtCoords = document.elementFromPoint(coords.left, coords.top);
        if (elAtCoords) {
          cellDom = elAtCoords.closest('td, th');
        }
      } catch {
        // Safe catch
      }
    }

    if (cellDom) {
      const tableDom = cellDom.closest('table');
      if (tableDom) {
        const tableRect = tableDom.getBoundingClientRect();
        const cellRect = cellDom.getBoundingClientRect();

        setRects({
          tableRect,
          cellRect,
          isTableActive: true,
        });
        return;
      }
    }

    // If editor has table active but no cell found yet, try finding active table in view
    const tableEl = view.dom.querySelector('table');
    if (tableEl) {
      const tableRect = tableEl.getBoundingClientRect();
      const firstCell = tableEl.querySelector('td, th');
      const cellRect = firstCell ? firstCell.getBoundingClientRect() : tableRect;

      setRects({
        tableRect,
        cellRect,
        isTableActive: true,
      });
      return;
    }

    setRects({ tableRect: null, cellRect: null, isTableActive: false });
  }, [editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    updateRects();

    const handleUpdate = () => updateRects();
    const handleScrollOrResize = () => updateRects();

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [editor, updateRects]);

  return {
    ...rects,
    updateRects,
  };
};
