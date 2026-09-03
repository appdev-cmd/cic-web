import { CmsShellClient } from './CmsShellClient';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCmsDashboardData } from '@/features/dashboard/server/queries';
import { getCmsSearchRecords } from '@/features/cms-search/server/queries';
import { can } from '@/server/auth/guards';
import { getCmsUsersData } from '@/features/users/server/queries';
import { getCmsPermissionsData } from '@/features/permissions/server/queries';
import { getCmsSystemSettingsData } from '@/features/system-settings/server/queries';
import { getFunctionSeoData } from '@/features/function-seo/server/queries';
import type { CmsUser } from '@/cms/types';
import { getCmsActivityLogsData } from '@/features/activity-logs/server/queries';

export default async function CmsFoundationPage() {
  const access = await requireCmsPageAccess();
  const userRole: CmsUser['role'] = access.roleCodes.includes('superadmin') ? 'superadmin' : access.roleCodes.includes('admin') ? 'admin' : 'viewer';
  const allowedModules = access.isAdministrator ? null : [...new Set(access.permissions.filter((item) => item.action === 'view').map((item) => item.module))];
  const canAny = (modules: string[], action: string) => modules.some((module) => can(access, module, action));
  const canViewUsers = can(access, 'users', 'view');
  const canViewPermissions = canAny(['roles', 'permissions'], 'view');
  const canViewSettings = canAny(['settings', 'config'], 'view');
  const canViewAudit = can(access, 'audit', 'view');
  const userCapabilities = { create: can(access, 'users', 'create'), edit: can(access, 'users', 'edit') };
  const permissionCapabilities = { create: canAny(['roles', 'permissions'], 'create'), edit: canAny(['roles', 'permissions'], 'edit') };
  const settingsCapabilities = { edit: canAny(['settings', 'config'], 'edit') };
  const [dashboardData, searchRecords, usersData, permissionsData, settingsData, functionSeoData, activityData] = await Promise.all([getCmsDashboardData(), getCmsSearchRecords(access.isAdministrator, allowedModules), canViewUsers ? getCmsUsersData() : Promise.resolve(null), canViewPermissions ? getCmsPermissionsData() : Promise.resolve(null), canViewSettings ? getCmsSystemSettingsData() : Promise.resolve(null), getFunctionSeoData('vi'), canViewAudit ? getCmsActivityLogsData() : Promise.resolve(null)]);
  const currentUser = { id: String(access.legacyUserId), username: access.username, full_name: access.fullName, email: access.email, role: userRole, status: 'active' as const };
  return <CmsShellClient dashboardData={dashboardData} searchRecords={searchRecords} currentUser={currentUser} userRole={userRole} usersData={usersData} userCapabilities={userCapabilities} permissionsData={permissionsData} permissionCapabilities={permissionCapabilities} settingsData={settingsData} settingsCapabilities={settingsCapabilities} functionSeoData={functionSeoData} activityData={activityData} auditCapabilities={{ export: can(access, 'audit', 'export') }} />;
}
