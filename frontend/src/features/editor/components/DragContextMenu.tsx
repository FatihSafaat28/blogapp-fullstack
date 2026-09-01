import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Editor } from "@tiptap/react";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { DotsSixVertical, Plus } from "@phosphor-icons/react";
import { NodeActionMenu } from "./NodeActionMenu";

interface DragContextMenuProps {
  editor: Editor | null;
}

export const DragContextMenu: React.FC<DragContextMenuProps> = ({ editor }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 1. Hover state (dynamically follows mouse position)
  const [hoveredNode, setHoveredNode] = useState<ProseMirrorNode | null>(null);
  const [hoveredPos, setHoveredPos] = useState<number>(-1);

  // 2. Active menu state (locked strictly to opened block)
  const [activeMenuNode, setActiveMenuNode] = useState<ProseMirrorNode | null>(
    null,
  );
  const [activeMenuPos, setActiveMenuPos] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );

  // Centered vertically on line with smooth Tiptap glide transition
  const tippyOptions = useMemo(
    () => ({
      offset: [3, 16] as [number, number],
      zIndex: 30,
      interactive: true,
      interactiveBorder: 35,
      moveTransition: "transform 0.15s cubic-bezier(0, 0, 0.2, 1)",
    }),
    [],
  );

  const handleNodeChange = useCallback(
    ({
      node,
      pos,
    }: {
      node: ProseMirrorNode | null;
      editor: Editor;
      pos: number;
    }) => {
      if (node && pos >= 0) {
        setHoveredNode(node);
        setHoveredPos(pos);
      }
    },
    [],
  );

  // Check if current hovered node is a table component
  const isHoveredTable =
    hoveredNode?.type.name === "table" ||
    hoveredNode?.type.name === "tableRow" ||
    hoveredNode?.type.name === "tableCell" ||
    hoveredNode?.type.name === "tableHeader";

  // Check if current hovered line is empty (no characters)
  const isLineEmpty =
    !hoveredNode ||
    (hoveredNode.type.name === "paragraph" &&
      (!hoveredNode.textContent || hoveredNode.textContent.trim() === ""));

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Disable context menu overlay for table nodes (drag & drop only)
    if (isHoveredTable) {
      setIsOpen(false);
      setActiveMenuPos(-1);
      setActiveMenuNode(null);
      return;
    }

    // If already open on the EXACT same block position -> toggle close
    if (isOpen && activeMenuPos === hoveredPos) {
      setIsOpen(false);
      setActiveMenuPos(-1);
      setActiveMenuNode(null);
      return;
    }

    // Open immediately on new block in 1 click
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setCoords({
        top: rect.bottom + scrollY + 6,
        left: Math.max(16, rect.left + scrollX),
      });

      let targetPos = hoveredPos;
      let targetNode = hoveredNode;

      // Fallback coordinate-based block position recovery
      if (editor && (targetPos < 0 || !targetNode)) {
        try {
          const docPos = editor.view.posAtCoords({
            left: rect.right + 30,
            top: rect.top + 10,
          });
          if (docPos && docPos.pos >= 0) {
            const resolved = editor.state.doc.resolve(docPos.pos);
            let d = resolved.depth;
            while (d > 0 && !resolved.node(d).isBlock) d--;
            if (d > 0) {
              const detectedNode = resolved.node(d);
              if (
                detectedNode.type.name === "table" ||
                detectedNode.type.name === "tableRow" ||
                detectedNode.type.name === "tableCell" ||
                detectedNode.type.name === "tableHeader"
              ) {
                setIsOpen(false);
                setActiveMenuPos(-1);
                setActiveMenuNode(null);
                return;
              }
              targetNode = detectedNode;
              targetPos = resolved.before(d);
              setHoveredNode(detectedNode);
              setHoveredPos(targetPos);
            }
          }
        } catch {
          // Safe catch
        }
      }

      setActiveMenuPos(targetPos);
      setActiveMenuNode(targetNode);
      setIsOpen(true);
    }
  };

  // Insert Block "+" handler: Inserts new paragraph with "/" physically
  const handleInsertBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor) return;

    let targetPos = hoveredPos;
    let targetSize = hoveredNode?.nodeSize || 2;

    if (targetPos < 0 && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const docPos = editor.view.posAtCoords({
        left: rect.right + 30,
        top: rect.top + 10,
      });
      if (docPos && docPos.pos >= 0) {
        targetPos = docPos.pos;
      }
    }

    if (targetPos >= 0) {
      const nextPos = targetPos + targetSize;
      editor
        .chain()
        .focus()
        .insertContentAt(nextPos, {
          type: "paragraph",
          content: [{ type: "text", text: "/" }],
        })
        .setTextSelection(nextPos + 2)
        .run();
    }

    setIsOpen(false);
    setActiveMenuPos(-1);
    setActiveMenuNode(null);
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
    dom.addEventListener("drop", handleDrop);
    return () => dom.removeEventListener("drop", handleDrop);
  }, [editor]);

  // Close only on outside click or Escape
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
        setActiveMenuPos(-1);
        setActiveMenuNode(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveMenuPos(-1);
        setActiveMenuNode(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!editor) return null;

  const handleTransform = (type: string, level?: 1 | 2 | 3) => {
    if (!editor || editor.isDestroyed || activeMenuPos < 0) return;
    const { state } = editor;

    try {
      // Resolve position INSIDE the locked target block (activeMenuPos + 1)
      const insidePos = Math.min(
        activeMenuPos + 1,
        Math.max(1, state.doc.content.size),
      );
      const resolvedPos = state.doc.resolve(insidePos);

      // Climb to find enclosing block node
      let depth = resolvedPos.depth;
      while (depth > 0 && !resolvedPos.node(depth).isBlock) {
        depth--;
      }

      if (depth === 0) return;

      const textFrom = resolvedPos.start(depth);
      const textTo = resolvedPos.end(depth);

      // Unified transformation with clearNodes to safely unwrap nested lists/quotes
      const chain = editor
        .chain()
        .focus()
        .setTextSelection({ from: textFrom, to: textTo })
        .clearNodes();

      if (type === "heading" && level) {
        chain.setHeading({ level }).run();
      } else if (type === "paragraph") {
        chain.setParagraph().run();
      } else if (type === "bulletList") {
        chain.toggleBulletList().run();
      } else if (type === "orderedList") {
        chain.toggleOrderedList().run();
      } else if (type === "taskList") {
        chain.toggleTaskList().run();
      } else if (type === "blockquote") {
        chain.toggleBlockquote().run();
      } else if (type === "codeBlock") {
        chain.toggleCodeBlock().run();
      }
    } catch (err) {
      console.error("[DragMenu] Transform error:", err);
    }

    setIsOpen(false);
    setActiveMenuPos(-1);
    setActiveMenuNode(null);
  };

  const handleDuplicate = () => {
    if (!editor || !activeMenuNode || activeMenuPos < 0) return;
    const nodeJson = activeMenuNode.toJSON();
    const insertPos = activeMenuPos + activeMenuNode.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, nodeJson)
      .setTextSelection(insertPos + 1)
      .run();
    setIsOpen(false);
    setActiveMenuPos(-1);
    setActiveMenuNode(null);
  };

  const handleCopyToClipboard = async () => {
    if (!activeMenuNode) return;
    const text = activeMenuNode.textContent || "";
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
    setIsOpen(false);
    setActiveMenuPos(-1);
    setActiveMenuNode(null);
  };

  const handleDelete = () => {
    if (!editor || !activeMenuNode || activeMenuPos < 0) return;
    editor
      .chain()
      .focus()
      .deleteRange({
        from: activeMenuPos,
        to: activeMenuPos + activeMenuNode.nodeSize,
      })
      .run();
    setIsOpen(false);
    setActiveMenuPos(-1);
    setActiveMenuNode(null);
  };

  const getNodeTypeName = () => {
    if (!activeMenuNode) return "paragraph";
    const type = activeMenuNode.type.name;
    if (type === "heading") return `heading ${activeMenuNode.attrs.level}`;
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
          className={`relative flex items-center transition-all duration-150 ${
            isLineEmpty ? "opacity-0 pointer-events-none" : "opacity-100"
          } ${isHoveredTable ? "translate-y-10" : "translate-y-0"}`}
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
