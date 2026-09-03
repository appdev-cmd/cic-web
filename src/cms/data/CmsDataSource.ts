import type {
  ActivityLog,
  CmsMenuGroup,
  CmsUser,
  ContactMessage,
  KpiStats,
  NotificationItem,
  PendingContent,
  ProductRegistration,
  TrafficStat,
  WeeklyContentStat,
} from '../types';
import type { AppLocale } from '@/shared/i18n/config';

export type CmsLocale = AppLocale;
export type CmsUiLanguage = AppLocale;

export interface CmsDashboardData {
  kpi: KpiStats;
  contacts: ContactMessage[];
  productRegistrations: ProductRegistration[];
  pendingContents: PendingContent[];
  activityLogs: ActivityLog[];
  traffic7Days: TrafficStat[];
  traffic30Days: TrafficStat[];
  weeklyContent: WeeklyContentStat[];
}

export interface CmsDataSource {
  currentUser: CmsUser;
  menuGroups: CmsMenuGroup[];
  notifications: NotificationItem[];
  availableLocales: CmsLocale[];
  dashboardByLocale: Partial<Record<CmsLocale, CmsDashboardData>>;
}
