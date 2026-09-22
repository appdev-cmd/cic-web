import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedNewsBySlug, listPublishedNews } from '@/features/news/server/queries';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/features/seo/components';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';
import { detailMetadata } from '@/lib/seo/detailMetadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const item = await getPublishedNewsBySlug(slug, 'en');
  if (!item) return {};
  return {
    ...detailMetadata(item.seoTitle || item.title, item.seoDescription || item.summary, `/en/news/${slug}`),
    keywords: item.seoKeyword || undefined,
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
  return (
    <>
      <ArticleJsonLd
        headline={item.title}
        description={item.summary}
        image={item.image}
        datePublished={item.date}
        url={`/en/news/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/en' },
          { name: 'News', url: '/en/news' },
          { name: item.title },
        ]}
      />
      <NewsRuntimeView items={items} products={products} initialSlug={slug} />
    </>
  );
}
