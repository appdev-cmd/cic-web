import assert from 'node:assert/strict';
import { config } from 'dotenv';
import type { User } from '@supabase/supabase-js';

import { createMediaFolder } from '../src/features/media/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import { getPostgresClient } from '../src/server/db/postgres.ts';

config({ path: '.env.local', override: true, quiet: true });

const sql = getPostgresClient();
const marker = `media-folder-audit-${Date.now()}`;
let folderId: string | null = null;

try {
  const [actorRow] = await sql`SELECT id,email,username,full_name FROM cic_users ORDER BY id LIMIT 1`;
  assert(actorRow, 'Media folder audit verification requires one CMS actor.');
  const actor: CmsPrincipal = {
    authUser: {} as User,
    legacyUserId: Number(actorRow.id),
    email: String(actorRow.email ?? ''),
    username: String(actorRow.username ?? ''),
    fullName: String(actorRow.full_name ?? actorRow.username ?? 'Verifier'),
    roleCodes: ['superadmin'],
    permissions: [],
    isAdministrator: true,
  };

  const created = await createMediaFolder({ workspace: 'vi', name: marker, alias: marker }, actor);
  folderId = created.id;
  const [event] = await sql`
    SELECT actor_id,action_code,entity_type,entity_id,entity_title,module,workspace,after_data
    FROM cic_activity_logs
    WHERE action_code='media_folder.created' AND entity_type='media_folder' AND entity_id=${folderId}
    ORDER BY occurred_at DESC LIMIT 1
  `;
  assert(event, 'Creating a Media folder must write an audit event.');
  assert.equal(Number(event.actor_id), actor.legacyUserId);
  assert.equal(event.entity_title, marker);
  assert.equal(event.module, 'media');
  assert.equal(event.workspace, 'vi');
  assert.equal(event.after_data.value.name, marker);
  assert.equal(event.after_data.value.alias, marker);

  console.log(JSON.stringify({ mediaFolderCreated: true, auditEventWritten: true, actorCaptured: true, metadataCaptured: true }, null, 2));
} finally {
  if (folderId) {
    await sql`DELETE FROM cic_media_folders WHERE id=${Number(folderId)}`;
    await sql`SET app.audit_retention_mode='on'`;
    await sql`DELETE FROM cic_activity_logs WHERE action_code='media_folder.created' AND entity_type='media_folder' AND entity_id=${folderId}`;
    await sql`SET app.audit_retention_mode='off'`;
  }
  await sql.end({ timeout: 2 });
}
