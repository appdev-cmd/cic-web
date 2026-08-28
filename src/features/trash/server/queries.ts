import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getTrashData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_trash_items').select('*').eq('status', 'trashed').order('deleted_at', { ascending: false }).limit(200);
  if (error) throw new Error('Unable to load trash items.');
  return data ?? [];
}
