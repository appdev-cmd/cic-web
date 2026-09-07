import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const userTrashSnapshotSchema = z.object({
  version: z.literal(1),
  record: z.object({
    id: z.number().int().positive(),
    username: z.string().min(1).max(50),
    accountStatus: z.enum(['active', 'suspended', 'deactivated', 'pending_invite']),
    published: z.boolean().nullable(),
    statusOnline: z.boolean().nullable(),
  }),
});

export type UserTrashSnapshot = z.infer<typeof userTrashSnapshotSchema>;

export async function moveUserToTrash(sql: Sql, userId: number, actorId: number) {
  const [row] = await sql`SELECT id,username,account_status,published,status_online FROM cic_users WHERE id=${userId} FOR UPDATE`;
  if (!row) throw new Error('Không tìm thấy tài khoản.');
  const [existing] = await sql`SELECT 1 FROM cic_trash_items WHERE entity_type='user' AND entity_id=${String(userId)} AND status='trashed' LIMIT 1`;
  if (existing) throw new Error('Tài khoản đã nằm trong Thùng rác.');
  const snapshot = userTrashSnapshotSchema.parse({
    version: 1,
    record: {
      id: Number(row.id), username: String(row.username), accountStatus: row.account_status,
      published: row.published == null ? null : Boolean(row.published),
      statusOnline: row.status_online == null ? null : Boolean(row.status_online),
    },
  });
  const [trash] = await sql`
    INSERT INTO cic_trash_items
      (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state)
    VALUES
      ('global','user',${String(userId)},'users',${snapshot.record.username},${sql.json(snapshot as never)},'/cms/users','trashed',${actorId},NULL,'inactive')
    RETURNING id
  `;
  await sql`UPDATE cic_users SET account_status='deactivated',published=false,status_online=false,updated_time=now() WHERE id=${userId}`;
  if (snapshot.record.accountStatus !== 'deactivated') await sql`INSERT INTO cic_user_status_history (user_id,previous_status,new_status,reason,changed_by) VALUES (${userId},${snapshot.record.accountStatus},'deactivated','Chuyển tài khoản vào Thùng rác',${actorId})`;
  return { trashId: String(trash.id), title: snapshot.record.username };
}

async function inspectUser(sql: Sql, rawSnapshot: unknown): Promise<TrashInspection> {
  const parsed = userTrashSnapshotSchema.safeParse(rawSnapshot);
  if (!parsed.success) return { status: 'schema_mismatch', details: 'Snapshot tài khoản không đúng phiên bản được hỗ trợ.', restoreModes: [] };
  const [row] = await sql`SELECT account_status,published FROM cic_users WHERE id=${parsed.data.record.id}`;
  if (!row) return { status: 'conflict', details: 'Identity tombstone của tài khoản không còn tồn tại; không thể phục hồi an toàn.', restoreModes: [] };
  if (row.account_status !== 'deactivated' || row.published !== false) return { status: 'conflict', details: 'Tài khoản nguồn đã thay đổi sau khi đưa vào Thùng rác.', restoreModes: [] };
  return { status: 'clear', details: 'Tài khoản có thể phục hồi về trạng thái ngừng hoạt động.', restoreModes: ['as_draft'] };
}

export const userTrashAdapter: TrashEntityAdapter = {
  entityType: 'user', module: 'users', label: 'Người dùng', itemType: 'Tài khoản CMS', workspace: 'global',
  restoreState: 'inactive', supportsPurge: false,
  getRevalidationTargets: (operation) => operation === 'restore' ? [{ path: '/cms/users' }] : [],
  purgeBlockedReason: 'Tài khoản đang được giữ làm identity tombstone cho Audit và dữ liệu tác giả; cần identity-cleanup outbox trước khi có thể purge an toàn.',
  parseSnapshot: (value) => userTrashSnapshotSchema.parse(value),
  inspect: inspectUser,
  restore: async (sql, value, mode) => {
    const snapshot = userTrashSnapshotSchema.parse(value);
    const inspection = await inspectUser(sql, snapshot);
    if (mode !== 'as_draft' || !inspection.restoreModes.includes(mode)) throw new Error(inspection.details);
    await sql`UPDATE cic_users SET account_status='deactivated',published=false,status_online=false,updated_time=now() WHERE id=${snapshot.record.id}`;
    return { title: snapshot.record.username, restoredEntityId: String(snapshot.record.id), restoredState: 'inactive' };
  },
  purge: async () => { throw new Error('Không hỗ trợ purge tài khoản khi chưa có identity-cleanup outbox.'); },
  presentSnapshot: (value) => {
    const snapshot = userTrashSnapshotSchema.parse(value);
    return { version: snapshot.version, username: snapshot.record.username, previousStatus: snapshot.record.accountStatus, restoreState: 'deactivated' };
  },
};
