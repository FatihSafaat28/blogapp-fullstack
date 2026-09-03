import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../auth/stores/authStore';
import {
  useDashboardPostsQuery,
  useTogglePublishMutation,
  useDeletePostMutation,
} from '../api/postsQueries';
import { useCreatePost } from './useCreatePost';
import { PostListItem } from '../types/post.types';
import { useToast } from '../../../../shared/components/ui/Toast/useToast';

export const usePostListPresenter = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postToDelete, setPostToDelete] = useState<PostListItem | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page on tab change
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus as 'all' | 'published' | 'draft');
    setCurrentPage(1);
  };

  // Queries & Mutations
  const { data, isLoading, isFetching, refetch } = useDashboardPostsQuery({
    status: statusFilter,
    search: debouncedSearch,
    page: currentPage,
    limit: 10,
  });

  const togglePublishMutation = useTogglePublishMutation();
  const deletePostMutation = useDeletePostMutation();
  const { createPost, isCreating: isCreatingDraft } = useCreatePost();

  const posts = data?.data?.posts || [];
  const pagination = data?.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  // Handlers
  const handleCreateDraft = (title?: string) => createPost(title);

  const handleTogglePublish = (post: PostListItem) => {
    togglePublishMutation.mutate({
      id: post.id,
      published: !post.published,
    });
  };

  const handleOpenDeleteModal = (post: PostListItem) => {
    setPostToDelete(post);
  };

  const handleCloseDeleteModal = () => {
    setPostToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePostMutation.mutateAsync(postToDelete.id);
      setPostToDelete(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleCopyPublicLink = async (post: PostListItem) => {
    if (!user) return;
    const url = `${window.location.origin}/@${user.username}/${post.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Tautan artikel berhasil disalin ke clipboard!', 'info');
    } catch {
      showToast('Gagal menyalin tautan.', 'error');
    }
  };

  return {
    user,
    posts,
    pagination,
    isLoading,
    isFetching,
    statusFilter,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    postToDelete,
    isDeleting: deletePostMutation.isPending,
    isCreatingDraft,
    handleStatusChange,
    handleCreateDraft,
    handleTogglePublish,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleCopyPublicLink,
    refetch,
  };
};
