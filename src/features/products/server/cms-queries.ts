import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { ProductLocale } from '../types';
import { normalizeProductMediaUrl } from '../mappers';
import type { ProductsModuleData } from '@/cms/data/CatalogDataSource';
import type { CmsProductListItem, ProductItem } from '@/cms/modules/products/types';

const tables = (locale: ProductLocale) => locale === 'en'
  ? { p: 'cic_products_en', c: 'cic_products_categories_en', cr: 'cic_products_categories_rel_en', b: 'cic_manufactories_en', a: 'cic_application_en', ar: 'cic_products_applications_rel_en', t: 'cic_products_types_en', rr: 'cic_products_related_rel_en', im: 'cic_products_images_en' }
  : { p: 'cic_products', c: 'cic_products_categories', cr: 'cic_products_categories_rel', b: 'cic_manufactories', a: 'cic_application', ar: 'cic_products_applications_rel', t: 'cic_products_types', rr: 'cic_products_related_rel', im: 'cic_products_images' };

const ids = (value: unknown) => Array.isArray(value) ? value.map(String) : [];
const tags = (value: unknown) => String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
const date = (value: unknown) => value ? new Date(String(value)).toISOString() : '';
const numericRelation = (value: unknown) => value && /^\d+$/.test(String(value)) ? String(value) : '';

function mapListRow(row: Record<string, unknown>): CmsProductListItem {
  return {
    id: String(row.id), name: String(row.name ?? ''), title: String(row.name ?? ''),
    sku: String(row.code ?? ''), code: String(row.code ?? ''), alias: String(row.alias ?? ''),
    summary: String(row.summary ?? ''), short_description: String(row.summary ?? ''),
    image: normalizeProductMediaUrl(row.image), icon: normalizeProductMediaUrl(row.icon),
    price_old: String(row.price_old ?? ''), price: String(row.price ?? ''), tags: tags(row.tags),
    is_hot: Boolean(row.is_hot), teamview: Boolean(row.teamview), ordering: Number(row.ordering ?? 0),
    published: Boolean(row.published), editorial_status: row.published ? 'published' as const : 'draft' as const,
    updated_time: date(row.edited_time), created_time: date(row.created_time),
    category_ids: ids(row.category_ids), category_id: '',
    application: ids(row.application_ids), application_areas: ids(row.application_ids),
    manufactory: numericRelation(row.manufactory), brand_id: numericRelation(row.manufactory),
    types: row.types_id ? String(row.types_id) : '', product_type: row.types_id ? String(row.types_id) : '',
  };
}

function mapDetailRow(row: Record<string, unknown>): ProductItem {
  return {
    ...mapListRow(row),
    other_languages1: String(row.other_languages1 ?? ''),
    description: String(row.description ?? ''), content_html: String(row.description ?? ''),
    feature_details: String(row.feature_details ?? ''),
    video: String(row.video ?? ''), video_url: String(row.video ?? ''), tawk_to: String(row.tawk_to ?? ''),
    gallery: ids(row.gallery).map(normalizeProductMediaUrl).filter(Boolean),
    landing_page: String(row.landing_page ?? ''), seo_title: String(row.seo_title ?? ''),
    seo_keyword: String(row.seo_keyword ?? ''), seo_description: String(row.seo_description ?? ''),
    file_catalogue: String(row.file_catalogue ?? ''), file_price: String(row.file_price ?? ''),
    link_catalogue: String(row.link_catalogue ?? ''), file_driver_name: String(row.file_driver_name ?? ''),
    file_driver: String(row.file_driver ?? ''), link_driver: String(row.link_driver ?? ''),
    products_relates: ids(row.related_ids),
    ...Object.fromEntries(Array.from({ length: 6 }, (_, index) => {
      const position = index + 1;
      return [[`file_name${position}`, String(row[`file_name${position}`] ?? '')], [`file_download${position}`, String(row[`file_download${position}`] ?? '')], [`link_download${position}`, String(row[`link_download${position}`] ?? '')]];
    }).flat()),
  } as ProductItem;
}

const detailColumns = (x: ReturnType<typeof tables>) => `p.id,p.name,p.alias,p.code,p.other_languages1,p.summary,p.description,p.feature_details,p.video,p.tawk_to,p.image,p.icon,p.price,p.price_old,p.tags,p.is_hot,p.teamview,p.ordering,p.landing_page,p.seo_title,p.seo_keyword,p.seo_description,p.file_catalogue,p.file_price,p.link_catalogue,p.file_driver_name,p.file_driver,p.link_driver,p.published,p.created_time,p.edited_time,p.manufactory,p.types_id,${Array.from({ length: 6 }, (_, index) => `p.file_name${index + 1},p.file_download${index + 1},p.link_download${index + 1}`).join(',')},(SELECT array_agg(category_id ORDER BY category_id) FROM ${x.cr} WHERE product_id=p.id) category_ids,(SELECT array_agg(application_id ORDER BY ordering,application_id) FROM ${x.ar} WHERE product_id=p.id) application_ids,(SELECT array_agg(related_product_id ORDER BY ordering,related_product_id) FROM ${x.rr} WHERE product_id=p.id) related_ids,(SELECT array_agg(image ORDER BY ordering,id) FROM ${x.im} WHERE record_id=p.id AND image IS NOT NULL AND btrim(image)<>'') gallery`;

export async function getCmsProductDetail(locale: ProductLocale, productId: number): Promise<ProductItem | null> {
  const sql = getPostgresClient();
  const x = tables(locale);
  const rows = await sql.unsafe(`SELECT ${detailColumns(x)} FROM ${x.p} p WHERE p.id=$1`, [productId]);
  return rows[0] ? mapDetailRow(rows[0] as Record<string, unknown>) : null;
}

export async function getCmsProductActivity(locale: ProductLocale, productId: number) {
  const sql = getPostgresClient();
  const activity = await sql`SELECT id,entity_id,entity_title,actor_label,action_code,occurred_at FROM cic_activity_logs WHERE entity_type='product' AND workspace=${locale} AND entity_id=${String(productId)} ORDER BY occurred_at DESC LIMIT 200`;
  return activity.map((row: Record<string, unknown>) => ({ id: String(row.id), product_id: String(row.entity_id), product_title: String(row.entity_title ?? ''), user_name: String(row.actor_label ?? 'Hệ thống'), user_role: '', action: String(row.action_code).endsWith('.created') ? 'create' as const : String(row.action_code).endsWith('.status_changed') ? 'publish' as const : 'update' as const, details: String(row.action_code), timestamp: date(row.occurred_at) }));
}

export async function getCmsProducts(locale: ProductLocale): Promise<ProductsModuleData> {
  const sql = getPostgresClient();
  const x = tables(locale);
  // List projection excludes full HTML and editor-only relations/media.
  const [rows, categories, brands, applications, productTypes] = await Promise.all([
    sql.unsafe(`SELECT p.id,p.name,p.alias,p.code,p.summary,p.image,p.icon,p.price,p.price_old,p.tags,p.is_hot,p.teamview,p.ordering,p.published,p.created_time,p.edited_time,p.manufactory,p.types_id,(SELECT array_agg(category_id ORDER BY category_id) FROM ${x.cr} WHERE product_id=p.id) category_ids,(SELECT array_agg(application_id ORDER BY ordering,application_id) FROM ${x.ar} WHERE product_id=p.id) application_ids FROM ${x.p} p WHERE p.name NOT ILIKE '[Du lieu da bi xoa%' ORDER BY coalesce(p.edited_time, p.created_time) DESC NULLS LAST, p.id DESC`),
    sql.unsafe(`SELECT id,name,alias FROM ${x.c} WHERE name NOT ILIKE '[Du lieu da bi xoa%' ORDER BY ordering,id`),
    sql.unsafe(`SELECT id,name,image FROM ${x.b} WHERE name NOT ILIKE '[Du lieu da bi xoa%' ORDER BY ordering,id`),
    sql.unsafe(`SELECT id,name,published FROM ${x.a} WHERE name NOT ILIKE '[Du lieu da bi xoa%' ORDER BY coalesce(updated_time, created_time) DESC NULLS LAST, ordering, id`),
    sql.unsafe(`SELECT id,name,published FROM ${x.t} WHERE name NOT ILIKE '[Du lieu da bi xoa%' ORDER BY ordering,id`),
  ]);
  return {
    products: rows.map((row) => mapListRow(row as Record<string, unknown>)),
    categories: categories.map((row: Record<string, unknown>) => ({ id: String(row.id), name: String(row.name), slug: String(row.alias ?? '') })),
    brands: brands.map((row: Record<string, unknown>) => ({ id: String(row.id), name: String(row.name), logo: String(row.image ?? '') })),
    applications: applications.map((row: Record<string, unknown>) => ({ id: String(row.id), name: String(row.name), type: 'applications' as const, sector_group: '', code: '', alias: '', status: row.published ? 'active' as const : 'inactive' as const, ordering: 0, usage_count: 0, created_time: '', updated_time: '' })),
    productTypes: productTypes.map((row: Record<string, unknown>) => ({ id: String(row.id), name: String(row.name), type: 'product_types' as const, type_code: '', requires_license_key: false, pricing_model_default: 'quote' as const, code: '', alias: '', status: row.published ? 'active' as const : 'inactive' as const, ordering: 0, usage_count: 0, created_time: '', updated_time: '' })),
    owners: [],
    activityLogs: [],
  };
}
