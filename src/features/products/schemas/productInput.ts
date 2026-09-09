import { z } from 'zod';

const id = z.coerce.number().int().positive();
const text = (max = 255) => z.string().trim().max(max).optional().default('');
export const productLocaleSchema = z.enum(['vi', 'en']);
export const productIdSchema = id;
export const productInputSchema = z.object({
  name: z.string().trim().min(1).max(255), alias: z.string().trim().min(1).max(255), code: text(), other_languages1: text(),
  summary: text(20_000), description: text(500_000), feature_details: text(500_000), video: text(100_000), tawk_to: text(100_000),
  image: text(2_000), icon: text(2_000), price: text(), tags: z.array(z.string().trim().min(1).max(100)).max(30), landing_page: text(2_000), seo_title: text(), seo_keyword: text(2_000), seo_description: text(10_000),
  file_catalogue: text(), file_price: text(2_000), link_catalogue: text(2_000), file_driver_name: text(), file_driver: text(2_000), link_driver: text(2_000),
  downloads: z.array(z.object({ name: text(), file: text(2_000), link: text(2_000) })).max(6),
  categoryIds: z.array(id).min(1), applicationIds: z.array(id), relatedProductIds: z.array(id), manufactoryId: id.nullable(), typeId: id.nullable(),
  published: z.boolean(), is_hot: z.boolean(), teamview: z.boolean(), ordering: z.coerce.number().int().min(0).max(1_000_000),
});
export type ProductInput = z.infer<typeof productInputSchema>;
