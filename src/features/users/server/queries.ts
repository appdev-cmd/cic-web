import 'server-only';
import { requirePermission } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import type { UsersGovernanceData } from '@/cms/data/GovernanceDataSource';
import type { CicUser, UserAccountStatus } from '@/cms/modules/cic_users/types';

const str = (value: unknown) => typeof value === 'string' ? value : '';
const list = (value: unknown) => str(value).split(',').map((item) => item.trim()).filter(Boolean);
const date = (value: unknown) => value ? String(value) : undefined;

export async function getCmsUsersData(): Promise<UsersGovernanceData> {
  await requirePermission('users','view');
  const sql=getPostgresClient();
  const [userRows,roleRows,assignments,branchRows,taskRows,rolePermissions]=await Promise.all([
    sql`SELECT id,username,email,fname,lname,full_name,phone,address,summary,image,account_status,agencies,password_changed_at,status_online,created_time,updated_time,last_visit_time,nums_visit FROM cic_users u WHERE NOT EXISTS (SELECT 1 FROM cic_trash_items ti WHERE ti.entity_type='user' AND ti.entity_id=u.id::text AND ti.status='trashed') ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,code,name,description,status FROM cic_roles WHERE status='active' ORDER BY name`,
    sql`SELECT user_id,role_id FROM cic_user_roles WHERE status='active' ORDER BY assigned_at DESC,id DESC`,
    sql`SELECT id,code,name FROM cic_branches WHERE workspace='vi' AND published=true ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,module,view,_task,description,published,ordering FROM cic_permission_tasks WHERE published=true ORDER BY module,ordering NULLS LAST,id`,
    sql`SELECT role_id,permission_task_id,action,allowed FROM cic_role_permissions WHERE allowed=true`,
  ]);
  const users: CicUser[] = userRows.map((row) => {
    const roleId = String(assignments.find((item) => item.user_id === row.id)?.role_id ?? '');
    return {
      id: String(row.id), username: str(row.username), email: str(row.email), fname: str(row.fname), lname: str(row.lname), full_name: str(row.full_name) || `${str(row.lname)} ${str(row.fname)}`.trim(), phone: str(row.phone), address: str(row.address), summary: str(row.summary), avatar: str(row.image), status: (row.account_status ?? 'deactivated') as UserAccountStatus, primaryRoleId: roleId, agencies: list(row.agencies), passwordChangedAt: date(row.password_changed_at), isOnline: row.status_online === true, created_time: date(row.created_time) ?? '', updated_time: date(row.updated_time), last_visit_time: date(row.last_visit_time), nums_visit: row.nums_visit ?? 0,
      status_history: [],
      security_logs: [],
    };
  });
  const tasks = taskRows.map((item) => ({ id: String(item.id), module: str(item.module), view: str(item.view), task: item._task, description: str(item.description), published: item.published, ordering: item.ordering ?? 0 }));
  const rolePermissionsByRole = Object.fromEntries(roleRows.map((role) => [String(role.id), rolePermissions.filter((item) => item.role_id === role.id).map((item) => ({ taskId: String(item.permission_task_id), action: str(item.action) }))]));
  return {
    users,
    roles: roleRows.map((item) => ({ id: String(item.id), name: String(item.name), description: str(item.description), permissions_count: new Set(rolePermissions.filter((permission) => permission.role_id === item.id).map((permission) => permission.permission_task_id)).size, badge_color: 'slate' })),
    agencies: branchRows.map((item) => ({ id: String(item.id), name: String(item.name), code: String(item.code) })),
    permissionTasks: tasks,
    rolePermissions: rolePermissionsByRole,
  };
}

export async function getCmsUserActivity(userId: number): Promise<Pick<CicUser, 'status_history' | 'security_logs'>> {
  await requirePermission('users', 'view');
  if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error('Tài khoản không hợp lệ.');
  const sql = getPostgresClient();
  const [target, histories, security] = await Promise.all([
    sql`SELECT id FROM cic_users WHERE id=${userId}`,
    sql`SELECT h.id,h.previous_status,h.new_status,h.reason,h.changed_at,coalesce(nullif(actor.full_name,''),nullif(actor.username,''),'Hệ thống') AS changed_by_label FROM cic_user_status_history h LEFT JOIN cic_users actor ON actor.id=h.changed_by WHERE h.user_id=${userId} ORDER BY h.changed_at DESC LIMIT 200`,
    sql`SELECT id,event_type,status,ip_address,user_agent,details,created_at FROM cic_security_events WHERE user_id=${userId} ORDER BY created_at DESC LIMIT 200`,
  ]);
  if (!target.length) throw new Error('Không tìm thấy tài khoản.');
  return {
    status_history: histories.map((item) => ({ id: String(item.id), timestamp: String(item.changed_at), previous_status: (item.previous_status ?? 'deactivated') as UserAccountStatus, new_status: item.new_status as UserAccountStatus, changed_by: str(item.changed_by_label), reason: str(item.reason) })),
    security_logs: security.map((item) => ({ id: String(item.id), timestamp: String(item.created_at), action: str(item.event_type), ip_address: String(item.ip_address ?? ''), user_agent: str(item.user_agent), status: item.status === 'failed' ? 'failed' : item.status === 'warning' ? 'warning' : 'success', details: str(item.details) })),
  };
}
