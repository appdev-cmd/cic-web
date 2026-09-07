import {z} from 'zod';
export const brandLocaleSchema=z.enum(['vi','en']),brandIdSchema=z.coerce.number().int().positive();
export const productBrandInputSchema=z.object({name:z.string().trim().min(1,'Tên hãng là bắt buộc.').max(255),alias:z.string().trim().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),ordering:z.coerce.number().int().min(1).max(1_000_000),published:z.boolean()});
export type ProductBrandInput=z.infer<typeof productBrandInputSchema>;
