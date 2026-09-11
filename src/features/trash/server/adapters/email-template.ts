import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const snapshotSchema = z.object({
  version: z.literal(1),
  workspace: z.enum(['vi', 'en']),
  record: z.object({
    id: z.string(),
    workspace: z.enum(['vi', 'en']),
    name: z.string(),
    event_key: z.string(),
    audience: z.string(),
    status: z.string(),
    draft_version_id: z.string().nullable().optional(),
    active_version_id: z.string().nullable().optional(),
    created_by: z.number().nullable().optional(),
    updated_by: z.number().nullable().optional(),
    activated_by: z.number().nullable().optional(),
    activated_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }),
  versions: z.array(
    z.object({
      id: z.string(),
      template_id: z.string(),
      version_number: z.number(),
      subject: z.string(),
      content: z.string(),
      created_by: z.number().nullable().optional(),
      created_at: z.string().optional(),
    })
  ),
});

export type EmailTemplateTrashSnapshot = z.infer<typeof snapshotSchema>;

export async function moveEmailTemplateToTrash(
  sql: Sql,
  id: string,
  actorId: number
): Promise<{ trashId: string; title: string; workspace: 'vi' | 'en' }> {
  // 1. Fetch template row
  const [tmpl] = await sql`
    SELECT 
      id::text, workspace, name, event_key, audience, status,
      draft_version_id::text, active_version_id::text,
      created_by, updated_by, activated_by,
      activated_at::text, created_at::text, updated_at::text
    FROM cic_email_templates
    WHERE id = ${id}
    FOR UPDATE
  `;
  if (!tmpl) {
    throw new Error('Không tìm thấy mẫu email để chuyển vào Thùng rác.');
  }

  // 2. Fetch versions
  const versions = await sql`
    SELECT 
      id::text, template_id::text, version_number,
      subject, content, created_by, created_at::text
    FROM cic_email_template_versions
    WHERE template_id = ${id}
    ORDER BY version_number ASC
  `;

  const snapshot: EmailTemplateTrashSnapshot = snapshotSchema.parse({
    version: 1,
    workspace: tmpl.workspace,
    record: {
      id: String(tmpl.id),
      workspace: tmpl.workspace,
      name: String(tmpl.name),
      event_key: String(tmpl.event_key),
      audience: String(tmpl.audience),
      status: String(tmpl.status),
      draft_version_id: tmpl.draft_version_id ? String(tmpl.draft_version_id) : null,
      active_version_id: tmpl.active_version_id ? String(tmpl.active_version_id) : null,
      created_by: tmpl.created_by != null ? Number(tmpl.created_by) : null,
      updated_by: tmpl.updated_by != null ? Number(tmpl.updated_by) : null,
      activated_by: tmpl.activated_by != null ? Number(tmpl.activated_by) : null,
      activated_at: tmpl.activated_at ? String(tmpl.activated_at) : null,
      created_at: tmpl.created_at ? String(tmpl.created_at) : undefined,
      updated_at: tmpl.updated_at ? String(tmpl.updated_at) : undefined,
    },
    versions: versions.map((v: any) => ({
      id: String(v.id),
      template_id: String(v.template_id),
      version_number: Number(v.version_number),
      subject: String(v.subject || ''),
      content: String(v.content || ''),
      created_by: v.created_by != null ? Number(v.created_by) : null,
      created_at: v.created_at ? String(v.created_at) : undefined,
    })),
  });

  const title = snapshot.record.name;
  const entityType = snapshot.workspace === 'en' ? 'email_template_en' : 'email_template';

  // 3. Insert into cic_trash_items
  const [trash] = await sql`
    INSERT INTO cic_trash_items (
      workspace, entity_type, entity_id, module,
      title_snapshot, payload_snapshot, original_url,
      status, deleted_by, purge_after, restore_state
    ) VALUES (
      ${snapshot.workspace},
      ${entityType},
      ${String(id)},
      'email_templates',
      ${title},
      ${sql.json(snapshot as never)},
      '/cms/email-templates',
      'trashed',
      ${actorId},
      now() + interval '30 days',
      'draft'
    ) RETURNING id
  `;

  // 4. Disconnect and delete from active tables
  await sql`UPDATE cic_email_templates SET draft_version_id = NULL, active_version_id = NULL WHERE id = ${id}`;
  await sql`DELETE FROM cic_email_template_versions WHERE template_id = ${id}`;
  await sql`DELETE FROM cic_email_templates WHERE id = ${id}`;

  return {
    trashId: String(trash.id),
    title,
    workspace: snapshot.workspace,
  };
}

async function inspect(sql: Sql, raw: unknown): Promise<TrashInspection> {
  const parsed = snapshotSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 'schema_mismatch', details: 'Snapshot mẫu email không hợp lệ.', restoreModes: [] };
  }

  const { record } = parsed.data;
  const existing = await sql`SELECT 1 FROM cic_email_templates WHERE id = ${record.id}`;
  if (existing.length > 0) {
    return { status: 'conflict', details: 'ID mẫu email đã tồn tại trong hệ thống.', restoreModes: [] };
  }

  return { status: 'clear', details: 'Sẵn sàng phục hồi về bản nháp.', restoreModes: ['as_draft'] };
}

async function restore(sql: Sql, raw: unknown, mode: TrashRestoreMode) {
  const snapshot = snapshotSchema.parse(raw);
  const check = await inspect(sql, snapshot);
  if (!check.restoreModes.includes(mode)) {
    throw new Error(check.details);
  }

  const { record, versions } = snapshot;

  // 1. Re-insert template as draft
  await sql`
    INSERT INTO cic_email_templates (
      id, workspace, name, event_key, audience, status,
      created_by, updated_by, created_at, updated_at
    ) OVERRIDING SYSTEM VALUE VALUES (
      ${record.id}, ${record.workspace}, ${record.name}, ${record.event_key}, ${record.audience}, 'draft',
      ${record.created_by ?? null}, ${record.updated_by ?? null},
      ${record.created_at ? new Date(record.created_at) : sql`now()`}, now()
    )
  `;

  // 2. Re-insert versions
  let latestVersionId: string | null = null;
  for (const ver of versions) {
    const [insertedVer] = await sql`
      INSERT INTO cic_email_template_versions (
        id, template_id, version_number, subject, content, created_by, created_at
      ) OVERRIDING SYSTEM VALUE VALUES (
        ${ver.id}, ${record.id}, ${ver.version_number}, ${ver.subject}, ${ver.content},
        ${ver.created_by ?? null}, ${ver.created_at ? new Date(ver.created_at) : sql`now()`}
      ) RETURNING id::text
    `;
    latestVersionId = insertedVer.id;
  }

  // 3. Connect draft pointer to latest version
  if (latestVersionId) {
    await sql`
      UPDATE cic_email_templates
      SET draft_version_id = ${latestVersionId}, active_version_id = NULL
      WHERE id = ${record.id}
    `;
  }

  return {
    title: record.name,
    restoredEntityId: record.id,
    restoredState: 'draft' as const,
  };
}

const createAdapter = (workspace: 'vi' | 'en'): TrashEntityAdapter => ({
  entityType: workspace === 'en' ? 'email_template_en' : 'email_template',
  module: 'email_templates',
  label: 'Mẫu email',
  itemType: 'Mẫu email',
  workspace,
  restoreState: 'draft',
  supportsPurge: true,
  getRevalidationTargets: () => [{ path: '/cms/email-templates' }],
  parseSnapshot: (value) => snapshotSchema.parse(value),
  inspect,
  restore,
  purge: async () => undefined,
  presentSnapshot: (value) => {
    const snapshot = snapshotSchema.parse(value);
    return {
      version: snapshot.version,
      title: snapshot.record.name,
      event: snapshot.record.event_key,
      versionsCount: snapshot.versions.length,
    };
  },
});

export const emailTemplateTrashAdapter = createAdapter('vi');
export const emailTemplateEnTrashAdapter = createAdapter('en');
