import 'server-only';
import postgres, { type Sql } from 'postgres';
import { getServerEnv } from '@/server/config/env';

let client: Sql | undefined;
export function getPostgresClient(): Sql {
  if (client) return client;
  const url = getServerEnv().DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required for PostgreSQL transactions.');
  client = postgres(url, { max: 5, prepare: false, ssl: 'require' });
  return client;
}

export async function withTransaction<T>(work: (tx: Sql) => Promise<T>): Promise<T> {
  const sql = getPostgresClient();
  return sql.begin(async (tx) => work(tx as unknown as Sql)) as Promise<T>;
}
