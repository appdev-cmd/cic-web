import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeMediaUrl } from '@/shared/lib/content';
import type { EventLocale } from '../types';
import type { EventItem } from '@/cms/modules/events/types';

const tables = (l: EventLocale) =>
  l === 'en'
    ? { e: 'cic_event_en', p: 'cic_products_en', n: 'cic_news_en' }
    : { e: 'cic_event', p: 'cic_products', n: 'cic_news' };

const parseCsv = (val: unknown): string[] =>
  String(val ?? '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);

export async function getCmsEvents(locale: EventLocale) {
  const sql = getPostgresClient();
  const t = tables(locale);

  const [rows, products, newsArticles, activity] = await Promise.all([
    sql.unsafe(`
      SELECT e.id, e.title, e.alias, e.summary, e.content, e.tags, e.image,
             e.time_event, e.end_time, e.specific_time, e.place, e.chu_de,
             e.link_dangky, e.published, e.is_hot, e.show_in_homepage,
             e.ordering, e.seo_title, e.seo_keyword, e.seo_description,
             e.tawk_to, e.products_related, e.news_related, e.event_related,
             e.created_time, e.updated_time
      FROM ${t.e} e
      ORDER BY e.ordering ASC, e.time_event DESC, e.id DESC
    `),
    sql.unsafe(`SELECT id, name, code, image, published FROM ${t.p} ORDER BY name, id`),
    sql.unsafe(`SELECT id, title, alias, image, published FROM ${t.n} ORDER BY id DESC LIMIT 50`),
    sql`
      SELECT id, entity_id, entity_title, actor_label, action_code, occurred_at
      FROM cic_activity_logs
      WHERE entity_type = 'event' AND workspace = ${locale}
      ORDER BY occurred_at DESC
      LIMIT 200
    `,
  ]);

  const events: EventItem[] = rows.map((r: Record<string, unknown>) => {
    const timeEvent = r.time_event ? new Date(String(r.time_event)).toISOString() : '';
    const endTime = r.end_time ? new Date(String(r.end_time)).toISOString() : '';

    return {
      id: String(r.id),
      title: String(r.title ?? ''),
      alias: String(r.alias ?? r.id),
      summary: String(r.summary ?? ''),
      content: String(r.content ?? ''),
      tags: parseCsv(r.tags),
      tawk_to: String(r.tawk_to ?? ''),
      image: normalizeMediaUrl(r.image ? String(r.image) : ''),
      time_event: timeEvent,
      end_time: endTime,
      place: String(r.place ?? ''),
      specific_time: String(r.specific_time ?? ''),
      chu_de: String(r.chu_de ?? ''),
      link_dangky: String(r.link_dangky ?? ''),
      editorial_status: r.published === true ? ('published' as const) : ('draft' as const),
      published: r.published === true,
      is_hot: r.is_hot === true,
      show_in_home: r.show_in_homepage === true || r.is_hot === true,
      ordering: Number(r.ordering ?? 1),
      event_related: parseCsv(r.event_related),
      news_related: parseCsv(r.news_related),
      products_related: parseCsv(r.products_related),
      seo_title: String(r.seo_title ?? ''),
      seo_keyword: String(r.seo_keyword ?? ''),
      seo_description: String(r.seo_description ?? ''),
      created_time: r.created_time ? new Date(String(r.created_time)).toISOString() : '',
      updated_time: r.updated_time ? new Date(String(r.updated_time)).toISOString() : undefined,
    };
  });

  const relatedProducts = products.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    name: String(r.name ?? ''),
    code: String(r.code ?? r.id),
    image: normalizeMediaUrl(r.image ? String(r.image) : ''),
  }));

  const relatedArticles = newsArticles.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    title: String(r.title ?? ''),
    alias: String(r.alias ?? r.id),
    category_id: '',
    summary: '',
    content: '',
    image: normalizeMediaUrl(r.image ? String(r.image) : ''),
    image_alt: '',
    image_caption: '',
    video: '',
    tags: [],
    news_related: [],
    products_related: [],
    start_time: '',
    end_time: '',
    timezone: '',
    is_hot: false,
    is_new: false,
    show_in_homepage: false,
    published: r.published === true,
    ordering: 1,
    views_count: 0,
    created_time: '',
    author: {
      name: 'Ban biên tập',
    },
    seo_title: '',
    seo_keyword: '',
    seo_description: '',
  }));

  return {
    events,
    relatedProducts,
    relatedArticles,
    activityLogs: activity.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      user: String(r.actor_label ?? 'Hệ thống'),
      role: 'Staff',
      action: String(r.action_code),
      timestamp: r.occurred_at ? new Date(String(r.occurred_at)).toISOString() : '',
    })),
  };
}
