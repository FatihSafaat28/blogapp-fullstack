import React from 'react';
import { Drawer } from '../../../shared/components/ui/Overlay/Drawer';
import { TagInput } from '../../../shared/components/ui/Form/TagInput';
import { Textarea } from '../../../shared/components/ui/Form/Textarea';
import { Button } from '../../../shared/components/ui/Form/Button';
import { CoverImageUploader } from './CoverImageUploader';
import { SlugEditor } from './SlugEditor';
import { Check } from '@phosphor-icons/react';

interface PostSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  coverImage: string | null;
  onCoverChange: (url: string | null) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  username: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  excerpt: string | null;
  onExcerptChange: (excerpt: string) => void;
  autoSaveStatus: string;
}

export const PostSettingsDrawer: React.FC<PostSettingsDrawerProps> = ({
  isOpen,
  onClose,
  coverImage,
  onCoverChange,
  slug,
  onSlugChange,
  username,
  tags,
  onTagsChange,
  excerpt,
  onExcerptChange,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Publikasi"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-6 p-6">
        {/* 1. Cover Image */}
        <CoverImageUploader
          coverImage={coverImage}
          onCoverChange={onCoverChange}
        />

        {/* 2. Custom URL Slug */}
        <SlugEditor
          slug={slug}
          username={username}
          onSlugChange={onSlugChange}
        />

        {/* 3. Tag / Topic Selector */}
        <div className="flex flex-col gap-1.5">
          <TagInput
            label="Topik & Tag Artikel"
            tags={tags}
            onChange={onTagsChange}
            maxTags={5}
            placeholder="Ketik topik & tekan Enter..."
            helperText="Maksimal 5 tag untuk membantu pembaca menemukan tulisanmu."
          />
        </div>

        {/* 4. Excerpt SEO Description */}
        <div className="flex flex-col gap-1.5">
          <Textarea
            label="Ringkasan / Excerpt Artikel"
            value={excerpt || ''}
            onChange={(e) => onExcerptChange(e.target.value)}
            placeholder="Tulis ringkasan singkat untuk kartu media sosial dan hasil pencarian..."
            rows={3}
            maxLength={160}
            helperText={`${excerpt?.length || 0}/160 karakter.`}
          />
        </div>

        {/* 5. Close Button */}
        <div className="pt-4 border-t border-line">
          <Button
            variant="primary"
            size="md"
            fullWidth
            iconPrefix={<Check size={16} weight="bold" />}
            onClick={onClose}
          >
            Selesai Mengatur
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
