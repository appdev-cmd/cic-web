import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'CMS CIC Technology',
  robots: { index: false, follow: false },
};

export default function CmsFoundationLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="cms-shell min-h-screen bg-[var(--token-color-surface-card)] text-[var(--token-color-text-primary)]">{children}</div>;
}
