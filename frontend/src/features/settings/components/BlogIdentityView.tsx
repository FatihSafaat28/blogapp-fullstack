import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Sparkle, ArrowSquareOut, Newspaper } from '@phosphor-icons/react';
import type { UpdateProfileFormData } from '../schemas/settingsValidation';
import type { User } from '../../auth/types/auth.types';
import { Input } from '../../../shared/components/ui/Form/Input';
import { Button } from '../../../shared/components/ui/Form/Button';
import { Avatar } from '../../../shared/components/ui/Display/Avatar';
import { Alert } from '../../../shared/components/ui/Feedback/Alert';

interface BlogIdentityViewProps {
  user: User | null;
  form: UseFormReturn<UpdateProfileFormData>;
  isSubmitting: boolean;
  serverError: string | null;
  blogTitleValue?: string | null;
  avatarValue?: string | null;
  bioValue?: string | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const BlogIdentityView: React.FC<BlogIdentityViewProps> = ({
  user,
  form,
  isSubmitting,
  serverError,
  blogTitleValue = '',
  avatarValue,
  bioValue = '',
  onSubmit,
}) => {
  const {
    register,
    formState: { errors, isDirty },
  } = form;

  const publicUrl = `avianblog.com/@${user?.username || 'penulis'}`;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {serverError && (
        <Alert variant="danger" className="py-3 px-4">
          {serverError}
        </Alert>
      )}

      {/* 1. INPUT JUDUL PUBLIKASI BLOG */}
      <div className="space-y-4">
        <Input
          label="Judul Publikasi / Nama Blog"
          placeholder="cth. Catatan Arsitektur & Gagasan Fatih"
          error={errors.blogTitle?.message}
          helperText="Nama ini akan menjadi judul utama di halaman beranda blog publikmu (ala Substack)."
          {...register('blogTitle')}
        />
      </div>

      {/* 2. LIVE SUBSTACK-STYLE HEADER PREVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Newspaper size={16} className="text-warning" />
            <span>Pratinjau Halaman Publik (@{user?.username})</span>
          </div>
          <a
            href={`/@${user?.username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono text-ink-muted hover:text-ink transition-colors"
          >
            <span>Buka halaman live</span>
            <ArrowSquareOut size={13} />
          </a>
        </div>

        {/* Live Card Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-muted/40 border border-line shadow-xs">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <Avatar
              src={avatarValue || user?.avatar}
              name={user?.fullName || user?.username}
              size="lg"
              className="mx-auto shadow-sm ring-4 ring-card"
            />

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-ink tracking-tight mb-1">
                {blogTitleValue || `${user?.fullName || user?.username}'s Publication`}
              </h3>
              <p className="text-xs font-mono text-ink-muted">
                {publicUrl}
              </p>
            </div>

            <p className="text-sm text-ink-secondary leading-relaxed max-w-md mx-auto italic">
              {bioValue ||
                '“Gagasan terbaik sering kali lahir dari catatan-catatan kecil yang kita rawat setiap hari.”'}
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-ink-muted">
              <span className="px-2.5 py-0.5 rounded-full bg-card border border-line inline-flex items-center gap-1">
                <Sparkle size={11} className="text-warning" /> Substack Style Hero
              </span>
            </div>
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
          Simpan Identitas Blog
        </Button>
      </div>
    </form>
  );
};
