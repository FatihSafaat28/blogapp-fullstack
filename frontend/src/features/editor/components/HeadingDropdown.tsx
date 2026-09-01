import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { CaretDown, Check } from '@phosphor-icons/react';

interface HeadingDropdownProps {
  editor: Editor;
}

export const HeadingDropdown: React.FC<HeadingDropdownProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const getActiveHeadingLevel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'H';
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

  const activeLevel = getActiveHeadingLevel();

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Pilih format heading"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleToggle}
        className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
          activeLevel !== 'H'
            ? 'bg-ink text-canvas font-bold'
            : isOpen
            ? 'bg-muted text-ink'
            : 'text-ink-muted hover:text-ink hover:bg-muted'
        }`}
      >
        <span className="text-[11px] font-bold">{activeLevel}</span>
        <CaretDown size={11} weight="bold" className="opacity-70" />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed w-48 rounded-xl bg-card border border-line shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-scaleIn text-xs"
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-ink text-canvas font-semibold'
                  : 'text-ink hover:bg-muted'
              }`}
            >
              <span className="font-serif text-base font-bold">Heading 1</span>
              {editor.isActive('heading', { level: 1 }) && (
                <Check size={14} weight="bold" />
              )}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-ink text-canvas font-semibold'
                  : 'text-ink hover:bg-muted'
              }`}
            >
              <span className="font-serif text-sm font-semibold">Heading 2</span>
              {editor.isActive('heading', { level: 2 }) && (
                <Check size={14} weight="bold" />
              )}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-ink text-canvas font-semibold'
                  : 'text-ink hover:bg-muted'
              }`}
            >
              <span className="font-serif text-xs font-medium">Heading 3</span>
              {editor.isActive('heading', { level: 3 }) && (
                <Check size={14} weight="bold" />
              )}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
