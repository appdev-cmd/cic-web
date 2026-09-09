import { z } from 'zod';

const ids=z.array(z.coerce.number().int().positive()).max(1000).transform(values=>[...new Set(values)]);
export const salesOwnerLocaleSchema=z.enum(['vi','en']);
export const salesOwnerIdSchema=z.coerce.number().int().positive();
export const salesOwnerInputSchema=z.object({
  name:z.string().trim().min(1,'Tên nhân viên là bắt buộc.').max(255),
  alias:z.string().trim().min(1,'Tên hiệu là bắt buộc.').max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Tên hiệu không hợp lệ.'),
  phone:z.string().trim().max(225), skype:z.string().trim().max(255), zalo:z.string().trim().max(255),
  ordering:z.coerce.number().int().min(1).max(1_000_000), published:z.boolean(),
  assignments:z.object({contact:ids,sales:ids,technical:ids,northSales:ids,southSales:ids}),
});
export type SalesOwnerInput=z.infer<typeof salesOwnerInputSchema>;
