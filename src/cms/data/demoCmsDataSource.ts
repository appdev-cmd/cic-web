import type { CmsDataSource } from './CmsDataSource';
import {
  activityLogsMock,
  cmsMenuGroupsMock,
  contactMessagesMock,
  currentUserMock,
  dailyTrafficMock,
  kpiStatsMock,
  monthlyTrafficMock,
  notificationsMock,
  pendingContentsMock,
  productRegistrationsMock,
  weeklyContentStatsMock,
} from './mockCmsData';

export const demoCmsDataSource: CmsDataSource = {
  currentUser: currentUserMock,
  menuGroups: cmsMenuGroupsMock,
  notifications: notificationsMock,
  availableLocales: ['vi', 'en'],
  dashboardByLocale: {
    vi: {
      kpi: kpiStatsMock,
      contacts: contactMessagesMock,
      productRegistrations: productRegistrationsMock,
      pendingContents: pendingContentsMock,
      activityLogs: activityLogsMock,
      traffic7Days: dailyTrafficMock,
      traffic30Days: monthlyTrafficMock,
      weeklyContent: weeklyContentStatsMock,
    },
  },
};
