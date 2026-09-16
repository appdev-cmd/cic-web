import type { Metadata } from 'next';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { getLegacyAboutCapacityContent } from '@/shared/page-content/legacyPageContent';
import { resolvePageContent } from '@/shared/page-content/resolvePageContent';
import { PublicAboutRoute } from '@/app/(public)/about/PublicAboutRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Năng lực & Kinh nghiệm | CIC Technology',
  description: 'Hồ sơ năng lực, kinh nghiệm thực hiện dự án và các chứng chỉ chuyên môn của CIC Technology.',
};

export default async function CapacityExperiencePage() {
  const pageData = await getPublicStaticPage('vi', 'capacity_experience');

  let capacityContent = getLegacyAboutCapacityContent();
  let pageSections = undefined;

  if (pageData && pageData.sections.length > 0) {
    pageSections = pageData.sections.map((s) => ({
      sectionKey: s.sectionKey,
      config: s.config,
    }));

    const resolved = resolvePageContent({
      pageType: 'capacity_experience',
      version: { sections: pageSections },
      legacyFallback: { capacity: capacityContent },
    });
    capacityContent = resolved.content.capacity;
  }

  return (
    <PublicAboutRoute
      activeTab="experience"
      pageSections={pageSections}
      capacityContent={capacityContent}
    />
  );
}
