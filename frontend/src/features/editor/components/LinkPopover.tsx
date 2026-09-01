import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { LinkSimple, ArrowSquareOut, Trash, Check } from '@phosphor-icons/react';

interface LinkPopoverProps {
  editor: Editor | null;
}

export const LinkPopover: React.FC<LinkPopoverProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const isLinkActive = editor?.isActive('link') || false;

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(10, Math.min(rect.left - 100, window.innerWidth - 320)),
      });
    }
  };

  const handleOpen = () => {
    if (!editor) return;
    const currentAttrs = editor.getAttributes('link');
    setUrl(currentAttrs.href || '');
    setOpenInNewTab(currentAttrs.target === '_blank');
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsOpen(false);
      return;
    }

    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')
      ? url.trim()
      : `https://${url.trim()}`;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: formattedUrl,
        target: openInNewTab ? '_blank' : null,
      })
      .run();

    setIsOpen(false);
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsOpen(false);
  };

  // Close on outside click
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
        aria-label="Sisipkan Tautan"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleOpen}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isLinkActive
            ? 'bg-ink text-canvas font-bold'
            : 'text-ink-muted hover:text-ink hover:bg-muted'
        }`}
      >
        <LinkSimple size={16} weight="bold" />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed w-80 rounded-2xl bg-card/98 backdrop-blur-md border border-line shadow-2xl p-3.5 z-50 animate-scaleIn flex flex-col gap-3 text-xs"
          >
            <form onSubmit={handleApply} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold uppercase tracking-wider text-[10px] text-ink-muted">
                  Tautan Link
                </span>
                {isLinkActive && url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline font-mono"
                  >
                    Buka <ArrowSquareOut size={12} />
                  </a>
                )}
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
                className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-line focus:border-brand focus:ring-1 focus:ring-brand outline-none text-ink text-xs transition-colors font-mono"
              />

              <label className="flex items-center gap-2 text-ink-muted hover:text-ink cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-line text-brand focus:ring-brand/20 accent-ink cursor-pointer"
                />
                <span>Buka di jendela / tab baru</span>
              </label>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/60">
                {isLinkActive ? (
                  <button
                    type="button"
                    onClick={handleUnlink}
                    className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors inline-flex items-center gap-1"
                    title="Hapus Tautan"
                  >
                    <Trash size={14} />
                    <span>Hapus</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-2.5 py-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-ink text-canvas font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1"
                  >
                    <Check size={13} weight="bold" />
                    <span>Terapkan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
};
