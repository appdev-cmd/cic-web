import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import type { CmsUser } from '@/cms/types';
import type { CmsLocale } from '@/cms/data/CmsDataSource';
import { getPermittedCmsMenuGroups } from '@/cms/config/navigation';
import { CmsShellClient } from '../CmsShellClient';

export default async function CmsWorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('cms_workspace_locale')?.value;
  const initialWorkspaceLocale: CmsLocale = rawLocale === 'en' ? 'en' : 'vi';
  const access = await requireCmsPageAccess();
  const userRole: CmsUser['role'] = access.roleCodes.includes('superadmin')
    ? 'superadmin'
    : access.roleCodes.includes('admin')
    ? 'admin'
    : 'viewer';
  const allowedModules = access.isAdministrator
    ? null
    : [...new Set(access.permissions.filter((item) => item.action === 'view').map((item) => item.module))];

  const currentUser = {
    id: String(access.legacyUserId),
    username: access.username,
    full_name: access.fullName,
    email: access.email,
    role: userRole,
    status: 'active' as const,
  };
  const menuGroups = getPermittedCmsMenuGroups(allowedModules);

  return (
    <CmsShellClient
      currentUser={currentUser}
      menuGroups={menuGroups}
      userRole={userRole}
      initialWorkspaceLocale={initialWorkspaceLocale}
    >
      {children}
    </CmsShellClient>
  );
}
