'use client';

import { useRouter } from 'next/navigation';
import { AboutView } from '@/web/components/AboutView';
import { getLegacyAboutCapacityContent, getLegacyAboutPageContent } from '@/shared/page-content/legacyPageContent';
import type { AboutCapacityModel, AboutPageModel } from '@/shared/page-content/models';

interface PublicAboutRouteProps {
  activeTab: 'overview' | 'structure' | 'experience';
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

  const handleTabChange = (tab: 'overview' | 'structure' | 'experience') => {
    if (tab === 'overview') router.push('/about');
    else if (tab === 'structure') router.push('/gioi-thieu/co-cau-to-chuc');
    else if (tab === 'experience') router.push('/gioi-thieu/nang-luc-kinh-nghiem');
  };

  return (
    <AboutView
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      onNavigateToContact={() => router.push('/contact')}
      aboutContent={aboutContent ?? getLegacyAboutPageContent()}
      capacityContent={capacityContent ?? getLegacyAboutCapacityContent()}
      pageSections={pageSections}
    />
  );
}
