import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
  'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
  'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
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
  const initials = getInitials(name);
  const background = !src ? getGradient(name) : undefined;

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full overflow-hidden font-heading font-bold text-white select-none shrink-0 border-2 border-slate-200 dark:border-slate-800 shadow-sm ${sizeStyles} ${className}`}
      style={{ background, ...style }}
      title={name}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
