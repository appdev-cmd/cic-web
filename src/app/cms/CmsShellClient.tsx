'use client';

import { CmsDashboard } from '@/cms/components/CmsDashboard';
import { useRouter } from 'next/navigation';
import type { CmsDashboardData } from '@/cms/data/CmsDataSource';
import type { CmsSearchRecord } from '@/features/cms-search/types';
import type { PermissionsGovernanceData, UsersGovernanceData } from '@/cms/data/GovernanceDataSource';
import type { SystemConfigurationData } from '@/cms/data/ConfigurationDataSource';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CmsShellClient({ dashboardData, searchRecords, userRole, usersData, userCapabilities, permissionsData, permissionCapabilities, settingsData, settingsCapabilities, functionSeoData }: any) {
  const router = useRouter();
  return <CmsDashboard onSwitchToWebsite={() => router.push('/')} dashboardData={dashboardData} searchRecords={searchRecords} userRole={userRole} usersData={usersData} userCapabilities={userCapabilities} permissionsData={permissionsData} permissionCapabilities={permissionCapabilities} settingsData={settingsData} settingsCapabilities={settingsCapabilities} functionSeoData={functionSeoData} />;
}
