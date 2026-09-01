import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { SLASH_ITEMS, SlashItem } from '../components/slashMenuItems';

export const useSlashMenu = (editor: Editor | null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const filterInputRef = useRef<HTMLInputElement | null>(null);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!filterQuery.trim()) return SLASH_ITEMS;
    const query = filterQuery.toLowerCase().trim();
    return SLASH_ITEMS.filter((item) => item.title.toLowerCase().includes(query));
  }, [filterQuery]);

  // Execute selected item
  const handleSelectItem = useCallback(
    (item: SlashItem) => {
      if (!editor) return;

      // Delete the slash character if typed
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 20), from);
      const slashIndex = textBefore.lastIndexOf('/');
      if (slashIndex >= 0) {
        const deleteFrom = from - (textBefore.length - slashIndex);
        editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
      }

      item.action(editor);
      setIsOpen(false);
      setFilterQuery('');
      setSelectedIndex(0);
    },
    [editor]
  );

  // Keyboard navigation inside menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelectItem(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, filteredItems, handleSelectItem]);

  // Detect slash "/" key typed in editor
  useEffect(() => {
    if (!editor) return;

    const handleTransaction = () => {
      if (editor.isDestroyed) return;
      const { from, empty } = editor.state.selection;
      if (!empty) {
        setIsOpen(false);
        return;
      }

      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 1), from);
      if (textBefore === '/') {
        const cursorCoords = editor.view.coordsAtPos(from);
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        setCoords({
          top: cursorCoords.bottom + scrollY + 8,
          left: Math.min(cursorCoords.left + scrollX, Math.max(16, document.documentElement.clientWidth - 280)),
        });
        setIsOpen(true);
        setFilterQuery('');
        setSelectedIndex(0);
      } else if (isOpen) {
        // Update query if still typing after slash
        const fullText = editor.state.doc.textBetween(Math.max(0, from - 20), from);
        const lastSlash = fullText.lastIndexOf('/');
        if (lastSlash >= 0) {
          const query = fullText.slice(lastSlash + 1);
          setFilterQuery(query);
        } else {
          setIsOpen(false);
        }
      }
    };

    editor.on('transaction', handleTransaction);
    return () => {
      editor.off('transaction', handleTransaction);
    };
  }, [editor, isOpen]);

  // Listen for custom trigger from "+" button
  useEffect(() => {
    const handleOpenSlashTrigger = (e: CustomEvent<{ pos: number }>) => {
      if (!editor) return;
      const { pos } = e.detail;
      const cursorCoords = editor.view.coordsAtPos(pos);
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setCoords({
        top: cursorCoords.bottom + scrollY + 8,
        left: Math.min(cursorCoords.left + scrollX, Math.max(16, document.documentElement.clientWidth - 280)),
      });
      setIsOpen(true);
      setFilterQuery('');
      setSelectedIndex(0);
      setTimeout(() => filterInputRef.current?.focus(), 50);
    };

    window.addEventListener('open-slash-menu', handleOpenSlashTrigger as EventListener);
    return () => {
      window.removeEventListener('open-slash-menu', handleOpenSlashTrigger as EventListener);
    };
  }, [editor]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return {
    isOpen,
    coords,
    filterQuery,
    setFilterQuery,
    selectedIndex,
    setSelectedIndex,
    filteredItems,
    menuRef,
    filterInputRef,
    handleSelectItem,
  };
};
