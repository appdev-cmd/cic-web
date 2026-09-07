import 'server-only';

import type { Sql } from 'postgres';
import { z } from 'zod';

import type { ProductBrandLocale } from '@/features/product-brands/types';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const snapshotSchema = z.object({
  version: z.literal(1),
  locale: z.enum(['vi', 'en']),
  record: z.record(z.string(), z.unknown()),
});

const table = (locale: ProductBrandLocale) =>
  locale === 'en' ? 'cic_manufactories_en' : 'cic_manufactories';

const productsTable = (locale: ProductBrandLocale) =>
  locale === 'en' ? 'cic_products_en' : 'cic_products';

const columns = [
  'id',
  'code',
  'tablenames',
  'published',
  'ordering',
  'created_time',
  'image',
  'first_toll',
  'show_in_homepage',
  'prefix_name',
  'old_id',
  'updated_time',
  'color_code',
  'is_retail',
  'is_common',
  'name',
  'alias',
  'description',
  'seo_title',
  'seo_keyword',
  'seo_description',
  'content',
] as const;

export async function moveProductBrandToTrash(
  sql: Sql,
  locale: ProductBrandLocale,
  id: number,
  actorId: number,
) {
  const source = table(locale);
  const productSource = productsTable(locale);
  const [row] = await sql.unsafe(
    `SELECT ${columns.join(',')} FROM ${source} WHERE id=$1 FOR UPDATE`,
    [id],
  );

  if (!row) throw new Error('Không tìm thấy hãng sản xuất.');

  const [{ count }] = await sql.unsafe(
    `SELECT count(*)::int count FROM ${productSource}
     WHERE CASE WHEN manufactory ~ '^[0-9]+$' THEN manufactory::int END=$1`,
    [id],
  );
  if (Number(count) > 0) {
    throw new Error(`Hãng đang được ${count} sản phẩm sử dụng; hãy đổi hãng trước khi xóa.`);
  }

  const record = Object.fromEntries(
    columns.map((column) => [
      column,
      row[column] instanceof Date ? (row[column] as Date).toISOString() : row[column],
    ]),
  );
  const snapshot = snapshotSchema.parse({ version: 1, locale, record });
  const entityType = locale === 'en' ? 'product_brand_en' : 'product_brand';
  const title = String(row.name ?? row.alias ?? id);
  const [trash] = await sql`
    INSERT INTO cic_trash_items (
      workspace, entity_type, entity_id, module, title_snapshot,
      payload_snapshot, original_url, status, deleted_by, purge_after, restore_state
    ) VALUES (
      ${locale}, ${entityType}, ${String(id)}, 'product_settings', ${title},
      ${sql.json(snapshot as never)}, '/products', 'trashed', ${actorId},
      now() + interval '30 days', 'inactive'
    )
    RETURNING id
  `;

  await sql.unsafe(`DELETE FROM ${source} WHERE id=$1`, [id]);
  return { trashId: String(trash.id), title };
}

async function inspect(sql: Sql, value: unknown): Promise<TrashInspection> {
  const snapshot = snapshotSchema.safeParse(value);
  if (!snapshot.success) {
    return {
      status: 'schema_mismatch',
      details: 'Snapshot hãng không đúng phiên bản.',
      restoreModes: [],
    };
  }

  const source = table(snapshot.data.locale);
  const record = snapshot.data.record;
  const conflict = await sql.unsafe(
    `SELECT 1 FROM ${source}
     WHERE id=$1 OR lower(btrim(alias))=lower(btrim($2))
     LIMIT 1`,
    [Number(record.id), String(record.alias ?? '')],
  );
  if (conflict.length > 0) {
    return {
      status: 'conflict',
      details: 'ID hoặc tên hiệu hãng đã được sử dụng.',
      restoreModes: [],
    };
  }

  return {
    status: 'clear',
    details: 'Hãng sẵn sàng phục hồi ở trạng thái ngừng sử dụng.',
    restoreModes: ['as_draft'],
  };
}

async function restore(sql: Sql, value: unknown, mode: TrashRestoreMode) {
  const snapshot = snapshotSchema.parse(value);
  const inspection = await inspect(sql, snapshot);
  if (!inspection.restoreModes.includes(mode)) throw new Error(inspection.details);

  const source = table(snapshot.locale);
  const restored: Record<string, unknown> = {
    ...snapshot.record,
    published: false,
    updated_time: new Date(),
  };
  const values = columns.map((column) => (restored[column] ?? null) as never);
  await sql.unsafe(
    `INSERT INTO ${source} (${columns.join(',')}) OVERRIDING SYSTEM VALUE
     VALUES (${columns.map((_, index) => `$${index + 1}`).join(',')})`,
    values,
  );

  return {
    title: String(restored.name ?? restored.alias ?? restored.id),
    restoredEntityId: String(restored.id),
    restoredState: 'inactive' as const,
  };
}

export const productBrandTrashAdapter: TrashEntityAdapter = {
  entityType: 'product_brand',
  module: 'product_settings',
  label: 'Hãng sản xuất',
  itemType: 'Hãng sản xuất',
  workspace: 'vi',
  restoreState: 'inactive',
  supportsPurge: true,
  getRevalidationTargets: () => [
    { path: '/cms/manufacturers' },
    { path: '/products' },
    { path: '/products/[slug]', type: 'page' },
  ],
  parseSnapshot: (value) => snapshotSchema.parse(value),
  inspect,
  restore,
  purge: async () => undefined,
  presentSnapshot: (value) => {
    const snapshot = snapshotSchema.parse(value);
    return {
      version: snapshot.version,
      locale: snapshot.locale,
      name: snapshot.record.name,
      alias: snapshot.record.alias,
    };
  },
};

export const productBrandEnTrashAdapter: TrashEntityAdapter = {
  ...productBrandTrashAdapter,
  entityType: 'product_brand_en',
  workspace: 'en',
};
