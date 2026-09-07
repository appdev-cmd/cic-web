import assert from 'node:assert/strict';
import { config } from 'dotenv';
import type { User } from '@supabase/supabase-js';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import { deleteProject } from '../src/features/projects/server/repository.ts';
import { purgeTrashRecord, restoreTrashRecord } from '../src/features/trash/server/repository.ts';

config({ path: '.env.local', override: true, quiet: true });
const sql = getPostgresClient();
const marker = `trash-roundtrip-${Date.now()}`;
let projectId: number | null = null;
const trashIds: string[] = [];

try {
  const [actorRow] = await sql`SELECT id,email,username,full_name FROM cic_users WHERE account_status='active' AND published IS DISTINCT FROM false ORDER BY id LIMIT 1`;
  assert(actorRow, 'An active CMS actor is required for Trash verification.');
  const actor: CmsPrincipal = {
    authUser: {} as User,
    legacyUserId: Number(actorRow.id),
    email: String(actorRow.email ?? ''), username: String(actorRow.username ?? ''),
    fullName: String(actorRow.full_name ?? actorRow.username ?? 'Verifier'),
    roleCodes: ['superadmin'], permissions: [], isAdministrator: true,
  };

  const [project] = await sql`
    INSERT INTO cic_projects (title,alias,technologies,is_ongoing,is_featured,published,ordering,created_by,updated_by)
    VALUES ('Trash roundtrip verification',${marker},ARRAY['verification'],false,false,true,0,${actor.legacyUserId},${actor.legacyUserId})
    RETURNING id
  `;
  projectId = Number(project.id);
  const [product] = await sql`SELECT id FROM cic_products ORDER BY id LIMIT 1`;
  const [service] = await sql`SELECT id FROM cic_services ORDER BY id LIMIT 1`;
  if (product) await sql`INSERT INTO cic_projects_products_rel (project_id,product_id,ordering) VALUES (${projectId},${product.id},0)`;
  if (service) await sql`INSERT INTO cic_projects_services_rel (project_id,service_id,ordering) VALUES (${projectId},${service.id},0)`;

  const firstDelete = await deleteProject(projectId, actor); trashIds.push(firstDelete.trashId);
  assert.equal((await sql`SELECT count(*)::int AS count FROM cic_projects WHERE id=${projectId}`)[0].count, 0, 'Trashed project must leave the active/public source.');
  const [snapshot] = await sql`SELECT status,payload_snapshot FROM cic_trash_items WHERE id=${firstDelete.trashId}`;
  assert.equal(snapshot.status, 'trashed');
  assert.equal(snapshot.payload_snapshot.version, 1);

  const restored = await restoreTrashRecord(firstDelete.trashId, 'as_draft', actor);
  assert.equal(restored.restoredEntityId, String(projectId));
  const [restoredProject] = await sql`SELECT alias,published FROM cic_projects WHERE id=${projectId}`;
  assert.equal(restoredProject.alias, marker);
  assert.equal(restoredProject.published, false, 'Restored project must be draft/private.');
  if (product) assert.equal((await sql`SELECT count(*)::int AS count FROM cic_projects_products_rel WHERE project_id=${projectId}`)[0].count, 1);
  if (service) assert.equal((await sql`SELECT count(*)::int AS count FROM cic_projects_services_rel WHERE project_id=${projectId}`)[0].count, 1);

  const secondDelete = await deleteProject(projectId, actor); trashIds.push(secondDelete.trashId);
  await purgeTrashRecord(secondDelete.trashId, 'Automated Trash roundtrip verification', actor);
  const [purged] = await sql`SELECT status,payload_snapshot,purged_by,purged_at FROM cic_trash_items WHERE id=${secondDelete.trashId}`;
  assert.equal(purged.status, 'purged');
  assert.deepEqual(purged.payload_snapshot, {});
  assert.equal(Number(purged.purged_by), actor.legacyUserId);
  assert(purged.purged_at);

  console.log(JSON.stringify({ projectDeleteSnapshot: true, publicRemoval: true, restoreDraft: true, relationsRestored: true, purgeScrubbed: true, auditIntegrated: true }, null, 2));
} finally {
  if (projectId !== null) await sql`DELETE FROM cic_projects WHERE id=${projectId}`;
  if (trashIds.length) await sql`DELETE FROM cic_trash_items WHERE id IN ${sql(trashIds)}`;
  await sql`SET app.audit_retention_mode='on'`;
  await sql`DELETE FROM cic_activity_logs WHERE (entity_type='project' AND entity_title='Trash roundtrip verification') OR (entity_type='trash_item' AND entity_id IN ${sql(trashIds.length ? trashIds : ['00000000-0000-0000-0000-000000000000'])})`;
  await sql`SET app.audit_retention_mode='off'`;
  await sql.end({ timeout: 2 });
}

