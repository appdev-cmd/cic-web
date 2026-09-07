'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { AppError } from '@/server/errors';
import { assignmentInputSchema, roleIdSchema, roleInputSchema } from '../schemas/roleInput';
import { assignRoleRecord, createRoleRecord, revokeRoleAssignment, setRoleStatus, trashRoleRecord, updateRoleRecord } from './repository';

async function requireRolePermission(action: string) {
  const principal = await getCurrentCmsPrincipal();
  if (!can(principal, 'roles', action) && !can(principal, 'permissions', action)) throw new AppError('Permission denied.', 'FORBIDDEN');
  return principal;
}
const refresh = () => revalidatePath('/cms', 'layout');
export async function createCmsRoleAction(payload: unknown) { const actor = await requireRolePermission('create'); const id = await createRoleRecord(roleInputSchema.parse(payload), actor); refresh(); return { id: String(id) }; }
export async function updateCmsRoleAction(id: string, payload: unknown) { const actor = await requireRolePermission('edit'); await updateRoleRecord(roleIdSchema.parse(id), roleInputSchema.parse(payload), actor); refresh(); }
export async function updateCmsRoleStatusAction(id: string, status: unknown) { const actor = await requireRolePermission('edit'); await setRoleStatus(roleIdSchema.parse(id), z.enum(['active', 'inactive']).parse(status), actor); refresh(); }
export async function assignCmsRoleAction(payload: unknown) { const actor = await requireRolePermission('edit'); const input = assignmentInputSchema.parse(payload); const id = await assignRoleRecord(input.userId, input.roleId, actor); refresh(); return { id: String(id) }; }
export async function revokeCmsRoleAssignmentAction(id: string) { const actor = await requireRolePermission('edit'); await revokeRoleAssignment(roleIdSchema.parse(id), actor); refresh(); }
export async function deleteCmsRoleAction(id: string) { const actor = await requireRolePermission('delete'); const result = await trashRoleRecord(roleIdSchema.parse(id), actor); refresh(); return { trashId: result.trashId }; }
