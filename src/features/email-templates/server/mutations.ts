import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { EmailAudience, EmailTemplateStatus, EmailWorkspace } from '../types';
import type { CmsPrincipal } from '@/server/auth/guards';
import { writeAuditEvent } from '@/server/audit/writer';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { moveEmailTemplateToTrash } from '@/features/trash/server/adapters/email-template';

export interface CreateTemplateInput {
  workspace: EmailWorkspace;
  name: string;
  event: string;
  audience: EmailAudience;
  subject: string;
  content: string;
  status?: EmailTemplateStatus;
  publishNow?: boolean;
}

export interface UpdateTemplateInput {
  name?: string;
  event?: string;
  audience?: EmailAudience;
  subject?: string;
  content?: string;
  status?: EmailTemplateStatus;
  publishNow?: boolean;
}

function getActorId(actor: CmsPrincipal | number | null = null): number | null {
  if (!actor) return null;
  if (typeof actor === 'number') return actor;
  return actor.legacyUserId ?? null;
}

export async function createEmailTemplate(
  data: CreateTemplateInput,
  actor: CmsPrincipal | number | null = null
) {
  const sql = getPostgresClient();
  const actorId = getActorId(actor);
  const status = data.publishNow ? 'active' : data.status || 'draft';

  // 1. Insert Template
  const [tmpl] = await sql`
    INSERT INTO cic_email_templates (
      workspace, name, event_key, audience, status,
      created_by, updated_by,
      activated_by, activated_at
    ) VALUES (
      ${data.workspace}, ${data.name}, ${data.event}, ${data.audience}, ${status},
      ${actorId}, ${actorId},
      ${data.publishNow ? actorId : null}, ${data.publishNow ? sql`now()` : null}
    ) RETURNING id::text
  `;

  // 2. Insert Version 1
  const [ver] = await sql`
    INSERT INTO cic_email_template_versions (
      template_id, version_number, subject, content, created_by
    ) VALUES (
      ${tmpl.id}, 1, ${data.subject}, ${data.content}, ${actorId}
    ) RETURNING id::text
  `;

  // 3. Update Pointers
  await sql`
    UPDATE cic_email_templates
    SET 
      draft_version_id = ${ver.id},
      active_version_id = ${data.publishNow ? ver.id : null}
    WHERE id = ${tmpl.id}
  `;

  // 4. Audit Log
  if (typeof actor === 'object' && actor !== null) {
    void writeAuditEvent(actor, {
      action: AUDIT_ACTIONS.EMAIL_TEMPLATE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
      entityId: tmpl.id,
      entityTitle: data.name,
      module: 'email_templates',
      workspace: data.workspace,
      result: 'success',
    }).catch((err) => console.error('[Audit Error in createEmailTemplate]', err));
  }

  return { id: tmpl.id, versionId: ver.id, versionNumber: 1 };
}

export async function updateEmailTemplate(
  id: string,
  data: UpdateTemplateInput,
  actor: CmsPrincipal | number | null = null
) {
  const sql = getPostgresClient();
  const actorId = getActorId(actor);

  const [tmpl] = await sql`
    SELECT id, workspace, name, active_version_id, draft_version_id 
    FROM cic_email_templates 
    WHERE id = ${id}
  `;
  if (!tmpl) throw new Error('Email template not found');

  // If content or subject changed, insert a new version
  let nextVersionId: string | null = null;
  let nextVersionNumber = 1;

  if (data.subject !== undefined || data.content !== undefined) {
    const [latestVer] = await sql`
      SELECT version_number, subject, content 
      FROM cic_email_template_versions 
      WHERE template_id = ${id}
      ORDER BY version_number DESC 
      LIMIT 1
    `;

    nextVersionNumber = latestVer ? Number(latestVer.version_number) + 1 : 1;
    const finalSubject = data.subject !== undefined ? data.subject : (latestVer?.subject || '');
    const finalContent = data.content !== undefined ? data.content : (latestVer?.content || '');

    const [newVer] = await sql`
      INSERT INTO cic_email_template_versions (
        template_id, version_number, subject, content, created_by
      ) VALUES (
        ${id}, ${nextVersionNumber}, ${finalSubject}, ${finalContent}, ${actorId}
      ) RETURNING id::text
    `;
    nextVersionId = newVer.id;
  }

  // Determine status and active pointer
  const shouldPublish = Boolean(data.publishNow);
  const nextStatus = shouldPublish ? 'active' : (data.status || 'draft');

  await sql`
    UPDATE cic_email_templates
    SET
      name = COALESCE(${data.name || null}, name),
      event_key = COALESCE(${data.event || null}, event_key),
      audience = COALESCE(${data.audience || null}, audience),
      status = ${nextStatus},
      draft_version_id = COALESCE(${nextVersionId}, draft_version_id),
      active_version_id = ${shouldPublish ? sql`COALESCE(${nextVersionId}, draft_version_id, active_version_id)` : sql`active_version_id`},
      activated_at = ${shouldPublish ? sql`now()` : sql`activated_at`},
      activated_by = ${shouldPublish ? actorId : sql`activated_by`},
      updated_at = now(),
      updated_by = ${actorId}
    WHERE id = ${id}
  `;

  // Audit Log
  if (typeof actor === 'object' && actor !== null) {
    const action = shouldPublish ? AUDIT_ACTIONS.EMAIL_TEMPLATE_PUBLISHED : AUDIT_ACTIONS.EMAIL_TEMPLATE_UPDATED;
    void writeAuditEvent(actor, {
      action,
      entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
      entityId: id,
      entityTitle: data.name || tmpl.name,
      module: 'email_templates',
      workspace: tmpl.workspace,
      result: 'success',
    }).catch((err) => console.error('[Audit Error in updateEmailTemplate]', err));
  }

  return { id, versionId: nextVersionId, versionNumber: nextVersionNumber };
}

export async function publishEmailTemplate(
  id: string,
  targetVersion?: string | number,
  actor: CmsPrincipal | number | null = null
) {
  const sql = getPostgresClient();
  const actorId = getActorId(actor);

  let targetVersionId: string | null = null;
  if (targetVersion) {
    const isNum = typeof targetVersion === 'number' || /^\d+$/.test(String(targetVersion));
    const [ver] = await sql`
      SELECT id::text FROM cic_email_template_versions 
      WHERE template_id = ${id} 
        AND (id = ${String(targetVersion)} ${isNum ? sql`OR version_number = ${Number(targetVersion)}` : sql``})
      LIMIT 1
    `;
    if (!ver) throw new Error(`Version ${targetVersion} not found`);
    targetVersionId = ver.id;
  } else {
    const [t] = await sql`
      SELECT draft_version_id, active_version_id, name, workspace
      FROM cic_email_templates 
      WHERE id = ${id}
    `;
    if (!t) throw new Error('Email template not found');
    targetVersionId = t.draft_version_id || t.active_version_id;
  }

  if (!targetVersionId) {
    throw new Error('No valid version found to publish');
  }

  const [updatedTmpl] = await sql`
    UPDATE cic_email_templates
    SET 
      status = 'active',
      active_version_id = ${targetVersionId},
      activated_at = now(),
      activated_by = ${actorId},
      updated_at = now(),
      updated_by = ${actorId}
    WHERE id = ${id}
    RETURNING id, name, workspace
  `;

  // Audit Log
  if (typeof actor === 'object' && actor !== null && updatedTmpl) {
    void writeAuditEvent(actor, {
      action: AUDIT_ACTIONS.EMAIL_TEMPLATE_PUBLISHED,
      entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
      entityId: id,
      entityTitle: updatedTmpl.name,
      module: 'email_templates',
      workspace: updatedTmpl.workspace,
      result: 'success',
    }).catch((err) => console.error('[Audit Error in publishEmailTemplate]', err));
  }

  return { id, activeVersionId: targetVersionId, status: 'active' };
}

export async function duplicateEmailTemplate(id: string, actor: CmsPrincipal | number | null = null) {
  const sql = getPostgresClient();

  const [orig] = await sql`
    SELECT t.workspace, t.name, t.event_key, t.audience, v.subject, v.content
    FROM cic_email_templates t
    LEFT JOIN cic_email_template_versions v ON v.id = COALESCE(t.active_version_id, t.draft_version_id)
    WHERE t.id = ${id}
  `;

  if (!orig) throw new Error('Original email template not found');

  return createEmailTemplate(
    {
      workspace: orig.workspace,
      name: `${orig.name} (Bản sao)`,
      event: orig.event_key,
      audience: orig.audience,
      subject: orig.subject || '',
      content: orig.content || '',
      status: 'draft',
    },
    actor
  );
}

export async function trashEmailTemplates(ids: string[], principal: CmsPrincipal) {
  const sql = getPostgresClient();
  if (!ids.length) return { trashedCount: 0 };

  let count = 0;
  for (const id of ids) {
    try {
      const moved = await moveEmailTemplateToTrash(sql, id, principal.legacyUserId || 0);
      count++;
      void writeAuditEvent(principal, {
        action: AUDIT_ACTIONS.EMAIL_TEMPLATE_TRASHED,
        entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
        entityId: id,
        entityTitle: moved.title,
        module: 'email_templates',
        workspace: moved.workspace,
        result: 'success',
      }).catch((err) => console.error('[Audit Error in trashEmailTemplates]', err));
    } catch (err) {
      console.error(`[Error moving template ${id} to trash]`, err);
    }
  }

  return { trashedCount: count };
}

export async function deleteEmailTemplates(ids: string[]) {
  const sql = getPostgresClient();
  if (!ids.length) return { deletedCount: 0 };

  // 1. Disconnect versions from templates
  await sql`
    UPDATE cic_email_templates
    SET draft_version_id = NULL, active_version_id = NULL
    WHERE id = ANY(${ids})
  `;

  // 2. Delete version rows
  await sql`
    DELETE FROM cic_email_template_versions
    WHERE template_id = ANY(${ids})
  `;

  // 3. Delete template rows
  const res = await sql`
    DELETE FROM cic_email_templates
    WHERE id = ANY(${ids})
  `;

  return { deletedCount: res.count };
}
