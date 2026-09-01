import React, { useState, useRef } from 'react';
import { Avatar } from '../../../shared/components/ui/Display/Avatar';
import { Badge } from '../../../shared/components/ui/Display/Badge';
import {
  Clock,
  Camera,
  Trash,
  CircleNotch,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import { editorApi } from '../api/editorApi';
import { useToast } from '../../../shared/components/ui/Toast/useToast';

interface PublishCardPreviewProps {
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  onCoverChange: (url: string | null) => void;
  tags: string[];
  authorName: string;
  authorAvatar: string | null;
  readingTime: number;
}

export const PublishCardPreview: React.FC<PublishCardPreviewProps> = ({
  title,
  excerpt,
  coverImage,
  onCoverChange,
  tags,
  authorName,
  authorAvatar,
  readingTime,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Format berkas harus berupa gambar (JPG, PNG, WebP).', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5MB.', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      const res = await editorApi.uploadImage(file);
      if (res?.data?.url) {
        onCoverChange(res.data.url);
        showToast('Gambar sampul berhasil diperbarui!', 'success');
      }
    } catch {
      showToast('Gagal mengunggah gambar sampul.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hidden File Input for Direct Upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        aria-label="Pilih berkas gambar sampul"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />

      {/* Editorial Card Component */}
      <div className="rounded-2xl bg-card border border-line shadow-xs overflow-hidden flex flex-col transition-colors">
        {/* Interactive Cover Image Dropzone / Preview */}
        {coverImage ? (
          <div className="w-full aspect-video bg-muted relative overflow-hidden group">
            <img
              src={coverImage}
              alt={title || 'Sampul artikel'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/90 hover:bg-card text-ink text-xs font-medium backdrop-blur-sm shadow-xs transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Ganti gambar sampul"
                disabled={isUploading}
              >
                <ArrowsClockwise size={14} weight="bold" />
                Ganti Sampul
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/90 hover:bg-danger text-white text-xs font-medium backdrop-blur-sm shadow-xs transition-colors cursor-pointer"
                onClick={() => onCoverChange(null)}
                aria-label="Hapus gambar sampul"
                disabled={isUploading}
              >
                <Trash size={14} weight="bold" />
                Hapus
              </button>
            </div>

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white text-xs font-mono">
                <CircleNotch size={24} className="animate-spin text-white" />
                <span>Mengompresi ke WebP...</span>
              </div>
            )}
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label="Unggah gambar sampul artikel"
            className={`w-full aspect-video flex flex-col items-center justify-center gap-2 border-b border-line-subtle transition-all cursor-pointer select-none p-4 text-center group ${
              isDragging
                ? 'bg-muted border-brand'
                : 'bg-muted/40 hover:bg-muted/70'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-ink-muted">
                <CircleNotch size={26} className="text-brand animate-spin" />
                <span className="text-xs font-mono">Mengompresi ke WebP...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-ink-muted">
                <div className="w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center text-ink shadow-xs group-hover:scale-105 transition-transform">
                  <Camera size={20} weight="bold" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-ink">
                    Klik atau seret gambar sampul ke sini
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted">
                    Format WebP, JPG, PNG (maks. 5MB)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card Body Content */}
        <div className="p-4 sm:p-5 flex flex-col gap-2.5">
          {/* Author Header */}
          <div className="flex items-center justify-between gap-3 pb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={authorAvatar} name={authorName} size="sm" />
              <span className="text-xs font-semibold text-ink truncate">
                {authorName}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-muted shrink-0">
              <Clock size={12} /> {readingTime} min baca
            </span>
          </div>

          {/* Headline Display */}
          <h4 className="font-serif text-lg sm:text-xl font-medium text-ink tracking-tight line-clamp-2 leading-snug">
            {title.trim() || 'Judul artikel belum ditulis...'}
          </h4>

          {/* Excerpt */}
          <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
            {excerpt?.trim() || 'Ringkasan artikel akan tampil di sini saat kamu menulisnya...'}
          </p>

          {/* Topic Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-line-subtle">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge key={tag} variant="tag">
                  #{tag}
                </Badge>
              ))
            ) : (
              <span className="text-[11px] font-mono text-ink-muted italic">
                Belum ada topik tag
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
