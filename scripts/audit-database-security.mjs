import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required for the read-only database security audit.');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
  ssl: 'require',
  connect_timeout: 10,
  idle_timeout: 5,
});

try {
  const [identity] = await sql`
    select current_database() as database_name,
           current_user as database_user,
           current_setting('server_version') as server_version
  `;
  const [rls] = await sql`
    select count(*)::int as total_tables,
           count(*) filter (where relrowsecurity)::int as rls_enabled,
           count(*) filter (where relforcerowsecurity)::int as rls_forced
    from pg_class
    where relnamespace = 'public'::regnamespace and relkind = 'r'
  `;
  const [policies] = await sql`select count(*)::int as policy_count from pg_policies where schemaname = 'public'`;
  const privileges = await sql`
    select grantee, privilege_type, count(*)::int as grant_count
    from information_schema.role_table_grants
    where table_schema = 'public'
      and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
    group by grantee, privilege_type
    order by grantee, privilege_type
  `;
  const roles = await sql`
    select rolname, rolsuper, rolbypassrls, rolcanlogin
    from pg_roles
    where rolname in (current_user, 'anon', 'authenticated', 'service_role')
    order by rolname
  `;
  console.log(JSON.stringify({
    connection: identity,
    rls,
    policies,
    roles,
    privileges,
    note: 'Read-only catalog audit; no schema or policy mutation performed.',
  }, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}
