import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublicStaticPage('en', 'terms_of_use');
  return {
    title: pageData?.seoTitle || 'Terms of Service | CIC Technology',
    description: pageData?.seoDescription || 'Terms, conditions, and user rights when accessing and using CIC Technology digital platforms.',
    alternates: {
      canonical: '/en/terms',
    },
  };
}

export default async function EnTermsPage() {
  const pageData = await getPublicStaticPage('en', 'terms_of_use');
  if (!pageData) {
    notFound();
  }
  return (
    <PublicLegalPageView
      pageData={pageData}
      defaultTitle="Terms of Service"
      categoryTag="LEGAL TERMS & REGULATIONS"
    />
  );
}
