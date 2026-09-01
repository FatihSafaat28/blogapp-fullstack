import React from 'react';
import { Input } from '../../../shared/components/ui/Form/Input';
import { LinkSimple } from '@phosphor-icons/react';

interface SlugEditorProps {
  slug: string;
  username: string;
  onSlugChange: (slug: string) => void;
}

export const SlugEditor: React.FC<SlugEditorProps> = ({ slug, username, onSlugChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        label="URL Slug Kustom"
        value={slug}
        onChange={(e) => onSlugChange(e.target.value)}
        placeholder="judul-artikel-kustom"
        iconPrefix={<LinkSimple size={16} className="text-ink-muted" />}
        helperText="Gunakan huruf kecil, angka, dan tanda hubung (-)."
      />

      {/* Live URL Preview */}
      <div className="p-2.5 rounded-xl bg-muted/50 border border-line-subtle text-[11px] font-mono text-ink-muted break-all">
        <span className="text-ink-muted/70">Tautan: </span>
        <span className="text-ink font-semibold">
          avianblog.com/@{username}/{slug || 'judul-artikel'}
        </span>
      </div>
    </div>
  );
};
