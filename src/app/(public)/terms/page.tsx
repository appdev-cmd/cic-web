import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublicStaticPage('vi', 'terms_of_use');
  return {
    title: pageData?.seoTitle || 'Điều khoản sử dụng | CIC Technology',
    description: pageData?.seoDescription || 'Quy định về quyền hạn, trách nhiệm, sở hữu trí tuệ và sử dụng tài nguyên tại CIC Technology.',
  };
}

export default async function TermsPage() {
  const pageData = await getPublicStaticPage('vi', 'terms_of_use');
  if (!pageData) {
    notFound();
  }
  return (
    <PublicLegalPageView
      pageData={pageData}
      defaultTitle="Điều khoản sử dụng"
      categoryTag="Điều khoản dịch vụ"
    />
  );
}
