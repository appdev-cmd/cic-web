import { z } from 'zod';

export const eventInputSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề sự kiện không được để trống').max(255),
  alias: z.string().trim().min(1, 'Alias sự kiện không được để trống').max(255),
  chuDe: z.string().trim().max(255).default(''),
  place: z.string().trim().max(255).default(''),
  timeEvent: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
  endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
  specificTime: z.string().trim().max(255).default(''),
  linkDangky: z.string().trim().max(500).default(''),
  summary: z.string().default(''),
  content: z.string().min(1, 'Nội dung sự kiện không được để trống'),
  image: z.string().default(''),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  isHot: z.boolean().default(false),
  showInHomepage: z.boolean().default(false),
  ordering: z.number().int().default(1),
  seoTitle: z.string().trim().max(255).default(''),
  seoKeyword: z.string().trim().max(255).default(''),
  seoDescription: z.string().default(''),
  tawkTo: z.string().default(''),
  productsRelated: z.array(z.string()).default([]),
  newsRelated: z.array(z.string()).default([]),
  eventRelated: z.array(z.string()).default([]),
}).refine((data) => {
  const start = new Date(data.timeEvent).getTime();
  const end = new Date(data.endTime).getTime();
  return Number.isFinite(start) && Number.isFinite(end) && end > start;
}, {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu.',
  path: ['endTime'],
});

export type EventInput = z.infer<typeof eventInputSchema>;
