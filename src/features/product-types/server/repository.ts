import 'server-only';

import type { Sql } from 'postgres';
import { moveProductTypeToTrash } from '@/features/trash/server/adapters/product-type';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type { CmsPrincipal } from '@/server/auth/guards';
import { withTransaction } from '@/server/db/postgres';
import type { ProductTypeInput } from '../schemas/productTypeInput';
import type { ProductTypeLocale } from '../types';

const table = (locale: ProductTypeLocale) => locale === 'en' ? 'cic_products_types_en' : 'cic_products_types';

async function assertUniqueAlias(sql: Sql, locale: ProductTypeLocale, alias: string, id: number | null) {
  const rows = await sql.unsafe(`SELECT 1 FROM ${table(locale)} WHERE lower(btrim(alias))=lower(btrim($1))
    AND ($2::int IS NULL OR id<>$2) LIMIT 1`, [alias, id]);
  if (rows.length) throw new Error('Tên hiệu đã được loại sản phẩm khác sử dụng.');
}

export async function saveProductType(locale: ProductTypeLocale, id: number | null, input: ProductTypeInput, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    await assertUniqueAlias(sql, locale, input.alias, id); const source = table(locale);
    const before = id ? (await sql.unsafe(`SELECT id,name,alias,ordering,published FROM ${source} WHERE id=$1 FOR UPDATE`, [id]))[0] : null;
    if (id && !before) throw new Error('Không tìm thấy loại sản phẩm.');
    const rows = id
      ? await sql.unsafe(`UPDATE ${source} SET name=$1,alias=$2,ordering=$3,published=$4,updated_time=now()
          WHERE id=$5 RETURNING id,name`, [input.name,input.alias,input.ordering,input.published,id])
      : await sql.unsafe(`INSERT INTO ${source}(name,alias,ordering,published,created_time,updated_time)
          VALUES($1,$2,$3,$4,now(),now()) RETURNING id,name`, [input.name,input.alias,input.ordering,input.published]);
    const row = rows[0];
    await writeAuditEvent(actor, { action: id ? AUDIT_ACTIONS.PRODUCT_TYPE_UPDATED : AUDIT_ACTIONS.PRODUCT_TYPE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.PRODUCT_TYPE, entityId: String(row.id), entityTitle: String(row.name),
      module: 'product_settings', workspace: locale, result: 'success', before, after: input }, sql);
    return { id: String(row.id) };
  });
}

export async function setProductTypesPublished(locale: ProductTypeLocale, ids: number[], published: boolean, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const rows = await sql.unsafe(`UPDATE ${table(locale)} SET published=$1,updated_time=now()
      WHERE id=ANY($2::int[]) RETURNING id,name`, [published, ids]);
    if (rows.length !== ids.length) throw new Error('Một hoặc nhiều loại sản phẩm không tồn tại.');
    for (const row of rows) await writeAuditEvent(actor, { action: AUDIT_ACTIONS.PRODUCT_TYPE_STATUS_CHANGED,
      entityType: AUDIT_ENTITY_TYPES.PRODUCT_TYPE, entityId: String(row.id), entityTitle: String(row.name),
      module: 'product_settings', workspace: locale, result: 'success', after: { published } }, sql);
  });
}

export async function trashProductType(locale: ProductTypeLocale, id: number, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const moved = await moveProductTypeToTrash(sql, locale, id, actor.legacyUserId);
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.PRODUCT_TYPE_TRASHED, entityType: AUDIT_ENTITY_TYPES.PRODUCT_TYPE,
      entityId: String(id), entityTitle: moved.title, module: 'product_settings', workspace: locale,
      result: 'success', after: { trashId: moved.trashId } }, sql);
    return moved;
  });
}
