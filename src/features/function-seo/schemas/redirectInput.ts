import { z } from 'zod';

export const redirectInputSchema = z.object({
  id: z.number().optional(),
  sourcePath: z.string().trim().min(1, 'URL cũ không được để trống').refine((val) => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
    message: 'URL cũ phải bắt đầu bằng dấu / hoặc http(s)://',
  }),
  targetPath: z.string().trim().min(1, 'URL đích không được để trống'),
  statusCode: z.union([z.literal(301), z.literal(302)]),
  source: z.string().optional().default('Thủ công'),
  isActive: z.boolean().optional().default(true),
  note: z.string().nullable().optional(),
});

export type RedirectInput = z.infer<typeof redirectInputSchema>;
