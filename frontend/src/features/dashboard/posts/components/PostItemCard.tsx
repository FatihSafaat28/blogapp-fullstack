import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PostListItem } from '../types/post.types';
import { Badge } from '../../../../shared/components/ui/Display/Badge';
import { Dropdown } from '../../../../shared/components/ui/Overlay/Dropdown';
import {
  DotsThreeVertical,
  PencilSimple,
  ArrowSquareOut,
  ArrowsClockwise,
  Copy,
  Trash,
  Clock,
  Eye,
  Article,
} from '@phosphor-icons/react';

interface PostItemCardProps {
  post: PostListItem;
  username: string;
  onTogglePublish: (post: PostListItem) => void;
  onDelete: (post: PostListItem) => void;
  onCopyLink: (post: PostListItem) => void;
}

export const PostItemCard: React.FC<PostItemCardProps> = ({
  post,
  username,
  onTogglePublish,
  onDelete,
  onCopyLink,
}) => {
  const navigate = useNavigate();

  const formattedDate = new Date(post.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const menuItems = [
    {
      id: 'edit',
      label: 'Edit Tulisan',
      icon: <PencilSimple size={15} />,
      onClick: () => navigate(`/editor/${post.id}`),
    },
    ...(post.published
      ? [
          {
            id: 'view',
            label: 'Lihat di Blog Publik',
            icon: <ArrowSquareOut size={15} />,
            onClick: () => window.open(`/@${username}/${post.slug}`, '_blank'),
          },
        ]
      : []),
    {
      id: 'toggle-publish',
      label: post.published ? 'Kembalikan ke Draf' : 'Terbitkan Sekarang',
      icon: <ArrowsClockwise size={15} />,
      onClick: () => onTogglePublish(post),
    },
    {
      id: 'copy-link',
      label: 'Salin Tautan Publik',
      icon: <Copy size={15} />,
      onClick: () => onCopyLink(post),
    },
    {
      id: 'delete',
      label: 'Hapus Artikel',
      icon: <Trash size={15} />,
      isDanger: true,
      onClick: () => onDelete(post),
    },
  ];

  return (
    <div className="group relative flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-card border border-line hover:border-line-subtle transition-all duration-200 shadow-xs hover:shadow-sm">
      {/* Cover Image Thumbnail / Fallback Graphic */}
      <Link
        to={`/editor/${post.id}`}
        className="shrink-0 w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-muted/60 border border-line flex items-center justify-center relative group-hover:opacity-95 transition-opacity"
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-ink-muted">
            <Article size={28} weight="duotone" className="text-ink-muted/70" />
            <span className="text-[11px] font-mono">Tanpa Sampul</span>
          </div>
        )}

        <div className="absolute top-2 left-2 sm:hidden">
          <Badge variant={post.published ? 'published' : 'draft'}>
            {post.published ? 'Terbit' : 'Draf'}
          </Badge>
        </div>
      </Link>

      {/* Post Metadata & Excerpt */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Top Line: Badge & Actions */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant={post.published ? 'published' : 'draft'}>
                {post.published ? 'Terbit' : 'Draf'}
              </Badge>
              {post.postTags && post.postTags.length > 0 && (
                <span className="text-xs font-mono text-ink-muted truncate max-w-[200px]">
                  #{post.postTags.map((pt) => pt.tag.name).join(' #')}
                </span>
              )}
            </div>

            <Dropdown
              trigger={
                <button
                  type="button"
                  aria-label="Menu opsi artikel"
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-muted/70 transition-colors"
                >
                  <DotsThreeVertical size={18} weight="bold" />
                </button>
              }
              items={menuItems}
            />
          </div>

          {/* Title */}
          <Link to={`/editor/${post.id}`} className="block group/title">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-ink group-hover/title:text-brand transition-colors tracking-tight line-clamp-1 mb-1.5">
              {post.title || 'Untitled Post'}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 leading-relaxed mb-3">
            {post.excerpt || 'Belum ada ringkasan teks untuk artikel ini.'}
          </p>
        </div>

        {/* Bottom Footer: Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-line-subtle text-[11px] sm:text-xs font-mono text-ink-muted">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {post.readingTimeMinutes} min baca
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={13} /> {post.viewCount} pembaca
            </span>
          </div>
          <span>Diperbarui {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};
