import 'server-only';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { getPostgresClient, withTransaction } from '@/server/db/postgres';
import type { TrashRestoreMode } from '../types';
import { getTrashEntityAdapter } from './registry';

type TrashRow = {
  id: string;
  workspace: 'global' | 'vi' | 'en';
  entity_type: string;
  entity_id: string;
  module: string;
  title_snapshot: string;
  payload_snapshot: unknown;
  status: string;
  is_legal_hold: boolean;
};

async function lockedTrashItem(id: string, sql: Parameters<Parameters<typeof withTransaction>[0]>[0]): Promise<TrashRow> {
  const [row] = await sql`
    SELECT id,workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,status,is_legal_hold
    FROM cic_trash_items WHERE id=${id} FOR UPDATE
  `;
  if (!row) throw new Error('Không tìm thấy mục trong Thùng rác.');
  if (row.status !== 'trashed') throw new Error('Mục này không còn ở trạng thái có thể xử lý.');
  return row as unknown as TrashRow;
}

async function writeFailureAudit(actor: CmsPrincipal, action: typeof AUDIT_ACTIONS.TRASH_RESTORED | typeof AUDIT_ACTIONS.TRASH_PURGED, id: string, message: string) {
  try {
    const sql = getPostgresClient();
    const [row] = await sql`SELECT title_snapshot,module,workspace FROM cic_trash_items WHERE id=${id}`;
    await writeAuditEvent(actor, {
      action, entityType: AUDIT_ENTITY_TYPES.TRASH_ITEM, entityId: id,
      entityTitle: String(row?.title_snapshot ?? `Trash ${id}`), module: String(row?.module ?? 'trash'),
      workspace: row?.workspace === 'vi' || row?.workspace === 'en' ? row.workspace : 'global',
      result: 'failed', resultMessage: message,
    });
  } catch {
    // Preserve the business error if failure-audit persistence is unavailable.
  }
}

export async function restoreTrashRecord(id: string, mode: TrashRestoreMode, actor: CmsPrincipal) {
  try {
    return await withTransaction(async (sql) => {
      const row = await lockedTrashItem(id, sql);
      const adapter = getTrashEntityAdapter(row.entity_type);
      if (adapter.module !== row.module || adapter.workspace !== row.workspace) throw new Error('Trash adapter không khớp source contract.');
      const snapshot = adapter.parseSnapshot(row.payload_snapshot);
      const result = await adapter.restore(sql, snapshot, mode);
      await sql`
        UPDATE cic_trash_items
        SET status='restored',restore_state=${result.restoredState},restored_by=${actor.legacyUserId},restored_at=now()
        WHERE id=${id}
      `;
      await writeAuditEvent(actor, {
        action: AUDIT_ACTIONS.TRASH_RESTORED, entityType: AUDIT_ENTITY_TYPES.TRASH_ITEM,
        entityId: id, entityTitle: result.title, module: row.module, workspace: row.workspace,
        result: 'success', before: { status: 'trashed', entityId: row.entity_id },
        after: { status: 'restored', restoredEntityId: result.restoredEntityId, restoredState: result.restoredState, restoredAlias: result.restoredAlias },
      }, sql);
      return { ...result, revalidationTargets: adapter.getRevalidationTargets('restore') };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể phục hồi mục đã chọn.';
    await writeFailureAudit(actor, AUDIT_ACTIONS.TRASH_RESTORED, id, message);
    throw error;
  }
}

export async function purgeTrashRecord(id: string, reason: string, actor: CmsPrincipal) {
  try {
    return await withTransaction(async (sql) => {
      const row = await lockedTrashItem(id, sql);
      if (row.is_legal_hold) throw new Error('Mục này đang bị giữ pháp lý và không thể xóa vĩnh viễn.');
      const adapter = getTrashEntityAdapter(row.entity_type);
      if (adapter.module !== row.module || adapter.workspace !== row.workspace) throw new Error('Trash adapter không khớp source contract.');
      if (!adapter.supportsPurge) throw new Error(adapter.purgeBlockedReason ?? 'Loại dữ liệu này chưa hỗ trợ xóa vĩnh viễn an toàn.');
      const snapshot = adapter.parseSnapshot(row.payload_snapshot);
      await adapter.purge(sql, snapshot);
      await sql`
        UPDATE cic_trash_items
        SET status='purged',payload_snapshot='{}'::jsonb,purged_by=${actor.legacyUserId},purged_at=now(),purge_reason=${reason}
        WHERE id=${id}
      `;
      await writeAuditEvent(actor, {
        action: AUDIT_ACTIONS.TRASH_PURGED, entityType: AUDIT_ENTITY_TYPES.TRASH_ITEM,
        entityId: id, entityTitle: row.title_snapshot, module: row.module, workspace: row.workspace,
        result: 'success', before: { status: 'trashed', entityId: row.entity_id },
        after: { status: 'purged', reason, snapshotRemoved: true },
      }, sql);
      return { title: row.title_snapshot, revalidationTargets: adapter.getRevalidationTargets('purge') };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn mục đã chọn.';
    await writeFailureAudit(actor, AUDIT_ACTIONS.TRASH_PURGED, id, message);
    throw error;
  }
}
