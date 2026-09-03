import 'server-only';

import { redirect } from 'next/navigation';

import { AppError } from '@/server/errors';
import { requireCmsAccess } from './guards';

/** Converts authentication failures to explicit page states without changing action/route-handler semantics. */
export async function requireCmsPageAccess() {
  try {
    return await requireCmsAccess();
  } catch (error) {
    if (error instanceof AppError && error.code === 'UNAUTHENTICATED') redirect('/cms/unauthorized');
    if (error instanceof AppError && error.code === 'FORBIDDEN') redirect('/cms/forbidden');
    throw error;
  }
}
