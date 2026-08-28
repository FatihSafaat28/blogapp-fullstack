import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { Spinner } from '../shared/components/ui/Feedback/Spinner';

export const PublicOnlyRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore();

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-canvas text-ink-secondary">
        <Spinner size="lg" color="primary" />
        <span className="text-sm font-semibold animate-pulse">
          Memeriksa sesi...
        </span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
