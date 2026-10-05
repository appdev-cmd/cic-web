import { cookies } from 'next/headers';
import type { CmsLocale } from '@/cms/data/CmsDataSource';
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
import type { ReactNode } from 'react';
import { ApplicationLoadingState } from '@/shared/ui/application';
import { CicUsersManager } from '@/cms/modules/cic_users/CicUsersManager';
import { PermissionManagement } from '@/cms/modules/permission_management/PermissionManagement';
import { SystemConfiguration } from '@/cms/modules/system_configuration/SystemConfiguration';
import { FunctionSeoManager } from '@/cms/modules/function_seo/FunctionSeoManager';
import { ActivityLogsManager } from '@/cms/modules/activity_logs_trash/ActivityLogsManager';
import { TrashManager } from '@/cms/modules/activity_logs_trash/TrashManager';
import { MediaManager } from '@/cms/modules/media/MediaManager';
import { CmsGlobalSearchPage } from '@/cms/modules/search/CmsGlobalSearchPage';
import { DashboardOverview } from '@/cms/modules/dashboard/DashboardOverview';

function GuardedModule({ authorized, ready, message, children }: Readonly<{ authorized: boolean; ready: boolean; message: string; children: ReactNode }>) {
  if (!authorized) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">{message}</div>;
  if (!ready) return <ApplicationLoadingState label="Đang tải dữ liệu module…" />;
  return children;
}

export async function renderCmsModuleContent(module: CmsModuleKey, _path = '/cms/dashboard', customModuleContent?: ReactNode) {
  void _path;
  if (customModuleContent) {
    return customModuleContent;
  }

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('cms_workspace_locale')?.value;
  const initialWorkspaceLocale: CmsLocale = rawLocale === 'en' ? 'en' : 'vi';
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

  if (module === 'dashboard') {
    const dashboardData = await getCmsDashboardData(initialWorkspaceLocale);
    return <DashboardOverview data={dashboardData} workspaceLocale={initialWorkspaceLocale} />;
  }

  if (module === 'users') {
    const usersData = canViewUsers ? await getCmsUsersData() : null;
    return (
      <GuardedModule authorized={canViewUsers} ready={usersData !== null} message="Bạn không có quyền xem danh sách người dùng CMS.">
        {usersData && (
          <CicUsersManager
            data={usersData}
            capabilities={{
              create: can(access, 'users', 'create'),
              edit: can(access, 'users', 'edit'),
              delete: can(access, 'users', 'delete'),
              currentUserId: String(access.legacyUserId),
            }}
          />
        )}
      </GuardedModule>
    );
  }

  if (module === 'permissions') {
    const permissionsData = canViewPermissions ? await getCmsPermissionsData() : null;
    return (
      <GuardedModule authorized={canViewPermissions} ready={permissionsData !== null} message="Bạn không có quyền xem phân quyền CMS.">
        {permissionsData && (
          <PermissionManagement
            data={permissionsData}
            capabilities={{
              create: canAny(['roles', 'permissions'], 'create'),
              edit: canAny(['roles', 'permissions'], 'edit'),
              delete: canAny(['roles', 'permissions'], 'delete'),
            }}
          />
        )}
      </GuardedModule>
    );
  }

  if (module === 'settings') {
    const settingsData = canViewSettings ? await getCmsSystemSettingsData() : null;
    return (
      <GuardedModule authorized={canViewSettings} ready={settingsData !== null} message="Bạn không có quyền xem cấu hình hệ thống.">
        {settingsData && (
          <SystemConfiguration
            websiteData={settingsData}
            capabilities={{ edit: canAny(['settings', 'config'], 'edit') }}
          />
        )}
      </GuardedModule>
    );
  }

  if (module === 'function_seo') {
    const functionSeoData = await getFunctionSeoData(initialWorkspaceLocale);
    return <FunctionSeoManager workspaceLocale={initialWorkspaceLocale} data={functionSeoData} />;
  }

  if (module === 'activity_logs') {
    const activityData = canViewAudit ? await getCmsActivityLogsData() : null;
    return (
      <GuardedModule authorized={canViewAudit} ready={activityData !== null} message="Bạn không có quyền xem Nhật ký hoạt động.">
        {activityData && (
          <ActivityLogsManager
            data={activityData}
            capabilities={{ export: can(access, 'audit', 'export') }}
          />
        )}
      </GuardedModule>
    );
  }

  if (module === 'trash') {
    const trashData = canViewTrash ? await getCmsTrashPage(initialTrashQuery) : null;
    return (
      <GuardedModule authorized={canViewTrash} ready={trashData !== null} message="Bạn không có quyền xem Thùng rác.">
        {trashData && (
          <TrashManager
            data={trashData}
            capabilities={{
              restore: can(access, 'trash', 'restore'),
              purge: can(access, 'trash', 'purge'),
            }}
          />
        )}
      </GuardedModule>
    );
  }

  if (module === 'media') {
    const mediaData = canViewMedia ? await getCmsMediaData(initialWorkspaceLocale) : null;
    return (
      <GuardedModule authorized={canViewMedia} ready={mediaData !== null} message="Bạn không có quyền xem Thư viện Media.">
        {mediaData && (
          <MediaManager
            data={mediaData}
            workspaceLocale={initialWorkspaceLocale}
            capabilities={{
              create: can(access, 'media', 'create'),
              edit: can(access, 'media', 'edit'),
              delete: can(access, 'media', 'delete'),
              replace: can(access, 'media', 'replace'),
            }}
          />
        )}
      </GuardedModule>
    );
  }

  if (module === 'search') {
    const searchRecords = await getCmsSearchRecords(access.isAdministrator, allowedModules);
    return (
      <CmsGlobalSearchPage
        workspaceLocale={initialWorkspaceLocale}
        userRole={userRole}
        records={searchRecords}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">Không tìm thấy trang</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Đường dẫn này không thuộc module CMS đang được hỗ trợ.
      </p>
    </div>
  );
}

export async function renderCmsFoundationRoute(module: CmsModuleKey, path = '/cms/dashboard', moduleContent?: ReactNode) {
  return renderCmsModuleContent(module, path, moduleContent);
}
