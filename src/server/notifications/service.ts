import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import type {
  CreateNotificationInput,
  CmsNotificationItem,
  GetNotificationsOptions,
  GetNotificationsResult,
} from './types';

/**
 * Creates a CMS notification safely.
 * Non-blocking: catches any internal database error to ensure caller operations succeed.
 */
export async function createCmsNotification(input: CreateNotificationInput): Promise<number | null> {
  try {
    const sql = getPostgresClient();
    const [row] = await sql`
      INSERT INTO cms_notifications (
        title,
        description,
        type,
        target_module,
        target_action,
        target_user_id,
        link_url,
        metadata
      ) VALUES (
        ${input.title.trim()},
        ${input.description?.trim() || null},
        ${input.type},
        ${input.targetModule || null},
        ${input.targetAction || 'view'},
        ${input.targetUserId || null},
        ${input.linkUrl || null},
        ${sql.json((input.metadata || {}) as never)}
      )
      RETURNING id
    `;
    return row?.id ? Number(row.id) : null;
  } catch (error) {
    console.error('[createCmsNotification Error]:', error);
    return null;
  }
}

/**
 * Retrieves visible notifications for the given CMS principal, enforcing RBAC and independent read tracking.
 */
export async function getCmsNotifications(
  principal: CmsPrincipal,
  options: GetNotificationsOptions = {}
): Promise<GetNotificationsResult> {
  const sql = getPostgresClient();
  const limit = Math.min(Math.max(options.limit || 20, 1), 100);
  const offset = Math.max(options.offset || 0, 0);
  const userId = principal.legacyUserId;

  // Build RBAC permission condition
  const isAdministrator = principal.isAdministrator;
  const allowedModules = Array.from(new Set(principal.permissions.map((p) => p.module.toLowerCase())));

  // Base permission fragment
  const rbacFilter = isAdministrator
    ? sql`(n.target_user_id IS NULL OR n.target_user_id = ${userId})`
    : allowedModules.length > 0
    ? sql`(n.target_user_id = ${userId} OR (n.target_user_id IS NULL AND LOWER(n.target_module) IN ${sql(allowedModules)}))`
    : sql`n.target_user_id = ${userId}`;

  // Optional filters
  const typeFilter = options.type && options.type !== 'all'
    ? sql`AND n.type = ${options.type}`
    : sql``;

  const unreadFilter = options.unreadOnly
    ? sql`AND nr.read_at IS NULL`
    : sql``;

  // Query notifications with read status
  const rows = await sql`
    SELECT
      n.id,
      n.title,
      n.description,
      n.type,
      n.target_module,
      n.target_action,
      n.target_user_id,
      n.link_url,
      n.metadata,
      n.created_at,
      (nr.read_at IS NULL) AS unread
    FROM cms_notifications n
    LEFT JOIN cms_notification_reads nr
      ON nr.notification_id = n.id AND nr.user_id = ${userId}
    WHERE ${rbacFilter}
      ${typeFilter}
      ${unreadFilter}
    ORDER BY n.created_at DESC, n.id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  // Query counts
  const [countRow] = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE nr.read_at IS NULL)::int AS unread_count
    FROM cms_notifications n
    LEFT JOIN cms_notification_reads nr
      ON nr.notification_id = n.id AND nr.user_id = ${userId}
    WHERE ${rbacFilter}
      ${typeFilter}
  `;

  const notifications: CmsNotificationItem[] = rows.map((r) => ({
    id: String(r.id),
    title: String(r.title || ''),
    description: String(r.description || ''),
    type: r.type,
    targetModule: r.target_module ? String(r.target_module) : null,
    targetAction: r.target_action ? String(r.target_action) : null,
    targetUserId: r.target_user_id ? Number(r.target_user_id) : null,
    linkUrl: r.link_url ? String(r.link_url) : null,
    metadata: (r.metadata as Record<string, unknown>) || {},
    unread: Boolean(r.unread),
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at || ''),
  }));

  return {
    notifications,
    total: Number(countRow?.total || 0),
    unreadCount: Number(countRow?.unread_count || 0),
  };
}

/**
 * Marks a single notification as read for the current user.
 */
export async function markNotificationAsRead(
  principal: CmsPrincipal,
  notificationId: number
): Promise<boolean> {
  try {
    const sql = getPostgresClient();
    const userId = principal.legacyUserId;

    await sql`
      INSERT INTO cms_notification_reads (notification_id, user_id, read_at)
      VALUES (${notificationId}, ${userId}, NOW())
      ON CONFLICT (notification_id, user_id)
      DO UPDATE SET read_at = NOW()
    `;
    return true;
  } catch (error) {
    console.error('[markNotificationAsRead Error]:', error);
    return false;
  }
}

/**
 * Marks all visible notifications as read for the current user.
 */
export async function markAllNotificationsAsRead(principal: CmsPrincipal): Promise<boolean> {
  try {
    const sql = getPostgresClient();
    const userId = principal.legacyUserId;

    const isAdministrator = principal.isAdministrator;
    const allowedModules = Array.from(new Set(principal.permissions.map((p) => p.module.toLowerCase())));

    const rbacFilter = isAdministrator
      ? sql`(n.target_user_id IS NULL OR n.target_user_id = ${userId})`
      : allowedModules.length > 0
      ? sql`(n.target_user_id = ${userId} OR (n.target_user_id IS NULL AND LOWER(n.target_module) IN ${sql(allowedModules)}))`
      : sql`n.target_user_id = ${userId}`;

    // Insert reads for all unread notifications visible to this user
    await sql`
      INSERT INTO cms_notification_reads (notification_id, user_id, read_at)
      SELECT n.id, ${userId}, NOW()
      FROM cms_notifications n
      LEFT JOIN cms_notification_reads nr
        ON nr.notification_id = n.id AND nr.user_id = ${userId}
      WHERE ${rbacFilter} AND nr.read_at IS NULL
      ON CONFLICT (notification_id, user_id)
      DO UPDATE SET read_at = NOW()
    `;
    return true;
  } catch (error) {
    console.error('[markAllNotificationsAsRead Error]:', error);
    return false;
  }
}

/**
 * Deletes a notification (allowed for administrators or author of target).
 */
export async function deleteNotification(
  principal: CmsPrincipal,
  notificationId: number
): Promise<boolean> {
  try {
    const sql = getPostgresClient();
    if (!principal.isAdministrator) {
      // Non-admin can only delete notifications targeted to themselves
      const result = await sql`
        DELETE FROM cms_notifications
        WHERE id = ${notificationId} AND target_user_id = ${principal.legacyUserId}
      `;
      return result.count > 0;
    }

    const result = await sql`
      DELETE FROM cms_notifications
      WHERE id = ${notificationId}
    `;
    return result.count > 0;
  } catch (error) {
    console.error('[deleteNotification Error]:', error);
    return false;
  }
}
