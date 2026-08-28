import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getStaticPagesData(locale: 'vi' | 'en' = 'vi') {
  const db = await getDatabaseClient();
  const table = locale === 'en' ? 'cic_content_pages' : 'cic_content_pages';
  const { data, error } = await db.from(table).select('*').order('updated_at', { ascending: false }).limit(200);
  if (error) throw new Error('Unable to load static pages.');
  return data ?? [];
}
