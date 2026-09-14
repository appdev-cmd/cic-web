import 'server-only';
import type { Sql } from 'postgres';
import { withTransaction } from '@/server/db/postgres';
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

type CreateAuditContext = Readonly<{ duplicatedFromId?: string }>;

export async function createEmailTemplateInTransaction(
  sql: Sql,
  data: CreateTemplateInput,
  principal: CmsPrincipal,
  auditContext: CreateAuditContext = {}
) {
  const actorId = principal.legacyUserId;
  const status = data.publishNow ? 'active' : data.status || 'draft';

  const [template] = await sql`
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

  const [version] = await sql`
    INSERT INTO cic_email_template_versions (
      template_id, version_number, subject, content, created_by
    ) VALUES (
      ${template.id}, 1, ${data.subject}, ${data.content}, ${actorId}
    ) RETURNING id::text
  `;

  await sql`
    UPDATE cic_email_templates
    SET
      draft_version_id = ${version.id},
      active_version_id = ${data.publishNow ? version.id : null}
    WHERE id = ${template.id}
  `;

  await writeAuditEvent(principal, {
    action: AUDIT_ACTIONS.EMAIL_TEMPLATE_CREATED,
    entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
    entityId: template.id,
    entityTitle: data.name,
    module: 'email_templates',
    workspace: data.workspace,
    result: 'success',
    metadata: auditContext.duplicatedFromId
      ? { duplicatedFromTemplateId: auditContext.duplicatedFromId }
      : undefined,
  }, sql);

  return { id: template.id, versionId: version.id, versionNumber: 1 };
}

export async function createEmailTemplate(
  data: CreateTemplateInput,
  principal: CmsPrincipal,
  tx?: Sql
) {
  if (tx) {
    return createEmailTemplateInTransaction(tx, data, principal);
  }
  return withTransaction((sql) => createEmailTemplateInTransaction(sql, data, principal));
}

export async function updateEmailTemplate(
  id: string,
  data: UpdateTemplateInput,
  principal: CmsPrincipal,
  tx?: Sql
) {
  const execute = async (sql: Sql) => {
    const actorId = principal.legacyUserId;
    const [template] = await sql`
      SELECT id, workspace, name, status, active_version_id, draft_version_id
      FROM cic_email_templates
      WHERE id = ${id}
      FOR UPDATE
    `;
    if (!template) throw new Error('Email template not found');

    let nextVersionId: string | null = null;
    let nextVersionNumber = 1;

    if (data.subject !== undefined || data.content !== undefined) {
      const [latestVersion] = await sql`
        SELECT version_number, subject, content
        FROM cic_email_template_versions
        WHERE template_id = ${id}
        ORDER BY version_number DESC
        LIMIT 1
      `;

      nextVersionNumber = latestVersion ? Number(latestVersion.version_number) + 1 : 1;
      const finalSubject = data.subject !== undefined ? data.subject : (latestVersion?.subject || '');
      const finalContent = data.content !== undefined ? data.content : (latestVersion?.content || '');

      const [newVersion] = await sql`
        INSERT INTO cic_email_template_versions (
          template_id, version_number, subject, content, created_by
        ) VALUES (
          ${id}, ${nextVersionNumber}, ${finalSubject}, ${finalContent}, ${actorId}
        ) RETURNING id::text
      `;
      nextVersionId = newVersion.id;
    }

    const shouldPublish = Boolean(data.publishNow);
    const nextStatus = shouldPublish ? 'active' : (data.status ?? template.status);

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

    await writeAuditEvent(principal, {
      action: shouldPublish
        ? AUDIT_ACTIONS.EMAIL_TEMPLATE_PUBLISHED
        : AUDIT_ACTIONS.EMAIL_TEMPLATE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
      entityId: id,
      entityTitle: data.name || template.name,
      module: 'email_templates',
      workspace: template.workspace,
      result: 'success',
    }, sql);

    return { id, versionId: nextVersionId, versionNumber: nextVersionNumber };
  };

  return tx ? execute(tx) : withTransaction(execute);
}

export async function publishEmailTemplate(
  id: string,
  targetVersion: string | number | undefined,
  principal: CmsPrincipal,
  tx?: Sql
) {
  const execute = async (sql: Sql) => {
    const actorId = principal.legacyUserId;
    const [template] = await sql`
      SELECT id, draft_version_id, active_version_id, name, workspace
      FROM cic_email_templates
      WHERE id = ${id}
      FOR UPDATE
    `;
    if (!template) throw new Error('Email template not found');

    let targetVersionId: string | null = null;
    if (targetVersion) {
      const isNumeric = typeof targetVersion === 'number' || /^\d+$/.test(String(targetVersion));
      const [version] = await sql`
        SELECT id::text
        FROM cic_email_template_versions
        WHERE template_id = ${id}
          AND (id = ${String(targetVersion)} ${isNumeric ? sql`OR version_number = ${Number(targetVersion)}` : sql``})
        LIMIT 1
      `;
      if (!version) throw new Error(`Version ${targetVersion} not found`);
      targetVersionId = version.id;
    } else {
      targetVersionId = template.draft_version_id || template.active_version_id;
    }

    if (!targetVersionId) throw new Error('No valid version found to publish');

    const [updatedTemplate] = await sql`
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
    if (!updatedTemplate) throw new Error('Email template not found');

    await writeAuditEvent(principal, {
      action: AUDIT_ACTIONS.EMAIL_TEMPLATE_PUBLISHED,
      entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
      entityId: id,
      entityTitle: updatedTemplate.name,
      module: 'email_templates',
      workspace: updatedTemplate.workspace,
      result: 'success',
    }, sql);

    return { id, activeVersionId: targetVersionId, status: 'active' };
  };

  return tx ? execute(tx) : withTransaction(execute);
}

export async function duplicateEmailTemplate(
  id: string,
  principal: CmsPrincipal,
  tx?: Sql
) {
  const execute = async (sql: Sql) => {
    const [original] = await sql`
      SELECT workspace, name, event_key, audience,
             COALESCE(active_version_id, draft_version_id)::text AS source_version_id
      FROM cic_email_templates
      WHERE id = ${id}
      FOR SHARE
    `;
    if (!original) throw new Error('Original email template not found');

    const [sourceVersion] = original.source_version_id
      ? await sql`
          SELECT subject, content
          FROM cic_email_template_versions
          WHERE id = ${original.source_version_id} AND template_id = ${id}
        `
      : [];

    return createEmailTemplateInTransaction(
      sql,
      {
        workspace: original.workspace,
        name: `${original.name} (Bản sao)`,
        event: original.event_key,
        audience: original.audience,
        subject: sourceVersion?.subject || '',
        content: sourceVersion?.content || '',
        status: 'draft',
      },
      principal,
      { duplicatedFromId: id }
    );
  };

  return tx ? execute(tx) : withTransaction(execute);
}

export async function trashEmailTemplates(
  ids: string[],
  principal: CmsPrincipal,
  tx?: Sql
) {
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return { trashedCount: 0 };

  const execute = async (sql: Sql) => {
    for (const id of uniqueIds) {
      const moved = await moveEmailTemplateToTrash(sql, id, principal.legacyUserId);
      await writeAuditEvent(principal, {
        action: AUDIT_ACTIONS.EMAIL_TEMPLATE_TRASHED,
        entityType: AUDIT_ENTITY_TYPES.EMAIL_TEMPLATE,
        entityId: id,
        entityTitle: moved.title,
        module: 'email_templates',
        workspace: moved.workspace,
        result: 'success',
        after: { trashId: moved.trashId },
      }, sql);
    }

    return { trashedCount: uniqueIds.length };
  };

  return tx ? execute(tx) : withTransaction(execute);
}

export async function deleteEmailTemplates(ids: string[], tx?: Sql) {
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return { deletedCount: 0 };

  const execute = async (sql: Sql) => {
    await sql`
      UPDATE cic_email_templates
      SET draft_version_id = NULL, active_version_id = NULL
      WHERE id = ANY(${uniqueIds})
    `;

    await sql`
      DELETE FROM cic_email_template_versions
      WHERE template_id = ANY(${uniqueIds})
    `;

    const result = await sql`
      DELETE FROM cic_email_templates
      WHERE id = ANY(${uniqueIds})
    `;

    return { deletedCount: result.count };
  };

  return tx ? execute(tx) : withTransaction(execute);
}
