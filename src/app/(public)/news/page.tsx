import { listPublishedNews, listPublishedNewsPlacement } from '@/features/news/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

export const revalidate = 60;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const category = (await searchParams).category ?? null;
  const news = await listPublishedNews({ page: 1, pageSize: 30 });
  return <NewsRuntimeView items={news.items} products={[]} initialCategory={category} />;
}
