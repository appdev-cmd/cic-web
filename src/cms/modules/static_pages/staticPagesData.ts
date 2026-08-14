import type { CmsLocale } from '../../data/CmsDataSource';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import { getDemoMediaPickerItems } from '../../data/demoMediaDataSource';
import { pageBuilderEntityOptions, pageBuilderPagesMock } from './pageBuilderData';
import type { PageBuilderEntityOption, PageBuilderPage } from './pageBuilderTypes';

export interface StaticPagesModuleData {
  pages: PageBuilderPage[];
  entityOptions: PageBuilderEntityOption[];
  mediaImages: CmsMediaPickerItem[];
  canCreateLegalPage: boolean;
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Current React mockup boundary. VI/EN are independent; there is no implicit locale fallback. */
export function getCmsStaticPagesData(locale: CmsLocale): StaticPagesModuleData {
  return {
    pages: locale === 'vi' ? clone(pageBuilderPagesMock) : [],
    entityOptions: locale === 'vi' ? clone(pageBuilderEntityOptions) : [],
    mediaImages: clone(getDemoMediaPickerItems(locale)),
    canCreateLegalPage: locale === 'vi',
  };
}
