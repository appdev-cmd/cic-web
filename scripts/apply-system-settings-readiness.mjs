import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
  ssl: 'require',
});

try {
  const migration = await readFile('db_migrate/migrations/20260914_system_settings_readiness.sql', 'utf8');
  await sql.unsafe(migration);
  console.log('System Settings readiness migration applied.');
} finally {
  await sql.end();
}
