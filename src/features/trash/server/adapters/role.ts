import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const nullableNumber = z.number().int().nullable();
const roleTrashSnapshotSchema = z.object({
  version: z.literal(1),
  record: z.object({
    id: z.number().int().positive(), code: z.string().min(1).max(100), name: z.string().min(1).max(255),
    description: z.string().nullable(), status: z.enum(['active', 'inactive']), createdAt: z.string().datetime(),
    createdBy: nullableNumber, updatedAt: z.string().datetime(), updatedBy: nullableNumber,
  }),
  permissions: z.array(z.object({ taskId: z.number().int().positive(), action: z.string().min(1).max(24), allowed: z.boolean() })),
  assignments: z.array(z.object({ userId: z.number().int().positive(), assignedAt: z.string().datetime(), assignedBy: nullableNumber, status: z.string().max(16) })),
});

export type RoleTrashSnapshot = z.infer<typeof roleTrashSnapshotSchema>;
const iso = (value: unknown) => new Date(String(value)).toISOString();
const nullableInt = (value: unknown) => value == null ? null : Number(value);

export async function moveRoleToTrash(sql: Sql, roleId: number, actorId: number) {
  const [row] = await sql`SELECT id,code,name,description,status,is_protected,created_at,created_by,updated_at,updated_by FROM cic_roles WHERE id=${roleId} FOR UPDATE`;
  if (!row) throw new Error('Không tìm thấy vai trò.');
  if (row.is_protected || ['admin', 'superadmin'].includes(String(row.code).toLowerCase())) throw new Error('Vai trò hệ thống được bảo vệ không thể xóa.');
  const [permissionRows, assignmentRows] = await Promise.all([
    sql`SELECT permission_task_id,action,allowed FROM cic_role_permissions WHERE role_id=${roleId} ORDER BY permission_task_id,action`,
    sql`SELECT user_id,assigned_at,assigned_by,status FROM cic_user_roles WHERE role_id=${roleId} ORDER BY id`,
  ]);
  const snapshot = roleTrashSnapshotSchema.parse({
    version: 1,
    record: { id: Number(row.id), code: String(row.code), name: String(row.name), description: row.description == null ? null : String(row.description), status: row.status, createdAt: iso(row.created_at), createdBy: nullableInt(row.created_by), updatedAt: iso(row.updated_at), updatedBy: nullableInt(row.updated_by) },
    permissions: permissionRows.map((item) => ({ taskId: Number(item.permission_task_id), action: String(item.action), allowed: Boolean(item.allowed) })),
    assignments: assignmentRows.map((item) => ({ userId: Number(item.user_id), assignedAt: iso(item.assigned_at), assignedBy: nullableInt(item.assigned_by), status: String(item.status) })),
  });
  const [trash] = await sql`
    INSERT INTO cic_trash_items
      (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state)
    VALUES
      ('global','role',${String(roleId)},'roles',${snapshot.record.name},${sql.json(snapshot as never)},'/cms/permissions','trashed',${actorId},now()+interval '30 days','inactive')
    RETURNING id
  `;
  await sql`DELETE FROM cic_user_roles WHERE role_id=${roleId}`;
  await sql`DELETE FROM cic_roles WHERE id=${roleId}`;
  return { trashId: String(trash.id), title: snapshot.record.name };
}

async function inspectRole(sql: Sql, rawSnapshot: unknown): Promise<TrashInspection> {
  const parsed = roleTrashSnapshotSchema.safeParse(rawSnapshot);
  if (!parsed.success) return { status: 'schema_mismatch', details: 'Snapshot vai trò không đúng phiên bản được hỗ trợ.', restoreModes: [] };
  const snapshot = parsed.data;
  if ((await sql`SELECT 1 FROM cic_roles WHERE id=${snapshot.record.id} LIMIT 1`).length) return { status: 'conflict', details: 'ID vai trò gốc đã được sử dụng.', restoreModes: [] };
  const [codeConflict] = await sql`SELECT 1 FROM cic_roles WHERE lower(code)=lower(${snapshot.record.code}) LIMIT 1`;
  const taskIds = [...new Set(snapshot.permissions.map((item) => item.taskId))];
  const userIds = [...new Set(snapshot.assignments.map((item) => item.userId))];
  const [tasks, users] = await Promise.all([
    taskIds.length ? sql`SELECT id FROM cic_permission_tasks WHERE id IN ${sql(taskIds)}` : Promise.resolve([]),
    userIds.length ? sql`SELECT id FROM cic_users WHERE id IN ${sql(userIds)}` : Promise.resolve([]),
  ]);
  if (tasks.length !== taskIds.length || users.length !== userIds.length) return { status: 'conflict', details: 'Task quyền hoặc người dùng từng được gán không còn tồn tại.', restoreModes: [] };
  if (codeConflict) return { status: 'conflict', details: `Mã vai trò “${snapshot.record.code}” đang được sử dụng.`, restoreModes: ['auto_rename'] };
  return { status: 'clear', details: 'Vai trò, quyền và quan hệ gán sẵn sàng phục hồi về trạng thái không hoạt động.', restoreModes: ['as_draft'] };
}

async function uniqueCode(sql: Sql, original: string) {
  const base = `${original.replace(/_restored(?:_\d+)?$/, '')}_restored`.slice(0, 90);
  let candidate = base;
  for (let suffix = 2; (await sql`SELECT 1 FROM cic_roles WHERE lower(code)=lower(${candidate}) LIMIT 1`).length; suffix += 1) candidate = `${base.slice(0, 96 - String(suffix).length)}_${suffix}`;
  return candidate;
}

export const roleTrashAdapter: TrashEntityAdapter = {
  entityType: 'role', module: 'roles', label: 'Vai trò & Quyền', itemType: 'Vai trò CMS', workspace: 'global',
  restoreState: 'inactive', supportsPurge: true,
  getRevalidationTargets: () => [{ path: '/cms/permissions' }, { path: '/cms/users' }],
  parseSnapshot: (value) => roleTrashSnapshotSchema.parse(value),
  inspect: inspectRole,
  restore: async (sql, value, mode) => {
    const snapshot = roleTrashSnapshotSchema.parse(value);
    const inspection = await inspectRole(sql, snapshot);
    if (!inspection.restoreModes.includes(mode)) throw new Error(inspection.details);
    const code = mode === 'auto_rename' ? await uniqueCode(sql, snapshot.record.code) : snapshot.record.code;
    await sql`INSERT INTO cic_roles (id,code,name,description,status,is_protected,created_at,created_by,updated_at,updated_by) OVERRIDING SYSTEM VALUE VALUES (${snapshot.record.id},${code},${snapshot.record.name},${snapshot.record.description},'inactive',false,${snapshot.record.createdAt},${snapshot.record.createdBy},now(),${snapshot.record.updatedBy})`;
    for (const permission of snapshot.permissions) await sql`INSERT INTO cic_role_permissions (role_id,permission_task_id,action,allowed,updated_by) VALUES (${snapshot.record.id},${permission.taskId},${permission.action},${permission.allowed},${snapshot.record.updatedBy})`;
    for (const assignment of snapshot.assignments) await sql`INSERT INTO cic_user_roles (user_id,role_id,assigned_at,assigned_by,status) VALUES (${assignment.userId},${snapshot.record.id},${assignment.assignedAt},${assignment.assignedBy},'inactive')`;
    return { title: snapshot.record.name, restoredEntityId: String(snapshot.record.id), restoredState: 'inactive', originalAlias: snapshot.record.code, restoredAlias: code };
  },
  purge: async () => undefined,
  presentSnapshot: (value) => {
    const snapshot = roleTrashSnapshotSchema.parse(value);
    return { version: snapshot.version, code: snapshot.record.code, name: snapshot.record.name, previousStatus: snapshot.record.status, permissions: snapshot.permissions.length, assignments: snapshot.assignments.length };
  },
};
