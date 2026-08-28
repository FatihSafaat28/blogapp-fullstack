import React from 'react';
import { Link } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import type { RegisterFormData } from '../schemas/authValidation';
import { Notebook, Eye, EyeSlash, ArrowRight, Check } from '@phosphor-icons/react';

import { ThemeToggle } from '../../../shared/components/ui/Theme/ThemeToggle';
import { Button } from '../../../shared/components/ui/Form/Button';
import { Input } from '../../../shared/components/ui/Form/Input';
import { Alert } from '../../../shared/components/ui/Feedback/Alert';

interface RegisterFormViewProps {
  form: UseFormReturn<RegisterFormData>;
  passwordChecks: {
    hasMinLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
  };
  showPassword: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  togglePasswordVisibility: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const RegisterFormView: React.FC<RegisterFormViewProps> = ({
  form,
  passwordChecks,
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
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
            <Notebook weight="bold" size={14} className="text-ink" />
            <span>Mulai Menulis</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 rounded-md bg-muted text-xs">
              <Link
                to="/login"
                className="px-2.5 py-1 text-ink-muted hover:text-ink transition-colors"
              >
                Masuk
              </Link>
              <span className="px-2.5 py-1 rounded-xs bg-card text-ink font-semibold shadow-xs">
                Daftar
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-[2.15rem] font-medium tracking-tight text-ink leading-tight mb-2">
          Mulai blog pribadimu.
        </h1>
        <p className="text-sm text-ink-secondary leading-relaxed mb-6">
          Dapatkan alamat blog pribadimu dan mulailah menerbitkan tulisan pertamamu hari ini.
        </p>

        {/* Global Server Error Alert */}
        {serverError && (
          <Alert variant="danger" className="mb-6 py-3 px-3.5 text-xs">
            {serverError}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Full Name */}
          <Input
            label="Nama Lengkap"
            type="text"
            placeholder="cth. Fatih Safaat"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          {/* Username with Integrated Prefix (Custom Field Structure) */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-username"
              className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
            >
              Username Blog
            </label>
            <div className="relative flex items-center">
              <span className="h-11 px-3 inline-flex items-center text-xs font-mono text-ink-muted bg-muted border-y border-l border-line rounded-l-lg select-none">
                avianblog.com/@
              </span>
              <input
                id="register-username"
                type="text"
                placeholder="username_kamu"
                autoComplete="username"
                {...register('username')}
                className={`input-editorial px-3 rounded-r-lg font-mono ${
                  errors.username ? 'input-editorial-error' : ''
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-danger">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <Input
            label="Alamat Email Aktif"
            type="email"
            placeholder="kamu@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password */}
          <div>
            <Input
              label="Buat Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 8 karakter (huruf & angka)"
              autoComplete="new-password"
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

            {/* Interactive Password Requirements Checklist Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-mono select-none">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                  passwordChecks.hasMinLength
                    ? 'bg-success-bg text-success border border-success-border'
                    : 'bg-muted text-ink-muted border border-line'
                }`}
              >
                {passwordChecks.hasMinLength ? <Check size={11} weight="bold" /> : '○'} Min. 8 karakter
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                  passwordChecks.hasLetter
                    ? 'bg-success-bg text-success border border-success-border'
                    : 'bg-muted text-ink-muted border border-line'
                }`}
              >
                {passwordChecks.hasLetter ? <Check size={11} weight="bold" /> : '○'} Ada huruf
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                  passwordChecks.hasNumber
                    ? 'bg-success-bg text-success border border-success-border'
                    : 'bg-muted text-ink-muted border border-line'
                }`}
              >
                {passwordChecks.hasNumber ? <Check size={11} weight="bold" /> : '○'} Ada angka
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            iconSuffix={<ArrowRight weight="bold" size={15} />}
            className="h-11 mt-2 shadow-xs font-semibold"
          >
            Buat Blog & Mulai Menulis
          </Button>
        </form>
      </div>

      {/* Enhanced Clear Footer Action */}
      <div className="mt-6 pt-4 border-t border-line-subtle text-xs text-center text-ink-muted">
        Sudah memiliki akun?{' '}
        <Link
          to="/login"
          className="font-semibold text-ink underline underline-offset-4 hover:text-ink-secondary"
        >
          Masuk di sini ➔
        </Link>
      </div>
    </div>
  );
};
