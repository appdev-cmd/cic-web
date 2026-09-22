import type { Metadata } from 'next';
import { listPublishedNews } from '@/features/news/server/queries';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Engineering News, Insights & Events | CIC',
  description: 'Stay updated with the latest technological developments, BIM seminars, and company highlights from CIC Technology.',
  alternates: {
    canonical: '/en/news',
  },
};

export default async function EnNewsPage() {
  const [news, products] = await Promise.all([
    listPublishedNews({ locale: 'en', page: 1, pageSize: 30 }),
    listPublishedProductsForReference('en').catch(() => []),
  ]);

  return <NewsRuntimeView items={news.items} products={products} />;
}
