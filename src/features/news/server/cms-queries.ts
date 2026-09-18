import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeMediaUrl } from '@/shared/lib/content';
import type { NewsModuleData } from '@/cms/data/EditorialContentDataSource';
import type { NewsArticle, NewsCategory, RelatedProductItem } from '@/cms/modules/news/types';
import type { NewsLocale } from './placement';

const tables = (locale: NewsLocale) => locale === 'en'
  ? { news: 'cic_news_en', category: 'cic_news_categories_en', product: 'cic_products_en' }
  : { news: 'cic_news', category: 'cic_news_categories', product: 'cic_products' };
const ids = (value: unknown) => String(value ?? '').split(',').map((item) => item.trim()).filter((item) => /^\d+$/.test(item));
const tags = (value: unknown) => String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
const iso = (value: unknown) => value == null ? '' : new Date(String(value)).toISOString();
const media = (value: unknown) => value == null ? '' : normalizeMediaUrl(String(value)) ?? '';

const newsCache = new Map<string, { data: NewsModuleData; expiresAt: number }>();
const NEWS_CACHE_TTL_MS = 30_000;

export function invalidateCmsNewsCache(): void {
  newsCache.clear();
}

export async function getCmsNewsContent(locale: NewsLocale, id: string): Promise<string> {
  const sql = getPostgresClient();
  const t = tables(locale);
  const rows = await sql.unsafe<Array<{ content: string | null }>>(
    `SELECT content FROM ${t.news} WHERE id = $1 LIMIT 1`,
    [Number(id)]
  );
  return rows[0]?.content ?? '';
}

export async function getCmsNews(locale: NewsLocale) {
  const cached = newsCache.get(locale);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const sql = getPostgresClient(); const t = tables(locale);
  // Omit n.content (11MB payload) from list projection to achieve instant load
  const [rows, categories, products, activity] = await Promise.all([
    sql.unsafe(`SELECT n.id,n.title,n.alias,n.other_languages1,n.category_id,n.summary,n.image,n.video,n.file_upload,n.tags,n.news_related,n.products_related,n.start_time,n.end_time,n.published,n.is_hot,n.is_new,n.show_in_homepage,n.ordering,n.seo_title,n.seo_keyword,n.seo_description,n.tawk_to,n.created_time,n.updated_time,n.author,n.author_last,u.full_name author_name FROM ${t.news} n LEFT JOIN cic_users u ON u.id=coalesce(n.author_last_id,n.author_id) ORDER BY coalesce(n.start_time,n.created_time) DESC,n.id DESC`),
    sql.unsafe(`SELECT id,name,title,alias,summary,parent_id,ordering,image,published,show_in_homepage,seo_title,seo_keyword,seo_description,created_time,updated_time FROM ${t.category} ORDER BY ordering,id`),
    sql.unsafe(`SELECT id,name,image,code FROM ${t.product} ORDER BY name,id`),
    sql`SELECT id,entity_id,actor_label,action_code,occurred_at,after_data FROM cic_activity_logs WHERE entity_type='news' AND workspace=${locale} ORDER BY occurred_at DESC LIMIT 500`,
  ]);

  const activityByEntity = new Map<string, Array<{ id: string; timestamp: string; user: string; action: string; details: string }>>();
  for (const event of activity) {
    const entityId = String(event.entity_id);
    let list = activityByEntity.get(entityId);
    if (!list) {
      list = [];
      activityByEntity.set(entityId, list);
    }
    list.push({
      id: String(event.id),
      timestamp: iso(event.occurred_at),
      user: String(event.actor_label ?? 'Hệ thống'),
      action: String(event.action_code),
      details: String(event.action_code),
    });
  }

  const articles: NewsArticle[] = rows.map((row: Record<string, unknown>) => {
    const rowId = String(row.id);
    return {
      id: rowId,
      title: String(row.title ?? ''),
      alias: String(row.alias ?? ''),
      other_languages1: String(row.other_languages1 ?? ''),
      category_id: String(row.category_id ?? ''),
      summary: String(row.summary ?? ''),
      content: '', // Loaded lazily on demand when editing or previewing
      image: media(row.image),
      video: String(row.video ?? ''),
      file_upload: String(row.file_upload ?? ''),
      tags: tags(row.tags),
      news_related: ids(row.news_related),
      products_related: ids(row.products_related),
      start_time: iso(row.start_time),
      end_time: iso(row.end_time),
      published: row.published === true,
      is_hot: row.is_hot === true,
      is_new: row.is_new === true,
      show_in_homepage: row.show_in_homepage === true,
      ordering: Number(row.ordering ?? 0),
      seo_title: String(row.seo_title ?? ''),
      seo_keyword: String(row.seo_keyword ?? ''),
      seo_description: String(row.seo_description ?? ''),
      tawk_to: String(row.tawk_to ?? ''),
      created_time: iso(row.created_time),
      updated_time: iso(row.updated_time),
      author: { name: String(row.author_name ?? row.author_last ?? row.author ?? 'Hệ thống') },
      activity_logs: activityByEntity.get(rowId) ?? [],
    };
  });
  const mappedCategories: NewsCategory[] = categories.map((row:Record<string,unknown>)=>({id:String(row.id),name:String(row.name??''),title:String(row.title??''),alias:String(row.alias??''),summary:String(row.summary??''),parent_id:row.parent_id==null?null:String(row.parent_id),ordering:Number(row.ordering??0),image:media(row.image),published:row.published===true,show_in_homepage:row.show_in_homepage===true,seo_title:String(row.seo_title??''),seo_keyword:String(row.seo_keyword??''),seo_description:String(row.seo_description??''),created_time:iso(row.created_time),updated_time:iso(row.updated_time)}));
  const relatedProducts: RelatedProductItem[] = products.map((row:Record<string,unknown>)=>({id:String(row.id),name:String(row.name??''),image:media(row.image),code:String(row.code??'')}));
  const result: NewsModuleData = { articles, categories: mappedCategories, relatedProducts, mediaImages: [] };

  newsCache.set(locale, {
    data: result,
    expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
  });

  return result;
}
