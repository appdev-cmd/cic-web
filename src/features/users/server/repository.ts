import 'server-only';
import type { Sql } from 'postgres';
import { withTransaction } from '@/server/db/postgres';
import type { UserInput } from '../schemas/userInput';

const csv = (values: string[]) => [...new Set(values)].join(',');
async function validateRelations(sql: Sql, input: UserInput) {
  const [role] = await sql`SELECT id FROM cic_roles WHERE id = ${input.roleId} AND status = 'active'`;
  if (!role) throw new Error('Vai trò không tồn tại hoặc đã ngừng hoạt động.');
  const validateIds = async (table: 'cic_branches' | 'cic_products_categories' | 'cic_news_categories', values: string[]) => {
    if (!values.length) return;
    const ids = [...new Set(values)].map(Number);
    if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw new Error('Phạm vi người dùng không hợp lệ.');
    const rows = await sql`SELECT id FROM ${sql(table)} WHERE id IN ${sql(ids)}`;
    if (rows.length !== ids.length) throw new Error('Một hoặc nhiều phạm vi người dùng không còn tồn tại.');
  };
  await validateIds('cic_branches', input.agencies);
  await validateIds('cic_products_categories', input.productCategories);
  await validateIds('cic_news_categories', input.newsCategories);
}
function userRow(input: UserInput) {
  const now = new Date();
  const row = { username: input.username, email: input.email, fname: input.fname, lname: input.lname, full_name: `${input.lname} ${input.fname}`.trim() || input.username, phone: input.phone, country: input.country, address: input.address, summary: input.summary, image: input.avatar, account_status: input.status, published: input.status === 'active', ordering: input.ordering, agencies: csv(input.agencies), products_categories: csv(input.productCategories), news_categories: csv(input.newsCategories), two_factor_enabled: input.twoFactorEnabled, updated_time: now };
  return input.password ? { ...row, password_changed_at: now } : row;
}
async function writeStatusHistory(sql: Sql, userId: number, previousStatus: string | null, input: UserInput, actorId: number) {
  if (previousStatus === input.status) return;
  await sql`INSERT INTO cic_user_status_history (user_id, previous_status, new_status, reason, changed_by) VALUES (${userId}, ${previousStatus}, ${input.status}, ${input.statusReason || `Chuyển trạng thái sang ${input.status}`}, ${actorId})`;
}
async function syncRole(sql: Sql, userId: number, roleId: number, actorId: number) {
  await sql`UPDATE cic_user_roles SET status = 'inactive' WHERE user_id = ${userId} AND status = 'active' AND role_id <> ${roleId}`;
  const existing = await sql`SELECT id FROM cic_user_roles WHERE user_id = ${userId} AND role_id = ${roleId} LIMIT 1`;
  if (existing.length) await sql`UPDATE cic_user_roles SET status = 'active', assigned_at = now(), assigned_by = ${actorId} WHERE id = ${existing[0].id}`;
  else await sql`INSERT INTO cic_user_roles (user_id, role_id, assigned_by, status) VALUES (${userId}, ${roleId}, ${actorId}, 'active')`;
}
export async function createUserRecord(input: UserInput, actorId: number) {
  return withTransaction(async (sql) => {
    await validateRelations(sql, input);
    const duplicate = await sql`SELECT id FROM cic_users WHERE lower(username) = lower(${input.username}) OR lower(email) = lower(${input.email}) LIMIT 1`;
    if (duplicate.length) throw new Error('Tên đăng nhập hoặc email đã tồn tại.');
    const [created] = await sql`INSERT INTO cic_users ${sql({ ...userRow(input), created_time: new Date() })} RETURNING id`;
    const id = Number(created.id);
    await syncRole(sql, id, input.roleId, actorId);
    await writeStatusHistory(sql, id, null, input, actorId);
    return id;
  });
}
export async function updateUserRecord(id: number, input: UserInput, actorId: number) {
  return withTransaction(async (sql) => {
    await validateRelations(sql, input);
    const [current] = await sql`SELECT id,email,account_status FROM cic_users WHERE id = ${id} FOR UPDATE`;
    if (!current) throw new Error('Không tìm thấy tài khoản.');
    const duplicate = await sql`SELECT id FROM cic_users WHERE id <> ${id} AND (lower(username) = lower(${input.username}) OR lower(email) = lower(${input.email})) LIMIT 1`;
    if (duplicate.length) throw new Error('Tên đăng nhập hoặc email đã tồn tại.');
    await sql`UPDATE cic_users SET ${sql(userRow(input))} WHERE id = ${id}`;
    await syncRole(sql, id, input.roleId, actorId);
    await writeStatusHistory(sql, id, String(current.account_status ?? ''), input, actorId);
    return { previousEmail: String(current.email ?? '') };
  });
}
export async function updateUserStatuses(ids: number[], status: UserInput['status'], reason: string, actorId: number) {
  return withTransaction(async (sql) => {
    const uniqueIds = [...new Set(ids)];
    const rows = await sql`SELECT id,account_status FROM cic_users WHERE id IN ${sql(uniqueIds)} FOR UPDATE`;
    if (rows.length !== uniqueIds.length) throw new Error('Một hoặc nhiều tài khoản không còn tồn tại.');
    await sql`UPDATE cic_users SET account_status = ${status}, published = ${status === 'active'}, updated_time = now() WHERE id IN ${sql(uniqueIds)}`;
    for (const row of rows) if (row.account_status !== status) await sql`INSERT INTO cic_user_status_history (user_id, previous_status, new_status, reason, changed_by) VALUES (${row.id}, ${row.account_status}, ${status}, ${reason}, ${actorId})`;
  });
}
