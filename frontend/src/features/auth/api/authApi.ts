import { apiClient } from '../../../shared/api/apiClient';
import type { AuthResponse, ApiResponse } from '../types/auth.types';
import type { LoginFormData, RegisterFormData } from '../schemas/authValidation';

export const authApi = {
  login: async (payload: LoginFormData): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  register: async (payload: RegisterFormData): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const res = await apiClient.get<AuthResponse>('/auth/me');
    return res.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/logout');
    return res.data;
  },
};
