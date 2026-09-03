import React from 'react';
import { usePostListPresenter } from '../hooks/usePostListPresenter';
import { PostListHeader } from '../components/PostListHeader';
import { PostFilterBar } from '../components/PostFilterBar';
import { PostItemCard } from '../components/PostItemCard';
import { DeletePostModal } from '../components/DeletePostModal';
import { EmptyState } from '../../../../shared/components/ui/Display/EmptyState';
import { Skeleton } from '../../../../shared/components/ui/Feedback/Skeleton';
import { Pagination } from '../../../../shared/components/ui/Display/Pagination';
import { Article, MagnifyingGlass } from '@phosphor-icons/react';

export const PostListPage: React.FC = () => {
  const {
    user,
    posts,
    pagination,
    isLoading,
    statusFilter,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    postToDelete,
    isDeleting,
    handleStatusChange,
    handleCreateDraft,
    handleTogglePublish,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleCopyPublicLink,
  } = usePostListPresenter();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* 1. Page Header */}
      <PostListHeader totalPosts={pagination.total} />

      {/* 2. Filter Tabs & Search Bar */}
      <PostFilterBar
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onClearSearch={() => setSearchTerm('')}
        totalCount={pagination.total}
      />

      {/* 3. Post List Content Area */}
      {isLoading ? (
        <div className="flex flex-col gap-4 pt-2">
          <Skeleton height="128px" className="rounded-2xl" />
          <Skeleton height="128px" className="rounded-2xl" />
          <Skeleton height="128px" className="rounded-2xl" />
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4 pt-2">
          {posts.map((post) => (
            <PostItemCard
              key={post.id}
              post={post}
              username={user?.username || ''}
              onTogglePublish={handleTogglePublish}
              onDelete={handleOpenDeleteModal}
              onCopyLink={handleCopyPublicLink}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty States */
        <div className="pt-4">
          <div className="p-8 rounded-2xl bg-card border border-line">
            {searchTerm ? (
              <EmptyState
                icon={<MagnifyingGlass size={36} className="text-ink-muted" />}
                title="Tulisan tidak ditemukan"
                description={`Tidak ada artikel yang cocok dengan kata kunci "${searchTerm}". Coba kata kunci lain.`}
                actionLabel="Reset Pencarian"
                onAction={() => setSearchTerm('')}
              />
            ) : (
              <EmptyState
                icon={<Article size={36} className="text-ink-muted" />}
                title={
                  statusFilter === 'published'
                    ? 'Belum ada artikel yang terbit'
                    : statusFilter === 'draft'
                    ? 'Tidak ada draf tulisan'
                    : 'Belum ada karya tulisan'
                }
                description="Mulai tuangkan ide, cerita, dan gagasan berhargamu di studio editor bebas distraksi."
                actionLabel="Mulai Menulis Sekarang"
                onAction={handleCreateDraft}
              />
            )}
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      <DeletePostModal
        post={postToDelete}
        isOpen={!!postToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
