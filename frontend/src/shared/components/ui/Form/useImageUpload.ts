import { useState, useRef, useId } from 'react';
import { apiClient } from '../../../api/apiClient';

export interface UseImageUploadOptions {
  id?: string;
  onChange: (url: string | null) => void;
  onUpload?: (file: File) => Promise<string>;
}

export const useImageUpload = ({
  id,
  onChange,
  onUpload,
}: UseImageUploadOptions) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsUploading(true);
    try {
      if (onUpload) {
        const url = await onUpload(file);
        onChange(url);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post<{ success: boolean; data: { url: string } }>(
          '/media/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (res.data.success) {
          onChange(res.data.data.url);
        }
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

  return {
    inputId,
    isUploading,
    isDragging,
    fileInputRef,
    setIsDragging,
    handleUpload,
    handleDrop,
  };
};
