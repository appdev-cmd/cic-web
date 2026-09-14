import assert from 'node:assert/strict';
import { getPostgresClient, withTransaction } from '../src/server/db/postgres.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import {
  createEmailTemplate,
  duplicateEmailTemplate,
  publishEmailTemplate,
  trashEmailTemplates,
  updateEmailTemplate,
} from '../src/features/email-templates/server/mutations.ts';
import {
  getEmailTemplateDetail,
  listEmailTemplates,
} from '../src/features/email-templates/server/queries.ts';

const sql = getPostgresClient();
const marker = `[VERIFY_EMAIL_TEMPLATE:${Date.now()}-${process.pid}]`;
const markerPattern = `${marker}%`;
let originalId: string | null = null;
let duplicateId: string | null = null;

async function cleanupVerificationArtifacts() {
  await withTransaction(async (tx) => {
    const activeRows = await tx`
      SELECT id::text
      FROM cic_email_templates
      WHERE name LIKE ${markerPattern}
      FOR UPDATE
    `;
    const activeIds = activeRows.map((row) => String(row.id));

    if (activeIds.length > 0) {
      await tx`
        UPDATE cic_email_templates
        SET draft_version_id = NULL, active_version_id = NULL
        WHERE id IN ${tx(activeIds)}
      `;
      await tx`
        DELETE FROM cic_email_template_versions
        WHERE template_id IN ${tx(activeIds)}
      `;
      await tx`
        DELETE FROM cic_email_templates
        WHERE id IN ${tx(activeIds)}
      `;
    }

    await tx`
      DELETE FROM cic_trash_items
      WHERE module = 'email_templates' AND title_snapshot LIKE ${markerPattern}
    `;

    await tx`SELECT set_config('app.audit_retention_mode', 'on', true)`;
    await tx`
      DELETE FROM cic_activity_logs
      WHERE entity_type = 'email_template' AND entity_title LIKE ${markerPattern}
    `;
  });

  const [remaining] = await sql`
    SELECT
      (SELECT count(*)::int FROM cic_email_templates WHERE name LIKE ${markerPattern}) AS active,
      (SELECT count(*)::int FROM cic_trash_items
        WHERE module = 'email_templates' AND title_snapshot LIKE ${markerPattern}) AS trash,
      (SELECT count(*)::int FROM cic_activity_logs
        WHERE entity_type = 'email_template' AND entity_title LIKE ${markerPattern}) AS audit
  `;
  assert.deepEqual(
    { active: Number(remaining.active), trash: Number(remaining.trash), audit: Number(remaining.audit) },
    { active: 0, trash: 0, audit: 0 },
    'Email Template verification artifacts must be fully cleaned.'
  );
}

async function main() {
  console.log('=== EMAIL TEMPLATE DB ROUNDTRIP ===');

  const [actorRow] = await sql`
    SELECT id, email, username, full_name
    FROM cic_users
    WHERE account_status = 'active' AND published IS DISTINCT FROM false
    ORDER BY id
    LIMIT 1
  `;
  assert(actorRow, 'An active CMS actor is required for Email Template verification.');

  const principal = {
    authUser: {} as CmsPrincipal['authUser'],
    legacyUserId: Number(actorRow.id),
    email: String(actorRow.email ?? ''),
    username: String(actorRow.username ?? 'email-template-verifier'),
    fullName: String(actorRow.full_name ?? actorRow.username ?? 'Email Template verifier'),
    roleCodes: ['superadmin'],
    permissions: [],
    isAdministrator: true,
  } satisfies CmsPrincipal;

  const [templateCount] = await sql`SELECT count(*)::int AS count FROM cic_email_templates`;
  const [versionCount] = await sql`SELECT count(*)::int AS count FROM cic_email_template_versions`;
  assert(Number(templateCount.count) > 0, 'Expected seeded email templates.');
  assert(Number(versionCount.count) > 0, 'Expected seeded email template versions.');
  assert((await listEmailTemplates({ workspace: 'vi' })).length > 0, 'Expected VI templates.');
  assert((await listEmailTemplates({ workspace: 'en' })).length > 0, 'Expected EN templates.');

  const created = await createEmailTemplate({
    workspace: 'vi',
    name: marker,
    event: 'product_contact',
    audience: 'customer',
    subject: 'Bản nháp 1: {{request.reference}}',
    content: '<p>Nội dung bản nháp 1 cho {{customer.full_name}}</p>',
    status: 'draft',
  }, principal);
  originalId = created.id;
  assert.equal(created.versionNumber, 1);

  const createdDetail = await getEmailTemplateDetail(originalId);
  assert(createdDetail, 'Created template must be readable.');
  assert.equal(createdDetail.status, 'draft');
  assert.equal(createdDetail.versions.length, 1);

  const updated = await updateEmailTemplate(originalId, {
    subject: 'Bản nháp 2: {{request.reference}}',
    content: '<p>Nội dung bản nháp 2 cho {{customer.full_name}}</p>',
  }, principal);
  assert.equal(updated.versionNumber, 2);
  assert(updated.versionId, 'Version update must return the new version ID.');

  const updatedDetail = await getEmailTemplateDetail(originalId);
  assert(updatedDetail, 'Updated template must be readable.');
  assert.equal(updatedDetail.status, 'draft');
  assert.equal(updatedDetail.versions.length, 2);
  assert.equal(updatedDetail.subject, 'Bản nháp 2: {{request.reference}}');

  const published = await publishEmailTemplate(originalId, updated.versionId, principal);
  assert.equal(published.status, 'active');
  assert.equal(published.activeVersionId, updated.versionId);

  const publishedDetail = await getEmailTemplateDetail(originalId);
  assert(publishedDetail, 'Published template must be readable.');
  assert.equal(publishedDetail.status, 'active');
  assert.equal(publishedDetail.activeVersionId, updated.versionId);

  await updateEmailTemplate(originalId, { name: `${marker} Updated` }, principal);
  const patchedDetail = await getEmailTemplateDetail(originalId);
  assert(patchedDetail, 'PATCH-updated template must be readable.');
  assert.equal(patchedDetail.status, 'active', 'Omitted status must preserve active state.');
  assert.equal(patchedDetail.versions.length, 2, 'Metadata-only update must not create a version.');

  const duplicated = await duplicateEmailTemplate(originalId, principal);
  duplicateId = duplicated.id;
  const duplicateDetail = await getEmailTemplateDetail(duplicateId);
  assert(duplicateDetail, 'Duplicated template must be readable.');
  assert.equal(duplicateDetail.status, 'draft');
  assert.equal(duplicateDetail.versions.length, 1);
  assert.equal(duplicateDetail.subject, 'Bản nháp 2: {{request.reference}}');
  assert(duplicateDetail.name.endsWith('(Bản sao)'));

  const guaranteedMissingId = '9223372036854775807';
  await assert.rejects(
    () => trashEmailTemplates([duplicateId!, guaranteedMissingId], principal),
    'Bulk Trash must reject and roll back when one member fails.'
  );
  assert(await getEmailTemplateDetail(duplicateId), 'Failed bulk Trash must roll back the first member.');
  assert.equal((await sql`
    SELECT count(*)::int AS count
    FROM cic_trash_items
    WHERE module = 'email_templates' AND entity_id = ${duplicateId}
  `)[0].count, 0, 'Failed bulk Trash must not leave a snapshot.');

  const trashed = await trashEmailTemplates([originalId, duplicateId], principal);
  assert.equal(trashed.trashedCount, 2);
  assert.equal(await getEmailTemplateDetail(originalId), null);
  assert.equal(await getEmailTemplateDetail(duplicateId), null);

  const trashRows = await sql`
    SELECT id::text, entity_id, status, payload_snapshot
    FROM cic_trash_items
    WHERE module = 'email_templates' AND entity_id IN ${sql([originalId, duplicateId])}
    ORDER BY entity_id
  `;
  assert.equal(trashRows.length, 2, 'Both templates must have Trash snapshots.');
  assert(trashRows.every((row) => row.status === 'trashed'));
  assert.deepEqual(
    trashRows.map((row) => row.payload_snapshot.versions.length).sort((a, b) => a - b),
    [1, 2],
    'Trash snapshots must preserve all versions.'
  );

  const auditRows = await sql`
    SELECT entity_id, action_code, after_data
    FROM cic_activity_logs
    WHERE entity_type = 'email_template' AND entity_id IN ${sql([originalId, duplicateId])}
    ORDER BY id
  `;
  const originalActions = auditRows
    .filter((row) => String(row.entity_id) === originalId)
    .map((row) => String(row.action_code));
  const duplicateActions = auditRows
    .filter((row) => String(row.entity_id) === duplicateId)
    .map((row) => String(row.action_code));

  assert.deepEqual(originalActions.sort(), [
    'email_template.created',
    'email_template.updated',
    'email_template.published',
    'email_template.updated',
    'email_template.trashed',
  ].sort());
  assert.deepEqual(duplicateActions.sort(), [
    'email_template.created',
    'email_template.trashed',
  ].sort());

  const duplicateCreatedAudit = auditRows.find((row) =>
    String(row.entity_id) === duplicateId && row.action_code === 'email_template.created'
  );
  assert.equal(
    duplicateCreatedAudit?.after_data?.metadata?.duplicatedFromTemplateId,
    originalId,
    'Duplicate Audit metadata must identify the source template.'
  );

  console.log(JSON.stringify({
    databaseAuthority: true,
    createReadback: true,
    versionIncrement: true,
    publishReadback: true,
    patchStatusPreserved: true,
    duplicateReadback: true,
    failedBulkTrashRolledBack: true,
    trashSnapshotsPreserved: true,
    auditActionsVerified: true,
  }, null, 2));
}

try {
  await main();
  console.log('=== EMAIL TEMPLATE DB ROUNDTRIP PASSED ===');
} finally {
  await cleanupVerificationArtifacts();
  await sql.end({ timeout: 2 });
}
