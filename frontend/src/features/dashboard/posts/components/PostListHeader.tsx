import React from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { WritePostButton } from '../../../../shared/components/common/WritePostButton';

interface PostListHeaderProps {
  totalPosts: number;
}

export const PostListHeader: React.FC<PostListHeaderProps> = ({ totalPosts }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight">
            Semua Tulisan
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-muted text-ink-muted border border-line-subtle">
            <Sparkle size={12} weight="fill" className="text-brand" /> {totalPosts} artikel
          </span>
        </div>
        <p className="text-xs sm:text-sm text-ink-muted">
          Kelola, terbitkan, dan pantau performa seluruh karya tulismu dari satu tempat.
        </p>
      </div>

      <WritePostButton size="md" iconType="pencil">
        Tulis Cerita Baru
      </WritePostButton>
    </div>
  );
};
