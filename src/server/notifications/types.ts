export type NotificationType =
  | 'contact'
  | 'registration'
  | 'quote'
  | 'editorial'
  | 'system'
  | 'security';

export interface CreateNotificationInput {
  title: string;
  description?: string;
  type: NotificationType;
  targetModule?: string;
  targetAction?: string;
  targetUserId?: number | null;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CmsNotificationItem {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  targetModule?: string | null;
  targetAction?: string | null;
  targetUserId?: number | null;
  linkUrl?: string | null;
  metadata: Record<string, unknown>;
  unread: boolean;
  createdAt: string;
}

export interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: string;
}

export interface GetNotificationsResult {
  notifications: CmsNotificationItem[];
  unreadCount: number;
  total: number;
}
