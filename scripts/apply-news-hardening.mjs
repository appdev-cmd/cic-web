import postgres from 'postgres';
import { readFile } from 'node:fs/promises';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required. Load .env.local before applying the migration.');

const sql = postgres(url, { ssl: 'require', max: 1 });

try {
  const migration = await readFile(new URL('../db_migrate/migrations/20260910_news_hard_data_resolution.sql', import.meta.url), 'utf8');
  console.log('Executing migration 20260910_news_hard_data_resolution.sql...');
  
  // postgres-js supports multiple statements if we pass the string or execute unsafe
  // However, postgres-js unsafe() will return the result of the LAST query by default, or an array of results if multiple queries return results.
  const results = await sql.unsafe(migration);
  console.log('Migration executed successfully!');
  console.log('Results returned:', results);
} catch (err) {
  console.error('Migration failed with error:', err);
  process.exit(1);
} finally {
  await sql.end();
}
