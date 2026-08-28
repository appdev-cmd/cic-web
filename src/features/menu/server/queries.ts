import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getMenuData(locale: 'vi' | 'en' = 'vi') {
  const db = await getDatabaseClient();
  const table = locale === 'en' ? 'cic_menus_items_en' : 'cic_menus_items';
  const { data, error } = await db.from(table).select('*').order('ordering', { ascending: true }).limit(500);
  if (error) throw new Error('Unable to load website menu.');
  return data ?? [];
}
