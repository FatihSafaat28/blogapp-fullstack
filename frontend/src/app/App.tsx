import React, { useEffect } from 'react';
import { Providers } from './providers';
import { AppRouter } from './router';
import { useAuthStore } from '../features/auth/stores/authStore';

const AppContent: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AppRouter />;
};

export const App: React.FC = () => {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
};
