'use client';

import { CmsDashboard } from '@/cms/components/CmsDashboard';
import { useRouter } from 'next/navigation';
import type { CmsDashboardProps } from '@/cms/components/CmsDashboard';
import { logoutAction } from './login/actions';

type CmsShellClientProps = Omit<CmsDashboardProps, 'onSwitchToWebsite'>;

export function CmsShellClient(props: Readonly<CmsShellClientProps>) {
  const router = useRouter();
  if (!props.currentUser?.id || !props.currentUser.email) {
    throw new Error('Authenticated CMS user context is missing or invalid.');
  }
  return <CmsDashboard {...props} onNavigate={(path) => router.push(path)} onSwitchToWebsite={() => router.push('/')} onLogout={() => { void logoutAction(); }} />;
}
