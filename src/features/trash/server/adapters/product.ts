import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { ProductLocale } from '@/features/products/types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';
import type { TrashRestoreMode } from '../../types';

const schema = z.object({ version: z.literal(1), locale: z.enum(['vi', 'en']), record: z.record(z.string(), z.unknown()), categories: z.array(z.number().int()), applications: z.array(z.object({ id: z.number().int(), ordering: z.number().int() })), related: z.array(z.object({ id: z.number().int(), ordering: z.number().int() })), images: z.array(z.record(z.string(), z.unknown())) });
const tables = (locale: ProductLocale) => locale === 'en' ? { p: 'cic_products_en', cr: 'cic_products_categories_rel_en', ar: 'cic_products_applications_rel_en', rr: 'cic_products_related_rel_en', im: 'cic_products_images_en' } : { p: 'cic_products', cr: 'cic_products_categories_rel', ar: 'cic_products_applications_rel', rr: 'cic_products_related_rel', im: 'cic_products_images' };

export async function moveProductToTrash(sql: Sql, locale: ProductLocale, id: number, actorId: number) {
  const t = tables(locale);
  const [record] = await sql.unsafe(`SELECT to_jsonb(p) record FROM ${t.p} p WHERE id=$1 FOR UPDATE`, [id]);
  if (!record) throw new Error('Không tìm thấy sản phẩm.');
  const dependencies = locale === 'en'
    ? [['cic_products_related_rel_en', 'related_product_id'], ['cic_projects_products_rel_en', 'product_id'], ['cic_services_products_rel_en', 'product_id']]
    : [['cic_products_related_rel', 'related_product_id'], ['cic_projects_products_rel', 'product_id'], ['cic_services_products_rel', 'product_id'], ['cic_order_items', 'product_id'], ['cic_products_incentives', 'product_id'], ['cic_products_price', 'record_id']];
  for (const [table, column] of dependencies) if ((await sql.unsafe(`SELECT 1 FROM ${table} WHERE ${column}=$1 LIMIT 1`, [id])).length) throw new Error(`Không thể đưa sản phẩm vào Thùng rác vì còn dữ liệu liên quan trong ${table}.`);
  const [categories, applications, related, images] = await Promise.all([
    sql.unsafe(`SELECT category_id FROM ${t.cr} WHERE product_id=$1 ORDER BY category_id`, [id]),
    sql.unsafe(`SELECT application_id,ordering FROM ${t.ar} WHERE product_id=$1 ORDER BY ordering`, [id]),
    sql.unsafe(`SELECT related_product_id,ordering FROM ${t.rr} WHERE product_id=$1 ORDER BY ordering`, [id]),
    sql.unsafe(`SELECT to_jsonb(i) record FROM ${t.im} i WHERE record_id=$1 ORDER BY ordering,id`, [id]),
  ]);
  const snapshot = schema.parse({ version: 1, locale, record: record.record, categories: categories.map((value) => Number(value.category_id)), applications: applications.map((value) => ({ id: Number(value.application_id), ordering: Number(value.ordering ?? 0) })), related: related.map((value) => ({ id: Number(value.related_product_id), ordering: Number(value.ordering ?? 0) })), images: images.map((value) => value.record) });
  const [trash] = await sql`INSERT INTO cic_trash_items(workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state) VALUES(${locale},${locale === 'en' ? 'product_en' : 'product'},${String(id)},'products',${String(snapshot.record.name ?? id)},${sql.json(snapshot as never)},${`/products/${snapshot.record.alias ?? id}`},'trashed',${actorId},now()+interval '30 days','draft') RETURNING id`;
  if (locale === 'vi') {
    await sql.unsafe(`UPDATE cic_product_contact SET products_id=NULL WHERE products_id=$1`, [id]);
  }
  await sql.unsafe(`DELETE FROM ${t.im} WHERE record_id=$1`, [id]);
  await sql.unsafe(`DELETE FROM ${t.p} WHERE id=$1`, [id]);
  return { trashId: String(trash.id), title: String(snapshot.record.name ?? id) };
}

async function inspect(sql: Sql, raw: unknown): Promise<TrashInspection> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { status: 'schema_mismatch', details: 'Snapshot Sản phẩm không hợp lệ.', restoreModes: [] };
  const t = tables(parsed.data.locale); const id = Number(parsed.data.record.id);
  if ((await sql.unsafe(`SELECT 1 FROM ${t.p} WHERE id=$1`, [id])).length) return { status: 'conflict', details: 'ID Sản phẩm đã được sử dụng.', restoreModes: [] };
  const alias = String(parsed.data.record.alias ?? '');
  if (alias && (await sql.unsafe(`SELECT 1 FROM ${t.p} WHERE lower(alias)=lower($1)`, [alias])).length) return { status: 'conflict', details: 'Alias Sản phẩm đã được sử dụng.', restoreModes: [] };
  return { status: 'clear', details: 'Sẵn sàng phục hồi về bản nháp.', restoreModes: ['as_draft'] };
}

async function restore(sql: Sql, raw: unknown, mode: TrashRestoreMode) {
  const snapshot = schema.parse(raw); const check = await inspect(sql, snapshot); if (!check.restoreModes.includes(mode)) throw new Error(check.details);
  const t = tables(snapshot.locale); const record: Record<string, unknown> = { ...snapshot.record, published: false, is_hot: false, edited_time: new Date().toISOString() }; const productId = Number(record.id);
  await sql.unsafe(`INSERT INTO ${t.p} SELECT (jsonb_populate_record(NULL::${t.p},$1::jsonb)).*`, [JSON.stringify(record)]);
  for (const id of snapshot.categories) await sql.unsafe(`INSERT INTO ${t.cr}(product_id,category_id) VALUES($1,$2)`, [productId, id]);
  for (const value of snapshot.applications) await sql.unsafe(`INSERT INTO ${t.ar}(product_id,application_id,ordering) VALUES($1,$2,$3)`, [productId, value.id, value.ordering]);
  for (const value of snapshot.related) await sql.unsafe(`INSERT INTO ${t.rr}(product_id,related_product_id,ordering) VALUES($1,$2,$3)`, [productId, value.id, value.ordering]);
  for (const image of snapshot.images) await sql.unsafe(`INSERT INTO ${t.im} SELECT (jsonb_populate_record(NULL::${t.im},$1::jsonb)).*`, [JSON.stringify(image)]);
  return { title: String(record.name ?? productId), restoredEntityId: String(productId), restoredState: 'draft' as const };
}

const adapter = (locale: ProductLocale): TrashEntityAdapter => ({ entityType: locale === 'en' ? 'product_en' : 'product', module: 'products', label: 'Sản phẩm', itemType: 'Sản phẩm', workspace: locale, restoreState: 'draft', supportsPurge: true, getRevalidationTargets: () => [{ path: '/cms/products' }, { path: '/products' }, { path: '/products/[slug]', type: 'page' }], parseSnapshot: (value) => schema.parse(value), inspect, restore, purge: async () => undefined, presentSnapshot: (value) => { const snapshot = schema.parse(value); return { version: snapshot.version, title: snapshot.record.name, slug: snapshot.record.alias, categories: snapshot.categories.length, applications: snapshot.applications.length, related: snapshot.related.length, images: snapshot.images.length }; } });
export const productTrashAdapter = adapter('vi');
export const productEnTrashAdapter = adapter('en');
