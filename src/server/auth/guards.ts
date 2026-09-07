import 'server-only';
import { cache } from 'react';
import type { User } from '@supabase/supabase-js';
import { getDatabaseClient } from '@/server/db/foundation';
import { getPostgresClient } from '@/server/db/postgres';
import { AppError } from '@/server/errors';

export type CmsPermission = Readonly<{ module: string; action: string }>;
export type CmsPrincipal = Readonly<{ authUser: User; legacyUserId: number; email: string; username: string; fullName: string; roleCodes: readonly string[]; permissions: readonly CmsPermission[]; isAdministrator: boolean }>;
const normalize = (value: string) => value.trim().toLowerCase();

export const requireAuthenticatedUser = cache(async function requireAuthenticatedUser() {
  const client = await getDatabaseClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new AppError('Authentication required.', 'UNAUTHENTICATED', error);
  return data.user;
});

/** Resolves the request session to the active CMS profile and effective RBAC projection. */
export const getCurrentCmsPrincipal = cache(async function getCurrentCmsPrincipal(): Promise<CmsPrincipal> {
  const authUser = await requireAuthenticatedUser();
  // Profile and RBAC projections are trusted server reads so legacy table RLS
  // cannot prevent resolving an already authenticated identity.
  const sql = getPostgresClient();
  const [profile] = await sql`SELECT id,email,username,full_name,account_status,published FROM cic_users WHERE auth_user_id=${authUser.id}::uuid LIMIT 1`;
  if (!profile || profile.account_status !== 'active' || profile.published === false) throw new AppError('CMS access denied.', 'FORBIDDEN');

  const activeAssignments = await sql`SELECT ur.role_id,r.code FROM cic_user_roles ur JOIN cic_roles r ON r.id=ur.role_id WHERE ur.user_id=${profile.id} AND ur.status='active' AND r.status='active'`;
  const roleCodes = activeAssignments.map((assignment) => normalize(String(assignment.code)));
  const isAdministrator = roleCodes.some((code) => code === 'admin' || code === 'superadmin');
  const roleIds = activeAssignments.map((assignment) => Number(assignment.role_id));
  let permissions: CmsPermission[] = [];
  if (!isAdministrator && roleIds.length > 0) {
    const rows = await sql`SELECT rp.action,pt.module FROM cic_role_permissions rp JOIN cic_permission_tasks pt ON pt.id=rp.permission_task_id WHERE rp.role_id IN ${sql(roleIds)} AND rp.allowed=true`;
    permissions = rows.map((row) => ({ module: normalize(String(row.module)), action: normalize(String(row.action)) }));
  }
  return { authUser, legacyUserId: Number(profile.id), email: String(profile.email ?? authUser.email ?? ''), username: String(profile.username ?? ''), fullName: String(profile.full_name ?? profile.username ?? authUser.email ?? ''), roleCodes, permissions, isAdministrator };
});

export const requireCmsAccess = getCurrentCmsPrincipal;
export function can(principal: CmsPrincipal, module: string, action: string): boolean {
  if (principal.isAdministrator) return true;
  const expectedModule = normalize(module);
  const expectedAction = normalize(action);
  return principal.permissions.some((permission) => permission.module === expectedModule && permission.action === expectedAction);
}
export async function requirePermission(module: string, action: string): Promise<CmsPrincipal> {
  const principal = await getCurrentCmsPrincipal();
  if (!can(principal, module, action)) throw new AppError('Permission denied.', 'FORBIDDEN');
  return principal;
}
