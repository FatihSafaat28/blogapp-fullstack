import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { PaintBrush, Prohibit } from '@phosphor-icons/react';

interface HighlightPopoverProps {
  editor: Editor | null;
}

const HIGHLIGHT_COLORS = [
  { id: 'green', name: 'Hijau', color: '#4ade80' },
  { id: 'blue', name: 'Biru', color: '#60a5fa' },
  { id: 'red', name: 'Merah', color: '#f87171' },
  { id: 'purple', name: 'Ungu', color: '#c084fc' },
  { id: 'yellow', name: 'Kuning', color: '#facc15' },
];

export const HighlightPopover: React.FC<HighlightPopoverProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const isHighlighted = editor?.isActive('highlight') || false;
  const activeColor = editor?.getAttributes('highlight')?.color;

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(10, Math.min(rect.left - 60, window.innerWidth - 260)),
      });
    }
  };

  const handleToggle = () => {
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  const handleApplyColor = (colorHex: string) => {
    if (!editor) return;
    editor.chain().focus().setHighlight({ color: colorHex }).run();
    setIsOpen(false);
  };

  const handleClearHighlight = () => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
    setIsOpen(false);
  };

  // Close on outside click / scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
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

  if (!editor) return null;

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Warna Stabilo (Highlight)"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleToggle}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
          isHighlighted
            ? 'bg-ink text-canvas font-bold'
            : 'text-ink-muted hover:text-ink hover:bg-muted'
        }`}
      >
        <PaintBrush size={16} weight="bold" />
        {isHighlighted && activeColor && (
          <span
            className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ring-1 ring-card"
            style={{ backgroundColor: activeColor }}
          />
        )}
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed rounded-2xl bg-card/98 backdrop-blur-md border border-line shadow-2xl p-2 z-50 animate-scaleIn flex items-center gap-1.5"
          >
            {HIGHLIGHT_COLORS.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleApplyColor(item.color)}
                style={{ backgroundColor: item.color }}
                title={`Highlight ${item.name}`}
                className="w-6 h-6 rounded-full transition-transform hover:scale-115 active:scale-95 border border-black/10 shadow-2xs cursor-pointer"
              />
            ))}

            <div className="w-[1px] h-4 bg-line mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClearHighlight}
              title="Hapus Warna Stabilo"
              className="p-1 rounded-lg text-ink-muted hover:text-danger hover:bg-muted transition-colors cursor-pointer"
            >
              <Prohibit size={18} weight="bold" />
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
