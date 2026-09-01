import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { usePostDetailQuery, useEditorPublishMutation } from '../api/editorQueries';
import { postsApi } from '../../dashboard/posts/api/postsApi';
import { editorApi } from '../api/editorApi';
import { useAutoSave } from './useAutoSave';
import { useToast } from '../../../shared/components/ui/Toast/useToast';
import { useAuthStore } from '../../auth/stores/authStore';

// Extended Custom Image Extension with word-like alignment and size controls
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'medium',
        parseHTML: (element) => {
          if (element.classList.contains('img-size-small')) return 'small';
          if (element.classList.contains('img-size-full')) return 'full';
          return 'medium';
        },
        renderHTML: (attributes) => ({
          class: `img-size-${attributes.size || 'medium'} img-align-${
            attributes.alignment || 'center'
          } ${attributes.hasOutline !== false ? 'img-outline' : ''} ${
            attributes.hasShadow !== false ? 'img-shadow' : ''
          }`,
        }),
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => {
          if (element.classList.contains('img-align-left')) return 'left';
          if (element.classList.contains('img-align-right')) return 'right';
          return 'center';
        },
      },
      hasOutline: {
        default: true,
      },
      hasShadow: {
        default: true,
      },
    };
  },
});

export const useEditorPresenter = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [excerpt, setExcerpt] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const isInitialHydratedRef = useRef(false);
  const isCreatingNewDraftRef = useRef(false);

  // If landing on /editor/new, automatically initialize draft and replace URL
  useEffect(() => {
    if (id === 'new' && !isCreatingNewDraftRef.current) {
      isCreatingNewDraftRef.current = true;
      postsApi
        .createDraftPost('Untitled Post')
        .then((res) => {
          if (res?.data?.post?.id) {
            navigate(`/editor/${res.data.post.id}`, { replace: true });
          }
        })
        .catch(() => {
          showToast('Gagal membuat draf baru.', 'error');
          navigate('/dashboard/posts');
        });
    }
  }, [id, navigate, showToast]);

  const { data: postData, isLoading: isPostLoading } = usePostDetailQuery(id);
  const post = postData?.data?.post;

  const { status: autoSaveStatus, lastSavedAt, triggerAutoSave, flushAutoSave, isSaving } =
    useAutoSave({ postId: post?.id });

  const publishMutation = useEditorPublishMutation();

  // Helper to build payload
  const buildCurrentPayload = useCallback(
    (currentHtml?: string) => ({
      title: title || 'Untitled Post',
      slug: slug || undefined,
      coverImage,
      contentHtml: currentHtml ?? editor?.getHTML() ?? '',
      contentJson: editor?.getJSON(),
      excerpt,
      tags,
    }),
    [title, slug, coverImage, excerpt, tags]
  );

  // Tiptap Instance
  const editor = useEditor({
    extensions: [
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
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose-reader focus:outline-none min-h-[400px] text-ink leading-relaxed px-4 sm:px-16 py-4',
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              const file = items[i].getAsFile();
              if (file) {
                event.preventDefault();
                editorApi
                  .uploadImage(file)
                  .then((res) => {
                    if (res?.data?.url) {
                      editor?.chain().focus().setImage({ src: res.data.url }).run();
                      showToast('Gambar berhasil diunggah dan disisipkan!', 'success');
                    }
                  })
                  .catch(() => {
                    showToast('Gagal mengunggah gambar dari clipboard.', 'error');
                  });
                return true;
              }
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      const text = ed.getText().trim();
      const words = text ? text.split(/\s+/).length : 0;
      setWordCount(words);

      if (isInitialHydratedRef.current) {
        triggerAutoSave(buildCurrentPayload(html));
      }
    },
  });

  // Initial Data Hydration (Run only once)
  useEffect(() => {
    if (post && !isInitialHydratedRef.current && editor) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setCoverImage(post.coverImage || null);
      setExcerpt(post.excerpt || null);
      setTags(post.postTags?.map((pt) => pt.tag.name) || []);

      if (post.contentHtml) {
        editor.commands.setContent(post.contentHtml);
        const text = editor.getText().trim();
        setWordCount(text ? text.split(/\s+/).length : 0);
      }

      isInitialHydratedRef.current = true;
    }
  }, [post, editor]);

  // Clean unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Handlers
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    triggerAutoSave({ ...buildCurrentPayload(), title: newTitle });
  };

  const handleSlugChange = (newSlug: string) => {
    const sanitized = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setSlug(sanitized);
    triggerAutoSave({ ...buildCurrentPayload(), slug: sanitized });
  };

  const handleCoverChange = (url: string | null) => {
    setCoverImage(url);
    triggerAutoSave({ ...buildCurrentPayload(), coverImage: url });
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    triggerAutoSave({ ...buildCurrentPayload(), tags: newTags });
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    triggerAutoSave({ ...buildCurrentPayload(), excerpt: newExcerpt });
  };

  const handleOpenPublishModal = () => {
    setIsPublishModalOpen(true);
  };

  const handleClosePublishModal = () => {
    setIsPublishModalOpen(false);
  };

  const handleConfirmPublish = async () => {
    if (!post?.id) return;
    await flushAutoSave(buildCurrentPayload());
    try {
      await publishMutation.mutateAsync({ id: post.id, published: true });
      setIsPublishModalOpen(false);
    } catch {
      // Handled by toast
    }
  };

  const handleUnpublish = async () => {
    if (!post?.id) return;
    await flushAutoSave(buildCurrentPayload());
    try {
      await publishMutation.mutateAsync({ id: post.id, published: false });
      setIsPublishModalOpen(false);
    } catch {
      // Handled by toast
    }
  };

  const handleExitEditor = async () => {
    await flushAutoSave(buildCurrentPayload());
    navigate('/dashboard/posts');
  };

  const handleInsertImage = async (file: File) => {
    try {
      const res = await editorApi.uploadImage(file);
      if (res?.data?.url && editor) {
        editor.chain().focus().setImage({ src: res.data.url }).run();
        showToast('Gambar berhasil disisipkan.', 'success');
      }
    } catch {
      showToast('Gagal mengunggah gambar.', 'error');
    }
  };

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: post?.id,
    post,
    user,
    editor,
    title,
    slug,
    coverImage,
    tags,
    excerpt,
    wordCount,
    readingTime,
    isSettingsOpen,
    setIsSettingsOpen,
    isPublishModalOpen,
    isLoading: isPostLoading || !isInitialHydratedRef.current,
    autoSaveStatus,
    lastSavedAt,
    isSaving,
    isPublishing: publishMutation.isPending,
    handleTitleChange,
    handleSlugChange,
    handleCoverChange,
    handleTagsChange,
    handleExcerptChange,
    handleOpenPublishModal,
    handleClosePublishModal,
    handleConfirmPublish,
    handleUnpublish,
    handleExitEditor,
    handleInsertImage,
  };
};
