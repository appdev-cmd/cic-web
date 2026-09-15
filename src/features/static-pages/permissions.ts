import 'server-only';
import { getCurrentCmsPrincipal, requirePermission, type CmsPrincipal } from '@/server/auth/guards';

export const STATIC_PAGES_MODULE = 'static_pages' as const;

export const STATIC_PAGES_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  PREVIEW: 'preview',
  PUBLISH: 'publish',
  CREATE_LEGAL: 'create_legal',
} as const;

export type StaticPagesAction =
  (typeof STATIC_PAGES_ACTIONS)[keyof typeof STATIC_PAGES_ACTIONS];

/**
 * Server guard to enforce RBAC for static pages module.
 * Superadmin and admin roles bypass permission checks automatically via Foundation guards.
 */
export async function requireStaticPagesPermission(
  action: StaticPagesAction
): Promise<CmsPrincipal> {
  return requirePermission(STATIC_PAGES_MODULE, action);
}

/**
 * Checks if the current principal has the specified static_pages permission.
 */
export async function canStaticPages(
  action: StaticPagesAction
): Promise<boolean> {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (principal.isAdministrator) return true;
    return principal.permissions.some(
      (p) => p.module === STATIC_PAGES_MODULE && p.action === action
    );
  } catch {
    return false;
  }
}
