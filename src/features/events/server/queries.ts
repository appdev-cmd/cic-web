import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { normalizeMediaUrl } from '@/shared/lib/content';
const mapEvent = (row: Record<string, unknown>) => ({ id: String(row.id), title: String(row.title ?? row.name ?? ''), slug: String(row.alias ?? row.slug ?? row.id), summary: String(row.summary ?? row.description ?? ''), content: String(row.content ?? row.description ?? ''), image: normalizeMediaUrl(String(row.image ?? '')) });
export async function listPublishedEvents() { const rows = await getCmsEventsData(); return rows.filter((r) => r.published === true || r.status === 'published').map(mapEvent); }
export async function getPublishedEventBySlug(slug: string) { return (await listPublishedEvents()).find((row) => row.slug === slug) ?? null; }
export async function getCmsEventsData(locale: 'vi' | 'en' = 'vi') {
  const db = await getDatabaseClient();
  const table = locale === 'en' ? 'cic_event_en' : 'cic_event';
  const { data, error } = await db.from(table).select('*').order('ordering', { ascending: true }).limit(200);
  if (error) throw new Error('Unable to load events.');
  return data ?? [];
}
