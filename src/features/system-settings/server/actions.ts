'use server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { withTransaction } from '@/server/db/postgres';
import { saveSettingsSchema } from '../schemas/settingsInput';
import { saveSystemSettings } from './repository';

export async function saveCmsSystemSettingsAction(payload: unknown) {
  const actor = await requirePermission('settings', 'edit'); const input = saveSettingsSchema.parse(payload);
  await withTransaction(async (tx) => {
    await saveSystemSettings(input, actor.legacyUserId, tx);
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.SETTINGS_UPDATED, entityType: AUDIT_ENTITY_TYPES.SYSTEM_SETTINGS, entityId: 'global', entityTitle: 'Cấu hình hệ thống', module: 'settings', workspace: 'global', result: 'success', after: { changes: input.changes.map(({ key, scopeId }) => ({ key, scopeId })), branchWorkspace: input.branches?.workspace, branchCount: input.branches?.items.length } }, tx);
  });
  revalidatePath('/cms', 'layout'); revalidatePath('/', 'layout');
  return { ok: true } as const;
}
