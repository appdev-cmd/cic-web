'use server';

import { getCurrentCmsPrincipal } from '@/server/auth/guards';
import {
  getCmsNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from './service';
import type {
  GetNotificationsOptions,
  GetNotificationsResult,
} from './types';

/**
 * Server action to get CMS notifications for the currently logged in principal.
 */
export async function getCmsNotificationsAction(
  options: GetNotificationsOptions = {}
): Promise<GetNotificationsResult> {
  const principal = await getCurrentCmsPrincipal();
  return getCmsNotifications(principal, options);
}

/**
 * Server action to mark a notification as read.
 */
export async function markNotificationAsReadAction(notificationId: number): Promise<boolean> {
  const principal = await getCurrentCmsPrincipal();
  return markNotificationAsRead(principal, notificationId);
}

/**
 * Server action to mark all notifications as read.
 */
export async function markAllNotificationsAsReadAction(): Promise<boolean> {
  const principal = await getCurrentCmsPrincipal();
  return markAllNotificationsAsRead(principal);
}

/**
 * Server action to delete a notification.
 */
export async function deleteNotificationAction(notificationId: number): Promise<boolean> {
  const principal = await getCurrentCmsPrincipal();
  return deleteNotification(principal, notificationId);
}
