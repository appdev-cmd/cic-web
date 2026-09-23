import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
  ssl: 'require',
});

try {
  const migration = await readFile('db_migrate/migrations/20260923_form_multi_destination.sql', 'utf8');
  await sql.unsafe(migration);
  console.log('Multi-destination form migration applied successfully.');
} finally {
  await sql.end();
}
