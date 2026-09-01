import React from 'react';
import { ImageUpload } from '../../../shared/components/ui/Form/ImageUpload';

interface CoverImageUploaderProps {
  coverImage: string | null;
  onCoverChange: (url: string | null) => void;
}

export const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  coverImage,
  onCoverChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <ImageUpload
        label="Gambar Sampul Artikel"
        value={coverImage}
        onChange={onCoverChange}
        helperText="Format JPG, PNG, WEBP (maks. 5MB). Otomatis dioptimasi ke WebP."
      />
    </div>
  );
};
