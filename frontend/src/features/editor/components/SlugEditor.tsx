import React, { useId } from 'react';
import { LinkSimple } from '@phosphor-icons/react';

interface SlugEditorProps {
  slug: string;
  username: string;
  onSlugChange: (slug: string) => void;
}

export const SlugEditor: React.FC<SlugEditorProps> = ({
  slug,
  username,
  onSlugChange,
}) => {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
      >
        Tautan Publik Artikel
      </label>

      {/* Integrated Prefix + Slug Input Field */}
      <div className="relative flex items-center w-full">
        <span className="h-10 sm:h-11 px-3 inline-flex items-center text-xs font-mono text-ink-muted bg-muted border-y border-l border-line rounded-l-xl select-none shrink-0 truncate max-w-[60%] sm:max-w-none">
          <LinkSimple size={14} className="mr-1.5 text-ink-muted shrink-0" />
          avianblog.com/@{username}/
        </span>
        <input
          id={inputId}
          name="articleSlug"
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="judul-artikel-kustom"
          className="input-editorial h-10 sm:h-11 px-3 rounded-r-xl font-mono text-xs text-ink flex-1 min-w-0"
        />
      </div>

      <span className="text-[11px] font-mono text-ink-muted">
        Gunakan huruf kecil, angka, dan tanda hubung (-).
      </span>
    </div>
  );
};
