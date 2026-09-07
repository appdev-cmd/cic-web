import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const migration = await readFile('db_migrate/migrations/20260903_trash_foundation.sql', 'utf8');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });
try {
  await sql.unsafe(migration);
  const [result] = await sql`
    SELECT
      EXISTS (SELECT 1 FROM public.cic_permission_tasks WHERE lower(module)='trash' AND published=true) AS permission_task,
      (SELECT relrowsecurity FROM pg_class WHERE oid='public.cic_trash_items'::regclass) AS rls_enabled,
      (SELECT count(*)::int FROM pg_indexes WHERE schemaname='public' AND indexname IN (
        'idx_cic_trash_items_status_deleted_at','idx_cic_trash_items_status_purge_after',
        'idx_cic_trash_items_deleted_by_deleted_at','idx_cic_trash_items_retention_due'
      )) AS operational_indexes
  `;
  console.log(JSON.stringify(result, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}

