import 'server-only';
import type { Sql } from 'postgres';

export const NEWS_PLACEMENT_LIMIT = 4;
export type NewsLocale = 'vi' | 'en';
export type NewsPlacement = 'hot' | 'home';

const tableByLocale = { vi: 'cic_news', en: 'cic_news_en' } as const;
const columnByPlacement = { hot: 'is_hot', home: 'show_in_homepage' } as const;

/**
 * Must run before the write, using the same PostgreSQL transaction. Keeping the
 * lock acquisition in its own statement gives READ COMMITTED a fresh snapshot
 * for the subsequent count and prevents two writers from both admitting item 5.
 */
export async function assertNewsPlacementCapacity(
  sql: Sql,
  locale: NewsLocale,
  placement: NewsPlacement,
  articleId: number | null,
) {
  const table = tableByLocale[locale];
  const column = columnByPlacement[placement];
  await sql.unsafe('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [`${table}:${column}`]);
  const [row] = await sql.unsafe(
    `SELECT count(*)::int count FROM ${table} WHERE ${column} IS TRUE AND ($1::int IS NULL OR id<>$1)`,
    [articleId],
  );
  if (Number(row?.count ?? 0) >= NEWS_PLACEMENT_LIMIT) {
    throw new Error(`${placement === 'hot' ? 'Hot News' : 'Home News'} chỉ được chọn tối đa ${NEWS_PLACEMENT_LIMIT} bài cho mỗi ngôn ngữ.`);
  }
}
