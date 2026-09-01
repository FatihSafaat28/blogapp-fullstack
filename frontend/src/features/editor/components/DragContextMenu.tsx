import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Editor } from '@tiptap/react';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { DotsSixVertical, Plus } from '@phosphor-icons/react';
import { TurnIntoSubmenu } from './TurnIntoSubmenu';
import { NodeActionMenu } from './NodeActionMenu';

interface DragContextMenuProps {
  editor: Editor | null;
}

export const DragContextMenu: React.FC<DragContextMenuProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const turnIntoBtnRef = useRef<HTMLButtonElement | null>(null);

  const [currentNode, setCurrentNode] = useState<ProseMirrorNode | null>(null);
  const [currentPos, setCurrentPos] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [turnIntoRect, setTurnIntoRect] = useState<DOMRect | null>(null);

  // Centered vertically on line with smooth Tiptap glide transition
  const tippyOptions = useMemo(
    () => ({
      offset: [3, 16] as [number, number],
      zIndex: 30,
      interactive: true,
      interactiveBorder: 35,
      moveTransition: 'transform 0.15s cubic-bezier(0, 0, 0.2, 1)',
    }),
    []
  );

  const handleNodeChange = useCallback(
    ({ node, pos }: { node: ProseMirrorNode | null; editor: Editor; pos: number }) => {
      setCurrentNode(node);
      setCurrentPos(pos);
    },
    []
  );

  // Check if current hovered line is empty (no characters)
  const isLineEmpty =
    !currentNode ||
    (currentNode.type.name === 'paragraph' &&
      (!currentNode.textContent || currentNode.textContent.trim() === ''));

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: Math.max(16, rect.left) });
      setIsOpen(true);
      setIsSubmenuOpen(false);
    } else {
      setIsOpen(false);
      setIsSubmenuOpen(false);
    }
  };

  // Insert Block "+" handler: Inserts new paragraph with "/" physically
  const handleInsertBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor || !currentNode || currentPos < 0) return;

    const nextPos = currentPos + currentNode.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(nextPos, {
        type: 'paragraph',
        content: [{ type: 'text', text: '/' }],
      })
      .setTextSelection(nextPos + 2)
      .run();

    setIsOpen(false);
    setIsSubmenuOpen(false);
  };

  // Automatically reset node selection after drag & drop so text returns to regular state
  useEffect(() => {
    if (!editor?.view?.dom) return;
    const handleDrop = () => {
      setTimeout(() => {
        if (!editor.isDestroyed) {
          const { to } = editor.state.selection;
          editor.chain().focus().setTextSelection(to).run();
        }
      }, 50);
    };
    const dom = editor.view.dom;
    dom.addEventListener('drop', handleDrop);
    return () => dom.removeEventListener('drop', handleDrop);
  }, [editor]);

  // Close only on outside click or Escape (DO NOT close on scroll!)
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
        setIsSubmenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!editor) return null;

  const handleDuplicate = () => {
    if (!currentNode || currentPos < 0) return;
    editor.chain().focus().insertContentAt(currentPos + currentNode.nodeSize, currentNode.toJSON()).run();
    setIsOpen(false);
    setIsSubmenuOpen(false);
  };

  const handleCopyToClipboard = () => {
    if (!currentNode) return;
    navigator.clipboard.writeText(currentNode.textContent || '');
    setIsOpen(false);
    setIsSubmenuOpen(false);
  };

  const handleDelete = () => {
    if (!currentNode || currentPos < 0) return;
    editor.chain().focus().deleteRange({ from: currentPos, to: currentPos + currentNode.nodeSize }).run();
    setIsOpen(false);
    setIsSubmenuOpen(false);
  };

  const handleOpenTurnInto = () => {
    if (turnIntoBtnRef.current) {
      setTurnIntoRect(turnIntoBtnRef.current.getBoundingClientRect());
      setIsSubmenuOpen(true);
    }
  };

  const getNodeTypeName = () => {
    if (!currentNode) return 'paragraph';
    const type = currentNode.type.name;
    if (type === 'heading') return `heading ${currentNode.attrs.level}`;
    return type.toLowerCase();
  };

  return (
    <>
      <DragHandle
        editor={editor}
        onNodeChange={handleNodeChange}
        tippyOptions={tippyOptions}
        className="drag-handle-wrapper"
      >
        <div
          className={`relative flex items-center transition-opacity duration-150 ${
            isLineEmpty ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Invisible mouse bridge: covers 16px gap to the right */}
          <div
            className="absolute top-0 bottom-0 left-full w-8 pointer-events-auto"
            aria-hidden="true"
          />

          <div className="flex items-center gap-0.5 bg-card/95 border border-line-subtle shadow-xs rounded-lg p-0.5 backdrop-blur-xs transition-transform hover:scale-105">
            {/* 1. Insert block "+" button */}
            <div className="relative group/tooltip">
              <button
                type="button"
                aria-label="Insert block"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleInsertBlock}
                className="p-1 rounded-md text-ink-muted/70 hover:text-ink hover:bg-muted transition-colors cursor-pointer"
              >
                <Plus size={14} weight="bold" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:flex items-center px-2 py-0.5 rounded-md bg-ink text-canvas text-[10px] font-medium shadow-md whitespace-nowrap pointer-events-none z-50 animate-scaleIn">
                Insert block
              </div>
            </div>

            {/* 2. Drag Handle button "⋮⋮" */}
            <button
              ref={triggerRef}
              type="button"
              aria-label="Opsi blok atau seret untuk memindahkan"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleToggleMenu}
              className="p-1 rounded-md text-ink-muted/70 hover:text-ink hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
            >
              <DotsSixVertical size={14} weight="bold" />
            </button>
          </div>
        </div>
      </DragHandle>

      {/* Compact Primary Context Menu */}
      {isOpen && coords && (
        <NodeActionMenu
          coords={coords}
          nodeTypeName={getNodeTypeName()}
          isSubmenuOpen={isSubmenuOpen}
          menuRef={menuRef}
          turnIntoBtnRef={turnIntoBtnRef}
          onOpenTurnInto={handleOpenTurnInto}
          onDuplicate={handleDuplicate}
          onCopyToClipboard={handleCopyToClipboard}
          onDelete={handleDelete}
        />
      )}

      {/* Cascading Submenu "Turn Into >" */}
      {isOpen && isSubmenuOpen && (
        <TurnIntoSubmenu
          editor={editor}
          currentPos={currentPos}
          currentNodeType={currentNode?.type.name || null}
          parentRect={turnIntoRect}
          onCloseAll={() => {
            setIsOpen(false);
            setIsSubmenuOpen(false);
          }}
        />
      )}
    </>
  );
};
