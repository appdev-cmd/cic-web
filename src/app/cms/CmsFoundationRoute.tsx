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
import type { CmsModuleKey } from '@/cms/routing';
import { getCmsActivityLogsData } from '@/features/activity-logs/server/queries';
import { getCmsTrashPage, initialTrashQuery } from '@/features/trash/server/queries';
import { getCmsMediaData } from '@/features/media/server/queries';
import { getPermittedCmsMenuGroups } from '@/cms/config/navigation';
import type { ReactNode } from 'react';

export async function renderCmsFoundationRoute(module: CmsModuleKey, path = '/cms/dashboard', moduleContent?: ReactNode) {
  const access = await requireCmsPageAccess();
  const userRole: CmsUser['role'] = access.roleCodes.includes('superadmin') ? 'superadmin' : access.roleCodes.includes('admin') ? 'admin' : 'viewer';
  const allowedModules = access.isAdministrator ? null : [...new Set(access.permissions.filter((item) => item.action === 'view').map((item) => item.module))];
  const canAny = (modules: string[], action: string) => modules.some((candidate) => can(access, candidate, action));
  const canViewUsers = can(access, 'users', 'view');
  const canViewPermissions = canAny(['roles', 'permissions'], 'view');
  const canViewSettings = canAny(['settings', 'config'], 'view');
  const canViewAudit = can(access, 'audit', 'view');
  const canViewTrash = can(access, 'trash', 'view');
  const canViewMedia = can(access, 'media', 'view');

  const dashboardData = module === 'dashboard' ? await getCmsDashboardData() : undefined;
  const searchRecords = module === 'search' ? await getCmsSearchRecords(access.isAdministrator, allowedModules) : [];
  const usersData = module === 'users' && canViewUsers ? await getCmsUsersData() : null;
  const permissionsData = module === 'permissions' && canViewPermissions ? await getCmsPermissionsData() : null;
  const settingsData = module === 'settings' && canViewSettings ? await getCmsSystemSettingsData() : null;
  const functionSeoData = module === 'function_seo' ? await getFunctionSeoData('vi') : [];
  const activityData = module === 'activity_logs' && canViewAudit ? await getCmsActivityLogsData() : null;
  const trashData = module === 'trash' && canViewTrash ? await getCmsTrashPage(initialTrashQuery) : null;
  const mediaData = module === 'media' && canViewMedia ? await getCmsMediaData('vi') : null;

  const currentUser = { id: String(access.legacyUserId), username: access.username, full_name: access.fullName, email: access.email, role: userRole, status: 'active' as const };
  const menuGroups = getPermittedCmsMenuGroups(allowedModules);
  return <CmsShellClient
    initialPath={path}
    dashboardData={dashboardData}
    searchRecords={searchRecords}
    currentUser={currentUser}
    menuGroups={menuGroups}
    userRole={userRole}
    usersData={usersData}
    userCapabilities={{ create: can(access, 'users', 'create'), edit: can(access, 'users', 'edit'), delete: can(access, 'users', 'delete'), currentUserId: String(access.legacyUserId) }}
    permissionsData={permissionsData}
    permissionCapabilities={{ create: canAny(['roles', 'permissions'], 'create'), edit: canAny(['roles', 'permissions'], 'edit'), delete: canAny(['roles', 'permissions'], 'delete') }}
    settingsData={settingsData}
    settingsCapabilities={{ edit: canAny(['settings', 'config'], 'edit') }}
    functionSeoData={functionSeoData}
    activityData={activityData}
    auditCapabilities={{ export: can(access, 'audit', 'export') }}
    trashData={trashData}
    trashCapabilities={{ restore: can(access, 'trash', 'restore'), purge: can(access, 'trash', 'purge') }}
    mediaData={mediaData}
    mediaCapabilities={{ create: can(access,'media','create'), edit: can(access,'media','edit'), delete: can(access,'media','delete'), replace: can(access,'media','replace') }}
    moduleContent={moduleContent}
  />;
}
