import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getCustomerRequestsData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_contact').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) throw new Error('Unable to load customer requests.');
  return data ?? [];
}
