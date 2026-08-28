import type { ReactNode } from 'react';
import { WebsiteShell } from './WebsiteShell';

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <WebsiteShell>{children}</WebsiteShell>;
}
