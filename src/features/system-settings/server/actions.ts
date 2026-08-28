'use server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/server/auth/guards';
import { saveSettingsSchema } from '../schemas/settingsInput';
import { saveSystemSettings } from './repository';
export async function saveCmsSystemSettingsAction(payload: unknown) { const actor = await requirePermission('settings', 'edit'); await saveSystemSettings(saveSettingsSchema.parse(payload), actor.legacyUserId); revalidatePath('/cms', 'layout'); revalidatePath('/', 'layout'); }
