import { headers } from 'next/headers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import { OrganizationJsonLd } from '@/features/seo/components';
import { CANONICAL_SITE_URL } from '@/lib/seo/siteUrl';

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: 'CIC Technology — Đối tác công nghệ chiến lược',
    template: '%s | CIC Technology',
  },
  description: 'CIC Technology — Nhà cung cấp bản quyền phần mềm, thiết bị khoa học kỹ thuật và dịch vụ tư vấn BIM / Chuyển đổi số hàng đầu Việt Nam.',
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: 'CIC Technology',
    type: 'website',
    locale: 'vi_VN',
    url: CANONICAL_SITE_URL,
    title: 'CIC Technology — Đối tác công nghệ chiến lược',
    description: 'CIC Technology — Nhà cung cấp bản quyền phần mềm, thiết bị khoa học kỹ thuật và dịch vụ tư vấn BIM / Chuyển đổi số hàng đầu Việt Nam.',
    images: [
      {
        url: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
        width: 1690,
        height: 931,
        alt: 'CIC Technology - Đối tác công nghệ chiến lược',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIC Technology — Đối tác công nghệ chiến lược',
    description: 'CIC Technology — Nhà cung cấp bản quyền phần mềm, thiết bị khoa học kỹ thuật và dịch vụ tư vấn BIM / Chuyển đổi số hàng đầu Việt Nam.',
    images: ['/banner_hero/doi_tac_cong_nghe_chien_luoc.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'vi';

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
