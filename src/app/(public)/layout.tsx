import type { ReactNode } from 'react';
import { WebsiteShell } from './WebsiteShell';
import { getPublicSystemSettings } from '@/features/system-settings/server/queries';

export default async function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  const settings = await getPublicSystemSettings('vi');
  return <WebsiteShell settings={settings}>{children}</WebsiteShell>;
}
