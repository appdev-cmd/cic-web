import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required for the read-only auth audit.');
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
  const tables = ['cic_users', 'cic_roles', 'cic_user_roles', 'cic_role_permissions', 'cic_permission_tasks', 'cic_users_permission', 'cic_users_permission_fun', 'cic_users_permission_field'];
  const columns = await sql`
    select table_name, column_name, data_type, is_nullable
    from information_schema.columns
    where table_schema = 'public' and table_name in ${sql(tables)}
    order by table_name, ordinal_position
  `;
  const existingTables = new Set(columns.map((column) => column.table_name));
  const counts = {};
  const [{ count: authUsers }] = await sql`select count(*)::int as count from auth.users`;
  counts.auth_users = authUsers;
  for (const table of tables) {
    if (!existingTables.has(table)) {
      counts[table] = 'missing';
      continue;
    }
    const [{ count }] = await sql`select count(*)::int as count from ${sql(table)}`;
    counts[table] = count;
  }
  if (existingTables.has('cic_users')) {
    const [{ count: linkedUsers }] = await sql`select count(*)::int as count from auth.users au join cic_users cu on lower(cu.email) = lower(au.email)`;
    counts.linked_users = linkedUsers;
  }
  console.log(JSON.stringify({ counts, columns, note: 'Read-only auth catalog audit; no user data values or credentials emitted.' }, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}
