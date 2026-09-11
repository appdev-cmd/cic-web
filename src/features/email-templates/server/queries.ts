import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { EmailTemplate, EmailTemplateDetail, EmailTemplateFilter, EmailTemplateVersion, EmailUsageItem } from '../types';

export async function listEmailTemplates(filters: EmailTemplateFilter = {}): Promise<EmailTemplate[]> {
  const sql = getPostgresClient();
  const { workspace = 'vi', event, audience, status, search } = filters;

  const conditions = [sql`t.workspace = ${workspace}`];

  if (event && (event as string) !== 'all') {
    conditions.push(sql`t.event_key = ${event}`);
  }
  if (audience && (audience as string) !== 'all') {
    conditions.push(sql`t.audience = ${audience}`);
  }
  if (status && (status as string) !== 'all') {
    conditions.push(sql`t.status = ${status}`);
  }
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(sql`(t.name ILIKE ${term} OR t.event_key ILIKE ${term} OR v.subject ILIKE ${term})`);
  }

  const whereClause = conditions.reduce((acc, curr) => sql`${acc} AND ${curr}`);

  const rows = await sql`
    SELECT 
      t.id::text,
      t.workspace,
      t.name,
      t.event_key as "event",
      t.audience,
      t.status,
      t.draft_version_id::text as "draftVersionId",
      t.active_version_id::text as "activeVersionId",
      t.updated_at as "updatedAt",
      t.updated_by as "updatedBy",
      t.activated_at as "activatedAt",
      t.activated_by as "activatedBy",
      COALESCE(v.subject, '') as subject,
      COALESCE(v.content, '') as content,
      COALESCE(v.version_number, 1) as version,
      (SELECT count(*)::int FROM cic_email_template_versions vcount WHERE vcount.template_id = t.id) as "versionsCount"
    FROM cic_email_templates t
    LEFT JOIN cic_email_template_versions v ON v.id = COALESCE(t.active_version_id, t.draft_version_id)
    WHERE ${whereClause}
    ORDER BY t.updated_at DESC
  `;

  return rows.map((r: any) => ({
    id: String(r.id),
    workspace: r.workspace,
    name: r.name,
    event: r.event,
    audience: r.audience,
    status: r.status,
    draftVersionId: r.draftVersionId,
    activeVersionId: r.activeVersionId,
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
    updatedBy: r.updatedBy,
    activatedAt: r.activatedAt ? new Date(r.activatedAt).toISOString() : null,
    activatedBy: r.activatedBy,
    subject: r.subject,
    content: r.content,
    version: Number(r.version) || 1,
    versionsCount: Number(r.versionsCount) || 1,
  }));
}

export async function getEmailTemplateDetail(id: string): Promise<EmailTemplateDetail | null> {
  const sql = getPostgresClient();

  const [t] = await sql`
    SELECT 
      t.id::text,
      t.workspace,
      t.name,
      t.event_key as "event",
      t.audience,
      t.status,
      t.draft_version_id::text as "draftVersionId",
      t.active_version_id::text as "activeVersionId",
      t.updated_at as "updatedAt",
      t.updated_by as "updatedBy",
      t.activated_at as "activatedAt",
      t.activated_by as "activatedBy",
      COALESCE(v.subject, '') as subject,
      COALESCE(v.content, '') as content,
      COALESCE(v.version_number, 1) as version
    FROM cic_email_templates t
    LEFT JOIN cic_email_template_versions v ON v.id = COALESCE(t.draft_version_id, t.active_version_id)
    WHERE t.id = ${id}
  `;

  if (!t) return null;

  const versionRows = await sql`
    SELECT 
      id::text,
      template_id::text as "templateId",
      version_number as "versionNumber",
      subject,
      content,
      created_by as "createdBy",
      created_at as "createdAt"
    FROM cic_email_template_versions
    WHERE template_id = ${id}
    ORDER BY version_number DESC
  `;

  const versions: EmailTemplateVersion[] = versionRows.map((v: any) => ({
    id: String(v.id),
    templateId: String(v.templateId),
    versionNumber: Number(v.versionNumber),
    subject: v.subject,
    content: v.content,
    createdBy: v.createdBy,
    createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
  }));

  return {
    id: String(t.id),
    workspace: t.workspace,
    name: t.name,
    event: t.event,
    audience: t.audience,
    status: t.status,
    draftVersionId: t.draftVersionId,
    activeVersionId: t.activeVersionId,
    updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : new Date().toISOString(),
    updatedBy: t.updatedBy,
    activatedAt: t.activatedAt ? new Date(t.activatedAt).toISOString() : null,
    activatedBy: t.activatedBy,
    subject: t.subject,
    content: t.content,
    version: Number(t.version) || 1,
    versions,
  };
}

export async function getEmailTemplateForEvent(
  workspace: string,
  eventKey: string,
  audience: 'customer' | 'internal' = 'customer'
): Promise<{ subject: string; content: string; templateId: string } | null> {
  const sql = getPostgresClient();

  const [row] = await sql`
    SELECT 
      t.id::text as "templateId",
      v.subject,
      v.content
    FROM cic_email_templates t
    JOIN cic_email_template_versions v ON v.id = t.active_version_id
    WHERE t.workspace = ${workspace} 
      AND t.event_key = ${eventKey} 
      AND t.audience = ${audience}
      AND t.status = 'active'
    ORDER BY t.updated_at DESC
    LIMIT 1
  `;

  if (!row) return null;
  return {
    templateId: String(row.templateId),
    subject: row.subject,
    content: row.content,
  };
}

export async function getEmailTemplateUsage(id: string): Promise<EmailUsageItem[]> {
  const sql = getPostgresClient();
  const usages: EmailUsageItem[] = [];

  try {
    // Check in cic_forms if table exists
    const hasForms = await sql`
      SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cic_forms'
    `;
    if (hasForms.length > 0) {
      // Check column
      const formCols = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'cic_forms' AND column_name IN ('email_template_id', 'admin_email_template_id', 'confirmation_email_template_id')
      `;
      if (formCols.length > 0) {
        const rows = await sql.unsafe(`
          SELECT id, name FROM cic_forms 
          WHERE email_template_id = '${id}' 
             OR admin_email_template_id = '${id}' 
             OR confirmation_email_template_id = '${id}'
        `);
        for (const r of rows) {
          usages.push({ id: r.id, name: r.name || `Biểu mẫu #${r.id}`, type: 'form' });
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    const hasCta = await sql`
      SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cic_cta'
    `;
    if (hasCta.length > 0) {
      const ctaCols = await sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'cic_cta' AND column_name = 'email_template_id'
      `;
      if (ctaCols.length > 0) {
        const rows = await sql.unsafe(`
          SELECT id, name FROM cic_cta WHERE email_template_id = '${id}'
        `);
        for (const r of rows) {
          usages.push({ id: r.id, name: r.name || `Nút CTA #${r.id}`, type: 'cta' });
        }
      }
    }
  } catch {
    // ignore
  }

  return usages;
}

// Backward-compatible export
export async function getEmailTemplatesData() {
  return listEmailTemplates({ workspace: 'vi' });
}
