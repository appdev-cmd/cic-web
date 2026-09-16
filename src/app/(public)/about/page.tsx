import type { Metadata } from 'next';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { getLegacyAboutPageContent } from '@/shared/page-content/legacyPageContent';
import { resolvePageContent } from '@/shared/page-content/resolvePageContent';
import { PublicAboutRoute } from './PublicAboutRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Về CIC Technology | Đối tác công nghệ chiến lược',
  description: 'Tìm hiểu về lịch sử hình thành, tầm nhìn sứ mệnh và các cột mốc phát triển của CIC Technology.',
};

export default async function AboutPage() {
  const pageData = await getPublicStaticPage('vi', 'about');

  let aboutContent = getLegacyAboutPageContent();
  let pageSections = undefined;

  if (pageData && pageData.sections.length > 0) {
    pageSections = pageData.sections.map((s) => ({
      sectionKey: s.sectionKey,
      config: s.config,
      references: s.references ? [
        {
          entityType: 'project',
          entityIds: s.references.filter((r) => r.entityType === 'project').map((r) => r.entityId),
        },
      ] : [],
    }));

    const resolved = resolvePageContent({
      pageType: 'about',
      version: { sections: pageSections },
      legacyFallback: aboutContent,
    });
    aboutContent = resolved.content;
  }

  return (
    <PublicAboutRoute
      activeTab="overview"
      pageSections={pageSections}
      aboutContent={aboutContent}
    />
  );
}
