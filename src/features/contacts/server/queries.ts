import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getContactsData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_contact').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) throw new Error('Unable to load contact requests.');
  return data ?? [];
}
