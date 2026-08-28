import { apiClient } from '../../../shared/api/apiClient';
import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
  UploadMediaResponse,
} from '../types/settings.types';

export const settingsApi = {
  /**
   * Update Profil dan Identitas Blog pengguna
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse> {
    const response = await apiClient.patch<UpdateProfileResponse>('/users/profile', payload);
    return response.data;
  },

  /**
   * Unggah Foto Avatar (Backend otomatis mengubah ke format WebP teroptimasi)
   */
  async uploadAvatar(file: File): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadMediaResponse>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
