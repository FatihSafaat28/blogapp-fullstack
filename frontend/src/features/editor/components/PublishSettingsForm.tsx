import React from 'react';
import { Input } from '../../../shared/components/ui/Form/Input';
import { Textarea } from '../../../shared/components/ui/Form/Textarea';
import { TagInput } from '../../../shared/components/ui/Form/TagInput';
import { SlugEditor } from './SlugEditor';

interface PublishSettingsFormProps {
  title: string;
  onTitleChange: (val: string) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  username: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  excerpt: string | null;
  onExcerptChange: (excerpt: string) => void;
}

export const PublishSettingsForm: React.FC<PublishSettingsFormProps> = ({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  username,
  tags,
  onTagsChange,
  excerpt,
  onExcerptChange,
}) => {
  const isTitleTooShort = title.trim().length > 0 && title.trim().length < 3;

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Editable Title Input */}
      <Input
        label="Judul Tulisan"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Tuliskan judul tulisanmu..."
        error={isTitleTooShort ? 'Judul minimal 3 karakter untuk diterbitkan.' : undefined}
        helperText={
          title.trim().length === 0
            ? 'Judul wajib diisi (minimal 3 karakter).'
            : `${title.length} karakter.`
        }
      />

      {/* 2. Unified Custom Slug URL with Prefix */}
      <SlugEditor
        slug={slug}
        username={username}
        onSlugChange={onSlugChange}
      />

      {/* 3. Topic Tags Selector */}
      <TagInput
        label="Topik Tulisan"
        tags={tags}
        onChange={onTagsChange}
        maxTags={5}
        placeholder="Ketik topik (misal: teknologi, cerpen) lalu tekan Enter..."
        helperText="Pilih 1 - 5 topik untuk mempermudah pembaca menemukan karyamu."
      />

      {/* 4. Friendly SEO Excerpt */}
      <Textarea
        label="Ringkasan Singkat (Opsional)"
        value={excerpt || ''}
        onChange={(e) => onExcerptChange(e.target.value)}
        placeholder="Tuliskan 1 - 2 kalimat singkat tentang inti tulisanmu agar pembaca penasaran..."
        rows={3}
        maxLength={160}
        helperText={`${excerpt?.length || 0}/160 karakter · Berguna sebagai cuplikan saat artikel dibagikan.`}
      />
    </div>
  );
};
