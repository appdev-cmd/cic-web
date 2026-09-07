import { z } from 'zod';

export const accountStatusSchema = z.enum(['active', 'suspended', 'deactivated', 'pending_invite']);
const editableUserFields = z.object({
  username: z.string().trim().min(3).max(50).regex(/^[A-Za-z0-9._-]+$/),
  email: z.string().trim().email().max(50),
  fname: z.string().trim().max(50),
  lname: z.string().trim().max(50),
  phone: z.string().trim().max(20),
  address: z.string().trim().max(255),
  summary: z.string().trim().max(5000),
  avatar: z.string().trim().max(255).refine((value) => !value || /^(https?:\/\/|\/)/i.test(value), 'Avatar phải là URL hoặc đường dẫn website hợp lệ.'),
  status: accountStatusSchema,
  roleId: z.coerce.number().int().positive(),
  agencies: z.array(z.coerce.number().int().positive()).max(100),
  statusReason: z.string().trim().max(1000),
});
export const createUserInputSchema = editableUserFields.extend({ password: z.string().min(8).max(128) });
export const updateUserInputSchema = editableUserFields.extend({ password: z.string().min(8).max(128).optional() });
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
