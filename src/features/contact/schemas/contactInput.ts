import { z } from 'zod';
export const contactInputSchema = z.object({ email: z.string().email().max(255), fullname: z.string().trim().max(255).optional(), telephone: z.string().max(255).optional(), subject: z.string().max(255).optional(), message: z.string().max(10000).optional() });
export type ContactInput = z.infer<typeof contactInputSchema>;
