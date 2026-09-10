import { z } from 'zod';

export const newsCategoryLocaleSchema = z.enum(['vi', 'en']);
export const newsCategoryIdSchema = z.coerce.number().int().positive();
const nullableText = (limit: number) => z.union([z.string().trim().max(limit), z.null()]).transform((value) => value || null);

export const newsCategoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Tên danh mục là bắt buộc.').max(250),
  title: nullableText(255),
  alias: z.string().trim().min(1, 'Đường dẫn là bắt buộc.').max(250).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Đường dẫn chỉ gồm chữ thường, số và dấu gạch ngang.'),
  summary: nullableText(20_000),
  parentId: z.union([z.coerce.number().int().positive(), z.null()]),
  ordering: z.coerce.number().int().min(0).max(1_000_000),
  image: nullableText(2_000),
  published: z.boolean(),
  showInHomepage: z.boolean(),
  seoTitle: nullableText(255),
  seoKeyword: nullableText(255),
  seoDescription: nullableText(255),
});

export type NewsCategoryInput = z.infer<typeof newsCategoryInputSchema>;
