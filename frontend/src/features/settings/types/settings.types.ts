import type { User } from '../../auth/types/auth.types';

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string | null;
  avatar?: string | null;
  blogTitle?: string | null;
  socialTwitter?: string | null;
  socialGithub?: string | null;
  socialLinkedin?: string | null;
}

export interface UploadMediaResponse {
  success: boolean;
  message?: string;
  data: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
}

export type SettingsTab = 'profile' | 'blog' | 'social';
