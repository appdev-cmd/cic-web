import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { normalizeMediaUrl } from '@/shared/lib/content';
const mapService = (row: Record<string, unknown>) => ({ id: String(row.id), title: String(row.title ?? row.name ?? ''), slug: String(row.alias ?? row.slug ?? row.id), summary: String(row.summary ?? row.description ?? ''), content: String(row.content ?? row.description ?? ''), image: normalizeMediaUrl(String(row.image ?? '')), category: String(row.category_name ?? row.category ?? '') });
export async function listPublishedServices() { const rows = await getCmsServicesData(); return rows.filter((r) => r.published === true || r.status === 'published').map(mapService); }
export async function getPublishedServiceBySlug(slug: string) { return (await listPublishedServices()).find((row) => row.slug === slug) ?? null; }
export async function getCmsServicesData(locale: 'vi' | 'en' = 'vi') {
  const db = await getDatabaseClient();
  const table = locale === 'en' ? 'cic_services_en' : 'cic_services';
  const { data, error } = await db.from(table).select('*').order('ordering', { ascending: true }).limit(200);
  if (error) throw new Error('Unable to load services.');
  return data ?? [];
}
