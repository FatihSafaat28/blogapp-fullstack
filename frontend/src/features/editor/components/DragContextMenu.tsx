import React from "react";
import { Editor } from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { DotsSixVertical, Plus } from "@phosphor-icons/react";
import { NodeActionMenu } from "./NodeActionMenu";
import { useDragContextMenu } from "../hooks/useDragContextMenu";

interface DragContextMenuProps {
  editor: Editor | null;
}

export const DragContextMenu: React.FC<DragContextMenuProps> = ({ editor }) => {
  const {
    triggerRef,
    menuRef,
    isOpen,
    coords,
    isHoveredTable,
    isLineEmpty,
    tippyOptions,
    handleNodeChange,
    handleToggleMenu,
    handleInsertBlock,
    handleTransform,
    handleDuplicate,
    handleCopyToClipboard,
    handleDelete,
    getNodeTypeName,
  } = useDragContextMenu(editor);

  if (!editor) return null;

  return (
    <>
      <DragHandle
        editor={editor}
        onNodeChange={handleNodeChange}
        tippyOptions={tippyOptions}
        className="drag-handle-wrapper"
      >
        <div
          className={`relative flex items-center transition-all duration-150 ${
            isLineEmpty ? "opacity-0 pointer-events-none" : "opacity-100"
          } ${isHoveredTable ? "translate-y-2" : "translate-y-0"}`}
        >
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
              aria-label={
                isHoveredTable
                  ? "Seret untuk memindahkan tabel"
                  : "Opsi blok atau seret untuk memindahkan"
              }
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleToggleMenu}
              className={`p-1 rounded-md text-ink-muted/70 hover:text-ink hover:bg-muted cursor-grab active:cursor-grabbing transition-colors ${
                isHoveredTable ? "cursor-grab" : ""
              }`}
            >
              <DotsSixVertical size={14} weight="bold" />
            </button>
          </div>
        </div>
      </DragHandle>

      {/* Unified Drag Context Menu (Single Menu, Absolute Document Anchored & Frozen to Target Block) */}
      {isOpen && coords && (
        <NodeActionMenu
          coords={coords}
          nodeTypeName={getNodeTypeName()}
          menuRef={menuRef}
          onTransform={handleTransform}
          onDuplicate={handleDuplicate}
          onCopyToClipboard={handleCopyToClipboard}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
