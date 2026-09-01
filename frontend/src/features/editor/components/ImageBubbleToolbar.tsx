import React from 'react';
import { Editor, BubbleMenu } from '@tiptap/react';
import {
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  BoundingBox,
  Trash,
  Sparkle,
} from '@phosphor-icons/react';

interface ImageBubbleToolbarProps {
  editor: Editor | null;
}

export const ImageBubbleToolbar: React.FC<ImageBubbleToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const currentAttrs = editor.getAttributes('image');
  const currentSize = currentAttrs.size || 'medium';
  const currentAlignment = currentAttrs.alignment || 'center';
  const hasOutline = currentAttrs.hasOutline !== false;
  const hasShadow = currentAttrs.hasShadow !== false;

  const updateImageAttr = (attrs: Record<string, unknown>) => {
    editor.chain().focus().updateAttributes('image', attrs).run();
  };

  const handleDeleteImage = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => ed.isActive('image')}
      tippyOptions={{ duration: 150, placement: 'top', offset: [0, 10] }}
    >
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-card/95 backdrop-blur-md border border-line shadow-xl text-xs">
        {/* Size Presets */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-line">
          <button
            type="button"
            onClick={() => updateImageAttr({ size: 'small' })}
            className={`px-2 py-1 rounded-lg font-mono font-semibold transition-colors ${
              currentSize === 'small'
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Ukuran Kecil (320px)"
          >
            S
          </button>
          <button
            type="button"
            onClick={() => updateImageAttr({ size: 'medium' })}
            className={`px-2 py-1 rounded-lg font-mono font-semibold transition-colors ${
              currentSize === 'medium'
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Ukuran Sedang (600px)"
          >
            M
          </button>
          <button
            type="button"
            onClick={() => updateImageAttr({ size: 'full' })}
            className={`px-2 py-1 rounded-lg font-mono font-semibold transition-colors ${
              currentSize === 'full'
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Lebar Penuh (100%)"
          >
            Full
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 px-1 border-r border-line">
          <button
            type="button"
            onClick={() => updateImageAttr({ alignment: 'left' })}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlignment === 'left'
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Rata Kiri"
          >
            <TextAlignLeft size={15} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => updateImageAttr({ alignment: 'center' })}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlignment === 'center'
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Rata Tengah"
          >
            <TextAlignCenter size={15} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => updateImageAttr({ alignment: 'right' })}
            className={`p-1.5 rounded-lg transition-colors ${
              currentAlignment === 'right'
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Rata Kanan"
          >
            <TextAlignRight size={15} weight="bold" />
          </button>
        </div>

        {/* Outline & Shadow Toggle */}
        <div className="flex items-center gap-0.5 px-1 border-r border-line">
          <button
            type="button"
            onClick={() => updateImageAttr({ hasOutline: !hasOutline })}
            className={`p-1.5 rounded-lg transition-colors ${
              hasOutline
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Toggle Garis Tepi (Outline)"
          >
            <BoundingBox size={15} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => updateImageAttr({ hasShadow: !hasShadow })}
            className={`p-1.5 rounded-lg transition-colors ${
              hasShadow
                ? 'bg-ink text-canvas'
                : 'text-ink-muted hover:text-ink hover:bg-muted'
            }`}
            title="Toggle Bayangan Halus"
          >
            <Sparkle size={15} weight="bold" />
          </button>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDeleteImage}
          className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
          title="Hapus Gambar"
        >
          <Trash size={15} weight="bold" />
        </button>
      </div>
    </BubbleMenu>
  );
};
