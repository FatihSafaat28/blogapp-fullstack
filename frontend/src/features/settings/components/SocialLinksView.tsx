import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  TwitterLogo,
  GithubLogo,
  LinkedinLogo,
  ShareNetwork,
} from '@phosphor-icons/react';
import type { UpdateProfileFormData } from '../schemas/settingsValidation';
import { Input } from '../../../shared/components/ui/Form/Input';
import { Button } from '../../../shared/components/ui/Form/Button';
import { Alert } from '../../../shared/components/ui/Feedback/Alert';

interface SocialLinksViewProps {
  form: UseFormReturn<UpdateProfileFormData>;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const SocialLinksView: React.FC<SocialLinksViewProps> = ({
  form,
  isSubmitting,
  serverError,
  onSubmit,
}) => {
  const {
    register,
    formState: { errors, isDirty },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {serverError && (
        <Alert variant="danger" className="py-3 px-4">
          {serverError}
        </Alert>
      )}

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-muted/40 border border-line flex items-start gap-3 text-xs text-ink-secondary">
        <ShareNetwork size={20} className="shrink-0 text-ink mt-0.5" />
        <p className="leading-relaxed">
          Tautan ini akan disematkan sebagai ikon sosial di header profil blog publikmu dan di kartu penutup setiap artikel yang kamu tulis.
        </p>
      </div>

      {/* Social Inputs */}
      <div className="space-y-4">
        <Input
          label="Twitter / X"
          placeholder="username_kamu atau https://x.com/username"
          iconPrefix={<TwitterLogo size={16} className="text-ink-muted" />}
          error={errors.socialTwitter?.message}
          {...register('socialTwitter')}
        />

        <Input
          label="GitHub"
          placeholder="username_kamu atau https://github.com/username"
          iconPrefix={<GithubLogo size={16} className="text-ink-muted" />}
          error={errors.socialGithub?.message}
          {...register('socialGithub')}
        />

        <Input
          label="LinkedIn"
          placeholder="username_kamu atau https://linkedin.com/in/username"
          iconPrefix={<LinkedinLogo size={16} className="text-ink-muted" />}
          error={errors.socialLinkedin?.message}
          {...register('socialLinkedin')}
        />
      </div>

      {/* Submit Action Bar */}
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
          Simpan Tautan Sosial
        </Button>
      </div>
    </form>
  );
};
