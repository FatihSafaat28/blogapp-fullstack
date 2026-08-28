import React from 'react';
import { Link } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import type { LoginFormData } from '../schemas/authValidation';
import { PenNib, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';

import { ThemeToggle } from '../../../shared/components/ui/Theme/ThemeToggle';
import { Button } from '../../../shared/components/ui/Form/Button';
import { Input } from '../../../shared/components/ui/Form/Input';
import { Checkbox } from '../../../shared/components/ui/Form/Checkbox';
import { Alert } from '../../../shared/components/ui/Feedback/Alert';

interface LoginFormViewProps {
  form: UseFormReturn<LoginFormData>;
  showPassword: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  togglePasswordVisibility: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const LoginFormView: React.FC<LoginFormViewProps> = ({
  form,
  showPassword,
  isSubmitting,
  serverError,
  togglePasswordVisibility,
  onSubmit,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-card transition-colors">
      {/* Top Header with Fast Switch Tab Pill & ThemeToggle */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
            <PenNib weight="bold" size={14} className="text-ink" />
            <span>Studio Penulis</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 rounded-md bg-muted text-xs">
              <span className="px-2.5 py-1 rounded-xs bg-card text-ink font-semibold shadow-xs">
                Masuk
              </span>
              <Link
                to="/register"
                className="px-2.5 py-1 text-ink-muted hover:text-ink transition-colors"
              >
                Daftar
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-[2.15rem] font-medium tracking-tight text-ink leading-tight mb-2">
          Senang melihatmu kembali.
        </h1>
        <p className="text-sm text-ink-secondary leading-relaxed mb-6">
          Ketik idemu, rawat drafmu, dan lanjutkan tulisan yang kemarin tertunda.
        </p>

        {/* Global Server Error Alert */}
        {serverError && (
          <Alert variant="danger" className="mb-6 py-3 px-3.5 text-xs">
            {serverError}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Identifier Field */}
          <Input
            label="Email atau Username"
            type="text"
            placeholder="contoh@email.com atau username kamu"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register('identifier')}
          />

          {/* Password Field */}
          <Input
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
            error={errors.password?.message}
            iconSuffix={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                className="p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            }
            {...register('password')}
          />

          {/* Remember Me */}
          <div className="pt-1 pb-2">
            <Checkbox
              label={<span className="text-xs">Tetap ingat saya di perangkat ini (7 hari)</span>}
              {...register('rememberMe')}
            />
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            iconSuffix={<ArrowRight weight="bold" size={15} />}
            className="h-11 shadow-xs font-semibold"
          >
            Buka Studio Tulisan
          </Button>
        </form>
      </div>

      {/* Enhanced Clear Footer Action */}
      <div className="mt-8 pt-4 border-t border-line-subtle text-xs text-center text-ink-muted">
        Belum punya blog sendiri?{' '}
        <Link
          to="/register"
          className="font-semibold text-ink underline underline-offset-4 hover:text-ink-secondary"
        >
          Buat akun gratismu di sini ➔
        </Link>
      </div>
    </div>
  );
};
