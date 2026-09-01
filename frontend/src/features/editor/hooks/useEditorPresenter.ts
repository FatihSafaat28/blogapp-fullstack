import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import { getEditorExtensions } from '../extensions/editorExtensions';
import { usePostDetailQuery, useEditorPublishMutation } from '../api/editorQueries';
import { postsApi } from '../../dashboard/posts/api/postsApi';
import { editorApi } from '../api/editorApi';
import { useAutoSave } from './useAutoSave';
import { useToast } from '../../../shared/components/ui/Toast/useToast';
import { useAuthStore } from '../../auth/stores/authStore';
import { AutoSavePayload } from '../types/editor.types';

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
  const contentHtmlRef = useRef<string>('');
  const contentJsonRef = useRef<unknown>(null);

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

  const autoSave = useAutoSave({ postId: post?.id });
  const publishMutation = useEditorPublishMutation();

  // Tiptap Instance
  const editor = useEditor({
    extensions: getEditorExtensions(),
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
                      showToast('Gambar berhasil disisipkan!', 'success');
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
      contentHtmlRef.current = html;
      contentJsonRef.current = ed.getJSON();

      if (isInitialHydratedRef.current) {
        autoSave.triggerAutoSave(
          buildCurrentPayload({ contentHtml: html, contentJson: ed.getJSON() })
        );
      }
    },
  });

  // Safe live payload builder
  const buildCurrentPayload = (overrides?: Partial<AutoSavePayload>): AutoSavePayload => {
    const liveHtml =
      overrides?.contentHtml ??
      (editor && !editor.isDestroyed ? editor.getHTML() : contentHtmlRef.current) ??
      post?.contentHtml ??
      '';
    const liveJson =
      overrides?.contentJson ??
      (editor && !editor.isDestroyed ? editor.getJSON() : contentJsonRef.current) ??
      post?.contentJson;

    return {
      title: overrides?.title !== undefined ? overrides.title : (title || 'Untitled Post'),
      slug: overrides?.slug !== undefined ? overrides.slug : (slug || undefined),
      coverImage: overrides?.coverImage !== undefined ? overrides.coverImage : coverImage,
      contentHtml: liveHtml,
      contentJson: liveJson,
      excerpt: overrides?.excerpt !== undefined ? overrides.excerpt : excerpt,
      tags: overrides?.tags !== undefined ? overrides.tags : tags,
    };
  };

  const safeTriggerAutoSave = (payload: AutoSavePayload) => {
    if (!isInitialHydratedRef.current) return;
    autoSave.triggerAutoSave(payload);
  };

  // Initial Data Hydration (Run only once when post and editor ready)
  useEffect(() => {
    if (post && !isInitialHydratedRef.current && editor) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setCoverImage(post.coverImage || null);
      setExcerpt(post.excerpt || null);
      setTags(post.postTags?.map((pt) => pt.tag.name) || []);

      if (post.contentHtml) {
        contentHtmlRef.current = post.contentHtml;
        contentJsonRef.current = post.contentJson;
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
    safeTriggerAutoSave(buildCurrentPayload({ title: newTitle }));
  };

  const handleSlugChange = (newSlug: string) => {
    const sanitized = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setSlug(sanitized);
    safeTriggerAutoSave(buildCurrentPayload({ slug: sanitized }));
  };

  const handleCoverChange = (url: string | null) => {
    setCoverImage(url);
    safeTriggerAutoSave(buildCurrentPayload({ coverImage: url }));
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    safeTriggerAutoSave(buildCurrentPayload({ tags: newTags }));
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    safeTriggerAutoSave(buildCurrentPayload({ excerpt: newExcerpt }));
  };

  const handleOpenPublishModal = () => setIsPublishModalOpen(true);
  const handleClosePublishModal = () => setIsPublishModalOpen(false);

  const handleConfirmPublish = async () => {
    if (!post?.id) return;
    await autoSave.flushAutoSave(buildCurrentPayload());
    try {
      await publishMutation.mutateAsync({ id: post.id, published: true });
      setIsPublishModalOpen(false);
    } catch {
      // Handled by query toast
    }
  };

  const handleUnpublish = async () => {
    if (!post?.id) return;
    await autoSave.flushAutoSave(buildCurrentPayload());
    try {
      await publishMutation.mutateAsync({ id: post.id, published: false });
      setIsPublishModalOpen(false);
    } catch {
      // Handled by query toast
    }
  };

  const handleExitEditor = async () => {
    await autoSave.flushAutoSave(buildCurrentPayload());
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
    autoSaveStatus: autoSave.status,
    lastSavedAt: autoSave.lastSavedAt,
    isSaving: autoSave.isSaving,
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
