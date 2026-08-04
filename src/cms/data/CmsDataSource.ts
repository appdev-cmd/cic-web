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

export type CmsLocale = 'vi' | 'en';
export type CmsUiLanguage = 'vi' | 'en';

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
