import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublicStaticPage('en', 'privacy_policy');
  return {
    title: pageData?.seoTitle || 'Privacy Policy | CIC Technology',
    description: pageData?.seoDescription || 'CIC Technology policy on collecting, utilizing, storing, and safeguarding personal data.',
    alternates: {
      canonical: '/en/privacy',
    },
  };
}

export default async function EnPrivacyPage() {
  const pageData = await getPublicStaticPage('en', 'privacy_policy');
  if (!pageData) {
    notFound();
  }
  return (
    <PublicLegalPageView
      pageData={pageData}
      defaultTitle="Privacy Policy"
      categoryTag="DATA PROTECTION & PRIVACY"
    />
  );
}
