import React from 'react';
import { Modal } from '../../../shared/components/ui/Overlay/Modal';
import { Button } from '../../../shared/components/ui/Form/Button';
import { PublishCardPreview } from './PublishCardPreview';
import { PublishSettingsForm } from './PublishSettingsForm';
import { PaperPlaneTilt, ArrowCounterClockwise } from '@phosphor-icons/react';

interface PublishReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  isPublishing: boolean;
  title: string;
  onTitleChange: (val: string) => void;
  coverImage: string | null;
  onCoverChange: (url: string | null) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  username: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  excerpt: string | null;
  onExcerptChange: (excerpt: string) => void;
  isAlreadyPublished: boolean;
  onUnpublish: () => void;
  authorName?: string;
  authorAvatar?: string | null;
  readingTime?: number;
}

export const PublishReviewModal: React.FC<PublishReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing,
  title,
  onTitleChange,
  coverImage,
  onCoverChange,
  slug,
  onSlugChange,
  username,
  tags,
  onTagsChange,
  excerpt,
  onExcerptChange,
  isAlreadyPublished,
  onUnpublish,
  authorName,
  authorAvatar,
  readingTime = 1,
}) => {
  const canPublish = title.trim().length >= 3;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAlreadyPublished ? 'Perbarui Detail Artikel' : 'Siap Menerbitkan Karyamu?'}
      maxWidth="max-w-4xl lg:max-w-5xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          {isAlreadyPublished ? (
            <Button
              variant="outline"
              size="sm"
              iconPrefix={<ArrowCounterClockwise size={15} />}
              onClick={onUnpublish}
              disabled={isPublishing}
            >
              Tarik ke Draf
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isPublishing}
            >
              Kembali Menulis
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconPrefix={<PaperPlaneTilt size={16} weight="bold" />}
              onClick={onConfirmPublish}
              isLoading={isPublishing}
              disabled={!canPublish || isPublishing}
            >
              {isAlreadyPublished ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Visual Live Card Preview with Direct Cover Upload (5 Columns) */}
        <div className="w-full lg:col-span-5 lg:sticky lg:top-0">
          <PublishCardPreview
            title={title}
            excerpt={excerpt}
            coverImage={coverImage}
            onCoverChange={onCoverChange}
            tags={tags}
            authorName={authorName || username || 'Penulis'}
            authorAvatar={authorAvatar || null}
            readingTime={readingTime}
          />
        </div>

        {/* Right Column: Structured Metadata Controls (7 Columns) */}
        <div className="w-full lg:col-span-7">
          <PublishSettingsForm
            title={title}
            onTitleChange={onTitleChange}
            slug={slug}
            onSlugChange={onSlugChange}
            username={username}
            tags={tags}
            onTagsChange={onTagsChange}
            excerpt={excerpt}
            onExcerptChange={onExcerptChange}
          />
        </div>
      </div>
    </Modal>
  );
};
