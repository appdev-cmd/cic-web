'use client';

import { CmsDashboard } from '@/cms/components/CmsDashboard';
import { useRouter } from 'next/navigation';
import type { CmsDashboardProps } from '@/cms/components/CmsDashboard';
import { logoutAction } from './login/actions';

type CmsShellClientProps = Omit<CmsDashboardProps, 'onSwitchToWebsite'>;

export function CmsShellClient(props: Readonly<CmsShellClientProps>) {
  const router = useRouter();
  return <CmsDashboard {...props} onSwitchToWebsite={() => router.push('/')} onLogout={() => { void logoutAction(); }} />;
}
