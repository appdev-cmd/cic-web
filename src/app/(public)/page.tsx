import type { Metadata } from 'next';
import { getPublishedHomePage } from '@/features/static-pages/server/homeResolver';
import { HomeRoute } from './HomeRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CIC Technology — Đối tác công nghệ chiến lược',
  description: 'Sản phẩm, dịch vụ tư vấn và dự án công nghệ của CIC Technology.',
};

export default async function HomePage() {
  const homeContent = await getPublishedHomePage('vi');
  return <HomeRoute initialContent={homeContent} />;
}
