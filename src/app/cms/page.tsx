import { CmsShellClient } from './CmsShellClient';
import { requireCmsAccess } from '@/server/auth/guards';
import { getCmsDashboardData } from '@/features/dashboard/server/queries';
import { getCmsSearchRecords } from '@/features/cms-search/server/queries';
import { getDatabaseClient } from '@/server/db/foundation';
import { getCmsUsersData } from '@/features/users/server/queries';
import { getCmsPermissionsData } from '@/features/permissions/server/queries';
import { getCmsSystemSettingsData } from '@/features/system-settings/server/queries';
import { getFunctionSeoData } from '@/features/function-seo/server/queries';

export default async function CmsFoundationPage() {
  const access = await requireCmsAccess();
  const db = await getDatabaseClient();
  const { data: assignments, error } = await db.from('cic_user_roles').select('role_id,cic_roles!inner(code,status)').eq('user_id', access.legacyUserId).eq('status', 'active');
  if (error) throw new Error('Unable to resolve CMS search permissions.');
  const roleCodes = (assignments ?? []).flatMap((item) => {
    const role = item.cic_roles as unknown as { code?: string; status?: string } | null;
    return role?.status === 'active' && role.code ? [role.code] : [];
  });
  const userRole = roleCodes.includes('superadmin') ? 'superadmin' : roleCodes.includes('admin') ? 'admin' : roleCodes[0] ?? 'authenticated';
  const isAdministrator = ['admin', 'superadmin'].includes(userRole);
  let allowedModules: string[] | null = null;
  let allowedPermissionRows: Array<{ module: string; action: string }> = [];
  if (!isAdministrator) {
    const roleIds = (assignments ?? []).map((item) => item.role_id);
    const { data: permissions, error: permissionsError } = roleIds.length
      ? await db.from('cic_role_permissions').select('action,cic_permission_tasks!inner(module)').in('role_id', roleIds).eq('allowed', true)
      : { data: [], error: null };
    if (permissionsError) throw new Error('Unable to resolve CMS search permissions.');
    allowedPermissionRows = (permissions ?? []).flatMap((item) => {
      const task = item.cic_permission_tasks as unknown as { module?: string } | null;
      return task?.module ? [{ module: task.module, action: item.action }] : [];
    });
    allowedModules = [...new Set(allowedPermissionRows.filter((item) => item.action === 'view').map((item) => item.module))];
  }
  const canViewUsers = isAdministrator || (allowedModules ?? []).includes('users');
  const canViewPermissions = isAdministrator || (allowedModules ?? []).some((module) => ['roles', 'permissions'].includes(module.toLowerCase()));
  const canViewSettings = isAdministrator || (allowedModules ?? []).some((module) => ['settings', 'config'].includes(module.toLowerCase()));
  const userCapabilities = { create: isAdministrator || allowedPermissionRows.some((item) => item.module === 'users' && item.action === 'create'), edit: isAdministrator || allowedPermissionRows.some((item) => item.module === 'users' && item.action === 'edit') };
  const permissionCapabilities = { create: isAdministrator || allowedPermissionRows.some((item) => ['roles','permissions'].includes(item.module.toLowerCase()) && item.action === 'create'), edit: isAdministrator || allowedPermissionRows.some((item) => ['roles','permissions'].includes(item.module.toLowerCase()) && item.action === 'edit') };
  const settingsCapabilities = { edit: isAdministrator || allowedPermissionRows.some((item) => ['settings','config'].includes(item.module.toLowerCase()) && item.action === 'edit') };
  const [dashboardData, searchRecords, usersData, permissionsData, settingsData, functionSeoData] = await Promise.all([getCmsDashboardData(), getCmsSearchRecords(isAdministrator, allowedModules), canViewUsers ? getCmsUsersData() : Promise.resolve(null), canViewPermissions ? getCmsPermissionsData() : Promise.resolve(null), canViewSettings ? getCmsSystemSettingsData() : Promise.resolve(null), getFunctionSeoData('vi')]);
  return <CmsShellClient dashboardData={dashboardData} searchRecords={searchRecords} userRole={userRole} usersData={usersData} userCapabilities={userCapabilities} permissionsData={permissionsData} permissionCapabilities={permissionCapabilities} settingsData={settingsData} settingsCapabilities={settingsCapabilities} functionSeoData={functionSeoData} />;
}
