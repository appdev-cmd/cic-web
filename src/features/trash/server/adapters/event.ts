import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { EventLocale } from '@/features/events/types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';
import type { TrashRestoreMode } from '../../types';

const snapshotSchema = z.object({
  version: z.literal(1),
  locale: z.enum(['vi', 'en']),
  record: z.record(z.string(), z.unknown()),
});

const tables = (locale: EventLocale) =>
  locale === 'en' ? 'cic_event_en' : 'cic_event';

export async function moveEventToTrash(
  sql: Sql,
  locale: EventLocale,
  id: number,
  actorId: number
) {
  const table = tables(locale);
  const [row] = await sql.unsafe(
    `SELECT to_jsonb(e) as record FROM ${table} e WHERE id = $1 FOR UPDATE`,
    [id]
  );
  if (!row) throw new Error('Không tìm thấy sự kiện.');

  const snapshot = snapshotSchema.parse({
    version: 1,
    locale,
    record: row.record,
  });

  const title = String(snapshot.record.title ?? id);
  const alias = String(snapshot.record.alias ?? id);

  const [trash] = await sql`
    INSERT INTO cic_trash_items(
      workspace, entity_type, entity_id, module,
      title_snapshot, payload_snapshot, original_url,
      status, deleted_by, purge_after, restore_state
    ) VALUES (
      ${locale},
      ${locale === 'en' ? 'event_en' : 'event'},
      ${String(id)},
      'events',
      ${title},
      ${sql.json(snapshot as never)},
      ${`/events/${alias}`},
      'trashed',
      ${actorId},
      now() + interval '30 days',
      'draft'
    ) RETURNING id
  `;

  await sql.unsafe(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return { trashId: String(trash.id), title };
}

async function inspect(sql: Sql, raw: unknown): Promise<TrashInspection> {
  const parsed = snapshotSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'schema_mismatch',
      details: 'Snapshot Sự kiện không hợp lệ.',
      restoreModes: [],
    };
  }

  const table = tables(parsed.data.locale);
  const id = Number(parsed.data.record.id);
  const alias = String(parsed.data.record.alias ?? '');

  if ((await sql.unsafe(`SELECT 1 FROM ${table} WHERE id = $1`, [id])).length) {
    return {
      status: 'conflict',
      details: 'ID Sự kiện đã được sử dụng.',
      restoreModes: [],
    };
  }

  if (
    (
      await sql.unsafe(
        `SELECT 1 FROM ${table} WHERE lower(btrim(alias)) = lower(btrim($1))`,
        [alias]
      )
    ).length
  ) {
    return {
      status: 'conflict',
      details: 'Alias Sự kiện đã được sử dụng bởi sự kiện khác.',
      restoreModes: [],
    };
  }

  return {
    status: 'clear',
    details: 'Sẵn sàng phục hồi về bản nháp.',
    restoreModes: ['as_draft'],
  };
}

async function restore(sql: Sql, raw: unknown, mode: TrashRestoreMode) {
  const snapshot = snapshotSchema.parse(raw);
  const check = await inspect(sql, snapshot);
  if (!check.restoreModes.includes(mode)) throw new Error(check.details);

  const table = tables(snapshot.locale);
  const record: Record<string, unknown> = {
    ...snapshot.record,
    published: false,
    updated_time: new Date().toISOString(),
  };

  const columns = Object.keys(record);
  if (columns.some((col) => !/^[_a-z][_a-z0-9]*$/i.test(col))) {
    throw new Error('Snapshot Sự kiện chứa tên cột không hợp lệ.');
  }

  await sql.unsafe(
    `INSERT INTO ${table} (${columns.map((c) => `"${c}"`).join(',')})
     OVERRIDING SYSTEM VALUE
     VALUES (${columns.map((_, i) => `$${i + 1}`).join(',')})`,
    columns.map((c) => (record[c] ?? null) as never)
  );

  return {
    title: String(record.title ?? record.id),
    restoredEntityId: String(record.id),
    restoredState: 'draft' as const,
  };
}

const adapter = (locale: EventLocale): TrashEntityAdapter => ({
  entityType: locale === 'en' ? 'event_en' : 'event',
  module: 'events',
  label: 'Sự kiện',
  itemType: 'Sự kiện',
  workspace: locale,
  restoreState: 'draft',
  supportsPurge: true,
  getRevalidationTargets: () => [
    { path: '/cms/events' },
    { path: '/events' },
    { path: '/events/[slug]', type: 'page' },
  ],
  parseSnapshot: (value) => snapshotSchema.parse(value),
  inspect,
  restore,
  purge: async () => undefined,
  presentSnapshot: (value) => {
    const s = snapshotSchema.parse(value);
    return {
      version: s.version,
      title: s.record.title,
      slug: s.record.alias,
      timeEvent: s.record.time_event,
    };
  },
});

export const eventTrashAdapter = adapter('vi');
export const eventEnTrashAdapter = adapter('en');
