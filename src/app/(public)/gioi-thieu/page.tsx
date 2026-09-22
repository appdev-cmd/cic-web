import type { Metadata } from 'next';
import { getPublishedAboutPage } from '@/features/static-pages/server/aboutResolver';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';

export const dynamic = 'force-dynamic';

import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublishedAboutPage('vi', 'about');
  return {
    title: cleanSeoTitle(pageData.page.seoTitle || 'Về CIC Technology | Đối tác công nghệ chiến lược'),
    description: pageData.page.seoDescription || 'Tìm hiểu về lịch sử hình thành, tầm nhìn sứ mệnh và các cột mốc phát triển của CIC Technology.',
  };
}

export default async function GioiThieuPage() {
  const pageData = await getPublishedAboutPage('vi', 'about');

  return (
    <PublicAboutRoute
      activeTab="overview"
      pageSections={pageData.pageSections}
      aboutContent={pageData.aboutContent}
      capacityContent={pageData.capacityContent}
    />
  );
}
