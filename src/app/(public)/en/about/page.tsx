import type { Metadata } from 'next';
import { getPublishedAboutPage } from '@/features/static-pages/server/aboutResolver';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';
import { cleanSeoTitle } from '@/lib/seo/siteUrl';
import type { AboutTabKey } from '@/web/components/about';

export const dynamic = 'force-dynamic';

const VALID_TABS: readonly AboutTabKey[] = ['overview', 'ecosystem', 'structure', 'experience'];

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

export default async function EnAboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const rawTab = resolvedParams?.tab;
  const activeTab: AboutTabKey = rawTab && (VALID_TABS as readonly string[]).includes(rawTab)
    ? (rawTab as AboutTabKey)
    : 'overview';

  const pageData = await getPublishedAboutPage('en', 'about');

  return (
    <PublicAboutRoute
      activeTab={activeTab}
      pageSections={pageData.pageSections}
      aboutContent={pageData.aboutContent}
      capacityContent={pageData.capacityContent}
    />
  );
}
