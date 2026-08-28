import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { AppError } from '@/server/errors';

export async function requireAuthenticatedUser() {
  const client = await getDatabaseClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new AppError('Authentication required.', 'UNAUTHENTICATED');
  return data.user;
}

/** Minimal guard until role/permission tables are migrated; all CMS writes require an authenticated session. */
export async function requireCmsAccess() {
  const authUser = await requireAuthenticatedUser();
  const client = await getDatabaseClient();
  const { data, error } = await client.from('cic_users').select('id,account_status,published').eq('email', authUser.email ?? '').maybeSingle();
  if (error || !data || data.account_status !== 'active' || data.published === false) throw new AppError('CMS access denied.', 'FORBIDDEN');
  return { authUser, legacyUserId: data.id as number };
}

export async function requirePermission(module: string, action: string) {
  const user = await requireCmsAccess();
  const client = await getDatabaseClient();
  const { data: assignments, error } = await client.from('cic_user_roles').select('role_id,cic_roles!inner(code,status)').eq('user_id', user.legacyUserId).eq('status', 'active');
  if (error || !assignments?.length) throw new AppError('Permission denied.', 'FORBIDDEN');
  const isAdministrator = assignments.some((assignment) => {
    const role = assignment.cic_roles as unknown as { code?: string; status?: string } | null;
    return role?.status === 'active' && (role.code === 'admin' || role.code === 'superadmin');
  });
  if (isAdministrator) return user;
  const roleIds = assignments.map((item) => item.role_id);
  const { data: permissions, error: permissionError } = await client.from('cic_role_permissions').select('role_id,action,allowed,cic_permission_tasks!inner(module)').in('role_id', roleIds).eq('action', action).eq('allowed', true);
  if (permissionError || !permissions?.some((item) => (item.cic_permission_tasks as { module?: string } | null)?.module?.toLowerCase() === module.toLowerCase())) throw new AppError('Permission denied.', 'FORBIDDEN');
  return user;
}
