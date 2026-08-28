import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getFormsData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_forms').select('*,cic_form_fields(*)').order('updated_at', { ascending: false }).limit(200);
  if (error) throw new Error('Unable to load forms.');
  return data ?? [];
}
