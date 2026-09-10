import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeMediaUrl } from '@/shared/lib/content';
import type { NewsCategoryItem, NewsCategoryLocale, NewsCategoryModuleData, PublicNewsCategory } from '../types';

const names = (locale: NewsCategoryLocale) => ({
  category: locale === 'en' ? 'cic_news_categories_en' : 'cic_news_categories',
  news: locale === 'en' ? 'cic_news_en' : 'cic_news',
});
const iso = (value: unknown) => value == null ? null : new Date(String(value)).toISOString();
const media = (value: unknown) => value == null ? null : normalizeMediaUrl(String(value));
const rawMedia = (value: unknown) => value == null ? null : String(value);
const mapCms = (row: Record<string, unknown>): NewsCategoryItem => ({
  id: String(row.id), name: String(row.name ?? ''), title: row.title == null ? null : String(row.title), alias: String(row.alias ?? ''), summary: row.summary == null ? null : String(row.summary), parentId: row.parent_id == null ? null : String(row.parent_id), parentName: row.parent_name == null ? null : String(row.parent_name), level: Number(row.level ?? 0), ordering: Number(row.ordering ?? 0), image: rawMedia(row.image), published: row.published === true, showInHomepage: row.show_in_homepage === true, seoTitle: row.seo_title == null ? null : String(row.seo_title), seoKeyword: row.seo_keyword == null ? null : String(row.seo_keyword), seoDescription: row.seo_description == null ? null : String(row.seo_description), usageCount: Number(row.usage_count ?? 0), childCount: Number(row.child_count ?? 0), createdTime: iso(row.created_time), updatedTime: iso(row.updated_time),
});

export async function getCmsNewsCategories(locale: NewsCategoryLocale): Promise<NewsCategoryItem[]> {
  const sql = getPostgresClient(), { category, news } = names(locale);
  const rows = await sql.unsafe(`SELECT c.id,c.name,c.title,c.alias,c.summary,c.parent_id,p.name parent_name,c.level,c.ordering,c.image,c.published,c.show_in_homepage,c.seo_title,c.seo_keyword,c.seo_description,c.created_time,c.updated_time,(SELECT count(*)::int FROM ${news} n WHERE n.category_id=c.id) usage_count,(SELECT count(*)::int FROM ${category} ch WHERE ch.parent_id=c.id) child_count FROM ${category} c LEFT JOIN ${category} p ON p.id=c.parent_id ORDER BY c.ordering,c.id`);
  return rows.map((row) => mapCms(row as Record<string, unknown>));
}

export async function getNewsCategoryModuleData(): Promise<NewsCategoryModuleData> {
  const [vi, en] = await Promise.all([getCmsNewsCategories('vi'), getCmsNewsCategories('en')]);
  return { vi, en };
}

export async function listPublishedNewsCategories(locale: NewsCategoryLocale = 'vi'): Promise<PublicNewsCategory[]> {
  const sql = getPostgresClient(), { category } = names(locale);
  const rows = await sql.unsafe(`SELECT id,name,title,alias,parent_id,ordering,image,summary,seo_title,seo_description FROM ${category} WHERE published=true AND nullif(btrim(alias),'') IS NOT NULL ORDER BY ordering,id`);
  return rows.map((row) => ({ id: String(row.id), name: String(row.name ?? ''), title: row.title == null ? null : String(row.title), alias: String(row.alias), parentId: row.parent_id == null ? null : String(row.parent_id), ordering: Number(row.ordering ?? 0), image: media(row.image), summary: row.summary == null ? null : String(row.summary), seoTitle: row.seo_title == null ? null : String(row.seo_title), seoDescription: row.seo_description == null ? null : String(row.seo_description) }));
}
