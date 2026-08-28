import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { normalizeMediaUrl } from '@/shared/lib/content';
const parseRelated = (value: unknown) => Array.isArray(value) ? value.map(String) : String(value ?? '').split(/[,|]/).map((v) => v.trim()).filter(Boolean);
const mapNews = (row: Record<string, unknown>) => ({ id: String(row.id), title: String(row.title ?? ''), slug: String(row.alias ?? row.slug ?? row.id), summary: row.summary == null ? null : String(row.summary), content: String(row.content ?? row.content_html ?? row.description ?? ''), image: row.image == null ? null : normalizeMediaUrl(String(row.image)), date: String(row.created_time ?? row.published_time ?? ''), views: Number(row.hits ?? row.views ?? 0), category: String(row.category_alias ?? row.category ?? ''), productsRelated: parseRelated(row.products_related), projectsRelated: parseRelated(row.projects_related ?? row.project_related), eventsRelated: parseRelated(row.events_related ?? row.event_related), newsRelated: parseRelated(row.news_related) });
export async function listPublishedNews() { const rows = await getCmsNewsData(); return rows.filter((r) => r.published === true || r.status === 'published').map(mapNews); }
export async function getPublishedNewsBySlug(slug: string) { return (await listPublishedNews()).find((row) => row.slug === slug) ?? null; }
export async function getCmsNewsData(locale: 'vi' | 'en' = 'vi') {
  const db = await getDatabaseClient();
  const table = locale === 'en' ? 'cic_news_en' : 'cic_news';
  const { data, error } = await db.from(table).select('*').order('ordering', { ascending: true }).limit(200);
  if (error) throw new Error('Unable to load news.');
  return data ?? [];
}
