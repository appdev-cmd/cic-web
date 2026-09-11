import { listAllPublishedNews } from '@/features/news/server/queries';
import { listPublishedNewsCategories } from '@/features/news-categories/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

export const revalidate = 60;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const category = (await searchParams).category ?? null;
  const [items, categories] = await Promise.all([
    listAllPublishedNews('vi'),
    listPublishedNewsCategories('vi'),
  ]);
  return <NewsRuntimeView items={items} categories={categories} products={[]} initialCategory={category} />;
}
