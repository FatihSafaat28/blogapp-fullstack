import { apiClient } from '../../../shared/api/apiClient';
import {
  PostDetailResponse,
  AutoSavePayload,
  AutoSaveResponse,
} from '../types/editor.types';

export const editorApi = {
  getPostDetail: async (id: string): Promise<PostDetailResponse> => {
    const response = await apiClient.get<PostDetailResponse>(`/posts/dashboard/${id}`);
    return response.data;
  },

  autoSavePost: async (id: string, payload: AutoSavePayload): Promise<AutoSaveResponse> => {
    const response = await apiClient.put<AutoSaveResponse>(`/posts/${id}`, payload);
    return response.data;
  },

  togglePublish: async (id: string, published: boolean): Promise<AutoSaveResponse> => {
    const response = await apiClient.patch<AutoSaveResponse>(`/posts/${id}/publish`, {
      published,
    });
    return response.data;
  },

  uploadImage: async (file: File): Promise<{ success: boolean; data: { url: string } }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ success: boolean; data: { url: string } }>(
      '/media/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },
};
