import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'CMS Foundation',
  robots: { index: false, follow: false },
};

export default function CmsFoundationLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="cms-shell min-h-screen bg-slate-50 text-slate-900">{children}</div>;
}
