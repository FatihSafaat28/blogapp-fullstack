import React from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowsClockwise,
  CopySimple,
  ClipboardText,
  Trash,
  CaretRight,
} from '@phosphor-icons/react';

interface NodeActionMenuProps {
  coords: { top: number; left: number };
  nodeTypeName: string;
  isSubmenuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  turnIntoBtnRef: React.RefObject<HTMLButtonElement | null>;
  onOpenTurnInto: () => void;
  onDuplicate: () => void;
  onCopyToClipboard: () => void;
  onDelete: () => void;
}

export const NodeActionMenu: React.FC<NodeActionMenuProps> = ({
  coords,
  nodeTypeName,
  isSubmenuOpen,
  menuRef,
  turnIntoBtnRef,
  onOpenTurnInto,
  onDuplicate,
  onCopyToClipboard,
  onDelete,
}) => {
  return createPortal(
    <div
      ref={menuRef}
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
      className="fixed w-52 rounded-xl bg-card border border-line shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-scaleIn text-xs text-ink select-none"
    >
      <div className="px-2.5 py-1 text-[11px] font-mono text-ink-muted border-b border-line-subtle mb-0.5">
        {nodeTypeName}
      </div>

      <button
        ref={turnIntoBtnRef}
        type="button"
        onMouseEnter={onOpenTurnInto}
        onClick={onOpenTurnInto}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
          isSubmenuOpen ? 'bg-muted text-ink font-semibold' : 'text-ink hover:bg-muted/60'
        }`}
      >
        <div className="flex items-center gap-2">
          <ArrowsClockwise size={15} />
          <span>Turn Into</span>
        </div>
        <CaretRight size={12} weight="bold" className="text-ink-muted" />
      </button>

      <div className="w-full h-[1px] bg-line-subtle my-0.5" />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onDuplicate}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-ink hover:bg-muted/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <CopySimple size={15} />
          <span>Duplicate node</span>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">ModD</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCopyToClipboard}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-ink hover:bg-muted/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <ClipboardText size={15} />
          <span>Copy to clipboard</span>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">ModC</span>
      </button>

      <div className="w-full h-[1px] bg-line-subtle my-0.5" />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onDelete}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Trash size={15} />
          <span>Delete</span>
        </div>
        <span className="text-[10px] font-mono text-danger/80">Backspace</span>
      </button>
    </div>,
    document.body
  );
};
