import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { CustomImage } from './CustomImage';

export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  CustomImage.configure({
    allowBase64: false,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: 'text-brand underline underline-offset-4' },
  }),
  Placeholder.configure({
    placeholder: 'Mulai tuangkan cerita, ide, atau gagasan berhargamu di sini...',
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: 'task-list-group',
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: 'task-list-item',
    },
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];
