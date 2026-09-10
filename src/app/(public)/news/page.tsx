import { listPublishedNews, listPublishedNewsPlacement } from '@/features/news/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

export const revalidate = 60;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const category = (await searchParams).category ?? null;
  const [news, hotNews] = await Promise.all([
    listPublishedNews({ page: 1, pageSize: 30 }),
    listPublishedNewsPlacement('vi', 'hot'),
  ]);
  const hotIds = new Set(hotNews.map((item) => item.id));
  const items = [...hotNews, ...news.items.filter((item) => !hotIds.has(item.id))];
  return <NewsRuntimeView items={items} products={[]} initialCategory={category} />;
}
