import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const migration = await readFile('db_migrate/migrations/20260903_users_identity_hardening.sql', 'utf8');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });
try {
  await sql.unsafe(migration);
  const [result] = await sql`
    SELECT
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cic_users' AND column_name='auth_user_id') AS auth_bridge,
      EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='ux_cic_users_auth_user_id') AS auth_bridge_unique,
      EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_users'::regclass AND conname='cic_users_account_status_check' AND convalidated) AS status_constraint
  `;
  console.log(JSON.stringify(result, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}
