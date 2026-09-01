import { apiClient } from '../../../../shared/api/apiClient';
import {
  DashboardQueryParams,
  DashboardPostsResponse,
  TogglePublishResponse,
  CreateDraftResponse,
} from '../types/post.types';

export const postsApi = {
  getDashboardPosts: async (params?: DashboardQueryParams): Promise<DashboardPostsResponse> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      query.append('status', params.status);
    }
    if (params?.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }
    if (params?.page) {
      query.append('page', params.page.toString());
    }
    if (params?.limit) {
      query.append('limit', params.limit.toString());
    }

    const endpoint = `/posts/dashboard${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await apiClient.get<DashboardPostsResponse>(endpoint);
    return response.data;
  },

  togglePublishPost: async (id: string, published: boolean): Promise<TogglePublishResponse> => {
    const response = await apiClient.patch<TogglePublishResponse>(`/posts/${id}/publish`, {
      published,
    });
    return response.data;
  },

  deletePost: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/posts/${id}`);
    return response.data;
  },

  createDraftPost: async (title?: string): Promise<CreateDraftResponse> => {
    const response = await apiClient.post<CreateDraftResponse>('/posts/draft', {
      title: title || 'Untitled Post',
    });
    return response.data;
  },
};
