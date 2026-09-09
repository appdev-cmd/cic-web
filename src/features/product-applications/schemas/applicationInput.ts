import { z } from 'zod';

export const applicationLocaleSchema = z.enum(['vi', 'en']);
export const applicationIdSchema = z.coerce.number().int().positive();
export const productApplicationInputSchema = z.object({
  name: z.string().trim().min(1, 'Tên lĩnh vực ứng dụng là bắt buộc.').max(255),
  alias: z
    .string()
    .trim()
    .min(1, 'Tên hiệu là bắt buộc.')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tên hiệu không hợp lệ.'),
  ordering: z.coerce.number().int().min(1).max(1_000_000),
  published: z.boolean(),
});

export type ProductApplicationInput = z.infer<typeof productApplicationInputSchema>;
