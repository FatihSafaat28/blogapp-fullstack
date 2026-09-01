import React from 'react';
import { useEditorPresenter } from '../hooks/useEditorPresenter';
import { EditorHeader } from '../components/EditorHeader';
import { TiptapEditorCore } from '../components/TiptapEditorCore';
import { PostSettingsDrawer } from '../components/PostSettingsDrawer';
import { PublishReviewModal } from '../components/PublishReviewModal';
import { Spinner } from '../../../shared/components/ui/Feedback/Spinner';

export const EditorPage: React.FC = () => {
  const {
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
    isLoading,
    autoSaveStatus,
    isPublishing,
    post,
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
  } = useEditorPresenter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center gap-3 text-ink-muted">
        <Spinner size="lg" color="primary" />
        <span className="text-xs font-mono">Menyiapkan workspace editor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col transition-colors selection:bg-brand/20 selection:text-ink animate-fadeIn">
      {/* 1. Distraction-Free Header */}
      <EditorHeader
        autoSaveStatus={autoSaveStatus}
        isPublished={post?.published || false}
        wordCount={wordCount}
        readingTime={readingTime}
        isPublishing={isPublishing}
        onExit={handleExitEditor}
        onOpenPublishModal={handleOpenPublishModal}
      />

      {/* 2. Main Writing Surface with Left-Right Boundary Guides */}
      <main className="flex-1 w-full">
        <TiptapEditorCore
          editor={editor}
          title={title}
          onTitleChange={handleTitleChange}
          onUploadImage={handleInsertImage}
        />
      </main>

      {/* 3. Pre-Publish Review Modal (Substack Style Checklist) */}
      <PublishReviewModal
        isOpen={isPublishModalOpen}
        onClose={handleClosePublishModal}
        onConfirmPublish={handleConfirmPublish}
        isPublishing={isPublishing}
        title={title}
        onTitleChange={handleTitleChange}
        coverImage={coverImage}
        onCoverChange={handleCoverChange}
        slug={slug}
        onSlugChange={handleSlugChange}
        username={user?.username || ''}
        tags={tags}
        onTagsChange={handleTagsChange}
        excerpt={excerpt}
        onExcerptChange={handleExcerptChange}
        isAlreadyPublished={post?.published || false}
        onUnpublish={handleUnpublish}
        authorName={user?.fullName || user?.username || 'Penulis'}
        authorAvatar={user?.avatar || null}
        readingTime={readingTime}
      />

      {/* 4. Sliding Publication Settings Drawer */}
      <PostSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        coverImage={coverImage}
        onCoverChange={handleCoverChange}
        slug={slug}
        onSlugChange={handleSlugChange}
        username={user?.username || ''}
        tags={tags}
        onTagsChange={handleTagsChange}
        excerpt={excerpt}
        onExcerptChange={handleExcerptChange}
        autoSaveStatus={autoSaveStatus}
      />
    </div>
  );
};
