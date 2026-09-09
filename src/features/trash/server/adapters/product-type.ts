import 'server-only';

import type { Sql } from 'postgres';
import { z } from 'zod';
import type { ProductTypeLocale } from '@/features/product-types/types';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const snapshotSchema = z.object({ version: z.literal(1), locale: z.enum(['vi','en']), record: z.record(z.string(), z.unknown()) });
const table = (locale: ProductTypeLocale) => locale === 'en' ? 'cic_products_types_en' : 'cic_products_types';
const productsTable = (locale: ProductTypeLocale) => locale === 'en' ? 'cic_products_en' : 'cic_products';
const columns = ['id','image','published','ordering','created_time','tablenames','name','alias','description','updated_time'] as const;

export async function moveProductTypeToTrash(sql: Sql, locale: ProductTypeLocale, id: number, actorId: number) {
  const source = table(locale); const products = productsTable(locale);
  const [row] = await sql.unsafe(`SELECT ${columns.join(',')} FROM ${source} WHERE id=$1 FOR UPDATE`, [id]);
  if (!row) throw new Error('Không tìm thấy loại sản phẩm.');
  const [{ count }] = await sql.unsafe(`SELECT count(*)::int count FROM ${products} WHERE types_id=$1`, [id]);
  if (Number(count) > 0) throw new Error(`Loại sản phẩm đang được ${count} sản phẩm sử dụng; hãy đổi loại trước khi xóa.`);
  const record = Object.fromEntries(columns.map((column) => [column, row[column] instanceof Date ? (row[column] as Date).toISOString() : row[column]]));
  const snapshot = snapshotSchema.parse({ version: 1, locale, record });
  const entityType = locale === 'en' ? 'product_type_en' : 'product_type'; const title = String(row.name ?? row.alias ?? id);
  const [trash] = await sql`INSERT INTO cic_trash_items (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state)
    VALUES (${locale},${entityType},${String(id)},'product_settings',${title},${sql.json(snapshot as never)},'/products','trashed',${actorId},now()+interval '30 days','inactive') RETURNING id`;
  await sql.unsafe(`DELETE FROM ${source} WHERE id=$1`, [id]);
  return { trashId: String(trash.id), title };
}

async function inspect(sql: Sql, value: unknown): Promise<TrashInspection> {
  const snapshot = snapshotSchema.safeParse(value);
  if (!snapshot.success) return { status: 'schema_mismatch', details: 'Snapshot loại sản phẩm không đúng phiên bản.', restoreModes: [] };
  const record = snapshot.data.record;
  const conflict = await sql.unsafe(`SELECT 1 FROM ${table(snapshot.data.locale)} WHERE id=$1 OR lower(btrim(alias))=lower(btrim($2)) LIMIT 1`, [Number(record.id), String(record.alias ?? '')]);
  return conflict.length ? { status: 'conflict', details: 'ID hoặc tên hiệu loại sản phẩm đã được sử dụng.', restoreModes: [] }
    : { status: 'clear', details: 'Loại sản phẩm sẵn sàng phục hồi ở trạng thái ngừng sử dụng.', restoreModes: ['as_draft'] };
}

async function restore(sql: Sql, value: unknown, mode: TrashRestoreMode) {
  const snapshot = snapshotSchema.parse(value); const inspection = await inspect(sql, snapshot);
  if (!inspection.restoreModes.includes(mode)) throw new Error(inspection.details);
  const restored: Record<string, unknown> = { ...snapshot.record, published: false, updated_time: new Date() };
  await sql.unsafe(`INSERT INTO ${table(snapshot.locale)} (${columns.join(',')}) OVERRIDING SYSTEM VALUE VALUES (${columns.map((_,i)=>`$${i+1}`).join(',')})`, columns.map((column)=>(restored[column] ?? null) as never));
  return { title: String(restored.name ?? restored.alias ?? restored.id), restoredEntityId: String(restored.id), restoredState: 'inactive' as const };
}

export const productTypeTrashAdapter: TrashEntityAdapter = {
  entityType: 'product_type', module: 'product_settings', label: 'Loại sản phẩm', itemType: 'Loại sản phẩm', workspace: 'vi', restoreState: 'inactive', supportsPurge: true,
  getRevalidationTargets: () => [{ path: '/cms/product-settings/product-types' },{ path: '/products' },{ path: '/products/[slug]', type: 'page' }],
  parseSnapshot: (value) => snapshotSchema.parse(value), inspect, restore, purge: async () => undefined,
  presentSnapshot: (value) => { const snapshot=snapshotSchema.parse(value); return { version:snapshot.version,locale:snapshot.locale,name:snapshot.record.name,alias:snapshot.record.alias,image:snapshot.record.image }; },
};
export const productTypeEnTrashAdapter: TrashEntityAdapter = { ...productTypeTrashAdapter, entityType: 'product_type_en', workspace: 'en' };
