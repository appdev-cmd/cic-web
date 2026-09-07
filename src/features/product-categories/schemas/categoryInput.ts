import { z } from 'zod';
export const categoryLocaleSchema=z.enum(['vi','en']); export const categoryIdSchema=z.coerce.number().int().positive();
export const productCategoryInputSchema=z.object({name:z.string().trim().min(1,'Tên danh mục là bắt buộc.').max(250),alias:z.string().trim().min(1,'Alias là bắt buộc.').max(250).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Alias chỉ gồm chữ thường, số và dấu gạch ngang.'),description:z.string().trim().max(20_000).nullable(),parentId:z.union([z.coerce.number().int().positive(),z.null()]),ordering:z.coerce.number().int().min(0).max(1_000_000),published:z.boolean()});
export type ProductCategoryInput=z.infer<typeof productCategoryInputSchema>;
