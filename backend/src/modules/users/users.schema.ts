import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .trim()
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio maksimal 500 karakter')
    .trim()
    .nullable()
    .optional(),
  avatar: z
    .string()
    .max(500, 'URL avatar maksimal 500 karakter')
    .trim()
    .nullable()
    .optional(),
  blogTitle: z
    .string()
    .min(2, 'Judul blog minimal 2 karakter')
    .max(100, 'Judul blog maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
  socialTwitter: z
    .string()
    .max(100, 'Username / URL Twitter maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
  socialGithub: z
    .string()
    .max(100, 'Username / URL GitHub maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
  socialLinkedin: z
    .string()
    .max(100, 'Username / URL LinkedIn maksimal 100 karakter')
    .trim()
    .nullable()
    .optional(),
});

export const usernameParamSchema = z.object({
  username: z
    .string({ required_error: 'Username wajib disertakan' })
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username hanya boleh huruf, angka, dan underscore (_)'
    )
    .toLowerCase()
    .trim(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
