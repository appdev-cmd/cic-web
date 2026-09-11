import { z } from 'zod';
export const serviceLocaleSchema=z.enum(['vi','en']);export const serviceIdSchema=z.coerce.number().int().positive();
export const serviceInputSchema=z.object({title:z.string().trim().min(1).max(255),alias:z.string().trim().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),summary:z.string().trim().max(10000),content:z.string().max(1_000_000),tags:z.string().trim().max(255),image:z.string().trim().max(2000),seoTitle:z.string().trim().max(255),seoKeywords:z.string().trim().max(255),seoDescription:z.string().trim().max(255),published:z.boolean(),ordering:z.coerce.number().int().min(0).max(1_000_000),relatedProductIds:z.array(z.coerce.number().int().positive()).max(100)});
export type ServiceInput=z.infer<typeof serviceInputSchema>;
