import { z } from 'zod';

export const accountStatusSchema = z.enum(['active', 'suspended', 'deactivated', 'pending_invite']);
export const userInputSchema = z.object({
  username: z.string().trim().min(3).max(50).regex(/^[A-Za-z0-9._-]+$/),
  email: z.string().trim().email().max(50),
  password: z.string().min(8).max(128).optional(),
  fname: z.string().trim().max(50).default(''), lname: z.string().trim().max(50).default(''),
  phone: z.string().trim().max(20).default(''), country: z.string().trim().max(50).default('Việt Nam'),
  address: z.string().trim().max(255).default(''), summary: z.string().trim().max(5000).default(''),
  avatar: z.string().trim().max(255).default(''), status: accountStatusSchema,
  roleId: z.coerce.number().int().positive(), ordering: z.coerce.number().int().min(0).default(0),
  agencies: z.array(z.string().trim().min(1).max(100)).max(100).default([]),
  productCategories: z.array(z.string().trim().min(1).max(100)).max(500).default([]),
  newsCategories: z.array(z.string().trim().min(1).max(100)).max(500).default([]),
  twoFactorEnabled: z.boolean().default(false), statusReason: z.string().trim().max(1000).default(''),
});
export type UserInput = z.infer<typeof userInputSchema>;
