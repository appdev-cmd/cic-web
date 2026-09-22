import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedNewsBySlug, listPublishedNews } from '@/features/news/server/queries';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/features/seo/components';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';
import { detailMetadata } from '@/lib/seo/detailMetadata';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const item = await getPublishedNewsBySlug(slug);
  return item ? { ...detailMetadata(item.seoTitle || item.title, item.seoDescription || item.summary, `/news/${slug}`), keywords: item.seoKeyword || undefined } : {};
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
  // Replace item in merged list with detail item (which contains full content), or prepend it
  const items = [item, ...merged.filter((entry) => entry.id !== item.id)];
  return (
    <>
      <ArticleJsonLd
        headline={item.title}
        description={item.summary}
        image={item.image}
        datePublished={item.date}
        url={`/news/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Trang chủ', url: '/' },
          { name: 'Tin tức', url: '/news' },
          { name: item.title },
        ]}
      />
      <NewsRuntimeView items={items} products={products} initialSlug={slug} />
    </>
  );
}
