import { z } from 'zod';

export const productTypeLocaleSchema = z.enum(['vi', 'en']);
export const productTypeIdSchema = z.coerce.number().int().positive();
export const productTypeInputSchema = z.object({
  name: z.string().trim().min(1, 'Tên loại sản phẩm là bắt buộc.').max(255),
  alias: z.string().trim().min(1, 'Tên hiệu là bắt buộc.').max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tên hiệu không hợp lệ.'),
  ordering: z.coerce.number().int().min(1).max(1_000_000),
  published: z.boolean(),
});

export type ProductTypeInput = z.infer<typeof productTypeInputSchema>;
