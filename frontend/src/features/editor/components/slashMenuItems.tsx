import React from 'react';
import { Editor } from '@tiptap/react';
import {
  TextT,
  ListBullets,
  ListNumbers,
  CheckSquare,
  Quotes,
  CodeBlock as CodeBlockIcon,
} from '@phosphor-icons/react';

export interface SlashItem {
  id: string;
  title: string;
  group: 'Style' | 'Lists' | 'Blocks';
  icon: React.ReactNode;
  action: (editor: Editor) => void;
}

export const SLASH_ITEMS: SlashItem[] = [
  {
    id: 'text',
    title: 'Text',
    group: 'Style',
    icon: <TextT size={16} className="text-brand" />,
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: 'heading-1',
    title: 'Heading 1',
    group: 'Style',
    icon: <span className="font-serif font-bold text-xs w-4 text-center">H1</span>,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: 'heading-2',
    title: 'Heading 2',
    group: 'Style',
    icon: <span className="font-serif font-bold text-xs w-4 text-center">H2</span>,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: 'heading-3',
    title: 'Heading 3',
    group: 'Style',
    icon: <span className="font-serif font-bold text-xs w-4 text-center">H3</span>,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    id: 'bullet-list',
    title: 'Bullet List',
    group: 'Lists',
    icon: <ListBullets size={16} />,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'numbered-list',
    title: 'Numbered List',
    group: 'Lists',
    icon: <ListNumbers size={16} />,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: 'task-list',
    title: 'To-do list',
    group: 'Lists',
    icon: <CheckSquare size={16} />,
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    id: 'blockquote',
    title: 'Blockquote',
    group: 'Blocks',
    icon: <Quotes size={16} />,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'code-block',
    title: 'Code Block',
    group: 'Blocks',
    icon: <CodeBlockIcon size={16} />,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
];
