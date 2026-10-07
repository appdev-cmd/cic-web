import type { Metadata } from 'next';
import { getPublishedAboutPage } from '@/features/static-pages/server/aboutResolver';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';

import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublishedAboutPage('en', 'about');
  const rawTitle = pageData.page.seoTitle || 'About CIC — Strategic Engineering Partner';
  return {
    title: cleanSeoTitle(rawTitle) || 'About CIC — Strategic Engineering Partner',
    description: pageData.page.seoDescription || 'Learn about CIC journey, corporate leadership, technological capabilities, and strategic vision.',
    alternates: {
      canonical: '/en/about',
    },
  };
}

export default async function EnAboutPage() {
  const pageData = await getPublishedAboutPage('en', 'about');

  return (
    <PublicAboutRoute
      activeTab="overview"
      pageSections={pageData.pageSections}
      aboutContent={pageData.aboutContent}
      capacityContent={pageData.capacityContent}
    />
  );
}
