import 'server-only';
import { z } from 'zod';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import { AUDIT_WORKSPACES, auditActionRegistry, type AuditAction, type AuditEntityType, type AuditWorkspace } from './registry';
import { redactAuditValue } from './redaction';

const inputSchema = z.object({
  action: z.string().refine((value): value is AuditAction => value in auditActionRegistry),
  entityType: z.string().min(1).max(100), entityId: z.string().min(1).max(255), entityTitle: z.string().max(500),
  module: z.string().min(1).max(100), workspace: z.enum(AUDIT_WORKSPACES), locale: z.string().max(20).nullable().optional(),
  result: z.enum(['success', 'failed', 'partial', 'denied']).default('success'), resultMessage: z.string().max(5000).nullable().optional(),
  before: z.unknown().optional(), after: z.unknown().optional(), metadata: z.record(z.string(), z.unknown()).optional(),
});
export type AuditWriteInput = Omit<z.infer<typeof inputSchema>, 'action' | 'entityType' | 'workspace'> & { action: AuditAction; entityType: AuditEntityType; workspace: AuditWorkspace };

export async function writeAuditEvent(principal: CmsPrincipal, rawInput: AuditWriteInput, transaction?: Sql): Promise<string> {
  const input = inputSchema.parse(rawInput);
  const contract = auditActionRegistry[input.action];
  if (contract.entityType !== input.entityType) throw new Error('Audit action/entity contract mismatch.');
  const before = redactAuditValue(input.before ?? null); const after = redactAuditValue(input.after ?? null);
  const metadata = redactAuditValue(input.metadata ?? {});
  const textFields = redactAuditValue({ entityTitle: input.entityTitle, resultMessage: input.resultMessage ?? null });
  const sanitizedText = textFields.value as { entityTitle: string; resultMessage: string | null };
  const redactedFields = [...new Set([...before.redactedFields.map((x) => `before.${x}`), ...after.redactedFields.map((x) => `after.${x}`), ...metadata.redactedFields.map((x) => `metadata.${x}`), ...textFields.redactedFields])];
  const sql = transaction ?? getPostgresClient();
  const [row] = await sql`
    INSERT INTO cic_activity_logs
      (actor_id, actor_label, action_code, category, severity, is_sensitive, entity_type, entity_id, entity_title, module, workspace, locale, result, result_message, source_app, environment, before_data, after_data, redacted_fields)
    VALUES
      (${principal.legacyUserId}, ${principal.fullName || principal.username || principal.email}, ${input.action}, ${contract.category}, ${contract.severity}, ${redactedFields.length > 0}, ${input.entityType}, ${input.entityId}, ${sanitizedText.entityTitle}, ${input.module}, ${input.workspace}, ${input.locale ?? null}, ${input.result}, ${sanitizedText.resultMessage}, 'cms-next', ${process.env.NODE_ENV === 'production' ? 'production' : 'development'}, ${sql.json(before.value as never)}, ${sql.json({ value: after.value, metadata: metadata.value } as never)}, ${sql.array(redactedFields)}::text[])
    RETURNING id
  `;
  if (!row?.id) throw new Error('Audit event was not persisted.');
  return String(row.id);
}
