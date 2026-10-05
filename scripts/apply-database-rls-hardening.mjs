import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required.');
}

const migration = await readFile('db_migrate/migrations/20261005_database_rls_hardening.sql', 'utf8');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });

try {
  console.log('Applying migration 20261005_database_rls_hardening.sql...');
  await sql.unsafe(migration);
  console.log('Migration successfully applied!');

  const [rls] = await sql`
    SELECT count(*)::int AS total_tables,
           count(*) filter (where relrowsecurity)::int AS rls_enabled,
           count(*) filter (where not relrowsecurity)::int AS rls_disabled
    FROM pg_class
    WHERE relnamespace = 'public'::regnamespace AND relkind = 'r'
  `;

  const [policies] = await sql`
    SELECT count(*)::int AS policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
  `;

  const anonGrants = await sql`
    SELECT count(*)::int AS anon_grant_count
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND grantee = 'anon'
  `;

  console.log('\n=== KẾT QUẢ SAU KHI VÁ RLS ===');
  console.log(JSON.stringify({
    rls,
    policies,
    anonGrants: anonGrants[0].anon_grant_count,
  }, null, 2));

} finally {
  await sql.end({ timeout: 2 });
}
