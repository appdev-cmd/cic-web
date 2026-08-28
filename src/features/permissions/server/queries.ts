import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { PermissionsGovernanceData } from '@/cms/data/GovernanceDataSource';
import type { CmsRole, MatrixAction, ModulePermissionMatrix } from '@/cms/modules/permission_management/types';

const text = (value: unknown) => typeof value === 'string' ? value : '';
const uiModule = (value: unknown) => text(value).trim().toUpperCase();

export async function getCmsPermissionsData(): Promise<PermissionsGovernanceData> {
  const db = await getDatabaseClient();
  const [rolesResult, permissionsResult, tasksResult, assignmentsResult, usersResult, branchesResult] = await Promise.all([
    db.from('cic_roles').select('id,code,name,description,status,is_protected,created_at,created_by,updated_at,updated_by').order('name'),
    db.from('cic_role_permissions').select('role_id,permission_task_id,action,allowed'),
    db.from('cic_permission_tasks').select('id,module,view,_task,description,published,ordering').eq('published', true).order('module').order('ordering'),
    db.from('cic_user_roles').select('id,user_id,role_id,assigned_at,assigned_by,status').eq('status', 'active').order('assigned_at', { ascending: false }),
    db.from('cic_users').select('id,username,email,full_name,fname,lname,image,agencies,account_status').order('username'),
    db.from('cic_branches').select('id,code,name').eq('workspace', 'vi').eq('published', true).order('ordering'),
  ]);
  const results = [rolesResult, permissionsResult, tasksResult, assignmentsResult, usersResult, branchesResult];
  if (results.some((result) => result.error)) throw new Error('Không thể tải dữ liệu phân quyền CMS.');
  const users = usersResult.data ?? [];
  const tasks = tasksResult.data ?? [];
  const permissionRows = permissionsResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];
  const actorName = (id: number | null) => users.find((user) => user.id === id)?.username ?? 'Hệ thống';
  const roles: CmsRole[] = (rolesResult.data ?? []).map((row) => {
    const matrix: ModulePermissionMatrix = {};
    for (const permission of permissionRows.filter((item) => item.role_id === row.id && item.allowed)) {
      const task = tasks.find((item) => item.id === permission.permission_task_id);
      if (!task) continue;
      const moduleCode = uiModule(task.module);
      const action = permission.action as MatrixAction;
      matrix[moduleCode] = { ...matrix[moduleCode], [action]: 'allowed' };
    }
    const assignedUsersCount = assignments.filter((item) => item.role_id === row.id).length;
    return {
      id: String(row.id), name: row.name, category: row.is_protected ? 'system' : 'custom', riskLevel: row.is_protected ? 'privileged' : 'standard',
      status: row.status, purpose: text(row.description) || row.name, description: text(row.description), owner: actorName(row.created_by), reviewer: actorName(row.updated_by),
      activeVersion: 1, versions: [], matrix, assignedUsersCount, assignedGroupCount: 0, conflictIssuesCount: 0,
      updatedTime: String(row.updated_at), updatedBy: actorName(row.updated_by),
    };
  });
  const roleById = new Map(roles.map((role) => [role.id, role]));
  const userById = new Map(users.map((user) => [String(user.id), user]));
  return {
    users: users.filter((user) => user.account_status !== 'deactivated').map((user) => ({ id: String(user.id), username: text(user.username), fullName: text(user.full_name) || `${text(user.lname)} ${text(user.fname)}`.trim(), email: text(user.email), avatar: text(user.image), role: '', department: text(user.agencies) })),
    tasks: tasks.map((task) => ({ id: String(task.id), module: text(task.module), view: text(task.view), task: task._task, description: text(task.description), published: task.published, ordering: task.ordering ?? 0 })),
    functions: [], fields: [], userPermissions: {}, roles,
    assignments: assignments.flatMap((assignment) => {
      const user = userById.get(String(assignment.user_id)); const role = roleById.get(String(assignment.role_id));
      return user && role ? [{ id: String(assignment.id), userId: String(user.id), username: text(user.username), userFullName: text(user.full_name) || `${text(user.lname)} ${text(user.fname)}`.trim(), userEmail: text(user.email), avatar: text(user.image), roleId: role.id, roleName: role.name, assignedAt: String(assignment.assigned_at), assignedBy: actorName(assignment.assigned_by) }] : [];
    }),
    issues: [], reviews: [], agencies: (branchesResult.data ?? []).map((branch) => ({ id: String(branch.id), code: branch.code, name: branch.name })),
  };
}
