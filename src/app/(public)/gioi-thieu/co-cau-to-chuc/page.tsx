import type { Metadata } from 'next';
import { getPublishedAboutPage } from '@/features/static-pages/server/aboutResolver';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';

export const dynamic = 'force-dynamic';

import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublishedAboutPage('vi', 'organization');
  return {
    title: cleanSeoTitle(pageData.page.seoTitle || 'Cơ cấu tổ chức | CIC Technology'),
    description: pageData.page.seoDescription || 'Sơ đồ cơ cấu tổ chức và ban lãnh đạo Công ty CP Công nghệ và Tư vấn CIC.',
  };
}

export default async function OrganizationPage() {
  const pageData = await getPublishedAboutPage('vi', 'organization');

  return (
    <PublicAboutRoute
      activeTab="structure"
      pageSections={pageData.pageSections}
      aboutContent={pageData.aboutContent}
      capacityContent={pageData.capacityContent}
    />
  );
}
