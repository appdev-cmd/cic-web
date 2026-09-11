import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { EmailAudience, EmailTemplateStatus, EmailWorkspace } from '../types';

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

export async function createEmailTemplate(data: CreateTemplateInput, actorId: number | null = null) {
  const sql = getPostgresClient();
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

  return { id: tmpl.id, versionId: ver.id, versionNumber: 1 };
}

export async function updateEmailTemplate(
  id: string,
  data: UpdateTemplateInput,
  actorId: number | null = null
) {
  const sql = getPostgresClient();

  const [tmpl] = await sql`
    SELECT id, active_version_id, draft_version_id 
    FROM cic_email_templates 
    WHERE id = ${id}
  `;
  if (!tmpl) {
    throw new Error('Email template not found');
  }

  // Get current max version
  const [maxVerRow] = await sql`
    SELECT COALESCE(MAX(version_number), 0)::int as "maxVer"
    FROM cic_email_template_versions
    WHERE template_id = ${id}
  `;
  const nextVersionNumber = Number(maxVerRow.maxVer) + 1;

  // If subject or content changed, create new version
  let newVersionId: string | null = null;
  if (data.subject !== undefined || data.content !== undefined) {
    // Get previous version to fallback if only one is updated
    const [prevVer] = await sql`
      SELECT subject, content 
      FROM cic_email_template_versions 
      WHERE template_id = ${id}
      ORDER BY version_number DESC 
      LIMIT 1
    `;

    const sub = data.subject !== undefined ? data.subject : prevVer?.subject || '';
    const con = data.content !== undefined ? data.content : prevVer?.content || '';

    const [ver] = await sql`
      INSERT INTO cic_email_template_versions (
        template_id, version_number, subject, content, created_by
      ) VALUES (
        ${id}, ${nextVersionNumber}, ${sub}, ${con}, ${actorId}
      ) RETURNING id::text
    `;
    newVersionId = ver.id;
  }

  const updates: Record<string, any> = {
    updated_at: sql`now()`,
    updated_by: actorId,
  };

  if (data.name) updates.name = data.name;
  if (data.event) updates.event_key = data.event;
  if (data.audience) updates.audience = data.audience;

  if (newVersionId) {
    updates.draft_version_id = newVersionId;
  }

  if (data.publishNow) {
    updates.status = 'active';
    updates.active_version_id = newVersionId || tmpl.draft_version_id || tmpl.active_version_id;
    updates.activated_at = sql`now()`;
    updates.activated_by = actorId;
  } else if (data.status) {
    updates.status = data.status;
  }

  await sql`
    UPDATE cic_email_templates
    SET ${sql(updates)}
    WHERE id = ${id}
  `;

  return { id, versionId: newVersionId, versionNumber: nextVersionNumber };
}

export async function publishEmailTemplate(id: string, versionId?: string, actorId: number | null = null) {
  const sql = getPostgresClient();

  let targetVersionId = versionId;
  if (!targetVersionId) {
    const [t] = await sql`
      SELECT draft_version_id, active_version_id 
      FROM cic_email_templates 
      WHERE id = ${id}
    `;
    if (!t) throw new Error('Email template not found');
    targetVersionId = t.draft_version_id || t.active_version_id;
  }

  if (!targetVersionId) {
    throw new Error('No valid version found to publish');
  }

  await sql`
    UPDATE cic_email_templates
    SET 
      status = 'active',
      active_version_id = ${targetVersionId},
      activated_at = now(),
      activated_by = ${actorId},
      updated_at = now(),
      updated_by = ${actorId}
    WHERE id = ${id}
  `;

  return { id, activeVersionId: targetVersionId, status: 'active' };
}

export async function duplicateEmailTemplate(id: string, actorId: number | null = null) {
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
    actorId
  );
}

export async function archiveEmailTemplates(ids: string[], actorId: number | null = null) {
  const sql = getPostgresClient();
  if (!ids.length) return { updatedCount: 0 };

  const res = await sql`
    UPDATE cic_email_templates
    SET 
      status = 'archived',
      updated_at = now(),
      updated_by = ${actorId}
    WHERE id = ANY(${ids})
  `;

  return { updatedCount: res.count };
}
