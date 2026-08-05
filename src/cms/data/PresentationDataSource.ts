import type { CmsLocale } from './CmsDataSource';
import type { MenuGroup, MenuItem, ValidationIssue, MenuVersion, DiffChange, MenuActivityLog } from '../modules/menu/types';
import type { BannerContent, BannerPlacementConfig, ScheduleConflict, BannerVersion } from '../modules/banners/types';
import type { BlockItem, PlacementZone, PageTreeNode, ConflictIssue, BlockVersion } from '../modules/content_blocks/types';

export interface MenuModuleData {
  groups: MenuGroup[];
  items: MenuItem[];
  issues: ValidationIssue[];
  versions: MenuVersion[];
  diffs: DiffChange[];
  activityLogs: MenuActivityLog[];
}

export interface BannersModuleData {
  banners: BannerContent[];
  placements: BannerPlacementConfig[];
  conflicts: ScheduleConflict[];
  versions: BannerVersion[];
}

export interface ContentBlocksModuleData {
  blocks: BlockItem[];
  placements: PlacementZone[];
  pageTree: PageTreeNode[];
  issues: ConflictIssue[];
  versions: BlockVersion[];
}

export interface PresentationDataSource {
  menuByLocale: Partial<Record<CmsLocale, MenuModuleData>>;
  bannersByLocale: Partial<Record<CmsLocale, BannersModuleData>>;
  contentBlocksByLocale: Partial<Record<CmsLocale, ContentBlocksModuleData>>;
}
