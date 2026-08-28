import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z
    .string({ required_error: 'Nama lengkap wajib diisi' })
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .trim(),
  bio: z
    .string()
    .max(500, 'Bio maksimal 500 karakter')
    .trim()
    .nullable()
    .optional(),
  avatar: z
    .string()
    .max(500, 'URL avatar tidak valid')
    .trim()
    .nullable()
    .optional(),
  blogTitle: z
    .string()
    .max(100, 'Judul blog maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
  socialTwitter: z
    .string()
    .max(100, 'Username / tautan Twitter maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
  socialGithub: z
    .string()
    .max(100, 'Username / tautan GitHub maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
  socialLinkedin: z
    .string()
    .max(100, 'Username / tautan LinkedIn maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
