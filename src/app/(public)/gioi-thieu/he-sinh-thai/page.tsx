import type { Metadata } from 'next';
import { getPublishedAboutPage } from '@/features/static-pages/server/aboutResolver';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';
import { cleanSeoTitle } from '@/lib/seo/siteUrl';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublishedAboutPage('vi', 'about');
  return {
    title: cleanSeoTitle('Hệ sinh thái giải pháp | CIC Technology'),
    description: pageData.page.seoDescription || 'Khám phá hệ sinh thái sản phẩm và dịch vụ công nghệ toàn diện từ CIC Technology.',
  };
}

export default async function EcosystemPage() {
  const pageData = await getPublishedAboutPage('vi', 'about');

  return (
    <PublicAboutRoute
      activeTab="ecosystem"
      pageSections={pageData.pageSections}
      aboutContent={pageData.aboutContent}
      capacityContent={pageData.capacityContent}
    />
  );
}
