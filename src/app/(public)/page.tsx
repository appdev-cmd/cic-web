import type { Metadata } from 'next';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { getLegacyHomePageContent } from '@/shared/page-content/legacyPageContent';
import { resolvePageContent } from '@/shared/page-content/resolvePageContent';
import type { PageContentVersionSource } from '@/shared/page-content/resolvePageContent';
import { HomeRoute } from './HomeRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CIC Technology — Đối tác công nghệ chiến lược',
  description: 'Sản phẩm, dịch vụ tư vấn và dự án công nghệ của CIC Technology.',
};

export default async function HomePage() {
  const pageData = await getPublicStaticPage('vi', 'home');
  let homeContent = getLegacyHomePageContent();

  if (pageData && pageData.sections.length > 0) {
    const versionSource: PageContentVersionSource = {
      sections: pageData.sections.map((s) => ({
        sectionKey: s.sectionKey,
        config: s.config,
        references: s.references ? [
          {
            entityType: 'project',
            entityIds: s.references
              .filter((r) => r.entityType === 'project')
              .sort((a, b) => a.position - b.position)
              .map((r) => r.entityId),
          },
        ] : [],
      })),
    };
    const resolved = resolvePageContent({
      pageType: 'home',
      version: versionSource,
      legacyFallback: homeContent,
    });
    homeContent = resolved.content;
  }

  return <HomeRoute initialContent={homeContent} />;
}
