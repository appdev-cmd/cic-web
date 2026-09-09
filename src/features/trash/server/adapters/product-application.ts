import 'server-only';

import type { Sql } from 'postgres';
import { z } from 'zod';
import type { ProductApplicationLocale } from '@/features/product-applications/types';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const relationSchema = z.object({ product_id: z.number().int(), ordering: z.number().int() });
const snapshotSchema = z.object({
  version: z.literal(1), locale: z.enum(['vi', 'en']),
  record: z.record(z.string(), z.unknown()), relations: z.array(relationSchema),
});
const table = (locale: ProductApplicationLocale) => locale === 'en' ? 'cic_application_en' : 'cic_application';
const relationTable = (locale: ProductApplicationLocale) => locale === 'en' ? 'cic_products_applications_rel_en' : 'cic_products_applications_rel';
const columns = ['id','code','tablenames','published','ordering','created_time','image','first_toll','show_in_homepage','prefix_name','old_id','updated_time','color_code','is_retail','is_common','name','alias','description','seo_title','seo_keyword','seo_description','content'] as const;

export async function moveProductApplicationToTrash(sql: Sql, locale: ProductApplicationLocale, id: number, actorId: number) {
  const source = table(locale), relations = relationTable(locale);
  const [row] = await sql.unsafe(`SELECT ${columns.join(',')} FROM ${source} WHERE id=$1 FOR UPDATE`, [id]);
  if (!row || !String(row.alias ?? '').trim()) throw new Error('Không tìm thấy lĩnh vực ứng dụng có thể quản trị.');
  const relationRows = await sql.unsafe(`SELECT product_id,ordering FROM ${relations} WHERE application_id=$1 ORDER BY ordering,product_id`, [id]);
  if (relationRows.length > 0) throw new Error(`Lĩnh vực đang được ${relationRows.length} sản phẩm sử dụng; hãy đổi lĩnh vực trước khi xóa.`);
  const record = Object.fromEntries(columns.map((column) => [column, row[column] instanceof Date ? (row[column] as Date).toISOString() : row[column]]));
  const snapshot = snapshotSchema.parse({ version: 1, locale, record, relations: relationRows.map((relation) => ({ product_id: Number(relation.product_id), ordering: Number(relation.ordering) })) });
  const entityType = locale === 'en' ? 'product_application_en' : 'product_application';
  const title = String(row.name ?? row.alias ?? id);
  const [trash] = await sql`INSERT INTO cic_trash_items (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state) VALUES (${locale},${entityType},${String(id)},'product_settings',${title},${sql.json(snapshot as never)},'/products','trashed',${actorId},now()+interval '30 days','inactive') RETURNING id`;
  await sql.unsafe(`DELETE FROM ${source} WHERE id=$1`, [id]);
  return { trashId: String(trash.id), title };
}

async function inspect(sql: Sql, value: unknown): Promise<TrashInspection> {
  const snapshot = snapshotSchema.safeParse(value);
  if (!snapshot.success) return { status: 'schema_mismatch', details: 'Snapshot lĩnh vực không đúng phiên bản.', restoreModes: [] };
  const source = table(snapshot.data.locale), record = snapshot.data.record;
  const conflict = await sql.unsafe(`SELECT 1 FROM ${source} WHERE id=$1 OR (nullif(btrim($2),'') IS NOT NULL AND lower(btrim(alias))=lower(btrim($2))) LIMIT 1`, [Number(record.id), String(record.alias ?? '')]);
  if (conflict.length > 0) return { status: 'conflict', details: 'ID hoặc tên hiệu lĩnh vực đã được sử dụng.', restoreModes: [] };
  return { status: 'clear', details: 'Lĩnh vực sẵn sàng phục hồi ở trạng thái ngừng sử dụng.', restoreModes: ['as_draft'] };
}

async function restore(sql: Sql, value: unknown, mode: TrashRestoreMode) {
  const snapshot = snapshotSchema.parse(value), inspection = await inspect(sql, snapshot);
  if (!inspection.restoreModes.includes(mode)) throw new Error(inspection.details);
  const source = table(snapshot.locale), relations = relationTable(snapshot.locale);
  const restored: Record<string, unknown> = { ...snapshot.record, published: false, updated_time: new Date() };
  await sql.unsafe(`INSERT INTO ${source} (${columns.join(',')}) OVERRIDING SYSTEM VALUE VALUES (${columns.map((_, index) => `$${index + 1}`).join(',')})`, columns.map((column) => (restored[column] ?? null) as never));
  for (const relation of snapshot.relations) await sql.unsafe(`INSERT INTO ${relations}(product_id,application_id,ordering) VALUES($1,$2,$3)`, [relation.product_id, Number(restored.id), relation.ordering]);
  return { title: String(restored.name ?? restored.alias ?? restored.id), restoredEntityId: String(restored.id), restoredState: 'inactive' as const };
}

export const productApplicationTrashAdapter: TrashEntityAdapter = {
  entityType: 'product_application', module: 'product_settings', label: 'Lĩnh vực ứng dụng', itemType: 'Lĩnh vực ứng dụng', workspace: 'vi', restoreState: 'inactive', supportsPurge: true,
  getRevalidationTargets: () => [{ path: '/cms/product-settings/applications' },{ path: '/products' },{ path: '/products/[slug]', type: 'page' }],
  parseSnapshot: (value) => snapshotSchema.parse(value), inspect, restore, purge: async () => undefined,
  presentSnapshot: (value) => { const snapshot = snapshotSchema.parse(value); return { version: snapshot.version, locale: snapshot.locale, name: snapshot.record.name, alias: snapshot.record.alias }; },
};
export const productApplicationEnTrashAdapter: TrashEntityAdapter = { ...productApplicationTrashAdapter, entityType: 'product_application_en', workspace: 'en' };
