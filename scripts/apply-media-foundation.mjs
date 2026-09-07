import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const migration = await readFile('db_migrate/migrations/20260904_media_foundation_hardening.sql', 'utf8');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });
try {
  await sql.unsafe(migration);
  console.log('Media foundation migration applied.');
} finally {
  await sql.end({ timeout: 2 });
}
