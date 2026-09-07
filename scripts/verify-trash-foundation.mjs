import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });
try {
  const [result] = await sql`
    SELECT
      (SELECT count(*)::int FROM public.cic_trash_items) AS trash_rows,
      (SELECT count(*)::int FROM public.cic_trash_items WHERE status='trashed') AS active_trash_rows,
      EXISTS (SELECT 1 FROM public.cic_permission_tasks WHERE lower(module)='trash' AND published=true AND list_function LIKE '%restore%' AND list_function LIKE '%purge%') AS permission_task,
      (SELECT relrowsecurity FROM pg_class WHERE oid='public.cic_trash_items'::regclass) AS rls_enabled,
      NOT EXISTS (
        SELECT 1 FROM information_schema.role_table_grants
        WHERE table_schema='public' AND table_name='cic_trash_items' AND grantee IN ('anon','authenticated')
      ) AS browser_access_revoked,
      (SELECT count(*)::int FROM pg_indexes WHERE schemaname='public' AND indexname IN (
        'idx_cic_trash_items_status_deleted_at','idx_cic_trash_items_status_purge_after',
        'idx_cic_trash_items_deleted_by_deleted_at','idx_cic_trash_items_retention_due'
      )) AS operational_indexes,
      (SELECT count(*)::int FROM pg_constraint WHERE conrelid='public.cic_trash_items'::regclass AND conname IN (
        'cic_trash_items_workspace_check','cic_trash_items_identity_not_blank_check','cic_trash_items_legal_hold_reason_check'
      ) AND convalidated) AS validated_constraints
  `;
  if (!result.permission_task || !result.rls_enabled || !result.browser_access_revoked || Number(result.operational_indexes)!==4 || Number(result.validated_constraints)!==3) {
    throw new Error(`Trash foundation verification failed: ${JSON.stringify(result)}`);
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}

