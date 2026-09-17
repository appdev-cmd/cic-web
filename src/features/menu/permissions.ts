import 'server-only';
import { getCurrentCmsPrincipal, requirePermission, type CmsPrincipal } from '@/server/auth/guards';

export const MENU_MODULE = 'menu' as const;

export const MENU_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  REORDER: 'reorder',
  PUBLISH: 'publish',
} as const;

export type MenuAction = (typeof MENU_ACTIONS)[keyof typeof MENU_ACTIONS];

/**
 * Server guard to enforce RBAC for Menu module.
 * Superadmin and admin roles bypass permission checks automatically via Foundation guards.
 */
export async function requireMenuPermission(action: MenuAction): Promise<CmsPrincipal> {
  return requirePermission(MENU_MODULE, action);
}

/**
 * Checks if the current principal has the specified menu permission.
 */
export async function canMenu(action: MenuAction): Promise<boolean> {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (principal.isAdministrator) return true;
    return principal.permissions.some(
      (p) => p.module === MENU_MODULE && p.action === action
    );
  } catch {
    return false;
  }
}
