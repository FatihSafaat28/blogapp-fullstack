import React, { useState, useRef, useId } from 'react';
import { CloudArrowUp, Trash, CircleNotch } from '@phosphor-icons/react';
import { apiClient } from '../../../api/apiClient';

export interface ImageUploadProps {
  id?: string;
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  error?: string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post<{ success: boolean; data: { url: string } }>(
        '/media/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.success) {
        onChange(res.data.data.url);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      <input
        type="file"
        id={inputId}
        name="imageFile"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        aria-label={label || 'Unggah berkas gambar'}
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden group border border-line">
          <img src={value} alt="Preview" className="w-full max-h-56 object-cover" />
          <button
            type="button"
            className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 hover:bg-danger text-white text-xs font-semibold backdrop-blur-sm transition-all duration-150 cursor-pointer"
            onClick={() => onChange(null)}
          >
            <Trash size={13} /> Hapus
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer text-center ${
            isDragging
              ? 'border-brand bg-muted'
              : 'border-line bg-muted/40 hover:border-ink hover:bg-muted'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <CircleNotch size={28} className="text-brand animate-spin" />
          ) : (
            <CloudArrowUp size={28} className="text-ink-secondary" />
          )}
          <span className="text-sm font-semibold text-ink">
            {isUploading ? 'Mengompresi ke WebP...' : 'Klik atau drag foto ke sini'}
          </span>
          <span className="text-xs text-ink-muted">JPG, PNG, WEBP, GIF (Maks 5MB)</span>
        </div>
      )}

      {error && <span className="text-xs font-medium text-danger">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-ink-muted">{helperText}</span>
      )}
    </div>
  );
};
