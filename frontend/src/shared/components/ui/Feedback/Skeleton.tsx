import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  circle = false,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${
        circle ? 'rounded-full' : 'rounded-lg'
      } ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};
