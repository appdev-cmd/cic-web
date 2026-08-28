'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { assignmentInputSchema, roleIdSchema, roleInputSchema } from '../schemas/roleInput';
import { assignRoleRecord, createRoleRecord, revokeRoleAssignment, setRoleStatus, updateRoleRecord } from './repository';

const refresh = () => revalidatePath('/cms', 'layout');
export async function createCmsRoleAction(payload: unknown) { const actor = await requirePermission('roles', 'create'); const id = await createRoleRecord(roleInputSchema.parse(payload), actor.legacyUserId); refresh(); return { id: String(id) }; }
export async function updateCmsRoleAction(id: string, payload: unknown) { const actor = await requirePermission('roles', 'edit'); await updateRoleRecord(roleIdSchema.parse(id), roleInputSchema.parse(payload), actor.legacyUserId); refresh(); }
export async function updateCmsRoleStatusAction(id: string, status: unknown) { const actor = await requirePermission('roles', 'edit'); await setRoleStatus(roleIdSchema.parse(id), z.enum(['active','inactive']).parse(status), actor.legacyUserId); refresh(); }
export async function assignCmsRoleAction(payload: unknown) { const actor = await requirePermission('roles', 'edit'); const input = assignmentInputSchema.parse(payload); const id = await assignRoleRecord(input.userId,input.roleId,actor.legacyUserId); refresh(); return { id: String(id) }; }
export async function revokeCmsRoleAssignmentAction(id: string) { const actor = await requirePermission('roles', 'edit'); await revokeRoleAssignment(roleIdSchema.parse(id),actor.legacyUserId); refresh(); }
