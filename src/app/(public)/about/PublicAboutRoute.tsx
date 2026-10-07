'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/shared/i18n';
import { AboutView } from '@/web/components/AboutView';
import { getLegacyAboutCapacityContent, getLegacyAboutPageContent } from '@/shared/page-content/legacyPageContent';
import type { AboutCapacityModel, AboutPageModel } from '@/shared/page-content/models';
import type { AboutTabKey } from '@/web/components/about';

interface PublicAboutRouteProps {
  activeTab: AboutTabKey;
  pageSections?: readonly {
    sectionKey: string;
    config: Record<string, unknown>;
    references?: readonly { entityType: string; entityIds: readonly string[] }[];
  }[];
  aboutContent?: AboutPageModel;
  capacityContent?: AboutCapacityModel;
}

export function PublicAboutRoute({
  activeTab,
  pageSections,
  aboutContent,
  capacityContent,
}: PublicAboutRouteProps) {
  const router = useRouter();
  const { locale } = useI18n();

  const handleTabChange = (tab: AboutTabKey) => {
    if (locale === 'en') {
      if (tab === 'overview') router.push('/en/about');
      else router.push(`/en/about?tab=${tab}`);
      return;
    }

    if (tab === 'overview') router.push('/gioi-thieu');
    else if (tab === 'ecosystem') router.push('/gioi-thieu/he-sinh-thai');
    else if (tab === 'structure') router.push('/gioi-thieu/co-cau-to-chuc');
    else if (tab === 'experience') router.push('/gioi-thieu/nang-luc-kinh-nghiem');
  };

  return (
    <AboutView
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      onNavigateToContact={() => router.push(locale === 'en' ? '/en/contact' : '/contact')}
      aboutContent={aboutContent ?? getLegacyAboutPageContent()}
      capacityContent={capacityContent ?? getLegacyAboutCapacityContent()}
      pageSections={pageSections}
    />
  );
}
