import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeMediaUrl } from '@/shared/lib/content';
import type { EventLocale, EventItemViewModel, EventStatus } from '../types';

const tables = (locale: EventLocale) =>
  locale === 'en' ? 'cic_event_en' : 'cic_event';

export function deriveEventStatus(
  startTime?: string | null,
  endTime?: string | null
): EventStatus {
  const now = Date.now();
  const start = startTime ? new Date(startTime).getTime() : NaN;
  const end = endTime ? new Date(endTime).getTime() : NaN;

  if (Number.isFinite(start) && now < start) return 'upcoming';
  if (Number.isFinite(end) && now < end) return 'ongoing';
  return 'past';
}

const parseCsv = (val: unknown): string[] =>
  String(val ?? '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);

const mapRowToViewModel = (row: Record<string, unknown>): EventItemViewModel => {
  const timeEvent = row.time_event ? new Date(String(row.time_event)).toISOString() : '';
  const endTime = row.end_time ? new Date(String(row.end_time)).toISOString() : '';
  const status = deriveEventStatus(timeEvent, endTime);

  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    slug: String(row.alias ?? row.id),
    chuDe: String(row.chu_de ?? ''),
    place: String(row.place ?? ''),
    timeEvent,
    endTime,
    specificTime: String(row.specific_time ?? ''),
    linkDangky: String(row.link_dangky ?? ''),
    summary: String(row.summary ?? ''),
    content: String(row.content ?? ''),
    image: normalizeMediaUrl(row.image ? String(row.image) : ''),
    tags: parseCsv(row.tags),
    published: row.published === true,
    isHot: row.is_hot === true,
    showInHomepage: row.show_in_homepage === true,
    ordering: Number(row.ordering ?? 1),
    seoTitle: String(row.seo_title ?? ''),
    seoKeyword: String(row.seo_keyword ?? ''),
    seoDescription: String(row.seo_description ?? ''),
    tawkTo: String(row.tawk_to ?? ''),
    status,
    isOpenRegistration: status === 'upcoming' || status === 'ongoing',
    productsRelated: parseCsv(row.products_related),
    newsRelated: parseCsv(row.news_related),
    eventRelated: parseCsv(row.event_related),
    createdTime: row.created_time ? new Date(String(row.created_time)).toISOString() : undefined,
    updatedTime: row.updated_time ? new Date(String(row.updated_time)).toISOString() : undefined,
  };
};

const PUBLIC_PROJECTION = `
  id, title, alias, chu_de, place, time_event, end_time, specific_time,
  link_dangky, summary, content, image, tags, published, is_hot, show_in_homepage,
  ordering, seo_title, seo_keyword, seo_description, tawk_to,
  products_related, news_related, event_related, created_time, updated_time
`;

export async function listPublishedEvents(
  locale: EventLocale = 'vi'
): Promise<EventItemViewModel[]> {
  const sql = getPostgresClient();
  const table = tables(locale);

  const rows = await sql.unsafe(
    `SELECT ${PUBLIC_PROJECTION}
     FROM ${table}
     WHERE published = true AND nullif(btrim(alias), '') IS NOT NULL
     ORDER BY ordering ASC, time_event DESC, id DESC`
  );

  return rows.map((r) => mapRowToViewModel(r as Record<string, unknown>));
}

export async function getPublishedEventBySlug(
  slug: string,
  locale: EventLocale = 'vi'
): Promise<EventItemViewModel | null> {
  const sql = getPostgresClient();
  const table = tables(locale);

  const rows = await sql.unsafe(
    `SELECT ${PUBLIC_PROJECTION}
     FROM ${table}
     WHERE published = true AND (lower(btrim(alias)) = lower(btrim($1)) OR id::text = $1)
     LIMIT 1`,
    [slug]
  );

  if (!rows.length) return null;
  return mapRowToViewModel(rows[0] as Record<string, unknown>);
}

export async function getCmsEventsData(
  locale: EventLocale = 'vi'
): Promise<EventItemViewModel[]> {
  const sql = getPostgresClient();
  const table = tables(locale);

  const rows = await sql.unsafe(
    `SELECT ${PUBLIC_PROJECTION}
     FROM ${table}
     ORDER BY ordering ASC, time_event DESC, id DESC`
  );

  return rows.map((r) => mapRowToViewModel(r as Record<string, unknown>));
}

export async function getPublishedEventProducts(
  locale: EventLocale,
  ids: number[]
) {
  if (!ids.length) return [];
  const sql = getPostgresClient();
  const productTable = locale === 'en' ? 'cic_products_en' : 'cic_products';
  const rows = await sql.unsafe(
    `SELECT id, name, summary, description, tags, image, icon, price, manufactory
     FROM ${productTable}
     WHERE id = ANY($1::int[]) AND published = true
     ORDER BY array_position($1::int[], id)`,
    [ids]
  );
  return rows.map((row: Record<string, unknown>) => ({
    id: Number(row.id),
    name: String(row.name ?? ''),
    price: String(row.price ?? ''),
    description: String(row.description ?? ''),
    desc: String(row.summary ?? ''),
    field: '',
    brand: String(row.manufactory ?? ''),
    app: '',
    tags: String(row.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
    img: normalizeMediaUrl(String(row.image ?? '')),
    icon: normalizeMediaUrl(String(row.icon ?? '')),
  }));
}
