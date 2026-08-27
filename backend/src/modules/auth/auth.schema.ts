import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Nama lengkap wajib diisi' })
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .trim(),
  username: z
    .string({ required_error: 'Username wajib diisi' })
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username hanya boleh berisi huruf, angka, dan underscore (_)'
    )
    .toLowerCase()
    .trim(),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid')
    .max(100, 'Email maksimal 100 karakter')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Password harus mengandung setidaknya 1 huruf dan 1 angka'
    ),
});

export const loginSchema = z.object({
  identifier: z
    .string({ required_error: 'Email atau username wajib diisi' })
    .min(1, 'Email atau username wajib diisi')
    .trim(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(1, 'Password wajib diisi'),
  rememberMe: z.boolean().optional().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
