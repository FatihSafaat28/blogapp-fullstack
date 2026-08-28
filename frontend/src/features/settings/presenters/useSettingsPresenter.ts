import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useAuthStore } from '../../auth/stores/authStore';
import { useToast } from '../../../shared/components/ui/Toast/useToast';
import { settingsApi } from '../api/settingsApi';
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from '../schemas/settingsValidation';
import type { SettingsTab } from '../types/settings.types';

export const useSettingsPresenter = () => {
  const { user, setUser } = useAuthStore();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Deferred Avatar Upload State (Mencegah file sampah di server saat belum disimpan)
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      avatar: user?.avatar || null,
      blogTitle: user?.blogTitle || '',
      socialTwitter: user?.socialTwitter || '',
      socialGithub: user?.socialGithub || '',
      socialLinkedin: user?.socialLinkedin || '',
    },
  });

  // Bersihkan object URL saat unmount untuk mencegah memory leak
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // Reset form values jika data user di store berubah
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        bio: user.bio || '',
        avatar: user.avatar || null,
        blogTitle: user.blogTitle || '',
        socialTwitter: user.socialTwitter || '',
        socialGithub: user.socialGithub || '',
        socialLinkedin: user.socialLinkedin || '',
      });
      setPendingAvatarFile(null);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setAvatarPreviewUrl(null);
    }
  }, [user, form]);

  const avatarValue = form.watch('avatar');
  const bioValue = form.watch('bio');
  const blogTitleValue = form.watch('blogTitle');

  // Handler pemilihan avatar (Deferred / Pratinjau lokal instan)
  const handleAvatarSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toastError('Ukuran file maksimal 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toastError('Format file harus berupa gambar (JPG, PNG, WebP)');
      return;
    }

    // Bersihkan preview URL sebelumnya jika ada
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    // Buat URL pratinjau browser instan (0 detik, tanpa request server)
    const newPreviewUrl = URL.createObjectURL(file);
    objectUrlRef.current = newPreviewUrl;

    setPendingAvatarFile(file);
    setAvatarPreviewUrl(newPreviewUrl);
    form.setValue('avatar', newPreviewUrl, { shouldDirty: true });
    success('Foto avatar dipilih! Tekan "Simpan Profil" untuk menerapkan.');
  };

  // Handler hapus avatar
  const handleAvatarRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPendingAvatarFile(null);
    setAvatarPreviewUrl(null);
    form.setValue('avatar', null, { shouldDirty: true });
    success('Avatar dihapus. Tekan "Simpan Profil" untuk menerapkan.');
  };

  // Handler submit form terpadu
  const onSubmit = form.handleSubmit(async (data: UpdateProfileFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      let finalAvatarUrl: string | null | undefined = data.avatar;

      // Jika ada file avatar baru yang belum diunggah, unggah sekarang saat user benar-benar klik Simpan
      if (pendingAvatarFile) {
        const uploadResponse = await settingsApi.uploadAvatar(pendingAvatarFile);
        if (uploadResponse.success && uploadResponse.data?.url) {
          finalAvatarUrl = uploadResponse.data.url;
        }
      }

      const response = await settingsApi.updateProfile({
        fullName: data.fullName,
        bio: data.bio ? data.bio.trim() : null,
        avatar: finalAvatarUrl || null,
        blogTitle: data.blogTitle ? data.blogTitle.trim() : null,
        socialTwitter: data.socialTwitter ? data.socialTwitter.trim() : null,
        socialGithub: data.socialGithub ? data.socialGithub.trim() : null,
        socialLinkedin: data.socialLinkedin ? data.socialLinkedin.trim() : null,
      });

      if (response.success && response.data?.user) {
        // Bersihkan object URL
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setPendingAvatarFile(null);
        setAvatarPreviewUrl(null);

        setUser(response.data.user);
        form.reset({
          fullName: response.data.user.fullName || '',
          bio: response.data.user.bio || '',
          avatar: response.data.user.avatar || null,
          blogTitle: response.data.user.blogTitle || '',
          socialTwitter: response.data.user.socialTwitter || '',
          socialGithub: response.data.user.socialGithub || '',
          socialLinkedin: response.data.user.socialLinkedin || '',
        });
        success('Pengaturan profil dan blog berhasil disimpan!');
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg =
        axiosErr.response?.data?.message || 'Gagal menyimpan perubahan pengaturan.';
      setServerError(msg);
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    user,
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    isUploadingAvatar: isSubmitting && !!pendingAvatarFile,
    serverError,
    avatarValue: avatarPreviewUrl || avatarValue,
    bioValue,
    blogTitleValue,
    handleAvatarUpload: handleAvatarSelect,
    handleAvatarRemove,
    onSubmit,
  };
};
