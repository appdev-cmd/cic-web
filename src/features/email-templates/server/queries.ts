import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { AppError } from '@/server/errors';
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

interface FormUsageRow {
  id: string;
  admin_name: string | null;
  title: string | null;
}

interface CtaUsageRow {
  id: string;
  admin_name: string | null;
  display_text: string | null;
}

export function isValidEmailTemplateId(id: unknown): id is string | number {
  const rawId = typeof id === 'number' ? String(id) : typeof id === 'string' ? id.trim() : '';
  if (!rawId || !/^\d+$/.test(rawId)) return false;
  try {
    const val = BigInt(rawId);
    return val > 0n && val <= 9223372036854775807n;
  } catch {
    return false;
  }
}

export async function getEmailTemplateUsage(id: string | number): Promise<EmailUsageItem[]> {
  if (!isValidEmailTemplateId(id)) {
    throw new AppError('Invalid email template ID.', 'VALIDATION_ERROR');
  }

  const templateIdStr = typeof id === 'number' ? String(id) : id.trim();
  const sql = getPostgresClient();

  const [formRows, ctaRows] = await Promise.all([
    sql<FormUsageRow[]>`
      SELECT id::text, admin_name, title
      FROM cic_forms
      WHERE deleted_at IS NULL
        AND (
          admin_email_template_id = ${templateIdStr}::bigint
          OR confirmation_email_template_id = ${templateIdStr}::bigint
        )
      ORDER BY id ASC
    `,
    sql<CtaUsageRow[]>`
      SELECT id::text, admin_name, display_text
      FROM cic_ctas
      WHERE deleted_at IS NULL
        AND email_template_id = ${templateIdStr}::bigint
      ORDER BY id ASC
    `,
  ]);

  const usages: EmailUsageItem[] = [];

  for (const r of formRows) {
    const name = r.admin_name?.trim() || r.title?.trim() || `Biểu mẫu #${r.id}`;
    usages.push({ id: String(r.id), name, type: 'form' });
  }

  for (const r of ctaRows) {
    const name = r.admin_name?.trim() || r.display_text?.trim() || `Nút CTA #${r.id}`;
    usages.push({ id: String(r.id), name, type: 'cta' });
  }

  return usages;
}

// Backward-compatible export
export async function getEmailTemplatesData() {
  return listEmailTemplates({ workspace: 'vi' });
}
