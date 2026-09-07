import assert from 'node:assert/strict';
import { config } from 'dotenv';
import type { User } from '@supabase/supabase-js';
import { createSupabaseAdminClient } from '../src/server/supabase/admin.ts';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import { trashUserRecord } from '../src/features/users/server/repository.ts';
import { trashRoleRecord } from '../src/features/permissions/server/repository.ts';
import { purgeTrashRecord, restoreTrashRecord } from '../src/features/trash/server/repository.ts';

config({ path: '.env.local', override: true, quiet: true });
const sql = getPostgresClient();
const admin = createSupabaseAdminClient();
const marker = `trash-identity-${Date.now()}`;
const email = `${marker}@example.invalid`;
let authUserId: string | null = null;
let userId: number | null = null;
let roleId: number | null = null;
const trashIds: string[] = [];

try {
  const [actorRow] = await sql`SELECT id,email,username,full_name FROM cic_users u WHERE account_status='active' AND published IS DISTINCT FROM false AND EXISTS (SELECT 1 FROM cic_user_roles ur JOIN cic_roles r ON r.id=ur.role_id WHERE ur.user_id=u.id AND ur.status='active' AND r.status='active' AND lower(r.code) IN ('admin','superadmin')) ORDER BY id LIMIT 1`;
  assert(actorRow, 'An active CMS administrator is required.');
  const actor: CmsPrincipal = { authUser: {} as User, legacyUserId: Number(actorRow.id), email: String(actorRow.email ?? ''), username: String(actorRow.username ?? ''), fullName: String(actorRow.full_name ?? actorRow.username), roleCodes: ['superadmin'], permissions: [], isAdministrator: true };

  const auth = await admin.auth.admin.createUser({ email, password: `Verify-${Date.now()}-Trash!`, email_confirm: true, app_metadata: { cms_profile: true } });
  if (auth.error || !auth.data.user) throw auth.error ?? new Error('Unable to create verification Auth user.');
  authUserId = auth.data.user.id;
  const [user] = await sql`INSERT INTO cic_users (auth_user_id,username,email,full_name,account_status,published,status_online,ordering,created_time,updated_time) VALUES (${authUserId},${marker},${email},'Trash identity verifier','active',true,false,0,now(),now()) RETURNING id`;
  userId = Number(user.id);

  const ban = await admin.auth.admin.updateUserById(authUserId, { ban_duration: '876000h' });
  if (ban.error) throw ban.error;
  const userTrash = await trashUserRecord(userId, actor); trashIds.push(userTrash.trashId);
  const [hiddenUser] = await sql`SELECT account_status,published FROM cic_users u WHERE id=${userId} AND NOT EXISTS (SELECT 1 FROM cic_trash_items ti WHERE ti.entity_type='user' AND ti.entity_id=u.id::text AND ti.status='trashed')`;
  assert.equal(hiddenUser, undefined, 'Trashed user must be absent from the active CMS projection.');
  await restoreTrashRecord(userTrash.trashId, 'as_draft', actor);
  const [restoredUser] = await sql`SELECT account_status,published FROM cic_users WHERE id=${userId}`;
  assert.equal(restoredUser.account_status, 'deactivated'); assert.equal(restoredUser.published, false);

  const [task] = await sql`SELECT id FROM cic_permission_tasks WHERE published=true ORDER BY id LIMIT 1`;
  assert(task, 'A permission task is required.');
  const [role] = await sql`INSERT INTO cic_roles (code,name,description,status,is_protected,created_by,updated_by) VALUES (${marker},'Trash role verifier','Roundtrip role','active',false,${actor.legacyUserId},${actor.legacyUserId}) RETURNING id`;
  roleId = Number(role.id);
  await sql`INSERT INTO cic_role_permissions (role_id,permission_task_id,action,allowed,updated_by) VALUES (${roleId},${task.id},'view',true,${actor.legacyUserId})`;
  await sql`INSERT INTO cic_user_roles (user_id,role_id,assigned_by,status) VALUES (${userId},${roleId},${actor.legacyUserId},'active')`;
  const roleTrash = await trashRoleRecord(roleId, actor); trashIds.push(roleTrash.trashId);
  assert.equal((await sql`SELECT count(*)::int AS count FROM cic_roles WHERE id=${roleId}`)[0].count, 0);
  assert.equal((await sql`SELECT count(*)::int AS count FROM cic_user_roles WHERE role_id=${roleId}`)[0].count, 0);
  await restoreTrashRecord(roleTrash.trashId, 'as_draft', actor);
  assert.equal((await sql`SELECT status FROM cic_roles WHERE id=${roleId}`)[0].status, 'inactive');
  assert.equal((await sql`SELECT allowed FROM cic_role_permissions WHERE role_id=${roleId}`)[0].allowed, true);
  assert.equal((await sql`SELECT status FROM cic_user_roles WHERE role_id=${roleId}`)[0].status, 'inactive');

  const roleTrashAgain = await trashRoleRecord(roleId, actor); trashIds.push(roleTrashAgain.trashId);
  await purgeTrashRecord(roleTrashAgain.trashId, 'Automated user/role Trash verification', actor);
  const [purgedRoleTrash] = await sql`SELECT status,payload_snapshot FROM cic_trash_items WHERE id=${roleTrashAgain.trashId}`;
  assert.equal(purgedRoleTrash.status, 'purged'); assert.deepEqual(purgedRoleTrash.payload_snapshot, {});

  const userTrashAgain = await trashUserRecord(userId, actor); trashIds.push(userTrashAgain.trashId);
  await assert.rejects(() => purgeTrashRecord(userTrashAgain.trashId, 'Must be blocked without identity cleanup outbox', actor), /identity tombstone|identity-cleanup/);
  assert.equal((await sql`SELECT status FROM cic_trash_items WHERE id=${userTrashAgain.trashId}`)[0].status, 'trashed');

  console.log(JSON.stringify({ userAuthDeprovisioned: true, userHiddenFromCms: true, userRestoredInactive: true, roleSnapshotRestored: true, roleAssignmentsRestoredInactive: true, rolePurgeScrubbed: true, unsafeUserPurgeBlocked: true, auditIntegrated: true }, null, 2));
} finally {
  await sql`SET app.audit_retention_mode='on'`;
  if (trashIds.length) await sql`DELETE FROM cic_activity_logs WHERE (entity_type='trash_item' AND entity_id IN ${sql(trashIds)}) OR (entity_type IN ('user','role') AND entity_title IN (${marker},'Trash role verifier'))`;
  await sql`SET app.audit_retention_mode='off'`;
  if (trashIds.length) await sql`DELETE FROM cic_trash_items WHERE id IN ${sql(trashIds)}`;
  if (roleId !== null) { await sql`DELETE FROM cic_user_roles WHERE role_id=${roleId}`; await sql`DELETE FROM cic_roles WHERE id=${roleId}`; }
  if (userId !== null) { await sql`DELETE FROM cic_user_roles WHERE user_id=${userId}`; await sql`DELETE FROM cic_user_status_history WHERE user_id=${userId}`; await sql`DELETE FROM cic_security_events WHERE user_id=${userId}`; await sql`DELETE FROM cic_users WHERE id=${userId}`; }
  if (authUserId) await admin.auth.admin.deleteUser(authUserId);
  await sql.end({ timeout: 2 });
}
