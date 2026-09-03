import React from 'react';
import { Button, ButtonProps } from '../ui/Form/Button';
import { NotePencil, PenNib } from '@phosphor-icons/react';
import { useCreatePost } from '../../../features/dashboard/posts/hooks/useCreatePost';

export interface WritePostButtonProps extends Omit<ButtonProps, 'onClick' | 'isLoading'> {
  onBeforeCreate?: () => void;
  iconType?: 'pencil' | 'pen';
  draftTitle?: string;
}

export const WritePostButton: React.FC<WritePostButtonProps> = ({
  children = 'Tulis Cerita Baru',
  onBeforeCreate,
  iconType = 'pencil',
  draftTitle = 'Untitled Post',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const { createPost, isCreating } = useCreatePost();

  const handleClick = () => {
    if (onBeforeCreate) {
      onBeforeCreate();
    }
    createPost(draftTitle);
  };

  const icon =
    iconType === 'pencil' ? (
      <NotePencil size={size === 'sm' ? 14 : 16} weight="bold" />
    ) : (
      <PenNib size={size === 'sm' ? 14 : 17} weight="bold" />
    );

  return (
    <Button
      variant={variant}
      size={size}
      iconPrefix={icon}
      onClick={handleClick}
      isLoading={isCreating}
      {...props}
    >
      {children}
    </Button>
  );
};
