import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getCtaData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_ctas').select('*').order('updated_at', { ascending: false }).limit(500);
  if (error) throw new Error('Unable to load CTAs.');
  return data ?? [];
}
