import 'server-only';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { withTransaction } from '@/server/db/postgres';
import type { CreateUserInput, UpdateUserInput } from '../schemas/userInput';
import { moveUserToTrash } from '@/features/trash/server/adapters/user';

export type AuthSyncTarget = Readonly<{ id: number; authUserId: string | null; email: string; username: string; fullName: string; status: string }>;
type AuthProfileSync = (target: AuthSyncTarget) => Promise<string>;
type AuthStatusSync = (targets: readonly AuthSyncTarget[]) => Promise<void>;
const csv = (values: number[]) => [...new Set(values)].join(',');
const displayName = (input: Pick<UpdateUserInput, 'fname' | 'lname' | 'username'>) => `${input.lname} ${input.fname}`.trim() || input.username;

async function validateRelations(sql: Sql, input: Pick<UpdateUserInput, 'roleId' | 'agencies'>) {
  const [role] = await sql`SELECT id FROM cic_roles WHERE id=${input.roleId} AND status='active'`;
  if (!role) throw new Error('Vai trò không tồn tại hoặc đã ngừng hoạt động.');
  if (!input.agencies.length) return;
  const ids = [...new Set(input.agencies)];
  const rows = await sql`SELECT id FROM cic_branches WHERE id IN ${sql(ids)} AND published=true`;
  if (rows.length !== ids.length) throw new Error('Một hoặc nhiều phạm vi đơn vị không còn tồn tại.');
}

async function assertUniqueIdentity(sql: Sql, input: Pick<UpdateUserInput, 'username' | 'email'>, excludingId?: number) {
  const rows = excludingId
    ? await sql`SELECT id FROM cic_users WHERE id<>${excludingId} AND (lower(username)=lower(${input.username}) OR lower(email)=lower(${input.email})) LIMIT 1`
    : await sql`SELECT id FROM cic_users WHERE lower(username)=lower(${input.username}) OR lower(email)=lower(${input.email}) LIMIT 1`;
  if (rows.length) throw new Error('Tên đăng nhập hoặc email đã tồn tại.');
}

async function replacePrimaryRole(sql: Sql, userId: number, roleId: number, actorId: number) {
  await sql`UPDATE cic_user_roles SET status='inactive' WHERE user_id=${userId} AND status='active' AND role_id<>${roleId}`;
  const [existing] = await sql`SELECT id FROM cic_user_roles WHERE user_id=${userId} AND role_id=${roleId} ORDER BY id DESC LIMIT 1 FOR UPDATE`;
  if (existing) await sql`UPDATE cic_user_roles SET status='active',assigned_at=now(),assigned_by=${actorId} WHERE id=${existing.id}`;
  else await sql`INSERT INTO cic_user_roles (user_id,role_id,assigned_by,status) VALUES (${userId},${roleId},${actorId},'active')`;
}

async function assertNotLastAdministrator(sql: Sql, userId: number, nextStatus: UpdateUserInput['status']) {
  if (nextStatus === 'active') return;
  const [target] = await sql`SELECT 1 FROM cic_user_roles ur JOIN cic_roles r ON r.id=ur.role_id WHERE ur.user_id=${userId} AND ur.status='active' AND r.status='active' AND lower(r.code) IN ('admin','superadmin') LIMIT 1`;
  if (!target) return;
  const [other] = await sql`SELECT 1 FROM cic_users u JOIN cic_user_roles ur ON ur.user_id=u.id AND ur.status='active' JOIN cic_roles r ON r.id=ur.role_id AND r.status='active' WHERE u.id<>${userId} AND u.account_status='active' AND u.published IS DISTINCT FROM false AND lower(r.code) IN ('admin','superadmin') LIMIT 1`;
  if (!other) throw new Error('Không thể vô hiệu hóa quản trị viên đang hoạt động cuối cùng.');
}

async function assertUserNotTrashed(sql: Sql, userId: number) {
  const [trash] = await sql`SELECT 1 FROM cic_trash_items WHERE entity_type='user' AND entity_id=${String(userId)} AND status='trashed' LIMIT 1`;
  if (trash) throw new Error('Tài khoản đang nằm trong Thùng rác.');
}

const changedFields = (before: Record<string, unknown>, after: Record<string, unknown>) => Object.keys(after).filter((key) => JSON.stringify(before[key] ?? null) !== JSON.stringify(after[key] ?? null));

export async function createUserRecord(input: CreateUserInput, authUserId: string, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    await validateRelations(sql, input); await assertUniqueIdentity(sql, input);
    const [{ next_ordering }] = await sql`SELECT coalesce(max(ordering),0)+1 AS next_ordering FROM cic_users`;
    const [created] = await sql`INSERT INTO cic_users (auth_user_id,username,email,fname,lname,full_name,phone,address,summary,image,account_status,published,ordering,agencies,created_time,updated_time,password_changed_at) VALUES (${authUserId},${input.username},${input.email},${input.fname},${input.lname},${displayName(input)},${input.phone},${input.address},${input.summary},${input.avatar},${input.status},${input.status==='active'},${Number(next_ordering)},${csv(input.agencies)},now(),now(),now()) RETURNING id`;
    const id = Number(created.id);
    await replacePrimaryRole(sql, id, input.roleId, actor.legacyUserId);
    await sql`INSERT INTO cic_user_status_history (user_id,previous_status,new_status,reason,changed_by) VALUES (${id},NULL,${input.status},${input.statusReason || 'Tạo tài khoản'},${actor.legacyUserId})`;
    await writeAuditEvent(actor,{action:AUDIT_ACTIONS.USER_CREATED,entityType:AUDIT_ENTITY_TYPES.USER,entityId:String(id),entityTitle:input.username,module:'users',workspace:'global',result:'success',after:{username:input.username,fullName:displayName(input),status:input.status,roleId:input.roleId,agencyIds:input.agencies}},sql);
    return id;
  });
}

export async function updateUserRecord(id: number, input: UpdateUserInput, actor: CmsPrincipal, syncAuth: AuthProfileSync) {
  return withTransaction(async (sql) => {
    await assertUserNotTrashed(sql, id);
    await validateRelations(sql, input);
    const [current] = await sql`SELECT id,auth_user_id,email,username,full_name,fname,lname,phone,address,summary,image,account_status,agencies FROM cic_users WHERE id=${id} FOR UPDATE`;
    if (!current) throw new Error('Không tìm thấy tài khoản.');
    await assertUniqueIdentity(sql, input, id); await assertNotLastAdministrator(sql, id, input.status);
    const [assignment] = await sql`SELECT role_id FROM cic_user_roles WHERE user_id=${id} AND status='active' ORDER BY assigned_at DESC,id DESC LIMIT 1`;
    const before={username:String(current.username??''),fullName:String(current.full_name??''),status:String(current.account_status??''),roleId:Number(assignment?.role_id??0),agencyIds:String(current.agencies??'').split(',').filter(Boolean).map(Number)};
    const after={username:input.username,fullName:displayName(input),status:input.status,roleId:input.roleId,agencyIds:input.agencies};
    await sql`UPDATE cic_users SET username=${input.username},email=${input.email},fname=${input.fname},lname=${input.lname},full_name=${displayName(input)},phone=${input.phone},address=${input.address},summary=${input.summary},image=${input.avatar},account_status=${input.status},published=${input.status==='active'},agencies=${csv(input.agencies)},updated_time=now()${input.password ? sql`,password_changed_at=now()` : sql``} WHERE id=${id}`;
    await replacePrimaryRole(sql,id,input.roleId,actor.legacyUserId);
    if (current.account_status!==input.status) await sql`INSERT INTO cic_user_status_history (user_id,previous_status,new_status,reason,changed_by) VALUES (${id},${current.account_status},${input.status},${input.statusReason || `Chuyển trạng thái sang ${input.status}`},${actor.legacyUserId})`;
    const authUserId=await syncAuth({id,authUserId:current.auth_user_id?String(current.auth_user_id):null,email:String(current.email??''),username:String(current.username??''),fullName:String(current.full_name??''),status:String(current.account_status??'')});
    if(!current.auth_user_id) await sql`UPDATE cic_users SET auth_user_id=${authUserId} WHERE id=${id}`;
    await writeAuditEvent(actor,{action:AUDIT_ACTIONS.USER_UPDATED,entityType:AUDIT_ENTITY_TYPES.USER,entityId:String(id),entityTitle:input.username,module:'users',workspace:'global',result:'success',before,after:{...after,changedFields:changedFields(before,after)}},sql);
    return id;
  });
}

export async function updateUserStatuses(ids:number[],status:UpdateUserInput['status'],reason:string,actor:CmsPrincipal,syncAuth:AuthStatusSync){
  return withTransaction(async(sql)=>{
    const uniqueIds=[...new Set(ids)];
    for (const id of uniqueIds) await assertUserNotTrashed(sql, id);
    const rows=await sql`SELECT id,auth_user_id,email,username,full_name,account_status FROM cic_users WHERE id IN ${sql(uniqueIds)} FOR UPDATE`;
    if(rows.length!==uniqueIds.length) throw new Error('Một hoặc nhiều tài khoản không còn tồn tại.');
    for(const row of rows) await assertNotLastAdministrator(sql,Number(row.id),status);
    await sql`UPDATE cic_users SET account_status=${status},published=${status==='active'},updated_time=now() WHERE id IN ${sql(uniqueIds)}`;
    await syncAuth(rows.map((row)=>({id:Number(row.id),authUserId:row.auth_user_id?String(row.auth_user_id):null,email:String(row.email??''),username:String(row.username??''),fullName:String(row.full_name??''),status:String(row.account_status??'')})));
    for(const row of rows) if(row.account_status!==status){
      await sql`INSERT INTO cic_user_status_history (user_id,previous_status,new_status,reason,changed_by) VALUES (${row.id},${row.account_status},${status},${reason},${actor.legacyUserId})`;
      await writeAuditEvent(actor,{action:AUDIT_ACTIONS.USER_STATUS_CHANGED,entityType:AUDIT_ENTITY_TYPES.USER,entityId:String(row.id),entityTitle:String(row.username),module:'users',workspace:'global',result:'success',before:{status:row.account_status},after:{status,reason}},sql);
    }
  });
}

export async function trashUserRecord(id: number, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    if (id === actor.legacyUserId) throw new Error('Không thể xóa tài khoản đang đăng nhập.');
    await assertUserNotTrashed(sql, id);
    await assertNotLastAdministrator(sql, id, 'deactivated');
    const [before] = await sql`SELECT id,auth_user_id,email,username,full_name,account_status FROM cic_users WHERE id=${id} FOR UPDATE`;
    if (!before) throw new Error('Không tìm thấy tài khoản.');
    const trashed = await moveUserToTrash(sql, id, actor.legacyUserId);
    await writeAuditEvent(actor, {
      action: AUDIT_ACTIONS.USER_TRASHED, entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: String(id), entityTitle: String(before.username), module: 'users', workspace: 'global', result: 'success',
      before: { status: before.account_status }, after: { status: 'trashed', trashId: trashed.trashId },
    }, sql);
    return {
      ...trashed,
      authTarget: { id, authUserId: before.auth_user_id ? String(before.auth_user_id) : null, email: String(before.email ?? ''), username: String(before.username ?? ''), fullName: String(before.full_name ?? ''), status: String(before.account_status ?? '') } satisfies AuthSyncTarget,
    };
  });
}
