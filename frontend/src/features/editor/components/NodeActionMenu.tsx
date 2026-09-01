import React from 'react';
import { createPortal } from 'react-dom';
import {
  ListBullets,
  ListNumbers,
  CheckSquare,
  Quotes,
  CodeBlock as CodeBlockIcon,
  CopySimple,
  ClipboardText,
  Trash,
} from '@phosphor-icons/react';

interface NodeActionMenuProps {
  coords: { top: number; left: number };
  nodeTypeName: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onTransform: (type: string, level?: 1 | 2 | 3) => void;
  onDuplicate: () => void;
  onCopyToClipboard: () => void;
  onDelete: () => void;
}

export const NodeActionMenu: React.FC<NodeActionMenuProps> = ({
  coords,
  nodeTypeName,
  menuRef,
  onTransform,
  onDuplicate,
  onCopyToClipboard,
  onDelete,
}) => {
  const normType = nodeTypeName.toLowerCase().replace(/[\s_-]/g, '');

  const leftColumnItems = [
    {
      id: 'heading-1',
      label: 'Heading 1',
      icon: <span className="font-serif font-bold text-xs w-4 text-center">H1</span>,
      isActive: normType === 'heading1',
      onClick: () => (normType === 'heading1' ? onTransform('paragraph') : onTransform('heading', 1)),
    },
    {
      id: 'heading-2',
      label: 'Heading 2',
      icon: <span className="font-serif font-bold text-xs w-4 text-center">H2</span>,
      isActive: normType === 'heading2',
      onClick: () => (normType === 'heading2' ? onTransform('paragraph') : onTransform('heading', 2)),
    },
    {
      id: 'heading-3',
      label: 'Heading 3',
      icon: <span className="font-serif font-bold text-xs w-4 text-center">H3</span>,
      isActive: normType === 'heading3',
      onClick: () => (normType === 'heading3' ? onTransform('paragraph') : onTransform('heading', 3)),
    },
    {
      id: 'code-block',
      label: 'Code Block',
      icon: <CodeBlockIcon size={15} />,
      isActive: normType === 'codeblock',
      onClick: () => (normType === 'codeblock' ? onTransform('paragraph') : onTransform('codeBlock')),
    },
  ];

  const rightColumnItems = [
    {
      id: 'bullet-list',
      label: 'Bullet List',
      icon: <ListBullets size={15} />,
      isActive: normType === 'bulletlist',
      onClick: () => (normType === 'bulletlist' ? onTransform('paragraph') : onTransform('bulletList')),
    },
    {
      id: 'ordered-list',
      label: 'Numbered List',
      icon: <ListNumbers size={15} />,
      isActive: normType === 'orderedlist',
      onClick: () => (normType === 'orderedlist' ? onTransform('paragraph') : onTransform('orderedList')),
    },
    {
      id: 'task-list',
      label: 'Task List',
      icon: <CheckSquare size={15} />,
      isActive: normType === 'tasklist',
      onClick: () => (normType === 'tasklist' ? onTransform('paragraph') : onTransform('taskList')),
    },
    {
      id: 'blockquote',
      label: 'Blockquote',
      icon: <Quotes size={15} />,
      isActive: normType === 'blockquote',
      onClick: () => (normType === 'blockquote' ? onTransform('paragraph') : onTransform('blockquote')),
    },
  ];

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
      className="absolute w-72 rounded-2xl bg-card/95 backdrop-blur-xl border border-line shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scaleIn text-xs text-ink select-none ring-1 ring-black/5 dark:ring-white/10"
    >
      {/* 1. Symmetrical 2-Column Grid (4 Left vs 4 Right) */}
      <div className="grid grid-cols-2 gap-1">
        {/* Left Column: Headings & Code */}
        <div className="flex flex-col gap-0.5">
          {leftColumnItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={item.onClick}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                item.isActive
                  ? 'bg-muted text-ink font-semibold'
                  : 'text-ink hover:bg-muted/70'
              }`}
            >
              <div className="w-4 flex justify-center text-ink-muted shrink-0">
                {item.icon}
              </div>
              <span className="font-sans text-xs truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Column: Lists & Blockquote */}
        <div className="flex flex-col gap-0.5">
          {rightColumnItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={item.onClick}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                item.isActive
                  ? 'bg-muted text-ink font-semibold'
                  : 'text-ink hover:bg-muted/70'
              }`}
            >
              <div className="w-4 flex justify-center text-ink-muted shrink-0">
                {item.icon}
              </div>
              <span className="font-sans text-xs truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[1px] bg-line-subtle my-0.5" />

      {/* 2. Utility Actions */}
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onDuplicate}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-ink hover:bg-muted/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 flex justify-center text-ink-muted shrink-0">
              <CopySimple size={14} />
            </div>
            <span className="font-sans text-xs">Duplicate node</span>
          </div>
          <span className="text-[10px] font-mono text-ink-muted/70">Mod D</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCopyToClipboard}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-ink hover:bg-muted/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 flex justify-center text-ink-muted shrink-0">
              <ClipboardText size={14} />
            </div>
            <span className="font-sans text-xs">Copy to clipboard</span>
          </div>
          <span className="text-[10px] font-mono text-ink-muted/70">Mod C</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onDelete}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors cursor-pointer font-medium mt-0.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 flex justify-center text-danger shrink-0">
              <Trash size={14} weight="bold" />
            </div>
            <span className="font-sans text-xs">Delete</span>
          </div>
          <span className="text-[10px] font-mono text-danger/80">⌫</span>
        </button>
      </div>
    </div>,
    document.body
  );
};
