import React from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import {
  TextT,
  ListBullets,
  ListNumbers,
  CheckSquare,
  Quotes,
  CodeBlock as CodeBlockIcon,
  Check,
} from '@phosphor-icons/react';

interface TurnIntoSubmenuProps {
  editor: Editor;
  currentPos: number;
  currentNodeType: string | null;
  parentRect: DOMRect | null;
  onCloseAll: () => void;
}

export const TurnIntoSubmenu: React.FC<TurnIntoSubmenuProps> = ({
  editor,
  currentPos,
  currentNodeType,
  parentRect,
  onCloseAll,
}) => {
  if (!parentRect) return null;

  const runCommand = (cmd: () => void) => {
    if (currentPos >= 0) {
      editor.chain().focus().setNodeSelection(currentPos);
    }
    cmd();
    onCloseAll();
  };

  // Calculate placement (flip to left if not enough space on right)
  const isFlipped = parentRect.right + 200 > window.innerWidth;
  const left = isFlipped ? Math.max(10, parentRect.left - 190) : parentRect.right + 4;
  const top = Math.max(10, Math.min(parentRect.top - 8, window.innerHeight - 380));

  const items = [
    {
      id: 'paragraph',
      title: 'Text',
      icon: <TextT size={15} />,
      isActive: currentNodeType === 'paragraph',
      action: () => editor.chain().setParagraph().run(),
    },
    {
      id: 'heading-1',
      title: 'Heading 1',
      icon: <span className="font-serif font-bold text-xs w-4 text-center">H1</span>,
      isActive: currentNodeType === 'heading-1',
      action: () => editor.chain().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 'heading-2',
      title: 'Heading 2',
      icon: <span className="font-serif font-bold text-xs w-4 text-center">H2</span>,
      isActive: currentNodeType === 'heading-2',
      action: () => editor.chain().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 'heading-3',
      title: 'Heading 3',
      icon: <span className="font-serif font-bold text-xs w-4 text-center">H3</span>,
      isActive: currentNodeType === 'heading-3',
      action: () => editor.chain().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 'bullet-list',
      title: 'Bullet List',
      icon: <ListBullets size={15} />,
      isActive: currentNodeType === 'bulletList',
      action: () => editor.chain().toggleBulletList().run(),
    },
    {
      id: 'ordered-list',
      title: 'Ordered List',
      icon: <ListNumbers size={15} />,
      isActive: currentNodeType === 'orderedList',
      action: () => editor.chain().toggleOrderedList().run(),
    },
    {
      id: 'task-list',
      title: 'Task List',
      icon: <CheckSquare size={15} />,
      isActive: currentNodeType === 'taskList',
      action: () => editor.chain().toggleTaskList().run(),
    },
    {
      id: 'blockquote',
      title: 'Blockquote',
      icon: <Quotes size={15} />,
      isActive: currentNodeType === 'blockquote',
      action: () => editor.chain().toggleBlockquote().run(),
    },
    {
      id: 'code-block',
      title: 'Code Block',
      icon: <CodeBlockIcon size={15} />,
      isActive: currentNodeType === 'codeBlock',
      action: () => editor.chain().toggleCodeBlock().run(),
    },
  ];

  return createPortal(
    <div
      style={{ top: `${top}px`, left: `${left}px` }}
      className="fixed w-48 rounded-xl bg-card border border-line shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-scaleIn text-xs text-ink select-none"
    >
      <div className="px-2 py-1 text-[10px] font-medium text-ink-muted/70">
        Turn into
      </div>

      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand(item.action)}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            item.isActive ? 'bg-muted text-ink font-semibold' : 'text-ink hover:bg-muted/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 flex justify-center text-ink-muted">{item.icon}</div>
            <span>{item.title}</span>
          </div>
          {item.isActive && <Check size={13} weight="bold" className="text-brand" />}
        </button>
      ))}
    </div>,
    document.body
  );
};
