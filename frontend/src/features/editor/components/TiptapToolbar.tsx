import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  Code,
  CodeBlock as CodeBlockIcon,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
  Quotes,
  Image as ImageIcon,
} from '@phosphor-icons/react';
import { HeadingDropdown } from './HeadingDropdown';
import { ListDropdown } from './ListDropdown';
import { LinkPopover } from './LinkPopover';
import { HighlightPopover } from './HighlightPopover';
import { SearchReplacePopover } from './SearchReplacePopover';
import { ThemeToggle } from '../../../shared/components/ui/Theme/ThemeToggle';

interface TiptapToolbarProps {
  editor: Editor | null;
  onUploadImage: (file: File) => void;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor, onUploadImage }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [, setTick] = useState(0);

  // Subscribe to editor transactions for reactive state
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setTick((t) => t + 1);
    editor.on('transaction', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('transaction', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="sticky top-16 z-20 w-full bg-card/90 backdrop-blur-md border-b border-line px-4 py-2 shadow-2xs overflow-visible transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* CENTERED EDITING TOOLS CLUSTER */}
        <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-0.5">
          {/* 1. History (Undo / Redo) */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Batalkan (Undo)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowCounterClockwise size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Ulangi (Redo)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowClockwise size={16} weight="bold" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-line mx-1" />

          {/* 2. Heading Structure Dropdown [ H ˅ ] (H1-H3 Editorial Scale) */}
          <HeadingDropdown editor={editor} />

          {/* 3. List Structure Dropdown [ :≡ ˅ ] */}
          <ListDropdown editor={editor} />

          {/* 4. Blockquote */}
          <button
            type="button"
            aria-label="Kutipan (Quote)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive('blockquote')
                ? 'bg-ink text-canvas font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
          >
            <Quotes size={16} weight="bold" />
          </button>

          {/* 5. Code Block */}
          <button
            type="button"
            aria-label="Blok Kode"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor.isActive('codeBlock')
                ? 'bg-ink text-canvas font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
          >
            <CodeBlockIcon size={16} weight="bold" />
          </button>

          <div className="w-[1px] h-5 bg-line mx-1" />

          {/* 6. Inline Character Formatting: B, I, S, <>, U, Highlight, Link */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Tebal (Bold)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('bold')
                  ? 'bg-ink text-canvas font-bold'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextB size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Miring (Italic)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('italic')
                  ? 'bg-ink text-canvas font-bold'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextItalic size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Coret (Strikethrough)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('strike')
                  ? 'bg-ink text-canvas font-bold'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextStrikethrough size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Kode Inline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('code')
                  ? 'bg-ink text-canvas font-bold'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <Code size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Garis Bawah (Underline)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('underline')
                  ? 'bg-ink text-canvas font-bold'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextUnderline size={16} weight="bold" />
            </button>

            {/* Color Highlight Palette Popover */}
            <HighlightPopover editor={editor} />

            {/* Link Popover */}
            <LinkPopover editor={editor} />
          </div>

          <div className="w-[1px] h-5 bg-line mx-1" />

          {/* 7. Text Alignment */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Rata Kiri"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive({ textAlign: 'left' })
                  ? 'bg-ink text-canvas'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextAlignLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Rata Tengah"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive({ textAlign: 'center' })
                  ? 'bg-ink text-canvas'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextAlignCenter size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Rata Kanan"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive({ textAlign: 'right' })
                  ? 'bg-ink text-canvas'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextAlignRight size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Rata Kanan-Kiri"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive({ textAlign: 'justify' })
                  ? 'bg-ink text-canvas'
                  : 'text-ink-muted hover:text-ink hover:bg-muted'
              }`}
            >
              <TextAlignJustify size={16} weight="bold" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-line mx-1" />

          {/* 8. Media / Image */}
          <button
            type="button"
            aria-label="Sisipkan Gambar"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink-muted hover:text-ink hover:bg-muted transition-colors cursor-pointer"
          >
            <ImageIcon size={16} weight="bold" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* RIGHT SIDE TOOLS: Search & Replace + Theme Toggle */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-line/60">
          <SearchReplacePopover editor={editor} />
          <div className="w-[1px] h-5 bg-line mx-0.5" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
