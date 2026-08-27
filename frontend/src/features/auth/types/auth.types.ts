export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio: string | null;
  avatar: string | null;
  blogTitle: string | null;
  socialTwitter: string | null;
  socialGithub: string | null;
  socialLinkedin: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}
