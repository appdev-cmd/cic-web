import 'server-only';
import { withTransaction } from '@/server/db/postgres';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type { CmsPrincipal } from '@/server/auth/guards';
import type { CreateCtaInput, UpdateCtaInput, CtaStatus, CtaEntity } from '../types';
import { getCtaById } from './queries';

function parseId(val: unknown): number | null {
  if (val == null) return null;
  const n = Number(val);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export async function createCta(input: CreateCtaInput, actor: CmsPrincipal): Promise<CtaEntity> {
  const result = await withTransaction(async (sql) => {
    // 1. Verify code uniqueness in workspace
    const [existing] = await sql`
      SELECT id FROM cic_ctas 
      WHERE workspace = ${input.workspace} AND code = ${input.code} AND deleted_at IS NULL
      LIMIT 1
    `;
    if (existing) {
      throw new Error(`Mã CTA "${input.code}" đã tồn tại trong workspace ${input.workspace.toUpperCase()}.`);
    }

    const formId = parseId(input.formId || input.actionConfig?.formId);
    const mediaAssetId = parseId(input.mediaAssetId || input.actionConfig?.fileId);
    const emailTemplateId = parseId(input.emailTemplateId || input.actionConfig?.emailTemplateId);

    // Clean action_config of foreign keys before storing
    const cleanedConfig = { ...input.actionConfig };
    delete (cleanedConfig as any).formId;
    delete (cleanedConfig as any).fileId;
    delete (cleanedConfig as any).emailTemplateId;

    const [ctaRow] = await sql`
      INSERT INTO cic_ctas (
        workspace,
        code,
        is_system,
        admin_name,
        display_text,
        description,
        icon,
        style_variant,
        action_type,
        action_config,
        form_id,
        media_asset_id,
        email_template_id,
        status,
        created_by,
        created_at,
        updated_at
      ) VALUES (
        ${input.workspace},
        ${input.code},
        false,
        ${input.adminName},
        ${input.displayText},
        ${input.description || null},
        ${input.icon || null},
        ${input.styleVariant || 'primary'},
        ${input.actionType},
        ${sql.json(cleanedConfig)},
        ${formId},
        ${mediaAssetId},
        ${emailTemplateId},
        ${input.status || 'draft'},
        ${actor.legacyUserId || null},
        now(),
        now()
      )
      RETURNING id
    `;

    const newId = Number(ctaRow.id);

    // Write audit log
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.CTA_CREATED,
        entityType: AUDIT_ENTITY_TYPES.CTA,
        entityId: String(newId),
        entityTitle: input.adminName,
        module: 'cta',
        workspace: input.workspace,
        result: 'success',
        after: {
          code: input.code,
          actionType: input.actionType,
          status: input.status || 'draft',
        },
      },
      sql
    );

    return newId;
  });

  const created = await getCtaById(result);
  if (!created) {
    throw new Error('Không thể tải CTA vừa tạo.');
  }
  return created;
}

export async function updateCta(id: string | number, input: UpdateCtaInput, actor: CmsPrincipal): Promise<CtaEntity> {
  const numId = Number(id);
  if (!Number.isSafeInteger(numId) || numId <= 0) {
    throw new Error('ID CTA không hợp lệ.');
  }

  const existing = await getCtaById(numId);
  if (!existing) {
    throw new Error('Không tìm thấy CTA.');
  }

  const formId = parseId(input.formId || input.actionConfig?.formId);
  const mediaAssetId = parseId(input.mediaAssetId || input.actionConfig?.fileId);
  const emailTemplateId = parseId(input.emailTemplateId || input.actionConfig?.emailTemplateId);

  const cleanedConfig = { ...input.actionConfig };
  delete (cleanedConfig as any).formId;
  delete (cleanedConfig as any).fileId;
  delete (cleanedConfig as any).emailTemplateId;

  await withTransaction(async (sql) => {
    await sql`
      UPDATE cic_ctas
      SET
        admin_name = ${input.adminName},
        display_text = ${input.displayText},
        description = ${input.description || null},
        icon = ${input.icon || null},
        style_variant = ${input.styleVariant || 'primary'},
        action_type = ${input.actionType},
        action_config = ${sql.json(cleanedConfig)},
        form_id = ${formId},
        media_asset_id = ${mediaAssetId},
        email_template_id = ${emailTemplateId},
        ${input.status ? sql`status = ${input.status},` : sql``}
        updated_at = now()
      WHERE id = ${numId}
    `;

    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.CTA_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.CTA,
        entityId: String(numId),
        entityTitle: input.adminName,
        module: 'cta',
        workspace: existing.workspace,
        result: 'success',
        before: {
          code: existing.code,
          actionType: existing.actionType,
          status: existing.status,
        },
        after: {
          code: existing.code,
          actionType: input.actionType,
          status: input.status || existing.status,
        },
      },
      sql
    );
  });

  const updated = await getCtaById(numId);
  if (!updated) {
    throw new Error('Không thể tải CTA sau cập nhật.');
  }
  return updated;
}

export async function updateCtaStatus(id: string | number, status: CtaStatus, actor: CmsPrincipal): Promise<CtaEntity> {
  const numId = Number(id);
  if (!Number.isSafeInteger(numId) || numId <= 0) {
    throw new Error('ID CTA không hợp lệ.');
  }

  const existing = await getCtaById(numId);
  if (!existing) {
    throw new Error('Không tìm thấy CTA.');
  }

  await withTransaction(async (sql) => {
    await sql`
      UPDATE cic_ctas
      SET status = ${status}, updated_at = now()
      WHERE id = ${numId}
    `;

    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.CTA_STATUS_CHANGED,
        entityType: AUDIT_ENTITY_TYPES.CTA,
        entityId: String(numId),
        entityTitle: existing.adminName,
        module: 'cta',
        workspace: existing.workspace,
        result: 'success',
        before: {
          status: existing.status,
        },
        after: {
          status,
        },
      },
      sql
    );
  });

  const updated = await getCtaById(numId);
  return updated!;
}

export async function deleteCtas(ids: (string | number)[], actor: CmsPrincipal): Promise<{ count: number }> {
  const validIds = ids
    .map((x) => Number(x))
    .filter((n) => Number.isSafeInteger(n) && n > 0);

  if (validIds.length === 0) return { count: 0 };

  let deletedCount = 0;

  await withTransaction(async (sql) => {
    // 1. Check for system CTAs
    const systemRows = await sql`
      SELECT id, code, admin_name FROM cic_ctas 
      WHERE id IN ${sql(validIds)} AND is_system = true
    `;
    if (systemRows.length > 0) {
      const names = systemRows.map((r) => r.admin_name).join(', ');
      throw new Error(`Không được phép xóa CTA hệ thống: ${names}.`);
    }

    // 2. Fetch records for audit
    const rows = await sql`
      SELECT id, admin_name, code, workspace FROM cic_ctas 
      WHERE id IN ${sql(validIds)} AND deleted_at IS NULL
    `;

    // 3. Soft delete
    const result = await sql`
      UPDATE cic_ctas
      SET deleted_at = now(), updated_at = now()
      WHERE id IN ${sql(validIds)} AND deleted_at IS NULL
    `;

    deletedCount = result.count;

    for (const r of rows) {
      await writeAuditEvent(
        actor,
        {
          action: AUDIT_ACTIONS.CTA_TRASHED,
          entityType: AUDIT_ENTITY_TYPES.CTA,
          entityId: String(r.id),
          entityTitle: r.admin_name,
          module: 'cta',
          workspace: r.workspace as any,
          result: 'success',
          metadata: {
            code: r.code,
          },
        },
        sql
      );
    }
  });

  return { count: deletedCount };
}
