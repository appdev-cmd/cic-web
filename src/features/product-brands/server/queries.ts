import 'server-only';

import { getPostgresClient } from '@/server/db/postgres';
import type {
  ProductBrandItem,
  ProductBrandLocale,
  ProductBrandModuleData,
} from '../types';

const table = (locale: ProductBrandLocale) =>
  locale === 'en' ? 'cic_manufactories_en' : 'cic_manufactories';

const productsTable = (locale: ProductBrandLocale) =>
  locale === 'en' ? 'cic_products_en' : 'cic_products';

const mapCmsBrand = (row: Record<string, unknown>): ProductBrandItem => ({
  id: String(row.id),
  name: String(row.name ?? ''),
  alias: String(row.alias ?? ''),
  ordering: Number(row.ordering ?? 0),
  published: row.published === true,
  usageCount: Number(row.usage_count ?? 0),
  createdTime: row.created_time == null ? null : new Date(String(row.created_time)).toISOString(),
  updatedTime: row.updated_time == null ? null : new Date(String(row.updated_time)).toISOString(),
});

export async function getCmsProductBrands(locale: ProductBrandLocale) {
  const sql = getPostgresClient();
  const source = table(locale);
  const productSource = productsTable(locale);
  const rows = await sql.unsafe(
    `SELECT b.id,b.name,b.alias,b.ordering,b.published,b.created_time,b.updated_time,
       (SELECT count(*)::int FROM ${productSource} p
        WHERE CASE WHEN p.manufactory ~ '^[0-9]+$' THEN p.manufactory::int END=b.id) usage_count
     FROM ${source} b
     ORDER BY b.ordering,b.id`,
  );
  return rows.map((row) => mapCmsBrand(row as Record<string, unknown>));
}

export async function getProductBrandModuleData(): Promise<ProductBrandModuleData> {
  const [vi, en] = await Promise.all([getCmsProductBrands('vi'), getCmsProductBrands('en')]);
  return { vi, en };
}

export async function listPublishedProductBrands(locale: ProductBrandLocale) {
  const sql = getPostgresClient();
  const source = table(locale);
  const rows = await sql.unsafe(
    `SELECT id,name,alias,ordering FROM ${source} WHERE published=true ORDER BY ordering,id`,
  );
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ''),
    alias: String(row.alias ?? ''),
    ordering: Number(row.ordering ?? 0),
  }));
}
