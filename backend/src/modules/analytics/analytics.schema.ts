import { z } from 'zod';

export const recordViewParamSchema = z.object({
  postId: z.string({ required_error: 'ID artikel wajib disertakan' }).uuid({
    message: 'Format ID artikel tidak valid (harus UUID)',
  }),
});

export const dashboardAnalyticsQuerySchema = z.object({
  range: z.enum(['7d', '30d']).default('7d'),
});

export type DashboardAnalyticsQueryInput = z.infer<
  typeof dashboardAnalyticsQuerySchema
>;
