import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDraftMutation } from '../api/postsQueries';

export const useCreatePost = () => {
  const navigate = useNavigate();
  const createDraftMutation = useCreateDraftMutation();
  const isCreatingRef = useRef(false);

  const createPost = useCallback(
    async (title: string = 'Untitled Post') => {
      // Triple-layer race condition prevention
      if (isCreatingRef.current || createDraftMutation.isPending) {
        return;
      }

      isCreatingRef.current = true;

      try {
        const result = await createDraftMutation.mutateAsync(title);
        if (result?.data?.post?.id) {
          navigate(`/editor/${result.data.post.id}`);
          return result.data.post;
        }
      } catch {
        // Error toast is handled automatically by createDraftMutation.onError
      } finally {
        isCreatingRef.current = false;
      }
    },
    [createDraftMutation, navigate]
  );

  return {
    createPost,
    isCreating: createDraftMutation.isPending,
  };
};
