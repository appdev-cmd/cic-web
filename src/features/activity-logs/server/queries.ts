import 'server-only';
import { can, requirePermission } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import type { AuditEvent, AuditGovernanceData, AuditListPage, AuditListQuery, ExportJob } from '../types';
import { z } from 'zod';

const LIST_FIELDS = 'id,occurred_at,actor_id,actor_label,action_code,category,severity,is_sensitive,entity_type,entity_id,entity_title,module,workspace,locale,result,result_message,session_id,correlation_id,source_app,environment,ip_address,user_agent,http_method,endpoint,execution_time_ms,before_data,after_data,redacted_fields';
const JOB_FIELDS = 'id,requested_at,requested_by,workspace,filter_payload,status,total_records,file_size_bytes,expires_at,error_message,completed_at';
const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => value == null ? '' : String(value);
const timestamp = (value: unknown) => {
  const date = value instanceof Date ? value : new Date(text(value));
  if (Number.isNaN(date.getTime())) return text(value);
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(date);
};

function mapEvent(row: Record<string, unknown>, sensitive: boolean): AuditEvent {
  const before = object(row.before_data); const afterEnvelope = object(row.after_data); const after = object('value' in afterEnvelope ? afterEnvelope.value : afterEnvelope);
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  return {
    id: text(row.id), timestamp: timestamp(row.occurred_at),
    actor: { id: text(row.actor_id), name: text(row.actor_label) || 'Hệ thống', email: '', role: '', ipAddress: sensitive ? text(row.ip_address) : '[REDACTED]', userAgent: sensitive ? text(row.user_agent) : '[REDACTED]' },
    action: { code: text(row.action_code), label: text(row.action_code), category: text(row.category) as AuditEvent['action']['category'], severity: text(row.severity) as AuditEvent['action']['severity'], isSensitive: Boolean(row.is_sensitive) },
    target: { type: text(row.entity_type), id: text(row.entity_id), title: text(row.entity_title), module: text(row.module) },
    scope: { siteId: text(row.workspace), siteName: text(row.workspace), locale: text(row.locale) || undefined }, result: row.result as AuditEvent['result'], resultMessage: text(row.result_message) || undefined,
    context: { sessionId: sensitive ? text(row.session_id) : '[REDACTED]', correlationId: text(row.correlation_id), sourceApp: text(row.source_app), environment: row.environment === 'production' ? 'production' : 'staging' },
    changes: keys.map((field) => ({ field, oldValue: sensitive ? before[field] : '[REDACTED]', newValue: sensitive ? after[field] : '[REDACTED]', isRedacted: !sensitive || (row.redacted_fields as unknown[] | null)?.some((item) => text(item).includes(field)) })),
    technicalRef: sensitive ? { httpMethod: text(row.http_method) || undefined, endpoint: text(row.endpoint) || undefined, executionTimeMs: row.execution_time_ms == null ? undefined : Number(row.execution_time_ms) } : undefined,
  };
}

function mapJob(row: Record<string, unknown>): ExportJob {
  const filter = object(row.filter_payload); const bytes = row.file_size_bytes == null ? undefined : Number(row.file_size_bytes);
  return { id: text(row.id), requestedAt: text(row.requested_at), requestedBy: text(row.requested_by), scopeName: text(row.workspace), dateRange: text(filter.range), filterSummary: text(filter.summary), status: row.status as ExportJob['status'], totalRecords: row.total_records == null ? undefined : Number(row.total_records), fileSizeMb: bytes == null ? undefined : Number((bytes / 1_048_576).toFixed(2)), expiresAt: text(row.expires_at) || undefined, downloadUrl: row.status === 'completed' ? `/api/cms/audit-exports/${row.id}` : undefined };
}

export const auditListQuerySchema = z.object({
  page: z.number().int().min(1).max(100000).default(1),
  pageSize: z.number().int().min(10).max(100).default(20),
  search: z.string().trim().max(200).default(''),
  date: z.enum(['today', '7days', '30days', 'all']).default('30days'),
  severity: z.enum(['all', 'low', 'medium', 'high', 'critical']).default('all'),
  result: z.enum(['all', 'success', 'failed', 'partial', 'denied']).default('all'),
  category: z.enum(['all', 'sensitive', 'permissions_users', 'config_publish', 'export_jobs']).default('all'),
});

const initialQuery: AuditListQuery = { page: 1, pageSize: 20, search: '', date: '30days', severity: 'all', result: 'all', category: 'all' };
function startOfTodayInVietnam() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(`${value.year}-${value.month}-${value.day}T00:00:00+07:00`);
}

async function queryAuditPage(principal: Awaited<ReturnType<typeof requirePermission>>, input: AuditListQuery): Promise<AuditListPage> {
  const sql = getPostgresClient();
  const searchPattern = `%${input.search}%`;
  const since = input.date === 'today'
    ? startOfTodayInVietnam()
    : input.date === '7days' ? new Date(Date.now() - 7 * 86400000)
      : input.date === '30days' ? new Date(Date.now() - 30 * 86400000) : null;
  const offset = (input.page - 1) * input.pageSize;
  const filters = sql`
    (${input.search} = '' OR actor_label ILIKE ${searchPattern} OR action_code ILIKE ${searchPattern} OR entity_title ILIKE ${searchPattern} OR id::text ILIKE ${searchPattern})
    AND (${since}::timestamptz IS NULL OR occurred_at >= ${since})
    AND (${input.severity} = 'all' OR severity = ${input.severity})
    AND (${input.result} = 'all' OR result = ${input.result})
    AND (${input.category} = 'all' OR (${input.category} = 'sensitive' AND is_sensitive = true) OR category = ${input.category})
  `;
  const [events, countRows] = await Promise.all([
    sql`SELECT ${sql.unsafe(LIST_FIELDS)} FROM cic_activity_logs WHERE ${filters} ORDER BY occurred_at DESC LIMIT ${input.pageSize} OFFSET ${offset}`,
    sql`SELECT count(*)::int AS total FROM cic_activity_logs WHERE ${filters}`,
  ]);
  const sensitive = can(principal, 'audit', 'view_sensitive');
  return { items: events.map((row) => mapEvent(row as Record<string, unknown>, sensitive)), total: Number(countRows[0]?.total ?? 0) };
}

export async function getCmsActivityLogsPage(raw: unknown): Promise<AuditListPage> {
  const principal = await requirePermission('audit', 'view');
  return queryAuditPage(principal, auditListQuerySchema.parse(raw));
}

export async function getCmsActivityLogsData(): Promise<AuditGovernanceData> {
  const principal = await requirePermission('audit', 'view'); const sql = getPostgresClient();
  const canExport = can(principal, 'audit', 'export');
  const [page, jobs] = await Promise.all([
    queryAuditPage(principal, initialQuery),
    canExport
      ? sql`SELECT ${sql.unsafe(JOB_FIELDS)} FROM cic_audit_export_jobs WHERE requested_by=${principal.legacyUserId} ORDER BY requested_at DESC LIMIT 50`
      : Promise.resolve([]),
  ]);
  return { auditLogs: page.items, auditTotal: page.total, exportJobs: jobs.map((row) => mapJob(row as Record<string, unknown>)) };
}
