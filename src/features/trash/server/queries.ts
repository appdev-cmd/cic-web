import 'server-only';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import type { TrashItemViewModel, TrashListPage, TrashListQuery, TrashWorkspace } from '../types';
import { getTrashEntityAdapter, getTrashModuleMetadata, listTrashModuleOptions } from './registry';

export const trashListQuerySchema = z.object({
  page: z.number().int().min(1).max(100000).default(1),
  pageSize: z.number().int().min(10).max(100).default(10),
  search: z.string().trim().max(200).default(''),
  module: z.string().trim().max(100).default('all'),
  category: z.enum(['all', 'expiring_soon']).default('all'),
});

export const initialTrashQuery: TrashListQuery = { page: 1, pageSize: 10, search: '', module: 'all', category: 'all' };
const text = (value: unknown) => value == null ? '' : String(value);
const dateLabel = (value: unknown) => value == null ? 'Không tự động' : new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short',
}).format(new Date(String(value)));
const daysUntil = (value: unknown) => value == null ? 9999 : Math.max(0, Math.ceil((new Date(String(value)).getTime() - Date.now()) / 86_400_000));

function mapListRow(row: Record<string, unknown>): TrashItemViewModel {
  const metadata = getTrashModuleMetadata(text(row.entity_type));
  const workspace = (row.workspace === 'vi' || row.workspace === 'en' ? row.workspace : 'global') as TrashWorkspace;
  const dependencyStatus = row.dependency_status === 'conflict' ? 'conflict' : row.dependency_status === 'schema_mismatch' ? 'schema_mismatch' : 'clear';
  return {
    id: text(row.id), title: text(row.title_snapshot), entityType: text(row.entity_type), entityId: text(row.entity_id),
    itemType: metadata?.itemType ?? text(row.entity_type), moduleKey: text(row.module), moduleName: metadata?.moduleName ?? text(row.module),
    scope: { siteId: workspace, siteName: workspace === 'vi' ? 'Website Tiếng Việt' : workspace === 'en' ? 'English Website' : 'Toàn hệ thống' },
    deletedBy: { id: text(row.deleted_by), name: text(row.deleted_by_name) || 'Hệ thống', role: '' },
    deletedAt: dateLabel(row.deleted_at), expiresAt: dateLabel(row.purge_after), daysRemaining: daysUntil(row.purge_after),
    isLegalHold: Boolean(row.is_legal_hold), legalHoldReason: text(row.legal_hold_reason) || undefined,
    dependencyStatus, dependencyDetails: text(row.dependency_details) || undefined, snapshotData: {},
    originalUrl: text(row.original_url) || undefined, targetRestoreState: metadata?.restoreState ?? 'inactive',
    supportsPurge: metadata?.supportsPurge ?? false, purgeBlockedReason: metadata?.purgeBlockedReason,
    restoreModes: dependencyStatus === 'clear' ? ['as_draft'] : dependencyStatus === 'conflict' ? ['auto_rename'] : [],
  };
}

async function queryTrashPage(input: TrashListQuery): Promise<TrashListPage> {
  const sql = getPostgresClient();
  const pattern = `%${input.search}%`;
  const offset = (input.page - 1) * input.pageSize;
  const supportedEntities = listTrashModuleOptions().map((option) => option.value);
  const filters = sql`
    ti.status='trashed'
    AND (${input.search}='' OR ti.title_snapshot ILIKE ${pattern} OR ti.entity_id ILIKE ${pattern} OR ti.module ILIKE ${pattern} OR coalesce(u.full_name,u.username,u.email,'') ILIKE ${pattern})
    AND (${input.module}='all' OR ti.module=${input.module})
    AND (${input.category}='all' OR (ti.purge_after IS NOT NULL AND ti.purge_after <= now()+interval '7 days'))
    AND ti.module IN ${sql(supportedEntities)}
  `;
  const dependencyColumns = sql`
    CASE
      WHEN ti.entity_type='project' AND jsonb_typeof(ti.payload_snapshot) IS DISTINCT FROM 'object' THEN 'schema_mismatch'
      WHEN ti.entity_type='project' AND EXISTS (SELECT 1 FROM cic_projects p WHERE lower(p.alias)=lower(ti.payload_snapshot->'record'->>'alias')) THEN 'conflict'
      ELSE 'clear'
    END AS dependency_status,
    CASE
      WHEN ti.entity_type='project' AND jsonb_typeof(ti.payload_snapshot) IS DISTINCT FROM 'object' THEN 'Snapshot không đúng định dạng.'
      WHEN ti.entity_type='project' AND EXISTS (SELECT 1 FROM cic_projects p WHERE lower(p.alias)=lower(ti.payload_snapshot->'record'->>'alias')) THEN 'Slug dự án đang được sử dụng.'
      ELSE 'Snapshot và liên kết sẵn sàng phục hồi.'
    END AS dependency_details
  `;
  const [rows, countRows, expiringRows] = await Promise.all([
    sql`SELECT ti.id,ti.workspace,ti.entity_type,ti.entity_id,ti.module,ti.title_snapshot,ti.original_url,ti.deleted_by,ti.deleted_at,ti.purge_after,ti.restore_state,ti.is_legal_hold,ti.legal_hold_reason,coalesce(u.full_name,u.username,u.email) AS deleted_by_name,${dependencyColumns} FROM cic_trash_items ti LEFT JOIN cic_users u ON u.id=ti.deleted_by WHERE ${filters} ORDER BY ti.deleted_at DESC LIMIT ${input.pageSize} OFFSET ${offset}`,
    sql`SELECT count(*)::int AS total FROM cic_trash_items ti LEFT JOIN cic_users u ON u.id=ti.deleted_by WHERE ${filters}`,
    sql`SELECT count(*)::int AS total FROM cic_trash_items WHERE status='trashed' AND purge_after IS NOT NULL AND purge_after<=now()+interval '7 days' AND module IN ${sql(supportedEntities)}`,
  ]);
  return { items: rows.map((row) => mapListRow(row as Record<string, unknown>)), total: Number(countRows[0]?.total ?? 0), expiringSoonTotal: Number(expiringRows[0]?.total ?? 0), moduleOptions: listTrashModuleOptions(), query: input };
}

export async function getCmsTrashPage(raw: unknown = initialTrashQuery) {
  await requirePermission('trash', 'view');
  return queryTrashPage(trashListQuerySchema.parse(raw));
}

export async function getCmsTrashDetail(rawId: unknown) {
  await requirePermission('trash', 'view');
  const id = z.string().uuid().parse(rawId); const sql = getPostgresClient();
  const [row] = await sql`SELECT ti.id,ti.workspace,ti.entity_type,ti.entity_id,ti.module,ti.title_snapshot,ti.payload_snapshot,ti.original_url,ti.deleted_by,ti.deleted_at,ti.purge_after,ti.restore_state,ti.is_legal_hold,ti.legal_hold_reason,coalesce(u.full_name,u.username,u.email) AS deleted_by_name FROM cic_trash_items ti LEFT JOIN cic_users u ON u.id=ti.deleted_by WHERE ti.id=${id} AND ti.status='trashed'`;
  if (!row) throw new Error('Không tìm thấy mục trong Thùng rác.');
  const adapter = getTrashEntityAdapter(text(row.entity_type));
  const snapshot = adapter.parseSnapshot(row.payload_snapshot);
  const inspection = await adapter.inspect(sql, snapshot);
  return { ...mapListRow({ ...(row as Record<string, unknown>), dependency_status: inspection.status, dependency_details: inspection.details }), snapshotData: adapter.presentSnapshot(snapshot), restoreModes: inspection.restoreModes };
}
