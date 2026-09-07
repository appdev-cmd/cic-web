import 'server-only';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { AppError } from '@/server/errors';
import { getPostgresClient } from '@/server/db/postgres';
import type { PermissionsGovernanceData } from '@/cms/data/GovernanceDataSource';
import type { CmsRole, MatrixAction, ModulePermissionMatrix } from '@/cms/modules/permission_management/types';

const text = (value: unknown) => typeof value === 'string' ? value : '';

export async function getCmsPermissionsData(): Promise<PermissionsGovernanceData> {
  const principal = await getCurrentCmsPrincipal();
  if (!can(principal, 'roles', 'view') && !can(principal, 'permissions', 'view')) throw new AppError('Permission denied.', 'FORBIDDEN');
  const sql = getPostgresClient();
  const [roleRows, permissionRows, taskRows, assignmentRows, userRows] = await Promise.all([
    sql`SELECT id,code,name,description,status,is_protected,updated_at,updated_by FROM cic_roles ORDER BY name`,
    sql`SELECT role_id,permission_task_id,action FROM cic_role_permissions WHERE allowed=true`,
    sql`SELECT id,module,view,_task,description,published,ordering FROM cic_permission_tasks WHERE published=true AND lower(module) NOT IN ('menu','menus') ORDER BY module,ordering,id`,
    sql`SELECT ur.id,ur.user_id,ur.role_id,ur.assigned_at,ur.assigned_by,u.username,u.email,u.full_name,u.fname,u.lname,u.image FROM cic_user_roles ur JOIN cic_users u ON u.id=ur.user_id WHERE ur.status='active' AND u.account_status='active' AND u.published IS DISTINCT FROM false AND NOT EXISTS (SELECT 1 FROM cic_trash_items ti WHERE ti.entity_type='user' AND ti.entity_id=u.id::text AND ti.status='trashed') ORDER BY ur.assigned_at DESC`,
    sql`SELECT id,username,email,full_name,fname,lname,image,agencies FROM cic_users u WHERE account_status='active' AND published IS DISTINCT FROM false AND NOT EXISTS (SELECT 1 FROM cic_trash_items ti WHERE ti.entity_type='user' AND ti.entity_id=u.id::text AND ti.status='trashed') ORDER BY username`,
  ]);
  const assignmentCounts = new Map<number, number>();
  for (const row of assignmentRows) assignmentCounts.set(Number(row.role_id), (assignmentCounts.get(Number(row.role_id)) ?? 0) + 1);
  const roles: CmsRole[] = roleRows.map((row) => {
    const matrix: ModulePermissionMatrix = {};
    for (const permission of permissionRows) {
      if (Number(permission.role_id) !== Number(row.id)) continue;
      const taskId = String(permission.permission_task_id);
      matrix[taskId] = { ...matrix[taskId], [String(permission.action) as MatrixAction]: 'allowed' };
    }
    return { id: String(row.id), code: String(row.code), name: String(row.name), description: text(row.description), status: row.status as CmsRole['status'], isProtected: Boolean(row.is_protected), matrix, assignedUsersCount: assignmentCounts.get(Number(row.id)) ?? 0, updatedTime: String(row.updated_at), updatedById: row.updated_by == null ? null : Number(row.updated_by) };
  });
  return {
    roles,
    tasks: taskRows.map((task) => ({ id: String(task.id), module: text(task.module), view: text(task.view), task: text(task._task), description: text(task.description), published: Boolean(task.published), ordering: Number(task.ordering ?? 0) })),
    users: userRows.map((user) => ({ id: String(user.id), username: text(user.username), fullName: text(user.full_name) || `${text(user.lname)} ${text(user.fname)}`.trim(), email: text(user.email), avatar: text(user.image), role: '', department: text(user.agencies) })),
    assignments: assignmentRows.map((row) => ({ id: String(row.id), userId: String(row.user_id), username: text(row.username), userFullName: text(row.full_name) || `${text(row.lname)} ${text(row.fname)}`.trim(), userEmail: text(row.email), avatar: text(row.image), roleId: String(row.role_id), roleName: roles.find((role) => role.id === String(row.role_id))?.name ?? '', assignedAt: String(row.assigned_at), assignedBy: String(row.assigned_by ?? '') })),
    functions: [], fields: [], userPermissions: {}, issues: [], reviews: [], agencies: [],
  };
}
