import React, { useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { UploadSimple, Trash, Sparkle } from '@phosphor-icons/react';
import type { UpdateProfileFormData } from '../schemas/settingsValidation';
import type { User } from '../../auth/types/auth.types';
import { Avatar } from '../../../shared/components/ui/Display/Avatar';
import { Input } from '../../../shared/components/ui/Form/Input';
import { Textarea } from '../../../shared/components/ui/Form/Textarea';
import { Button } from '../../../shared/components/ui/Form/Button';
import { Alert } from '../../../shared/components/ui/Feedback/Alert';

interface ProfileFormViewProps {
  user: User | null;
  form: UseFormReturn<UpdateProfileFormData>;
  isSubmitting: boolean;
  isUploadingAvatar: boolean;
  serverError: string | null;
  avatarValue?: string | null;
  bioValue?: string | null;
  onAvatarUpload: (file: File) => void;
  onAvatarRemove: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const ProfileFormView: React.FC<ProfileFormViewProps> = ({
  user,
  form,
  isSubmitting,
  isUploadingAvatar,
  serverError,
  avatarValue,
  bioValue = '',
  onAvatarUpload,
  onAvatarRemove,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    formState: { errors, isDirty },
  } = form;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
      // Reset input agar bisa memilih file yang sama jika diperlukan
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {serverError && (
        <Alert variant="danger" className="py-3 px-4">
          {serverError}
        </Alert>
      )}

      {/* 1. SECTION AVATAR KREATOR */}
      <div className="p-5 sm:p-6 rounded-xl bg-muted/40 border border-line flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative shrink-0">
          <Avatar
            src={avatarValue || user?.avatar}
            name={user?.fullName || user?.username}
            size="xl"
            className="ring-4 ring-card shadow-sm"
          />
          {isUploadingAvatar && (
            <div className="absolute inset-0 rounded-full bg-canvas/70 backdrop-blur-xs flex items-center justify-center text-xs font-mono text-ink animate-pulse">
              Mengunggah...
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-ink">Foto Profil & Avatar</h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-muted bg-muted px-2 py-0.5 rounded border border-line">
              <Sparkle size={12} className="text-warning" /> WebP Teroptimasi
            </span>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Format yang didukung: JPG, PNG, atau WebP (Maksimal 5MB). Foto akan dikonversi ke WebP tajam dan ringan untuk pembaca.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <input
              type="file"
              id="avatar-upload-input"
              name="avatarFile"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              aria-label="Unggah foto avatar"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isUploadingAvatar}
              iconPrefix={<UploadSimple size={14} weight="bold" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Ganti Foto
            </Button>

            {avatarValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconPrefix={<Trash size={14} />}
                onClick={onAvatarRemove}
                className="text-danger hover:text-danger"
              >
                Hapus
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. SECTION INFORMASI DASAR & IDENTITAS */}
      <div className="space-y-4">
        <Input
          label="Nama Lengkap"
          placeholder="cth. Fatih Safaat"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Username Blog (Terkunci)"
            disabled
            value={user ? `@${user.username}` : ''}
            helperText="Username unik digunakan sebagai alamat URL blog publikmu."
            className="font-mono text-ink-muted bg-muted/30 cursor-not-allowed"
          />

          <Input
            label="Alamat Email Akun (Terkunci)"
            disabled
            value={user?.email || ''}
            helperText="Email utama terhubung dengan kredensial login."
            className="text-ink-muted bg-muted/30 cursor-not-allowed"
          />
        </div>

        {/* Bio Textarea dengan Live Character Counter */}
        <div className="space-y-1.5">
          <Textarea
            label="Bio Singkat Kreator"
            placeholder="Tuliskan cerita singkat tentang dirimu, topik yang sering kamu ulas, atau hal yang menginspirasimu..."
            error={errors.bio?.message}
            {...register('bio')}
            className="min-h-28"
          />
          <div className="flex items-center justify-between text-xs text-ink-muted pt-1 px-1">
            <span>Tampil di header kartu profil publik Substack-style dan di akhir artikel.</span>
            <span
              className={`font-mono ${
                (bioValue?.length || 0) > 450 ? 'text-warning font-semibold' : ''
              }`}
            >
              {bioValue?.length || 0}/500
            </span>
          </div>
        </div>
      </div>

      {/* 3. SUBMIT ACTION BAR */}
      <div className="flex items-center justify-between pt-4 border-t border-line-subtle">
        <span className="text-xs text-ink-muted">
          {isDirty ? '✦ Terdapat perubahan yang belum disimpan' : 'Semua perubahan tersimpan'}
        </span>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
        >
          Simpan Profil
        </Button>
      </div>
    </form>
  );
};
