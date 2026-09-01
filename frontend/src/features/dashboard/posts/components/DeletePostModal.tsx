import React from 'react';
import { Modal } from '../../../../shared/components/ui/Overlay/Modal';
import { Button } from '../../../../shared/components/ui/Form/Button';
import { PostListItem } from '../types/post.types';
import { WarningCircle, Trash } from '@phosphor-icons/react';

interface DeletePostModalProps {
  post: PostListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  post,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!post) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Artikel?"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs">
          <WarningCircle size={20} weight="fill" className="shrink-0 text-danger mt-0.5" />
          <p className="leading-relaxed">
            Tindakan ini bersifat permanen. Artikel <strong className="font-semibold text-ink font-serif">"{post.title}"</strong> beserta riwayat analitiknya akan dihapus dari server dan tidak dapat dipulihkan kembali.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            iconPrefix={<Trash size={15} weight="bold" />}
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Hapus Permanen
          </Button>
        </div>
      </div>
    </Modal>
  );
};
