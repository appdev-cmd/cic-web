import 'server-only';
import type { Sql } from 'postgres';
import { withTransaction } from '@/server/db/postgres';
import type { RoleInput } from '../schemas/roleInput';

const slug = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 90) || 'role';

async function syncPermissions(sql: Sql, roleId: number, input: RoleInput, actorId: number) {
  const requested = new Map<string, Set<string>>();
  for (const item of input.permissions) {
    const moduleCode = item.module.trim().toLowerCase();
    const actions = requested.get(moduleCode) ?? new Set<string>(); actions.add(item.action); requested.set(moduleCode, actions);
  }
  const modules = [...requested.keys()];
  const tasks = modules.length ? await sql`SELECT id,module FROM cic_permission_tasks WHERE published = true AND lower(module) IN ${sql(modules)}` : [];
  const foundModules = new Set(tasks.map((task) => String(task.module).toLowerCase()));
  if (modules.some((moduleCode) => !foundModules.has(moduleCode))) throw new Error('Có phân hệ quyền không tồn tại hoặc đã ngừng hoạt động.');
  await sql`DELETE FROM cic_role_permissions WHERE role_id = ${roleId}`;
  for (const task of tasks) for (const action of requested.get(String(task.module).toLowerCase()) ?? []) {
    await sql`INSERT INTO cic_role_permissions (role_id,permission_task_id,action,allowed,updated_by) VALUES (${roleId},${task.id},${action},true,${actorId})`;
  }
}

export async function createRoleRecord(input: RoleInput, actorId: number) {
  return withTransaction(async (sql) => {
    const base = slug(input.name); let code = base;
    for (let suffix = 2; (await sql`SELECT 1 FROM cic_roles WHERE lower(code)=lower(${code}) LIMIT 1`).length; suffix += 1) code = `${base.slice(0, 84)}_${suffix}`;
    const [role] = await sql`INSERT INTO cic_roles (code,name,description,status,is_protected,created_by,updated_by) VALUES (${code},${input.name},${input.description},${input.status},false,${actorId},${actorId}) RETURNING id`;
    const id = Number(role.id); await syncPermissions(sql, id, input, actorId); return id;
  });
}

export async function updateRoleRecord(id: number, input: RoleInput, actorId: number) {
  return withTransaction(async (sql) => {
    const [role] = await sql`SELECT id,is_protected FROM cic_roles WHERE id=${id} FOR UPDATE`;
    if (!role) throw new Error('Không tìm thấy vai trò.');
    await sql`UPDATE cic_roles SET name=${input.name},description=${input.description},status=${input.status},updated_at=now(),updated_by=${actorId} WHERE id=${id}`;
    await syncPermissions(sql, id, input, actorId);
  });
}

export async function setRoleStatus(id: number, status: RoleInput['status'], actorId: number) {
  return withTransaction(async (sql) => {
    const [role] = await sql`SELECT id,is_protected FROM cic_roles WHERE id=${id} FOR UPDATE`;
    if (!role) throw new Error('Không tìm thấy vai trò.');
    if (role.is_protected && status === 'inactive') throw new Error('Vai trò hệ thống được bảo vệ không thể tắt.');
    await sql`UPDATE cic_roles SET status=${status},updated_at=now(),updated_by=${actorId} WHERE id=${id}`;
  });
}

export async function assignRoleRecord(userId: number, roleId: number, actorId: number) {
  return withTransaction(async (sql) => {
    const [user] = await sql`SELECT id FROM cic_users WHERE id=${userId}`; const [role] = await sql`SELECT id FROM cic_roles WHERE id=${roleId} AND status='active'`;
    if (!user || !role) throw new Error('Người dùng hoặc vai trò không tồn tại/không hoạt động.');
    const [existing] = await sql`SELECT id FROM cic_user_roles WHERE user_id=${userId} AND role_id=${roleId} ORDER BY id DESC LIMIT 1 FOR UPDATE`;
    if (existing) { await sql`UPDATE cic_user_roles SET status='active',assigned_at=now(),assigned_by=${actorId} WHERE id=${existing.id}`; return Number(existing.id); }
    const [created] = await sql`INSERT INTO cic_user_roles (user_id,role_id,assigned_by,status) VALUES (${userId},${roleId},${actorId},'active') RETURNING id`;
    return Number(created.id);
  });
}

export async function revokeRoleAssignment(id: number, actorId: number) {
  return withTransaction(async (sql) => {
    const [assignment] = await sql`SELECT id,user_id,role_id FROM cic_user_roles WHERE id=${id} AND status='active' FOR UPDATE`;
    if (!assignment) throw new Error('Không tìm thấy lượt phân công đang hoạt động.');
    const [{ count }] = await sql`SELECT count(*)::int AS count FROM cic_user_roles ur JOIN cic_roles r ON r.id=ur.role_id WHERE ur.user_id=${assignment.user_id} AND ur.status='active' AND r.status='active'`;
    if (Number(count) <= 1) throw new Error('Không thể thu hồi vai trò hoạt động cuối cùng của tài khoản.');
    await sql`UPDATE cic_user_roles SET status='inactive',assigned_by=${actorId} WHERE id=${id}`;
  });
}
