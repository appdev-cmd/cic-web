import 'server-only';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { withTransaction } from '@/server/db/postgres';
import { moveEventToTrash } from '@/features/trash/server/adapters/event';
import type { EventInput } from '../schemas/eventInput';
import type { EventLocale } from '../types';

const tables = (locale: EventLocale) =>
  locale === 'en' ? 'cic_event_en' : 'cic_event';

const cleanHtml = (value: string) =>
  value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '');

async function validate(
  sql: Sql,
  locale: EventLocale,
  id: number | null,
  input: EventInput
) {
  const table = tables(locale);
  // Kiểm tra duplicate alias
  const dup = await sql.unsafe(
    `SELECT 1 FROM ${table} WHERE lower(btrim(alias)) = lower(btrim($1)) AND ($2::int IS NULL OR id <> $2)`,
    [input.alias, id]
  );
  if (dup.length > 0) {
    throw new Error('Alias đã được sự kiện khác sử dụng.');
  }

  // Ràng buộc thời gian kết thúc phải sau thời gian bắt đầu
  const start = new Date(input.timeEvent).getTime();
  const end = new Date(input.endTime).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu.');
  }
}

export async function saveEvent(
  locale: EventLocale,
  id: number | null,
  input: EventInput,
  actor: CmsPrincipal
) {
  return withTransaction(async (sql) => {
    await validate(sql, locale, id, input);
    const table = tables(locale);

    const before = id
      ? (
          await sql.unsafe(
            `SELECT id, title, alias, published, is_hot FROM ${table} WHERE id = $1 FOR UPDATE`,
            [id]
          )
        )[0]
      : null;

    if (id && !before) throw new Error('Không tìm thấy sự kiện.');

    // Nếu đặt sự kiện này là is_hot = true, tự động tắt is_hot của các sự kiện khác cùng locale (tối đa 1)
    if (input.isHot) {
      if (id) {
        await sql.unsafe(
          `UPDATE ${table} SET is_hot = false WHERE is_hot = true AND id <> $1`,
          [id]
        );
      } else {
        await sql.unsafe(
          `UPDATE ${table} SET is_hot = false WHERE is_hot = true`
        );
      }
    }

    const values = [
      input.title,
      input.alias,
      input.chuDe,
      input.place,
      new Date(input.timeEvent).toISOString(),
      new Date(input.endTime).toISOString(),
      input.specificTime,
      input.linkDangky,
      input.summary,
      cleanHtml(input.content),
      input.image,
      input.tags.join(', '),
      input.published,
      input.isHot,
      input.showInHomepage,
      input.ordering,
      input.seoTitle,
      input.seoKeyword,
      input.seoDescription,
      input.tawkTo,
      input.productsRelated.join(','),
      input.newsRelated.join(','),
      input.eventRelated.join(','),
    ];

    const columns = [
      'title',
      'alias',
      'chu_de',
      'place',
      'time_event',
      'end_time',
      'specific_time',
      'link_dangky',
      'summary',
      'content',
      'image',
      'tags',
      'published',
      'is_hot',
      'show_in_homepage',
      'ordering',
      'seo_title',
      'seo_keyword',
      'seo_description',
      'tawk_to',
      'products_related',
      'news_related',
      'event_related',
    ];

    const rows = id
      ? await sql.unsafe(
          `UPDATE ${table} 
           SET ${columns.map((c, i) => `${c} = $${i + 1}`).join(',')}, updated_time = now(), author_last_id = $${values.length + 1} 
           WHERE id = $${values.length + 2} 
           RETURNING id, title`,
          [...values, actor.legacyUserId, id]
        )
      : await sql.unsafe(
          `INSERT INTO ${table}(${columns.join(',')}, created_time, updated_time, author_id, author_last_id) 
           VALUES(${values.map((_, i) => `$${i + 1}`).join(',')}, now(), now(), $${values.length + 1}, $${values.length + 1}) 
           RETURNING id, title`,
          [...values, actor.legacyUserId]
        );

    const row = rows[0];

    await writeAuditEvent(
      actor,
      {
        action: id ? AUDIT_ACTIONS.EVENT_UPDATED : AUDIT_ACTIONS.EVENT_CREATED,
        entityType: AUDIT_ENTITY_TYPES.EVENT,
        entityId: String(row.id),
        entityTitle: String(row.title),
        module: 'events',
        workspace: locale,
        result: 'success',
        before,
        after: input,
      },
      sql
    );

    return { id: String(row.id) };
  });
}

export async function setEventsPublished(
  locale: EventLocale,
  ids: number[],
  published: boolean,
  actor: CmsPrincipal
) {
  return withTransaction(async (sql) => {
    const table = tables(locale);
    const rows = await sql.unsafe(
      `UPDATE ${table} 
       SET published = $1, updated_time = now(), author_last_id = $2 
       WHERE id = ANY($3::int[]) 
       RETURNING id, title`,
      [published, actor.legacyUserId, ids]
    );

    if (rows.length !== new Set(ids).size) {
      throw new Error('Một hoặc nhiều sự kiện không tồn tại.');
    }

    for (const row of rows) {
      await writeAuditEvent(
        actor,
        {
          action: AUDIT_ACTIONS.EVENT_STATUS_CHANGED,
          entityType: AUDIT_ENTITY_TYPES.EVENT,
          entityId: String(row.id),
          entityTitle: String(row.title),
          module: 'events',
          workspace: locale,
          result: 'success',
          after: { published },
        },
        sql
      );
    }
  });
}

export async function trashEvent(
  locale: EventLocale,
  id: number,
  actor: CmsPrincipal
) {
  return withTransaction(async (sql) => {
    const moved = await moveEventToTrash(sql, locale, id, actor.legacyUserId);
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.EVENT_TRASHED,
        entityType: AUDIT_ENTITY_TYPES.EVENT,
        entityId: String(id),
        entityTitle: moved.title,
        module: 'events',
        workspace: locale,
        result: 'success',
        after: { trashId: moved.trashId },
      },
      sql
    );
    return moved;
  });
}
