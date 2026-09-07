'use server';

import { getCurrentCmsPrincipal } from '@/server/auth/guards';
import { getCmsSearchRecords } from './queries';

export async function getCmsSearchRecordsAction() {
  const principal = await getCurrentCmsPrincipal();
  const allowedModules = principal.isAdministrator
    ? null
    : [...new Set(principal.permissions.filter((permission) => permission.action === 'view').map((permission) => permission.module))];
  return getCmsSearchRecords(principal.isAdministrator, allowedModules);
}
