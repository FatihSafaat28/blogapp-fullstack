import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email atau username wajib diisi')
    .trim(),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi'),
  rememberMe: z.boolean().default(true),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(50, 'Nama lengkap maksimal 50 karakter')
    .trim(),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(
      /^[a-z0-9_]+$/,
      'Username hanya boleh berisi huruf kecil, angka, dan underscore (_)'
    )
    .trim(),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format alamat email tidak valid')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'Kata sandi harus mengandung kombinasi huruf dan angka'
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
