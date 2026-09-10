import { z } from 'zod';

const id = z.coerce.number().int().positive();
const text = (max = 255) => z.string().trim().max(max).optional().default('');

export const newsLocaleSchema = z.enum(['vi', 'en']);
export const newsIdSchema = id;
export const newsInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  alias: z.string().trim().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  other_languages1: text(2_000),
  categoryId: id,
  summary: text(20_000),
  content: text(500_000),
  image: text(2_000),
  video: text(100_000),
  fileUpload: text(2_000),
  tags: z.array(z.string().trim().min(1).max(100)).max(50),
  relatedNewsIds: z.array(id).max(100),
  relatedProductIds: z.array(id).max(100),
  startTime: z.string().trim().min(1),
  endTime: z.string().trim().optional().default(''),
  published: z.boolean(),
  isHot: z.boolean(),
  showInHomepage: z.boolean(),
  ordering: z.coerce.number().int().min(0).max(1_000_000),
  seoTitle: text(),
  seoKeyword: text(2_000),
  seoDescription: text(10_000),
  tawkTo: text(100_000),
});

export type NewsInput = z.infer<typeof newsInputSchema>;
