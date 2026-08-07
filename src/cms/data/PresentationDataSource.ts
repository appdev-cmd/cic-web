import type { CmsLocale } from './CmsDataSource';
import type { MenuGroup, MenuItem, ValidationIssue, MenuVersion, DiffChange, MenuActivityLog } from '../modules/menu/types';

export interface MenuModuleData {
  groups: MenuGroup[];
  items: MenuItem[];
  issues: ValidationIssue[];
  versions: MenuVersion[];
  diffs: DiffChange[];
  activityLogs: MenuActivityLog[];
}

export interface PresentationDataSource {
  menuByLocale: Partial<Record<CmsLocale, MenuModuleData>>;
}
