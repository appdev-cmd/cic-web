import type { PresentationDataSource } from './PresentationDataSource';
import { mockDiffChanges, mockMenuActivityLogs, mockMenuGroups, mockMenuItems, mockMenuVersions, mockValidationIssues } from '../modules/menu/mockData';

export const demoPresentationDataSource: PresentationDataSource = {
  menuByLocale: {
    vi: {
      groups: mockMenuGroups,
      items: mockMenuItems,
      issues: mockValidationIssues,
      versions: mockMenuVersions,
      diffs: mockDiffChanges,
      activityLogs: mockMenuActivityLogs,
    },
  },
};
