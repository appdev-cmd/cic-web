import type { Metadata } from 'next';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cơ cấu tổ chức | CIC Technology',
  description: 'Sơ đồ cơ cấu tổ chức và ban lãnh đạo Công ty CP Công nghệ và Tư vấn CIC.',
};

export default async function OrganizationPage() {
  const pageData = await getPublicStaticPage('vi', 'organization');

  let pageSections = undefined;
  if (pageData && pageData.sections.length > 0) {
    pageSections = pageData.sections.map((s) => ({
      sectionKey: s.sectionKey,
      config: s.config,
    }));
  }

  return (
    <PublicAboutRoute
      activeTab="structure"
      pageSections={pageSections}
    />
  );
}
