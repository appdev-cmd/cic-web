import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getActivityLogsData() {
  const db = await getDatabaseClient();
  const { data, error } = await db.from('cic_activity_logs').select('*').order('occurred_at', { ascending: false }).limit(200);
  if (error) throw new Error('Unable to load activity logs.');
  return { auditLogs: data ?? [], exportJobs: [] };
}
