import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';
import { loginSchema, type LoginFormData } from '../schemas/authValidation';
import { useToast } from '../../../shared/components/ui/Toast/useToast';

export function useLoginPresenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await authApi.login(data);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        showToast('Selamat datang kembali! Senang melihatmu.', 'success');

        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard/posts';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal masuk ke studio. Mohon periksa kembali email/username dan kata sandi Anda.';
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
    showPassword,
    isSubmitting,
    serverError,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
