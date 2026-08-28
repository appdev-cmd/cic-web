import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { UsersGovernanceData } from '@/cms/data/GovernanceDataSource';
import type { CicUser, UserAccountStatus } from '@/cms/modules/cic_users/types';

const str = (value: unknown) => typeof value === 'string' ? value : '';
const list = (value: unknown) => str(value).split(',').map((item) => item.trim()).filter(Boolean);
const date = (value: unknown) => value ? String(value) : undefined;

export async function getCmsUsersData(): Promise<UsersGovernanceData> {
  const db = await getDatabaseClient();
  const [usersResult, rolesResult, assignmentsResult, historyResult, securityResult, branchesResult, productCategoriesResult, newsCategoriesResult, tasksResult, rolePermissionsResult] = await Promise.all([
    db.from('cic_users').select('id,username,email,fname,lname,full_name,phone,country,address,summary,image,account_status,ordering,agencies,products_categories,news_categories,two_factor_enabled,password_changed_at,failed_login_attempts,status_online,created_time,updated_time,last_visit_time,nums_visit').order('ordering').order('id'),
    db.from('cic_roles').select('id,code,name,description,status').eq('status', 'active').order('name'),
    db.from('cic_user_roles').select('user_id,role_id').eq('status', 'active'),
    db.from('cic_user_status_history').select('id,user_id,previous_status,new_status,reason,changed_at,changed_by').order('changed_at', { ascending: false }),
    db.from('cic_security_events').select('id,user_id,event_type,status,ip_address,user_agent,details,created_at').order('created_at', { ascending: false }),
    db.from('cic_branches').select('id,code,name').eq('workspace', 'vi').eq('published', true).order('ordering'),
    db.from('cic_products_categories').select('id,code,name').eq('published', true).order('ordering'),
    db.from('cic_news_categories').select('id,alias,name').eq('published', true).order('ordering'),
    db.from('cic_permission_tasks').select('id,module,view,_task,description,published,ordering').eq('published', true).order('module').order('ordering'),
    db.from('cic_role_permissions').select('role_id,permission_task_id,action,allowed').eq('allowed', true),
  ]);
  const results = [usersResult, rolesResult, assignmentsResult, historyResult, securityResult, branchesResult, productCategoriesResult, newsCategoriesResult, tasksResult, rolePermissionsResult];
  if (results.some((result) => result.error)) throw new Error('Unable to load CMS users.');
  const assignments = assignmentsResult.data ?? [];
  const histories = historyResult.data ?? [];
  const security = securityResult.data ?? [];
  const rolePermissions = rolePermissionsResult.data ?? [];
  const users: CicUser[] = (usersResult.data ?? []).map((row) => {
    const roleId = String(assignments.find((item) => item.user_id === row.id)?.role_id ?? '');
    return {
      id: String(row.id), username: str(row.username), email: str(row.email), fname: str(row.fname), lname: str(row.lname), full_name: str(row.full_name) || `${str(row.lname)} ${str(row.fname)}`.trim(), phone: str(row.phone), country: str(row.country), address: str(row.address), summary: str(row.summary), avatar: str(row.image), status: (row.account_status ?? 'deactivated') as UserAccountStatus, primaryRoleId: roleId, ordering: row.ordering ?? 0, agencies: list(row.agencies), products_categories: list(row.products_categories), news_categories: list(row.news_categories), two_factor_enabled: row.two_factor_enabled, passwordChangedAt: date(row.password_changed_at), failed_login_attempts: row.failed_login_attempts ?? 0, isOnline: row.status_online === true, created_time: date(row.created_time) ?? '', updated_time: date(row.updated_time), last_visit_time: date(row.last_visit_time), nums_visit: row.nums_visit ?? 0,
      status_history: histories.filter((item) => item.user_id === row.id).map((item) => ({ id: String(item.id), timestamp: String(item.changed_at), previous_status: (item.previous_status ?? 'deactivated') as UserAccountStatus, new_status: item.new_status as UserAccountStatus, changed_by: String(item.changed_by ?? ''), reason: str(item.reason) })),
      security_logs: security.filter((item) => item.user_id === row.id).map((item) => ({ id: String(item.id), timestamp: String(item.created_at), action: item.event_type, ip_address: String(item.ip_address ?? ''), user_agent: str(item.user_agent), status: item.status === 'failed' ? 'failed' : item.status === 'warning' ? 'warning' : 'success', details: str(item.details) })),
    };
  });
  const tasks = (tasksResult.data ?? []).map((item) => ({ id: String(item.id), module: str(item.module), view: str(item.view), task: item._task, description: str(item.description), published: item.published, ordering: item.ordering ?? 0 }));
  const userPermissions = Object.fromEntries(users.map((user) => {
    const roleId = Number(user.primaryRoleId);
    const grantedTaskIds = rolePermissions.filter((item) => item.role_id === roleId).map((item) => String(item.permission_task_id));
    return [user.id, { userId: user.id, grantedTaskIds: [...new Set(grantedTaskIds)], grantedFunctionIds: [], grantedFieldIds: [] }];
  }));
  return {
    users,
    roles: (rolesResult.data ?? []).map((item) => ({ id: String(item.id), name: item.name, description: str(item.description), permissions_count: new Set(rolePermissions.filter((permission) => permission.role_id === item.id).map((permission) => permission.permission_task_id)).size, badge_color: 'slate' })),
    agencies: (branchesResult.data ?? []).map((item) => ({ id: String(item.id), name: item.name, code: item.code })),
    productCategories: (productCategoriesResult.data ?? []).map((item) => ({ id: String(item.id), name: str(item.name), code: str(item.code) })),
    newsCategories: (newsCategoriesResult.data ?? []).map((item) => ({ id: String(item.id), name: str(item.name), code: str(item.alias) })),
    permissionTasks: tasks,
    userPermissions,
  } as UsersGovernanceData;
}
