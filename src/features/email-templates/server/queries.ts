import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getEmailTemplatesData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_email_templates').select('*').order('updated_at', { ascending: false }).limit(200);
  if (error) throw new Error('Unable to load email templates.');
  return data ?? [];
}
