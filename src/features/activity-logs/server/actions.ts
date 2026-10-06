'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { can, requirePermission } from '@/server/auth/guards';
import { getPostgresClient, withTransaction } from '@/server/db/postgres';
import { getDatabaseClient } from '@/server/db/foundation';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { getCmsActivityLogsPage } from './queries';
import { formatAuditLogsExcel } from './excel-export';

const exportInputSchema = z.object({ range: z.enum(['7days', '30days']), workspace: z.enum(['global', 'vi', 'en']).default('global') });
const idSchema = z.string().uuid();
type AuditExportStorage = ReturnType<Awaited<ReturnType<typeof getDatabaseClient>>['storage']['from']>;
async function removeExportArtifacts(storage: AuditExportStorage, paths: string[]) {
  if (!paths.length) return;
  const { error } = await storage.remove(paths);
  if (error) throw new Error(`Không thể xóa tệp xuất nhật ký: ${error.message}`);
}

export async function getAuditLogsPageAction(raw: unknown) {
  return getCmsActivityLogsPage(raw);
}

export async function createAuditExportAction(raw: unknown) {
  const principal = await requirePermission('audit', 'export');
  const input = exportInputSchema.parse(raw);
  const days = input.range === '7days' ? 7 : 30;
  const sql = getPostgresClient();
  const storage = (await getDatabaseClient()).storage.from('audit-exports');

  const expired = await sql`SELECT id,file_path FROM cic_audit_export_jobs WHERE requested_by=${principal.legacyUserId} AND expires_at < now() AND status='completed' LIMIT 100`;
  const expiredPaths = expired.flatMap((row) => row.file_path ? [String(row.file_path)] : []);
  await removeExportArtifacts(storage, expiredPaths);
  if (expired.length) await sql`UPDATE cic_audit_export_jobs SET status='expired' WHERE id IN ${sql(expired.map((row) => row.id))}`;

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const [job] = await sql`
    INSERT INTO cic_audit_export_jobs (requested_by,workspace,filter_payload,status,expires_at)
    VALUES (${principal.legacyUserId},${input.workspace},${sql.json({ range: input.range, summary: `Nhật ký ${days} ngày gần nhất` })},'processing',${expiresAt}) RETURNING id
  `;
  const jobId = String(job.id);
  const path = `${principal.legacyUserId}/${jobId}.xlsx`;

  try {
    const rows = await sql`SELECT occurred_at,actor_label,action_code,category,severity,entity_type,entity_id,entity_title,module,workspace,locale,result,result_message,correlation_id${can(principal,'audit','view_sensitive') ? sql`,ip_address,user_agent,before_data,after_data,redacted_fields` : sql``} FROM cic_activity_logs WHERE occurred_at >= now() - (${days} * interval '1 day') AND (${input.workspace}='global' OR workspace=${input.workspace}) ORDER BY occurred_at DESC LIMIT 50000`;

    const excelBuffer = formatAuditLogsExcel(rows as Array<Record<string, unknown>>, {
      range: input.range,
      days,
      workspace: input.workspace,
      totalRecords: rows.length,
    });

    const upload = await storage.upload(path, excelBuffer, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      upsert: false,
    });
    if (upload.error) throw upload.error;

    await withTransaction(async (tx) => {
      await tx`UPDATE cic_audit_export_jobs SET status='completed',total_records=${rows.length},file_path=${path},file_size_bytes=${excelBuffer.length},completed_at=now() WHERE id=${jobId}`;
      await writeAuditEvent(principal, {
        action: AUDIT_ACTIONS.EXPORT_CREATED,
        entityType: AUDIT_ENTITY_TYPES.AUDIT_EXPORT,
        entityId: jobId,
        entityTitle: `Audit export ${jobId}`,
        module: 'audit',
        workspace: input.workspace,
        result: 'success',
        metadata: { range: input.range, totalRecords: rows.length },
      }, tx);
    });

    revalidatePath('/cms', 'layout');
    return { id: jobId };
  } catch (error) {
    await storage.remove([path]);
    await sql`UPDATE cic_audit_export_jobs SET status='failed',error_message='Export failed',completed_at=now() WHERE id=${jobId}`;
    throw error;
  }
}

export async function getAuditExportDownloadUrlAction(rawId: unknown) {
  const principal = await requirePermission('audit', 'export');
  const id = idSchema.parse(rawId);
  const sql = getPostgresClient();
  const [job] = await sql`SELECT id,requested_by,file_path,status,expires_at,workspace FROM cic_audit_export_jobs WHERE id=${id}`;
  if (!job || job.status !== 'completed' || !job.file_path || new Date(job.expires_at) <= new Date()) {
    throw new Error('Tệp xuất không tồn tại hoặc đã hết hạn.');
  }

  const ext = String(job.file_path).endsWith('.xlsx') ? 'xlsx' : 'csv';
  const filename = `Audit_Export_${job.id}.${ext}`;
  const { data, error } = await (await getDatabaseClient()).storage.from('audit-exports').createSignedUrl(String(job.file_path), 60, { download: filename });
  if (error || !data) throw new Error('Không thể tạo liên kết tải an toàn.');

  await writeAuditEvent(principal, {
    action: AUDIT_ACTIONS.EXPORT_DOWNLOADED,
    entityType: AUDIT_ENTITY_TYPES.AUDIT_EXPORT,
    entityId: id,
    entityTitle: `Audit export ${id}`,
    module: 'audit',
    workspace: job.workspace,
    result: 'success',
  });

  return data.signedUrl;
}

export async function cleanupExpiredAuditExports() {
  const principal=await requirePermission('audit','export'); const sql=getPostgresClient(); const expired=await sql`SELECT id,file_path FROM cic_audit_export_jobs WHERE requested_by=${principal.legacyUserId} AND expires_at < now() AND status='completed' LIMIT 100`;
  const paths=expired.flatMap((row)=>row.file_path?[String(row.file_path)]:[]); await removeExportArtifacts((await getDatabaseClient()).storage.from('audit-exports'), paths);
  if(expired.length) await sql`UPDATE cic_audit_export_jobs SET status='expired' WHERE id IN ${sql(expired.map((row)=>row.id))}`;
  return expired.length;
}
