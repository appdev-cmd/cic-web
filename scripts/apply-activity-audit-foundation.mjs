import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const migration = await readFile('db_migrate/migrations/20260903_activity_audit_foundation.sql', 'utf8');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });
try {
  await sql.unsafe(migration);
  const [result] = await sql`
    SELECT
      (SELECT count(*)::int FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'audit_exports_%') AS storage_policies,
      (SELECT count(*)::int FROM pg_indexes WHERE schemaname='public' AND indexname LIKE 'idx_cic_activity_logs_%') AS activity_indexes,
      (SELECT count(*)::int FROM cic_permission_tasks WHERE lower(module)='audit' AND published=true) AS audit_tasks,
      EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='cic_activity_logs_append_only' AND NOT tgisinternal) AS append_only
  `;
  console.log(JSON.stringify(result, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}
