import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPublicStaticPage('vi', 'privacy_policy');
  return {
    title: pageData?.seoTitle || 'Chính sách bảo mật | CIC Technology',
    description: pageData?.seoDescription || 'Chính sách thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân tại CIC Technology.',
  };
}

export default async function PrivacyPage() {
  const pageData = await getPublicStaticPage('vi', 'privacy_policy');
  if (!pageData) {
    notFound();
  }
  return (
    <PublicLegalPageView
      pageData={pageData}
      defaultTitle="Chính sách bảo mật"
      categoryTag="Chính sách bảo mật"
    />
  );
}
