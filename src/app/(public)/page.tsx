import type { Metadata } from 'next';
import { getPublishedHomePage } from '@/features/static-pages/server/homeResolver';
import { HomeRoute } from './HomeRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'CIC Technology — Đối tác công nghệ chiến lược' },
  description: 'Sản phẩm, dịch vụ tư vấn và dự án công nghệ của CIC Technology.',
  alternates: {
    canonical: '/',
    languages: { 'vi-VN': '/', 'en-US': '/en', 'x-default': '/' },
  },
};

export default async function HomePage() {
  const homeContent = await getPublishedHomePage('vi');
  return <HomeRoute initialContent={homeContent} />;
}
