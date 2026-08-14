import type { CmsLocale } from './CmsDataSource';
import type { MenuGroup, MenuItem } from '../modules/menu/types';

export interface MenuModuleData {
  groups: MenuGroup[];
  items: MenuItem[];
}

export interface PresentationDataSource {
  menuByLocale: Partial<Record<CmsLocale, MenuModuleData>>;
}
