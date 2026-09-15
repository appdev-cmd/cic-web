import { readFile } from 'node:fs/promises';
import postgres from 'postgres';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
try {
  await sql.unsafe(await readFile(new URL('../db_migrate/migrations/20260914_system_settings_branch_seed.sql', import.meta.url), 'utf8'));
  console.log('System Settings branch seed applied.');
} finally { await sql.end(); }
