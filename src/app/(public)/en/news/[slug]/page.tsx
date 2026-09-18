import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedNewsBySlug, listPublishedNews } from '@/features/news/server/queries';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const item = await getPublishedNewsBySlug(slug, 'en');
  if (!item) return {};
  return {
    title: item.seoTitle || `${item.title} | CIC Technology`,
    description: item.seoDescription || item.summary || undefined,
    keywords: item.seoKeyword || undefined,
    alternates: {
      canonical: `/en/news/${slug}`,
    },
  };
}

export default async function EnNewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const item = await getPublishedNewsBySlug(slug, 'en');
  if (!item) notFound();

  const [news, products] = await Promise.all([
    listPublishedNews({ locale: 'en', page: 1, pageSize: 30 }),
    listPublishedProductsForReference('en').catch(() => []),
  ]);

  const items = [item, ...news.items.filter((entry) => entry.id !== item.id)];
  return <NewsRuntimeView items={items} products={products} initialSlug={slug} />;
}
