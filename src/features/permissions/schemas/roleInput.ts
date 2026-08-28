import { z } from 'zod';

export const permissionActionSchema = z.enum(['view', 'create', 'edit', 'delete', 'publish', 'export', 'configure']);
export const roleInputSchema = z.object({
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().max(5000).default(''),
  status: z.enum(['active', 'inactive']).default('active'),
  permissions: z.array(z.object({ module: z.string().trim().min(1).max(255), action: permissionActionSchema })).max(1000).default([]),
});
export const roleIdSchema = z.coerce.number().int().positive();
export const assignmentInputSchema = z.object({ userId: z.coerce.number().int().positive(), roleId: roleIdSchema });
export type RoleInput = z.infer<typeof roleInputSchema>;
