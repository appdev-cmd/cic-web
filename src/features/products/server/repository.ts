import 'server-only';

import type { Sql } from 'postgres';
import { moveProductToTrash } from '@/features/trash/server/adapters/product';
import { writeAuditEvent } from '@/server/audit/writer';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import type { CmsPrincipal } from '@/server/auth/guards';
import { withTransaction } from '@/server/db/postgres';
import type { ProductInput } from '../schemas/productInput';
import type { ProductLocale } from '../types';

const tables = (locale: ProductLocale) => locale === 'en'
  ? { p: 'cic_products_en', c: 'cic_products_categories_en', cr: 'cic_products_categories_rel_en', b: 'cic_manufactories_en', a: 'cic_application_en', ar: 'cic_products_applications_rel_en', t: 'cic_products_types_en', rr: 'cic_products_related_rel_en' }
  : { p: 'cic_products', c: 'cic_products_categories', cr: 'cic_products_categories_rel', b: 'cic_manufactories', a: 'cic_application', ar: 'cic_products_applications_rel', t: 'cic_products_types', rr: 'cic_products_related_rel' };
const cleanHtml = (value: string) => value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '').replace(/javascript:/gi, '');

async function validateRelations(sql: Sql, locale: ProductLocale, id: number | null, value: ProductInput) {
  const t = tables(locale);
  if ((await sql.unsafe(`SELECT 1 FROM ${t.p} WHERE lower(btrim(alias))=lower(btrim($1)) AND ($2::int IS NULL OR id<>$2) LIMIT 1`, [value.alias, id])).length) throw new Error('Alias đã được sản phẩm khác sử dụng.');
  if (value.relatedProductIds.includes(id ?? -1)) throw new Error('Sản phẩm không thể liên quan chính nó.');
  for (const [table, ids] of [[t.c, value.categoryIds], [t.a, value.applicationIds], [t.p, value.relatedProductIds]] as const) if (ids.length && (await sql.unsafe(`SELECT id FROM ${table} WHERE id=ANY($1::int[])`, [ids])).length !== new Set(ids).size) throw new Error('Quan hệ sản phẩm không hợp lệ.');
  if (value.manufactoryId && !(await sql.unsafe(`SELECT 1 FROM ${t.b} WHERE id=$1`, [value.manufactoryId])).length) throw new Error('Hãng sản xuất không hợp lệ.');
  if (value.typeId && !(await sql.unsafe(`SELECT 1 FROM ${t.t} WHERE id=$1`, [value.typeId])).length) throw new Error('Loại sản phẩm không hợp lệ.');
  const current = id ? (await sql.unsafe(`SELECT is_hot FROM ${t.p} WHERE id=$1`, [id]))[0] : null;
  if (value.is_hot && !current?.is_hot) { const [count] = await sql.unsafe(`SELECT count(*)::int n FROM ${t.p} WHERE is_hot=true`); if (Number(count.n) >= 6) throw new Error('Chỉ được chọn tối đa 6 sản phẩm nổi bật.'); }
}

export async function saveProduct(locale: ProductLocale, id: number | null, value: ProductInput, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    await validateRelations(sql, locale, id, value);
    const t = tables(locale);
    const before = id ? (await sql.unsafe(`SELECT id,name,alias,published,is_hot FROM ${t.p} WHERE id=$1 FOR UPDATE`, [id]))[0] : null;
    if (id && !before) throw new Error('Không tìm thấy sản phẩm.');
    const data = [value.name, value.alias, value.code, value.other_languages1, value.summary, cleanHtml(value.description), cleanHtml(value.feature_details), cleanHtml(value.video), value.tawk_to, value.image, value.icon, value.price, value.tags.join(','), value.is_hot, value.teamview, value.ordering, value.landing_page, value.seo_title, value.seo_keyword, value.seo_description, value.file_catalogue, value.file_price, value.link_catalogue, value.file_driver_name, value.file_driver, value.link_driver, value.published, value.manufactoryId ? String(value.manufactoryId) : null, value.typeId, ...Array.from({ length: 6 }, (_, index) => [value.downloads[index]?.name ?? '', value.downloads[index]?.file ?? '', value.downloads[index]?.link ?? '']).flat()];
    const columns = `name,alias,code,other_languages1,summary,description,feature_details,video,tawk_to,image,icon,price,tags,is_hot,teamview,ordering,landing_page,seo_title,seo_keyword,seo_description,file_catalogue,file_price,link_catalogue,file_driver_name,file_driver,link_driver,published,manufactory,types_id,${Array.from({ length: 6 }, (_, index) => `file_name${index + 1},file_download${index + 1},link_download${index + 1}`).join(',')}`;
    let row;
    if (id) [row] = await sql.unsafe(`UPDATE ${t.p} SET ${columns.split(',').map((column, index) => `${column}=$${index + 1}`).join(',')},edited_time=now() WHERE id=$${data.length + 1} RETURNING id,name`, [...data, id]);
    else [row] = await sql.unsafe(`INSERT INTO ${t.p}(${columns},hits,show_in_home,is_sell,rating_count,is_new,created_time,edited_time) VALUES(${data.map((_, index) => `$${index + 1}`).join(',')},0,false,false,0,false,now(),now()) RETURNING id,name`, data);
    for (const [table, column, ids] of [[t.cr, 'category_id', value.categoryIds], [t.ar, 'application_id', value.applicationIds], [t.rr, 'related_product_id', value.relatedProductIds]] as const) {
      await sql.unsafe(`DELETE FROM ${table} WHERE product_id=$1`, [row.id]);
      for (const [ordering, relationId] of ids.entries()) await sql.unsafe(`INSERT INTO ${table}(product_id,${column}${table === t.ar || table === t.rr ? ',ordering' : ''}) VALUES($1,$2${table === t.ar || table === t.rr ? ',$3' : ''})`, table === t.ar || table === t.rr ? [row.id, relationId, ordering] : [row.id, relationId]);
    }
    await writeAuditEvent(actor, { action: id ? AUDIT_ACTIONS.PRODUCT_UPDATED : AUDIT_ACTIONS.PRODUCT_CREATED, entityType: AUDIT_ENTITY_TYPES.PRODUCT, entityId: String(row.id), entityTitle: String(row.name), module: 'products', workspace: locale, result: 'success', before, after: value }, sql);
    return { id: String(row.id) };
  });
}

export async function setProductsPublished(locale: ProductLocale, ids: number[], published: boolean, actor: CmsPrincipal) { return withTransaction(async (sql) => { const rows = await sql.unsafe(`UPDATE ${tables(locale).p} SET published=$1,edited_time=now() WHERE id=ANY($2::int[]) RETURNING id,name`, [published, ids]); if (rows.length !== ids.length) throw new Error('Một hoặc nhiều sản phẩm không tồn tại.'); for (const row of rows) await writeAuditEvent(actor, { action: AUDIT_ACTIONS.PRODUCT_STATUS_CHANGED, entityType: AUDIT_ENTITY_TYPES.PRODUCT, entityId: String(row.id), entityTitle: String(row.name), module: 'products', workspace: locale, result: 'success', after: { published } }, sql); }); }
export async function setProductsFeatured(locale: ProductLocale, ids: number[], featured: boolean, actor: CmsPrincipal) { return withTransaction(async (sql) => { const table = tables(locale).p; if (featured) { const [count] = await sql.unsafe(`SELECT count(*)::int n FROM ${table} WHERE is_hot=true AND NOT(id=ANY($1::int[]))`, [ids]); if (Number(count.n) + ids.length > 6) throw new Error('Chỉ được chọn tối đa 6 sản phẩm nổi bật.'); } const rows = await sql.unsafe(`UPDATE ${table} SET is_hot=$1,edited_time=now() WHERE id=ANY($2::int[]) RETURNING id,name`, [featured, ids]); if (rows.length !== ids.length) throw new Error('Một hoặc nhiều sản phẩm không tồn tại.'); for (const row of rows) await writeAuditEvent(actor, { action: AUDIT_ACTIONS.PRODUCT_UPDATED, entityType: AUDIT_ENTITY_TYPES.PRODUCT, entityId: String(row.id), entityTitle: String(row.name), module: 'products', workspace: locale, result: 'success', after: { is_hot: featured } }, sql); }); }
export async function trashProduct(locale: ProductLocale, id: number, actor: CmsPrincipal) { return withTransaction(async (sql) => { const moved = await moveProductToTrash(sql, locale, id, actor.legacyUserId); await writeAuditEvent(actor, { action: AUDIT_ACTIONS.PRODUCT_TRASHED, entityType: AUDIT_ENTITY_TYPES.PRODUCT, entityId: String(id), entityTitle: moved.title, module: 'products', workspace: locale, result: 'success', after: { trashId: moved.trashId } }, sql); return moved; }); }
