import type { Metadata } from 'next';
import { getPublicStaticPage } from '@/features/static-pages/server/queries';
import { PublicLegalPageView } from '@/web/components/PublicLegalPageView';
import { TermsRoute } from './TermsRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | CIC Technology',
  description: 'Quy định về quyền hạn, trách nhiệm, sở hữu trí tuệ và sử dụng tài nguyên tại CIC Technology.',
};

export default async function TermsPage() {
  const pageData = await getPublicStaticPage('vi', 'terms_of_use');
  return (
    <PublicLegalPageView
      pageData={pageData}
      fallbackView={<TermsRoute />}
      defaultTitle="Điều khoản sử dụng"
      categoryTag="Điều khoản dịch vụ"
    />
  );
}
