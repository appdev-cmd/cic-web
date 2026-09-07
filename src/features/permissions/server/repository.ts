import 'server-only';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { withTransaction } from '@/server/db/postgres';
import type { RoleInput } from '../schemas/roleInput';
import { moveRoleToTrash } from '@/features/trash/server/adapters/role';

const slug = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 90) || 'role';

async function syncPermissions(sql: Sql, roleId: number, input: RoleInput, actorId: number) {
  const taskIds = [...new Set(input.permissions.map((permission) => permission.taskId))];
  const tasks = taskIds.length ? await sql`SELECT id FROM cic_permission_tasks WHERE published=true AND id IN ${sql(taskIds)}` : [];
  const available = new Set(tasks.map((task) => Number(task.id)));
  if (taskIds.some((taskId) => !available.has(taskId))) throw new Error('Có tác vụ quyền không tồn tại hoặc đã ngừng hoạt động.');
  await sql`DELETE FROM cic_role_permissions WHERE role_id=${roleId}`;
  for (const permission of input.permissions) {
    await sql`INSERT INTO cic_role_permissions (role_id,permission_task_id,action,allowed,updated_by) VALUES (${roleId},${permission.taskId},${permission.action},true,${actorId})`;
  }
}

export async function createRoleRecord(input: RoleInput, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const base = slug(input.name); let code = base;
    for (let suffix = 2; (await sql`SELECT 1 FROM cic_roles WHERE lower(code)=lower(${code}) LIMIT 1`).length; suffix += 1) code = `${base.slice(0, 84)}_${suffix}`;
    const [role] = await sql`INSERT INTO cic_roles (code,name,description,status,is_protected,created_by,updated_by) VALUES (${code},${input.name},${input.description},${input.status},false,${actor.legacyUserId},${actor.legacyUserId}) RETURNING id,code`;
    const id = Number(role.id);
    await syncPermissions(sql, id, input, actor.legacyUserId);
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.ROLE_CREATED, entityType: AUDIT_ENTITY_TYPES.ROLE, entityId: String(id), entityTitle: input.name, module: 'roles', workspace: 'global', result: 'success', after: { code: role.code, name: input.name, description: input.description, status: input.status, permissions: input.permissions } }, sql);
    return id;
  });
}

export async function updateRoleRecord(id: number, input: RoleInput, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const [before] = await sql`SELECT id,name,description,status,is_protected FROM cic_roles WHERE id=${id} FOR UPDATE`;
    if (!before) throw new Error('Không tìm thấy vai trò.');
    if (before.is_protected && input.status === 'inactive') throw new Error('Vai trò hệ thống được bảo vệ không thể tắt.');
    const previousPermissions = await sql`SELECT permission_task_id AS "taskId",action FROM cic_role_permissions WHERE role_id=${id} AND allowed=true ORDER BY permission_task_id,action`;
    await sql`UPDATE cic_roles SET name=${input.name},description=${input.description},status=${input.status},updated_at=now(),updated_by=${actor.legacyUserId} WHERE id=${id}`;
    await syncPermissions(sql, id, input, actor.legacyUserId);
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.ROLE_UPDATED, entityType: AUDIT_ENTITY_TYPES.ROLE, entityId: String(id), entityTitle: input.name, module: 'roles', workspace: 'global', result: 'success', before: { name: before.name, description: before.description, status: before.status, permissions: previousPermissions }, after: { name: input.name, description: input.description, status: input.status, permissions: input.permissions } }, sql);
  });
}

export async function setRoleStatus(id: number, status: RoleInput['status'], actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const [role] = await sql`SELECT id,name,status,is_protected FROM cic_roles WHERE id=${id} FOR UPDATE`;
    if (!role) throw new Error('Không tìm thấy vai trò.');
    if (role.is_protected && status === 'inactive') throw new Error('Vai trò hệ thống được bảo vệ không thể tắt.');
    await sql`UPDATE cic_roles SET status=${status},updated_at=now(),updated_by=${actor.legacyUserId} WHERE id=${id}`;
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.ROLE_STATUS_CHANGED, entityType: AUDIT_ENTITY_TYPES.ROLE, entityId: String(id), entityTitle: String(role.name), module: 'roles', workspace: 'global', result: 'success', before: { status: role.status }, after: { status } }, sql);
  });
}

export async function assignRoleRecord(userId: number, roleId: number, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const [user] = await sql`SELECT id,username,full_name FROM cic_users WHERE id=${userId} AND account_status='active' AND published IS DISTINCT FROM false`;
    const [role] = await sql`SELECT id,name FROM cic_roles WHERE id=${roleId} AND status='active'`;
    if (!user || !role) throw new Error('Người dùng hoặc vai trò không tồn tại/không hoạt động.');
    const [existing] = await sql`SELECT id,status FROM cic_user_roles WHERE user_id=${userId} AND role_id=${roleId} ORDER BY id DESC LIMIT 1 FOR UPDATE`;
    let assignmentId: number;
    if (existing) {
      assignmentId = Number(existing.id);
      if (existing.status === 'active') throw new Error('Nhân sự đã được gán vai trò này.');
      await sql`UPDATE cic_user_roles SET status='active',assigned_at=now(),assigned_by=${actor.legacyUserId} WHERE id=${assignmentId}`;
    } else {
      const [created] = await sql`INSERT INTO cic_user_roles (user_id,role_id,assigned_by,status) VALUES (${userId},${roleId},${actor.legacyUserId},'active') RETURNING id`;
      assignmentId = Number(created.id);
    }
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.ROLE_ASSIGNED, entityType: AUDIT_ENTITY_TYPES.ROLE_ASSIGNMENT, entityId: String(assignmentId), entityTitle: `${user.full_name || user.username} → ${role.name}`, module: 'roles', workspace: 'global', result: 'success', after: { userId, roleId } }, sql);
    return assignmentId;
  });
}

export async function revokeRoleAssignment(id: number, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const [assignment] = await sql`SELECT id,user_id,role_id FROM cic_user_roles WHERE id=${id} AND status='active' FOR UPDATE`;
    if (!assignment) throw new Error('Không tìm thấy lượt gán đang hoạt động.');
    const [{ count }] = await sql`SELECT count(*)::int AS count FROM cic_user_roles ur JOIN cic_roles r ON r.id=ur.role_id WHERE ur.user_id=${assignment.user_id} AND ur.status='active' AND r.status='active'`;
    if (Number(count) <= 1) throw new Error('Không thể thu hồi vai trò hoạt động cuối cùng của tài khoản.');
    await sql`UPDATE cic_user_roles SET status='inactive',assigned_by=${actor.legacyUserId} WHERE id=${id}`;
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.ROLE_REVOKED, entityType: AUDIT_ENTITY_TYPES.ROLE_ASSIGNMENT, entityId: String(id), entityTitle: `Thu hồi lượt gán ${id}`, module: 'roles', workspace: 'global', result: 'success', before: { userId: assignment.user_id, roleId: assignment.role_id, status: 'active' }, after: { status: 'inactive' } }, sql);
  });
}

export async function trashRoleRecord(id: number, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    const [role] = await sql`SELECT id,code,name,status,is_protected FROM cic_roles WHERE id=${id} FOR UPDATE`;
    if (!role) throw new Error('Không tìm thấy vai trò.');
    const trashed = await moveRoleToTrash(sql, id, actor.legacyUserId);
    await writeAuditEvent(actor, {
      action: AUDIT_ACTIONS.ROLE_TRASHED, entityType: AUDIT_ENTITY_TYPES.ROLE,
      entityId: String(id), entityTitle: String(role.name), module: 'roles', workspace: 'global', result: 'success',
      before: { code: role.code, status: role.status }, after: { status: 'trashed', trashId: trashed.trashId },
    }, sql);
    return trashed;
  });
}
