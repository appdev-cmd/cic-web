import 'server-only';
import { cache } from 'react';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeHtmlContent, normalizeMediaUrl } from '@/shared/lib/content';
import type { NewsLocale } from './placement';

type Row = Record<string, unknown>;

const table = (locale: NewsLocale) =>
  locale === 'en'
    ? { news: 'cic_news_en', category: 'cic_news_categories_en' }
    : { news: 'cic_news', category: 'cic_news_categories' };

const parseRelated = (value: unknown) =>
  String(value ?? '')
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter((item) => /^\d+$/.test(item));

const media = (value: unknown) => {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  if (/^https?:\/\/(?:www\.)?cic\.com\.vn\/images\//i.test(raw))
    return raw.replace(/^https?:\/\/(?:www\.)?cic\.com\.vn/i, '');
  if (/^\/?images\//i.test(raw)) return `/${raw.replace(/^\/+/, '')}`;
  return normalizeMediaUrl(raw);
};

const map = (row: Row) => ({
  id: String(row.id),
  title: String(row.title ?? ''),
  slug: String(row.alias ?? row.id),
  summary: row.summary == null ? null : String(row.summary),
  content: row.content == null ? '' : normalizeHtmlContent(String(row.content)),
  image: media(row.image),
  video: row.video == null ? null : String(row.video),
  fileUpload: media(row.file_upload),
  date: String(row.start_time ?? row.created_time ?? ''),
  views: Number(row.hits ?? 0),
  categoryId: row.category_id == null ? null : String(row.category_id),
  category: String(row.category_alias ?? ''),
  categoryName: String(row.category_name ?? ''),
  tags: String(row.tags ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
  productsRelated: parseRelated(row.products_related),
  newsRelated: parseRelated(row.news_related),
  seoTitle: row.seo_title == null ? null : String(row.seo_title),
  seoDescription: row.seo_description == null ? null : String(row.seo_description),
  seoKeyword: row.seo_keyword == null ? null : String(row.seo_keyword),
  isHot: row.is_hot === true,
  showInHomepage: row.show_in_homepage === true,
});

const listProjection = `n.id,n.title,n.alias,n.summary,n.image,n.video,n.file_upload,n.start_time,n.created_time,n.hits,n.category_id,n.tags,n.products_related,n.news_related,n.seo_title,n.seo_description,n.seo_keyword,n.is_hot,n.show_in_homepage,c.name category_name,c.alias category_alias`;
const detailProjection = `n.id,n.title,n.alias,n.summary,n.content,n.image,n.video,n.file_upload,n.start_time,n.created_time,n.hits,n.category_id,n.tags,n.products_related,n.news_related,n.seo_title,n.seo_description,n.seo_keyword,n.is_hot,n.show_in_homepage,c.name category_name,c.alias category_alias`;

export async function listPublishedNews(
  options: {
    locale?: NewsLocale;
    categoryAlias?: string;
    query?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const locale = options.locale ?? 'vi',
    t = table(locale),
    page = Math.max(1, options.page ?? 1),
    pageSize = Math.min(30, Math.max(1, options.pageSize ?? 6)),
    offset = (page - 1) * pageSize,
    sql = getPostgresClient();
  const category = options.categoryAlias?.trim() || null,
    query = options.query?.trim() || null;
  const where = `n.published=true AND c.published=true AND ($1::text IS NULL OR lower(btrim(c.alias))=lower(btrim($1))) AND ($2::text IS NULL OR n.title ILIKE '%'||$2||'%' OR coalesce(n.summary,'') ILIKE '%'||$2||'%')`;
  const [rows, count] = await Promise.all([
    sql.unsafe(
      `SELECT ${listProjection} FROM ${t.news} n JOIN ${t.category} c ON c.id=n.category_id WHERE ${where} ORDER BY coalesce(n.start_time, n.created_time) DESC, n.id DESC LIMIT $3 OFFSET $4`,
      [category, query, pageSize, offset]
    ),
    sql.unsafe(
      `SELECT count(*)::int total FROM ${t.news} n JOIN ${t.category} c ON c.id=n.category_id WHERE ${where}`,
      [category, query]
    ),
  ]);
  return {
    items: rows.map((row) => map(row as Row)),
    total: Number(count[0]?.total ?? 0),
    page,
    pageSize,
  };
}

export async function listPublishedNewsPlacement(locale: NewsLocale, placement: 'hot' | 'home') {
  const t = table(locale),
    column = placement === 'hot' ? 'is_hot' : 'show_in_homepage',
    sql = getPostgresClient();
  const rows = await sql.unsafe(
    `SELECT ${listProjection} FROM ${t.news} n JOIN ${t.category} c ON c.id=n.category_id WHERE n.published=true AND c.published=true AND n.${column}=true ORDER BY coalesce(n.start_time, n.created_time) DESC, n.id DESC LIMIT 4`
  );
  return rows.map((row) => map(row as Row));
}

export const getPublishedNewsBySlug = cache(async function (slug: string, locale: NewsLocale = 'vi') {
  const normalized = decodeURIComponent(slug).trim(),
    t = table(locale),
    sql = getPostgresClient();
  const rows = await sql.unsafe(
    `SELECT ${detailProjection} FROM ${t.news} n JOIN ${t.category} c ON c.id=n.category_id WHERE n.published=true AND c.published=true AND lower(btrim(n.alias))=lower(btrim($1))`,
    [normalized]
  );
  if (rows.length > 1) throw new Error('News alias invariant violated.');
  return rows[0] ? map(rows[0] as Row) : null;
});

export async function listLatestPublishedNews(locale: NewsLocale, excludeId: string, limit = 6) {
  const t = table(locale),
    sql = getPostgresClient();
  const rows = await sql.unsafe(
    `SELECT ${listProjection} FROM ${t.news} n JOIN ${t.category} c ON c.id=n.category_id WHERE n.published=true AND c.published=true AND n.id<>$1 ORDER BY coalesce(n.start_time, n.created_time) DESC, n.id DESC LIMIT $2`,
    [Number(excludeId), limit]
  );
  return rows.map((row) => map(row as Row));
}

export async function listPublishedNewsByIds(locale: NewsLocale, ids: string[]) {
  const normalized = ids.map(Number).filter(Number.isSafeInteger);
  if (normalized.length === 0) return [];
  const t = table(locale),
    sql = getPostgresClient();
  const rows = await sql.unsafe(
    `SELECT ${listProjection} FROM ${t.news} n JOIN ${t.category} c ON c.id=n.category_id WHERE n.published=true AND c.published=true AND n.id=ANY($1::bigint[]) ORDER BY coalesce(n.start_time, n.created_time) DESC, n.id DESC`,
    [normalized]
  );
  return rows.map((row) => map(row as Row));
}

