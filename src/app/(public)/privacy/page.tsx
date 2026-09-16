import type { Metadata } from 'next';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';
import { PrivacyRoute } from './PrivacyRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | CIC Technology',
  description: 'Chính sách thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân tại CIC Technology.',
};

export default async function PrivacyPage() {
  const pageData = await getPublicStaticPage('vi', 'privacy_policy');
  return (
    <PublicLegalPageView
      pageData={pageData}
      fallbackView={<PrivacyRoute />}
      defaultTitle="Chính sách bảo mật"
      categoryTag="Chính sách bảo mật"
    />
  );
}
