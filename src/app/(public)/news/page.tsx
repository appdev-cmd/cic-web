import { listAllPublishedNews } from '@/features/news/server/queries';
import { listPublishedNewsCategories } from '@/features/news-categories/server/queries';
import { NewsRuntimeView } from '@/web/components/NewsRuntimeView';

import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tin Tức & Sự Kiện Công Nghệ',
  description:
    'Cập nhật tin tức công nghệ mới nhất, sự kiện chuyển giao kỹ thuật và các hoạt động nổi bật từ CIC Technology.',
  alternates: {
    canonical: '/news',
  },
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const category = (await searchParams).category ?? null;
  const [items, categories] = await Promise.all([
    listAllPublishedNews('vi'),
    listPublishedNewsCategories('vi'),
  ]);
  return <NewsRuntimeView items={items} categories={categories} products={[]} initialCategory={category} />;
}
