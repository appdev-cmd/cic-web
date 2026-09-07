import 'server-only';

import type { Sql } from 'postgres';

import { moveProductBrandToTrash } from '@/features/trash/server/adapters/product-brand';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type { CmsPrincipal } from '@/server/auth/guards';
import { withTransaction } from '@/server/db/postgres';
import type { ProductBrandInput } from '../schemas/brandInput';
import type { ProductBrandLocale } from '../types';

const table = (locale: ProductBrandLocale) =>
  locale === 'en' ? 'cic_manufactories_en' : 'cic_manufactories';

async function assertUniqueAlias(
  sql: Sql,
  locale: ProductBrandLocale,
  alias: string,
  id: number | null,
) {
  const source = table(locale);
  const rows = await sql.unsafe(
    `SELECT 1 FROM ${source}
     WHERE lower(btrim(alias))=lower(btrim($1))
       AND ($2::int IS NULL OR id<>$2)
     LIMIT 1`,
    [alias, id],
  );
  if (rows.length > 0) throw new Error('Tên hiệu đã được hãng khác sử dụng.');
}

export async function saveProductBrand(
  locale: ProductBrandLocale,
  id: number | null,
  input: ProductBrandInput,
  actor: CmsPrincipal,
) {
  return withTransaction(async (sql) => {
    await assertUniqueAlias(sql, locale, input.alias, id);
    const source = table(locale);
    const before = id
      ? (
          await sql.unsafe(
            `SELECT id,name,alias,ordering,published FROM ${source} WHERE id=$1 FOR UPDATE`,
            [id],
          )
        )[0]
      : null;
    if (id && !before) throw new Error('Không tìm thấy hãng sản xuất.');

    const values = [input.name, input.alias, input.ordering, input.published, id];
    const rows = id
      ? await sql.unsafe(
          `UPDATE ${source}
           SET name=$1,alias=$2,ordering=$3,published=$4,updated_time=now()
           WHERE id=$5
           RETURNING id,name`,
          values,
        )
      : await sql.unsafe(
          `INSERT INTO ${source}(name,alias,ordering,published,created_time,updated_time)
           VALUES($1,$2,$3,$4,now(),now())
           RETURNING id,name`,
          values.slice(0, 4),
        );
    const row = rows[0];

    await writeAuditEvent(
      actor,
      {
        action: id ? AUDIT_ACTIONS.PRODUCT_BRAND_UPDATED : AUDIT_ACTIONS.PRODUCT_BRAND_CREATED,
        entityType: AUDIT_ENTITY_TYPES.PRODUCT_BRAND,
        entityId: String(row.id),
        entityTitle: String(row.name),
        module: 'product_settings',
        workspace: locale,
        result: 'success',
        before,
        after: input,
      },
      sql,
    );
    return { id: String(row.id) };
  });
}

export async function setProductBrandsPublished(
  locale: ProductBrandLocale,
  ids: number[],
  published: boolean,
  actor: CmsPrincipal,
) {
  return withTransaction(async (sql) => {
    const source = table(locale);
    const rows = await sql.unsafe(
      `UPDATE ${source}
       SET published=$1,updated_time=now()
       WHERE id=ANY($2::int[])
       RETURNING id,name`,
      [published, ids],
    );
    if (rows.length !== ids.length) throw new Error('Một hoặc nhiều hãng không tồn tại.');

    for (const row of rows) {
      await writeAuditEvent(
        actor,
        {
          action: AUDIT_ACTIONS.PRODUCT_BRAND_STATUS_CHANGED,
          entityType: AUDIT_ENTITY_TYPES.PRODUCT_BRAND,
          entityId: String(row.id),
          entityTitle: String(row.name),
          module: 'product_settings',
          workspace: locale,
          result: 'success',
          after: { published },
        },
        sql,
      );
    }
  });
}

export async function trashProductBrand(
  locale: ProductBrandLocale,
  id: number,
  actor: CmsPrincipal,
) {
  return withTransaction(async (sql) => {
    const moved = await moveProductBrandToTrash(sql, locale, id, actor.legacyUserId);
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.PRODUCT_BRAND_TRASHED,
        entityType: AUDIT_ENTITY_TYPES.PRODUCT_BRAND,
        entityId: String(id),
        entityTitle: moved.title,
        module: 'product_settings',
        workspace: locale,
        result: 'success',
        after: { trashId: moved.trashId },
      },
      sql,
    );
    return moved;
  });
}
