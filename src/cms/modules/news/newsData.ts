import type { CmsLocale } from '../../data/CmsDataSource';
import type { NewsModuleData } from '../../data/EditorialContentDataSource';
import { INITIAL_ASSETS } from '../media/mockData';
import { mockArticles, mockNewsCategories, mockRelatedProducts } from './mockData';

/** Current React mockup data boundary for the News CMS module. */
export const getCmsNewsData = (locale: CmsLocale): NewsModuleData => {
  if (locale !== 'vi') return { articles: [], categories: [], relatedProducts: [], mediaImages: [] };
  return {
    articles: mockArticles,
    categories: mockNewsCategories,
    relatedProducts: mockRelatedProducts,
    mediaImages: INITIAL_ASSETS.filter((asset) => asset.type === 'image' && asset.workflow_status === 'ready'),
  };
};
