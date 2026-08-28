import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getLocalizationData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_translate_content').select('*').order('id', { ascending: true }).limit(1000);
  if (error) throw new Error('Unable to load localization strings.');
  return data ?? [];
}
