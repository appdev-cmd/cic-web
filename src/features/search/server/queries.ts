import 'server-only';
import { listPublishedProducts } from '@/features/products/server/queries';
import { listPublishedProjects } from '@/features/projects/server/queries';
import { listPublishedServices } from '@/features/services/server/queries';
import { listPublishedNews } from '@/features/news/server/queries';
import { listPublishedEvents } from '@/features/events/server/queries';

export type SearchResult = { id: string; type: 'product' | 'project' | 'service' | 'news' | 'event'; title: string; summary: string | null; href: string };

export async function searchPublishedContent(query: string): Promise<SearchResult[]> {
  const keyword = query.trim().toLocaleLowerCase('vi');
  if (!keyword) return [];
  const [products, projects, services, news, events] = await Promise.all([listPublishedProducts(), listPublishedProjects(), listPublishedServices(), listPublishedNews(), listPublishedEvents()]);
  const results: SearchResult[] = [
    ...products.map((item) => ({ id: item.id, type: 'product' as const, title: item.title, summary: item.summary, href: `/products/${item.slug}` })),
    ...projects.map((item) => ({ id: item.id, type: 'project' as const, title: item.title, summary: item.summary, href: `/projects/${item.slug}` })),
    ...services.map((item) => ({ id: item.id, type: 'service' as const, title: item.title, summary: item.summary, href: `/services/${item.slug}` })),
    ...news.map((item) => ({ id: item.id, type: 'news' as const, title: item.title, summary: item.summary, href: `/news/${item.slug}` })),
    ...events.map((item) => ({ id: item.id, type: 'event' as const, title: item.title, summary: item.summary, href: `/events/${item.slug}` })),
  ];
  return results.filter((item) => `${item.title} ${item.summary ?? ''}`.toLocaleLowerCase('vi').includes(keyword)).slice(0, 100);
}
