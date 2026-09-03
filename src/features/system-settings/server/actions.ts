'use server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/server/auth/guards';
import { saveSettingsSchema } from '../schemas/settingsInput';
import { saveSystemSettings } from './repository';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { withTransaction } from '@/server/db/postgres';
export async function saveCmsSystemSettingsAction(payload: unknown) {
  const actor = await requirePermission('settings', 'edit'); const input = saveSettingsSchema.parse(payload);
  await withTransaction(async (tx) => {
    await saveSystemSettings(input, actor.legacyUserId, tx);
    await writeAuditEvent(actor, { action: AUDIT_ACTIONS.SETTINGS_UPDATED, entityType: AUDIT_ENTITY_TYPES.SYSTEM_SETTINGS, entityId: 'global', entityTitle: 'Cấu hình hệ thống', module: 'settings', workspace: 'global', result: 'success', after: { changes: input.changes.map((change) => ({ settingId: change.settingId, scopeId: change.scopeId, value: change.value })), branches: input.branches } }, tx);
  });
  revalidatePath('/cms', 'layout'); revalidatePath('/', 'layout');
}
