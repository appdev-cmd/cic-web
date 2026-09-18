import 'server-only';
import postgres, { type Sql } from 'postgres';
import { getServerEnv } from '@/server/config/env';

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: Sql | undefined;
}

export function getPostgresClient(): Sql {
  if (globalThis.__postgresClient) return globalThis.__postgresClient;
  const url = getServerEnv().DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required for PostgreSQL transactions.');
  const client = postgres(url, {
    max: 20,
    prepare: false,
    ssl: 'require',
    connect_timeout: 10,
    idle_timeout: 30,
    max_lifetime: 60 * 10,
  });
  globalThis.__postgresClient = client;
  return client;
}

export async function withTransaction<T>(work: (tx: Sql) => Promise<T>): Promise<T> {
  const sql = getPostgresClient();
  return sql.begin(async (tx) => work(tx as unknown as Sql)) as Promise<T>;
}
