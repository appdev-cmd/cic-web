import type { PresentationDataSource } from './PresentationDataSource';
import { mockDiffChanges, mockMenuActivityLogs, mockMenuGroups, mockMenuItems, mockMenuVersions, mockValidationIssues } from '../modules/menu/mockData';
import { mockBanners, mockConflicts, mockPlacements, mockVersions } from '../modules/banners/mockData';
import { INITIAL_BLOCKS, MOCK_ISSUES, MOCK_PAGE_TREE, MOCK_PLACEMENTS, MOCK_VERSIONS } from '../modules/content_blocks/mockData';

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
  bannersByLocale: {
    vi: {
      banners: mockBanners,
      placements: mockPlacements,
      conflicts: mockConflicts,
      versions: mockVersions,
    },
  },
  contentBlocksUnscoped: {
    blocks: INITIAL_BLOCKS,
    placements: MOCK_PLACEMENTS,
    pageTree: MOCK_PAGE_TREE,
    issues: MOCK_ISSUES,
    versions: MOCK_VERSIONS,
  },
};
