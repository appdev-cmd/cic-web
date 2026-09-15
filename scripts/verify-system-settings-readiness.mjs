import assert from 'node:assert/strict';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
  ssl: 'require',
});

try {
  const tasks = await sql`
    SELECT module, _task, published, list_function
    FROM public.cic_permission_tasks
    WHERE lower(btrim(module)) IN ('settings', 'config')
  `;
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].module, 'settings');
  assert.equal(tasks[0]._task, 'settings');
  assert.equal(tasks[0].published, true);
  assert.equal(tasks[0].list_function, 'view,edit');

  const tables = await sql`
    SELECT relname, relrowsecurity
    FROM pg_class
    WHERE oid IN (
      'public.cic_config'::regclass,
      'public.cic_config_en'::regclass,
      'public.cic_config_enjicad'::regclass,
      'public.cic_branches'::regclass
    )
    ORDER BY relname
  `;
  assert.equal(tables.length, 4);
  assert.ok(tables.every((table) => table.relrowsecurity === true));

  const branchCounts = await sql`
    SELECT workspace,count(*)::int count,count(*) FILTER (WHERE is_head_office IS TRUE)::int head_offices
    FROM cic_branches WHERE workspace IN ('vi','en') GROUP BY workspace ORDER BY workspace
  `;
  assert.deepEqual(branchCounts.map((row) => ({ workspace: row.workspace, count: row.count, headOffices: row.head_offices })), [
    { workspace: 'en', count: 2, headOffices: 1 },
    { workspace: 'vi', count: 2, headOffices: 1 },
  ]);

  console.log(JSON.stringify({ permissionTask: tasks[0], rlsTables: tables.length, branchCounts }, null, 2));
} finally {
  await sql.end();
}
