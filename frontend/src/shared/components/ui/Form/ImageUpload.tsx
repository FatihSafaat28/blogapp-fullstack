import React, { useState, useRef } from 'react';
import { UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

export interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  error?: string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
}) => {
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
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-800">
          <img src={value} alt="Preview" className="w-full max-h-56 object-cover" />
          <button
            type="button"
            className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-red-600 text-white text-xs font-semibold backdrop-blur-sm transition-all duration-150"
            onClick={() => onChange(null)}
          >
            <Trash2 size={13} /> Hapus
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10'
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
            <Loader2 size={28} className="text-indigo-600 animate-spin" />
          ) : (
            <UploadCloud size={28} className="text-indigo-600 dark:text-indigo-400" />
          )}
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isUploading ? 'Mengompresi ke WebP...' : 'Klik atau drag foto ke sini'}
          </span>
          <span className="text-xs text-slate-400">JPG, PNG, WEBP, GIF (Maks 5MB)</span>
        </div>
      )}

      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>
      )}
    </div>
  );
};
