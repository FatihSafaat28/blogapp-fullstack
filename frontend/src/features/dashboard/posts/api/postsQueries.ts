import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from './postsApi';
import { DashboardQueryParams } from '../types/post.types';
import { useToast } from '../../../../shared/components/ui/Toast/useToast';

export const postsKeys = {
  all: ['dashboard-posts'] as const,
  list: (params?: DashboardQueryParams) => ['dashboard-posts', params] as const,
};

export const useDashboardPostsQuery = (params?: DashboardQueryParams) => {
  return useQuery({
    queryKey: postsKeys.list(params),
    queryFn: () => postsApi.getDashboardPosts(params),
    staleTime: 1000 * 60 * 3, // 3 menit
  });
};

export const useTogglePublishMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      postsApi.togglePublishPost(id, published),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      showToast(
        variables.published
          ? '✦ Artikel berhasil dipublikasikan ke blog publik!'
          : 'Artikel telah dikembalikan ke status draf.',
        'success'
      );
    },
    onError: (error: Error) => {
      showToast(error.message || 'Gagal mengubah status publikasi artikel.', 'error');
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      showToast('Artikel berhasil dihapus secara permanen.', 'info');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Gagal menghapus artikel.', 'error');
    },
  });
};

export const useCreateDraftMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (title?: string) => postsApi.createDraftPost(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
    },
    onError: (error: Error) => {
      showToast(error.message || 'Gagal membuat draf baru.', 'error');
    },
  });
};
