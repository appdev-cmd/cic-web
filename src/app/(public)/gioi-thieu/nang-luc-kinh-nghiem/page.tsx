import type { Metadata } from 'next';
import { getPublishedAboutPage } from '@/features/static-pages/server/aboutResolver';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';

export const dynamic = 'force-dynamic';

import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublishedAboutPage('vi', 'capacity_experience');
  return {
    title: cleanSeoTitle(pageData.page.seoTitle || 'Năng lực & Kinh nghiệm | CIC Technology'),
    description: pageData.page.seoDescription || 'Hồ sơ năng lực, kinh nghiệm thực hiện dự án và các chứng chỉ chuyên môn của CIC Technology.',
  };
}

export default async function CapacityExperiencePage() {
  const pageData = await getPublishedAboutPage('vi', 'capacity_experience');

  return (
    <PublicAboutRoute
      activeTab="experience"
      pageSections={pageData.pageSections}
      aboutContent={pageData.aboutContent}
      capacityContent={pageData.capacityContent}
    />
  );
}
