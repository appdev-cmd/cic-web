import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { CtaEntity, CtaFilterParams, CtaWorkspace } from '../types';

interface RawCtaRow {
  id: number | string;
  workspace: string;
  code: string;
  is_system: boolean;
  admin_name: string;
  display_text: string;
  description: string | null;
  icon: string | null;
  style_variant: string;
  action_type: string;
  action_config: any;
  form_id: number | string | null;
  media_asset_id: number | string | null;
  email_template_id: number | string | null;
  status: string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator_name?: string | null;
}

function mapRowToCtaEntity(row: RawCtaRow): CtaEntity {
  const isSystem = Boolean(row.is_system);
  const actionConfig = typeof row.action_config === 'object' && row.action_config !== null
    ? { ...row.action_config }
    : {};

  if (row.form_id != null) actionConfig.formId = String(row.form_id);
  if (row.media_asset_id != null) actionConfig.fileId = String(row.media_asset_id);
  if (row.email_template_id != null) actionConfig.emailTemplateId = String(row.email_template_id);

  return {
    id: String(row.id),
    workspace: row.workspace as CtaWorkspace,
    code: row.code,
    isSystem,
    adminName: row.admin_name,
    displayText: row.display_text,
    description: row.description ?? undefined,
    icon: row.icon ?? undefined,
    styleVariant: (row.style_variant as any) || 'primary',
    actionType: row.action_type as any,
    actionConfig,
    formId: row.form_id != null ? String(row.form_id) : null,
    mediaAssetId: row.media_asset_id != null ? String(row.media_asset_id) : null,
    emailTemplateId: row.email_template_id != null ? String(row.email_template_id) : null,
    status: (row.status as any) || 'draft',
    createdBy: row.creator_name || (isSystem ? 'Hệ thống' : 'Người dùng'),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).toISOString() : null,
    usedByCount: 0,
    usedByPages: [],
    analytics: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    governance: {
      origin: isSystem ? 'system' : 'custom',
      allowedPlacements: isSystem ? ['fixed_section'] : ['rich_text'],
      fixedPlacementKeys: isSystem ? [`cta.${row.code}`] : undefined,
    },
  };
}

export async function listCtas(params: CtaFilterParams): Promise<CtaEntity[]> {
  const sql = getPostgresClient();
  const workspace = params.workspace || 'vi';

  const rows = await sql<RawCtaRow[]>`
    SELECT 
      c.*,
      COALESCE(u.full_name, u.username) AS creator_name
    FROM cic_ctas c
    LEFT JOIN cic_users u ON u.id = c.created_by
    WHERE c.workspace = ${workspace}
      AND c.deleted_at IS NULL
      ${params.status ? sql`AND c.status = ${params.status}` : sql``}
      ${params.actionType ? sql`AND c.action_type = ${params.actionType}` : sql``}
      ${params.search ? sql`AND (
        lower(c.admin_name) LIKE lower(${`%${params.search}%`})
        OR lower(c.display_text) LIKE lower(${`%${params.search}%`})
        OR lower(c.code) LIKE lower(${`%${params.search}%`})
      )` : sql``}
      ${params.dateFrom ? sql`AND c.created_at >= ${params.dateFrom}::timestamptz` : sql``}
      ${params.dateTo ? sql`AND c.created_at <= ${`${params.dateTo} 23:59:59`}::timestamptz` : sql``}
    ORDER BY 
      ${params.sortBy === 'oldest' ? sql`c.created_at ASC` :
        params.sortBy === 'name' ? sql`c.admin_name ASC` :
        sql`c.updated_at DESC`}
  `;

  return rows.map(mapRowToCtaEntity);
}

export async function getCtaById(id: string | number): Promise<CtaEntity | null> {
  const sql = getPostgresClient();
  const numId = Number(id);
  if (!Number.isSafeInteger(numId) || numId <= 0) return null;

  const [row] = await sql<RawCtaRow[]>`
    SELECT 
      c.*,
      COALESCE(u.full_name, u.username) AS creator_name
    FROM cic_ctas c
    LEFT JOIN cic_users u ON u.id = c.created_by
    WHERE c.id = ${numId}
    LIMIT 1
  `;

  if (!row) return null;
  return mapRowToCtaEntity(row);
}

export async function getCtaByCode(workspace: CtaWorkspace, code: string): Promise<CtaEntity | null> {
  const sql = getPostgresClient();
  const [row] = await sql<RawCtaRow[]>`
    SELECT 
      c.*,
      COALESCE(u.full_name, u.username) AS creator_name
    FROM cic_ctas c
    LEFT JOIN cic_users u ON u.id = c.created_by
    WHERE c.workspace = ${workspace}
      AND c.code = ${code}
      AND c.deleted_at IS NULL
    LIMIT 1
  `;

  if (!row) return null;
  return mapRowToCtaEntity(row);
}
