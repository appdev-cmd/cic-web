import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1,
  prepare: false,
});

try {
  const migration = await readFile(
    'db_migrate/migrations/20260904_product_brands_hardening.sql',
    'utf8',
  );
  await sql.unsafe(migration);
  console.log('Product brands hardening applied.');
} finally {
  await sql.end();
}
