import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cic.com.vn';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CIC Technology',
    template: '%s | CIC Technology',
  },
  description: 'CIC Technology — Đối tác công nghệ chiến lược',
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
