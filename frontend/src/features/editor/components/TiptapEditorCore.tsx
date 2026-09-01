import React, { useRef, useEffect } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { TiptapToolbar } from './TiptapToolbar';
import { DragContextMenu } from './DragContextMenu';
import { SlashDropdownMenu } from './SlashDropdownMenu';
import { ImageBubbleToolbar } from './ImageBubbleToolbar';
import { TableNodeController } from './table/TableNodeController';

interface TiptapEditorCoreProps {
  editor: Editor | null;
  title: string;
  onTitleChange: (title: string) => void;
  onUploadImage: (file: File) => void;
}

export const TiptapEditorCore: React.FC<TiptapEditorCoreProps> = ({
  editor,
  title,
  onTitleChange,
  onUploadImage,
}) => {
  const titleTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto resize textarea height based on title length
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] bg-canvas flex flex-col items-center transition-colors pb-24">
      {/* 1. Fixed Top Control Toolbar (Tiptap Simple Editor Standard) */}
      <TiptapToolbar editor={editor} onUploadImage={onUploadImage} />

      {/* 2. Drag Handle & Context Menu for Block Operations */}
      <DragContextMenu editor={editor} />

      {/* 3. Slash Command Palette Dropdown Menu */}
      <SlashDropdownMenu editor={editor} />

      {/* 3. Floating Image Controller Bubble Menu */}
      <ImageBubbleToolbar editor={editor} />

      {/* 3.5 Tiptap Interactive Table Node Controller Suite */}
      <TableNodeController editor={editor} />

      {/* 4. Paper Sheet Document Container (Expanded with generous ProseMirror padding) */}
      <div className="w-full max-w-5xl my-8 bg-card rounded-2xl border border-line shadow-sm px-3 sm:px-6 py-10 sm:py-16 min-h-[90vh] flex flex-col transition-colors">
        {/* Auto-Resizing Headline Title (Matches ProseMirror px-4 sm:px-16) */}
        <div className="mb-8 pb-4 border-b border-line-subtle px-4 sm:px-16">
          <textarea
            ref={titleTextareaRef}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Judul Artikel..."
            rows={1}
            className="w-full font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-ink placeholder:text-ink-muted/30 bg-transparent border-none outline-none resize-none leading-tight tracking-tight focus:ring-0 p-0"
          />
        </div>

        {/* Tiptap Core Editor Content */}
        <div className="flex-1 min-h-[500px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
