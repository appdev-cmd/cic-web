import 'server-only';

import { getPostgresClient } from '@/server/db/postgres';
import type { ProductTypeItem, ProductTypeLocale, ProductTypeModuleData, PublishedProductType } from '../types';

const table = (locale: ProductTypeLocale) => locale === 'en' ? 'cic_products_types_en' : 'cic_products_types';
const productsTable = (locale: ProductTypeLocale) => locale === 'en' ? 'cic_products_en' : 'cic_products';

const mapItem = (row: Record<string, unknown>): ProductTypeItem => ({
  id: String(row.id), name: String(row.name ?? ''), alias: String(row.alias ?? ''),
  ordering: Number(row.ordering ?? 0), published: row.published === true,
  usageCount: Number(row.usage_count ?? 0),
  createdTime: row.created_time == null ? null : new Date(String(row.created_time)).toISOString(),
  updatedTime: row.updated_time == null ? null : new Date(String(row.updated_time)).toISOString(),
});

export async function getCmsProductTypes(locale: ProductTypeLocale) {
  const sql = getPostgresClient();
  const source = table(locale); const products = productsTable(locale);
  const rows = await sql.unsafe(`SELECT t.id,t.name,t.alias,t.ordering,t.published,t.created_time,t.updated_time,
    (SELECT count(*)::int FROM ${products} p WHERE p.types_id=t.id) usage_count
    FROM ${source} t WHERE nullif(btrim(t.alias),'') IS NOT NULL ORDER BY t.ordering,t.id`);
  return rows.map((row) => mapItem(row as Record<string, unknown>));
}

export async function getProductTypeModuleData(): Promise<ProductTypeModuleData> {
  const [vi, en] = await Promise.all([getCmsProductTypes('vi'), getCmsProductTypes('en')]);
  return { vi, en };
}

export async function listPublishedProductTypes(locale: ProductTypeLocale): Promise<readonly PublishedProductType[]> {
  const sql = getPostgresClient(); const source = table(locale);
  const rows = await sql.unsafe(`SELECT id,name,alias,ordering FROM ${source}
    WHERE published=true AND nullif(btrim(alias),'') IS NOT NULL ORDER BY ordering,id`);
  return rows.map((row) => ({ id: String(row.id), name: String(row.name ?? ''), alias: String(row.alias ?? ''),
    ordering: Number(row.ordering ?? 0) }));
}
