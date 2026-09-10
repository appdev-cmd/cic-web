import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedNewsBySlug, listPublishedNews, listPublishedNewsPlacement } from '@/features/news/server/queries';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = await getPublishedNewsBySlug((await params).slug);
  return item ? { title: item.seoTitle || item.title, description: item.seoDescription || item.summary || undefined, keywords: item.seoKeyword || undefined } : {};
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const item = await getPublishedNewsBySlug(slug);
  if (!item) notFound();
  const [news, products] = await Promise.all([
    listPublishedNews({ page: 1, pageSize: 30 }),
    listPublishedProductsForReference().catch(() => []),
  ]);
  const merged = news.items;
  const items = merged.some((entry) => entry.id === item.id) ? merged : [item, ...merged];
  return <NewsRuntimeView items={items} products={products} initialSlug={slug} />;
}
