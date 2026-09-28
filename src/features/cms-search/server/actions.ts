'use server';

import { getCurrentCmsPrincipal } from '@/server/auth/guards';
import { getCmsSearchRecords, searchCmsQuickJump } from './queries';
import type { CmsQuickSearchResult } from '../types';

export async function getCmsSearchRecordsAction() {
  const principal = await getCurrentCmsPrincipal();
  const allowedModules = principal.isAdministrator
    ? null
    : [...new Set(principal.permissions.filter((permission) => permission.action === 'view').map((permission) => permission.module))];
  return getCmsSearchRecords(principal.isAdministrator, allowedModules);
}

export async function searchCmsQuickJumpAction(query: string, locale: 'vi' | 'en' = 'vi'): Promise<CmsQuickSearchResult[]> {
  const principal = await getCurrentCmsPrincipal();
  const allowedModules = principal.isAdministrator
    ? null
    : [...new Set(principal.permissions.filter((permission) => permission.action === 'view').map((permission) => permission.module))];
  return searchCmsQuickJump(query, locale, allowedModules, 5);
}
