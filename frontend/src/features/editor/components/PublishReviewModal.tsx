import React from 'react';
import { Modal } from '../../../shared/components/ui/Overlay/Modal';
import { Button } from '../../../shared/components/ui/Form/Button';
import { TagInput } from '../../../shared/components/ui/Form/TagInput';
import { Textarea } from '../../../shared/components/ui/Form/Textarea';
import { CoverImageUploader } from './CoverImageUploader';
import { SlugEditor } from './SlugEditor';
import { PaperPlaneTilt, Sparkle, ArrowCounterClockwise } from '@phosphor-icons/react';

interface PublishReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  isPublishing: boolean;
  title: string;
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
}

export const PublishReviewModal: React.FC<PublishReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing,
  title,
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
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAlreadyPublished ? 'Pengaturan & Perbarui Artikel' : 'Tinjau & Publikasikan Artikel'}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          {isAlreadyPublished ? (
            <Button
              variant="danger"
              size="sm"
              iconPrefix={<ArrowCounterClockwise size={15} />}
              onClick={onUnpublish}
              disabled={isPublishing}
            >
              Kembalikan ke Draf
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
              Kembali Mengedit
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconPrefix={<PaperPlaneTilt size={16} weight="bold" />}
              onClick={onConfirmPublish}
              isLoading={isPublishing}
            >
              {isAlreadyPublished ? 'Simpan Perubahan' : 'Konfirmasi & Terbitkan Sekarang'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Banner Info */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/60 border border-line-subtle text-xs text-ink-muted">
          <Sparkle size={18} weight="fill" className="text-brand shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Periksa kembali sampul, topik, dan ringkasan sebelum artikel ditampilkan di blog publikmu (
            <span className="font-mono text-ink font-semibold">avianblog.com/@{username}</span>).
          </p>
        </div>

        {/* 1. Article Title Headline */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted font-semibold">
            Judul Publikasi
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-ink tracking-tight mt-1">
            {title || 'Untitled Post'}
          </h3>
        </div>

        {/* 2. Cover Image Upload */}
        <CoverImageUploader
          coverImage={coverImage}
          onCoverChange={onCoverChange}
        />

        {/* 3. Custom Slug URL */}
        <SlugEditor
          slug={slug}
          username={username}
          onSlugChange={onSlugChange}
        />

        {/* 4. Tags Selector */}
        <TagInput
          label="Topik / Tag Artikel"
          tags={tags}
          onChange={onTagsChange}
          maxTags={5}
          placeholder="Ketik topik lalu tekan Enter..."
          helperText="Tambahkan 1 - 5 tag topik untuk mempermudah pembaca menemukan karyamu."
        />

        {/* 5. Excerpt / Ringkasan Deskripsi */}
        <Textarea
          label="Ringkasan / Excerpt SEO"
          value={excerpt || ''}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Tuliskan 1 - 2 kalimat ringkasan yang menarik minat pembaca..."
          rows={3}
          maxLength={160}
          helperText={`${excerpt?.length || 0}/160 karakter.`}
        />
      </div>
    </Modal>
  );
};
