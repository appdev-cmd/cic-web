import 'server-only';

import { getPostgresClient } from '@/server/db/postgres';
import type {
  ProductApplicationItem,
  ProductApplicationLocale,
  ProductApplicationModuleData,
  PublishedProductApplication,
} from '../types';

const applicationTable = (locale: ProductApplicationLocale) =>
  locale === 'en' ? 'cic_application_en' : 'cic_application';

const relationTable = (locale: ProductApplicationLocale) =>
  locale === 'en' ? 'cic_products_applications_rel_en' : 'cic_products_applications_rel';

const mapCmsApplication = (row: Record<string, unknown>): ProductApplicationItem => ({
  id: String(row.id),
  name: String(row.name ?? ''),
  alias: String(row.alias ?? ''),
  ordering: Number(row.ordering ?? 0),
  published: row.published === true,
  usageCount: Number(row.usage_count ?? 0),
  createdTime: row.created_time == null ? null : new Date(String(row.created_time)).toISOString(),
  updatedTime: row.updated_time == null ? null : new Date(String(row.updated_time)).toISOString(),
});

export async function getCmsProductApplications(locale: ProductApplicationLocale) {
  const sql = getPostgresClient();
  const source = applicationTable(locale);
  const relations = relationTable(locale);
  const rows = await sql.unsafe(
    `SELECT a.id,a.name,a.alias,a.ordering,a.published,a.created_time,a.updated_time,
       (SELECT count(*)::int FROM ${relations} r WHERE r.application_id=a.id) usage_count
     FROM ${source} a
     WHERE nullif(btrim(a.alias),'') IS NOT NULL
     ORDER BY a.ordering,a.id`,
  );
  return rows.map((row) => mapCmsApplication(row as Record<string, unknown>));
}

export async function getProductApplicationModuleData(): Promise<ProductApplicationModuleData> {
  const [vi, en] = await Promise.all([
    getCmsProductApplications('vi'),
    getCmsProductApplications('en'),
  ]);
  return { vi, en };
}

export async function listPublishedProductApplications(
  locale: ProductApplicationLocale,
): Promise<readonly PublishedProductApplication[]> {
  const sql = getPostgresClient();
  const source = applicationTable(locale);
  const rows = await sql.unsafe(
    `SELECT id,name,alias,ordering
     FROM ${source}
     WHERE published=true AND nullif(btrim(alias),'') IS NOT NULL
     ORDER BY ordering,id`,
  );
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ''),
    alias: String(row.alias ?? ''),
    ordering: Number(row.ordering ?? 0),
  }));
}
