'use server';

import { revalidatePath } from 'next/cache';
import { getPostgresClient } from '@/server/db/postgres';
import { requirePermission } from '@/server/auth/guards';
import { writeAuditEvent } from '@/server/audit/writer';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { functionSeoInputSchema, type FunctionSeoInput } from '../schemas/functionSeoInput';
import { redirectInputSchema, type RedirectInput } from '../schemas/redirectInput';

export async function updateFunctionSeo(input: FunctionSeoInput) {
  const principal = await requirePermission('function_seo', 'edit');
  const value = functionSeoInputSchema.parse(input);
  const sql = getPostgresClient();
  const table = value.locale === 'en' ? 'cic_config_modules_en' : 'cic_config_modules';

  // Read before state
  const [before] = await sql`
    SELECT id, module, view, value_seo_title, value_seo_keyword, value_seo_description, seo_indexable
    FROM ${sql(table)}
    WHERE id = ${Number(value.id)}
    LIMIT 1
  `;

  if (!before) {
    throw new Error(`Không tìm thấy cấu hình SEO module với ID: ${value.id}`);
  }

  // Update
  const [after] = await sql`
    UPDATE ${sql(table)}
    SET
      value_seo_title = ${value.title || null},
      value_seo_keyword = ${value.keywords || null},
      value_seo_description = ${value.description || null},
      seo_indexable = ${value.indexable}
    WHERE id = ${Number(value.id)}
    RETURNING id, module, view, value_seo_title, value_seo_keyword, value_seo_description, seo_indexable
  `;

  // Audit Logging
  await writeAuditEvent(principal, {
    action: AUDIT_ACTIONS.SEO_CONFIG_UPDATED,
    entityType: AUDIT_ENTITY_TYPES.SEO_CONFIG,
    entityId: String(value.id),
    entityTitle: value.title || String(before.module ?? 'Module SEO'),
    module: 'function_seo',
    workspace: value.locale,
    locale: value.locale,
    before,
    after,
    result: 'success',
    resultMessage: `Cập nhật cấu hình SEO cho module ${before.module}/${before.view} (${value.locale.toUpperCase()})`,
  });

  revalidatePath('/cms/function-seo');
  revalidatePath('/cms');
  return { ok: true };
}

export async function saveRedirect(input: RedirectInput) {
  const principal = await requirePermission('function_seo', 'edit');
  const value = redirectInputSchema.parse(input);
  const sql = getPostgresClient();

  const sourceNormalized = value.sourcePath.trim().toLowerCase();
  const targetNormalized = value.targetPath.trim().toLowerCase();

  if (sourceNormalized === targetNormalized) {
    throw new Error('Đường dẫn nguồn và đích không được giống nhau.');
  }

  // Check duplicate sourcePath
  const existingWithSource = await sql<{ id: number }[]>`
    SELECT id FROM cic_redirects 
    WHERE LOWER(TRIM(source_path)) = ${sourceNormalized}
      ${value.id ? sql`AND id != ${value.id}` : sql``}
    LIMIT 1
  `;

  if (existingWithSource.length > 0) {
    throw new Error('Đường dẫn nguồn đã tồn tại trong danh sách chuyển hướng.');
  }

  // Loop detection
  const allActive = await sql<{ id: number; source: string; target: string }[]>`
    SELECT id, LOWER(TRIM(source_path)) as source, LOWER(TRIM(target_path)) as target 
    FROM cic_redirects 
    WHERE is_active = true ${value.id ? sql`AND id != ${value.id}` : sql``}
  `;

  const redirectMap = new Map<string, string>();
  for (const r of allActive) {
    redirectMap.set(r.source, r.target);
  }
  if (value.isActive) {
    redirectMap.set(sourceNormalized, targetNormalized);
  }

  // Detect cycle starting from target
  let current: string | undefined = targetNormalized;
  const visited = new Set<string>();
  let hops = 0;

  while (current && hops < 25) {
    if (current === sourceNormalized) {
      throw new Error(`Phát hiện vòng lặp chuyển hướng: ${value.sourcePath} -> ... -> ${current}`);
    }
    if (visited.has(current)) {
      break;
    }
    visited.add(current);
    current = redirectMap.get(current);
    hops++;
  }

  if (value.id) {
    // Update existing
    const [before] = await sql`SELECT * FROM cic_redirects WHERE id = ${value.id} LIMIT 1`;
    if (!before) throw new Error('Không tìm thấy bản ghi redirect.');

    const [after] = await sql`
      UPDATE cic_redirects
      SET
        source_path = ${value.sourcePath.trim()},
        target_path = ${value.targetPath.trim()},
        status_code = ${value.statusCode},
        source = ${value.source || 'Thủ công'},
        is_active = ${value.isActive},
        note = ${value.note || null},
        updated_at = NOW()
      WHERE id = ${value.id}
      RETURNING *
    `;

    await writeAuditEvent(principal, {
      action: AUDIT_ACTIONS.REDIRECT_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.REDIRECT,
      entityId: String(value.id),
      entityTitle: `${value.sourcePath} -> ${value.targetPath}`,
      module: 'function_seo',
      workspace: 'global',
      before,
      after,
      result: 'success',
      resultMessage: `Cập nhật quy tắc chuyển hướng ${value.sourcePath} -> ${value.targetPath} (${value.statusCode})`,
    });

    revalidatePath('/cms/function-seo');
    return { ok: true, id: value.id };
  } else {
    // Insert new
    const [inserted] = await sql`
      INSERT INTO cic_redirects (source_path, target_path, status_code, source, is_active, note)
      VALUES (
        ${value.sourcePath.trim()},
        ${value.targetPath.trim()},
        ${value.statusCode},
        ${value.source || 'Thủ công'},
        ${value.isActive},
        ${value.note || null}
      )
      RETURNING *
    `;

    await writeAuditEvent(principal, {
      action: AUDIT_ACTIONS.REDIRECT_CREATED,
      entityType: AUDIT_ENTITY_TYPES.REDIRECT,
      entityId: String(inserted.id),
      entityTitle: `${value.sourcePath} -> ${value.targetPath}`,
      module: 'function_seo',
      workspace: 'global',
      after: inserted,
      result: 'success',
      resultMessage: `Tạo quy tắc chuyển hướng mới ${value.sourcePath} -> ${value.targetPath} (${value.statusCode})`,
    });

    revalidatePath('/cms/function-seo');
    return { ok: true, id: inserted.id };
  }
}

export async function toggleRedirect(id: number, active: boolean) {
  const principal = await requirePermission('function_seo', 'edit');
  const sql = getPostgresClient();

  const [before] = await sql`SELECT * FROM cic_redirects WHERE id = ${id} LIMIT 1`;
  if (!before) throw new Error('Không tìm thấy redirect.');

  const [after] = await sql`
    UPDATE cic_redirects
    SET is_active = ${active}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  await writeAuditEvent(principal, {
    action: AUDIT_ACTIONS.REDIRECT_UPDATED,
    entityType: AUDIT_ENTITY_TYPES.REDIRECT,
    entityId: String(id),
    entityTitle: `${before.source_path} -> ${before.target_path}`,
    module: 'function_seo',
    workspace: 'global',
    before,
    after,
    result: 'success',
    resultMessage: `Đổi trạng thái redirect sang ${active ? 'hoạt động' : 'tạm tắt'}`,
  });

  revalidatePath('/cms/function-seo');
  return { ok: true };
}

export async function deleteRedirect(id: number) {
  const principal = await requirePermission('function_seo', 'edit');
  const sql = getPostgresClient();

  const [before] = await sql`SELECT * FROM cic_redirects WHERE id = ${id} LIMIT 1`;
  if (!before) throw new Error('Không tìm thấy redirect.');

  await sql`DELETE FROM cic_redirects WHERE id = ${id}`;

  await writeAuditEvent(principal, {
    action: AUDIT_ACTIONS.REDIRECT_DELETED,
    entityType: AUDIT_ENTITY_TYPES.REDIRECT,
    entityId: String(id),
    entityTitle: `${before.source_path} -> ${before.target_path}`,
    module: 'function_seo',
    workspace: 'global',
    before,
    result: 'success',
    resultMessage: `Xóa quy tắc chuyển hướng ${before.source_path} -> ${before.target_path}`,
  });

  revalidatePath('/cms/function-seo');
  return { ok: true };
}
