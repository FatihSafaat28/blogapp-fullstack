import React, { useState, useEffect } from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GRADIENTS = [
  'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
  'linear-gradient(135deg, #27272a 0%, #52525b 100%)',
  'linear-gradient(135deg, #15803d 0%, #166534 100%)',
  'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
  'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
  'linear-gradient(135deg, #4c1d95 0%, #312e81 100%)',
];

const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getGradient = (name?: string): string => {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const initials = getInitials(name);
  const showImage = Boolean(src && !imageError);
  const background = !showImage ? getGradient(name) : undefined;

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full overflow-hidden font-heading font-bold text-ink-inverse select-none shrink-0 border border-line shadow-xs ${sizeStyles} ${className}`}
      style={{ background, ...style }}
      title={name}
      {...props}
    >
      {showImage ? (
        <img
          src={src!}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
