import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { ListBullets, ListNumbers, CheckSquare, CaretDown, Check } from '@phosphor-icons/react';

interface ListDropdownProps {
  editor: Editor;
}

export const ListDropdown: React.FC<ListDropdownProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const isListActive =
    editor.isActive('bulletList') ||
    editor.isActive('orderedList') ||
    editor.isActive('taskList');

  const getActiveListIcon = () => {
    if (editor.isActive('orderedList')) {
      return <ListNumbers size={15} weight="bold" />;
    }
    if (editor.isActive('taskList')) {
      return <CheckSquare size={15} weight="bold" />;
    }
    return <ListBullets size={15} weight="bold" />;
  };

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
      setIsOpen(true);
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

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Pilih format daftar"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleToggle}
        className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
          isListActive
            ? 'bg-ink text-canvas font-bold'
            : isOpen
            ? 'bg-muted text-ink'
            : 'text-ink-muted hover:text-ink hover:bg-muted'
        }`}
      >
        {getActiveListIcon()}
        <CaretDown size={11} weight="bold" className="opacity-70" />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed w-52 rounded-xl bg-card border border-line shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-scaleIn text-xs"
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('bulletList')
                  ? 'bg-ink text-canvas font-semibold'
                  : 'text-ink hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                <ListBullets size={15} /> Bullet List
              </span>
              {editor.isActive('bulletList') && <Check size={14} weight="bold" />}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('orderedList')
                  ? 'bg-ink text-canvas font-semibold'
                  : 'text-ink hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                <ListNumbers size={15} /> Numbered List
              </span>
              {editor.isActive('orderedList') && <Check size={14} weight="bold" />}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().toggleTaskList().run();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('taskList')
                  ? 'bg-ink text-canvas font-semibold'
                  : 'text-ink hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckSquare size={15} /> Task List
              </span>
              {editor.isActive('taskList') && <Check size={14} weight="bold" />}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
