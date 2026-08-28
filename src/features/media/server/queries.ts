import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getMediaData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_media_assets').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) throw new Error('Unable to load media assets.');
  return data ?? [];
}
