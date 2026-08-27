import { create } from 'zustand';
import { apiClient } from '../../../shared/api/apiClient';
import { User, AuthResponse } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      isInitialized: true,
    }),

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      if (response.data?.success && response.data.data?.user) {
        set({
          user: response.data.data.user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },
}));
