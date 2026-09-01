import { z } from 'zod';

export const createDraftSchema = z.object({
  title: z
    .string()
    .max(200, 'Judul maksimal 200 karakter')
    .trim()
    .optional()
    .default('Untitled Post'),
});

export const updatePostSchema = z.object({
  title: z
    .string({ required_error: 'Judul artikel wajib diisi' })
    .min(2, 'Judul artikel minimal 2 karakter')
    .max(200, 'Judul artikel maksimal 200 karakter')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .max(220, 'Slug maksimal 220 karakter')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)'
    )
    .trim()
    .optional(),
  coverImage: z.string().max(500).trim().nullable().optional(),
  contentHtml: z.string().optional(),
  contentJson: z.unknown().optional(),
  excerpt: z
    .string()
    .max(500, 'Excerpt maksimal 500 karakter')
    .trim()
    .nullable()
    .optional(),
  tags: z
    .array(
      z
        .string()
        .min(2, 'Tag minimal 2 karakter')
        .max(30, 'Tag maksimal 30 karakter')
        .trim()
    )
    .max(5, 'Maksimal 5 tag per artikel')
    .optional()
    .default([]),
});

export const publishToggleSchema = z.object({
  published: z.boolean({
    required_error: 'Status publikasi (true/false) wajib ditentukan',
  }),
});

export const exploreQuerySchema = z.object({
  tab: z.enum(['trending', 'for-you', 'latest']).default('trending'),
  tag: z.string().trim().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const dashboardQuerySchema = z.object({
  status: z.enum(['all', 'published', 'draft']).default('all'),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateDraftInput = z.infer<typeof createDraftSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PublishToggleInput = z.infer<typeof publishToggleSchema>;
export type ExploreQueryInput = z.infer<typeof exploreQuerySchema>;
export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
