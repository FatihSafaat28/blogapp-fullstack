import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { SLASH_ITEMS, SlashItem } from './slashMenuItems';

interface SlashDropdownMenuProps {
  editor: Editor | null;
}

export const SlashDropdownMenu: React.FC<SlashDropdownMenuProps> = ({ editor }) => {
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

  if (!isOpen || !coords) return null;

  const groups: Array<'Style' | 'Lists' | 'Blocks'> = ['Style', 'Lists', 'Blocks'];

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
      className="absolute w-64 max-h-80 bg-card border border-line shadow-2xl rounded-2xl p-1.5 z-50 flex flex-col gap-1 text-xs text-ink animate-scaleIn select-none"
    >
      {/* Scrollable Items List */}
      <div className="flex-1 overflow-y-auto pr-0.5 max-h-64 flex flex-col gap-1.5">
        {filteredItems.length === 0 ? (
          <div className="py-4 text-center text-ink-muted text-xs">
            Tidak ada opsi yang cocok
          </div>
        ) : (
          groups.map((grp) => {
            const groupItems = filteredItems.filter((it) => it.group === grp);
            if (groupItems.length === 0) return null;

            return (
              <div key={grp} className="flex flex-col gap-0.5">
                <span className="px-2.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
                  {grp}
                </span>
                {groupItems.map((item) => {
                  const globalIndex = filteredItems.findIndex((it) => it.id === item.id);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectItem(item);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
                        isSelected ? 'bg-muted text-ink font-semibold' : 'text-ink hover:bg-muted/60'
                      }`}
                    >
                      <div className="w-5 flex justify-center text-ink-muted shrink-0">
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Filter Input /Filter... */}
      <div className="pt-1.5 border-t border-line-subtle flex items-center gap-1.5 px-2 py-1 bg-muted/40 rounded-xl">
        <MagnifyingGlass size={13} className="text-ink-muted shrink-0" />
        <span className="text-ink-muted font-mono text-[11px]">/</span>
        <input
          ref={filterInputRef}
          type="text"
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Filter..."
          className="w-full bg-transparent border-none outline-none text-xs text-ink placeholder:text-ink-muted/50 p-0 focus:ring-0"
        />
      </div>
    </div>,
    document.body
  );
};
