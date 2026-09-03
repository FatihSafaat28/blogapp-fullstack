import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { editorApi } from './editorApi';
import { AutoSavePayload } from '../types/editor.types';
import { postsKeys } from '../../dashboard/posts/api/postsQueries';
import { useToast } from '../../../shared/components/ui/Toast/useToast';

export const editorKeys = {
  detail: (id: string) => ['editor-post', id] as const,
};

export const usePostDetailQuery = (id?: string) => {
  return useQuery({
    queryKey: editorKeys.detail(id || ''),
    queryFn: () => editorApi.getPostDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

export const useAutoSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AutoSavePayload }) =>
      editorApi.autoSavePost(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(editorKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
    },
  });
};

export const useEditorPublishMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      editorApi.togglePublish(id, published),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(editorKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      showToast(
        variables.published
          ? '✦ Artikelmu resmi dipublikasikan ke blog publik!'
          : 'Artikel telah dikembalikan ke status draf.',
        'success'
      );
    },
    onError: (error: Error) => {
      showToast(error.message || 'Gagal mengubah status artikel.', 'error');
    },
  });
};
