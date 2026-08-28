import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';
import { registerSchema, type RegisterFormData } from '../schemas/authValidation';
import { useToast } from '../../../shared/components/ui/Toast/useToast';

export function useRegisterPresenter() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const watchedUsername = form.watch('username');
  const watchedPassword = form.watch('password') || '';

  const cleanSlug = watchedUsername
    ? watchedUsername.toLowerCase().replace(/[^a-z0-9_]/g, '')
    : 'username';

  const passwordChecks = {
    hasMinLength: watchedPassword.length >= 8,
    hasLetter: /[a-zA-Z]/.test(watchedPassword),
    hasNumber: /\d/.test(watchedPassword),
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await authApi.register(data);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        showToast('Akun blog berhasil dibuat! Selamat datang di Avian.', 'success');
        navigate('/dashboard/posts', { replace: true });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal mendaftar. Username atau email mungkin sudah digunakan.';
      setServerError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    form,
    cleanSlug,
    passwordChecks,
    showPassword,
    isSubmitting,
    serverError,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
