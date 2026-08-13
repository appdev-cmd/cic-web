import type { CmsLocale } from '../../data/CmsDataSource';
import type { EventsModuleData } from '../../data/EditorialContentDataSource';
import { INITIAL_ASSETS } from '../media/mockData';
import { mockArticles } from '../news/mockData';
import { mockEventProducts, mockEvents } from './mockData';

/** Current React mockup boundary. Workspaces are independent; EN never falls back to VI. */
export function getCmsEventsData(locale: CmsLocale): EventsModuleData {
  if (locale !== 'vi') return { events: [], relatedArticles: [], relatedProducts: [], mediaImages: [] };

  return {
    events: mockEvents,
    relatedArticles: mockArticles,
    relatedProducts: mockEventProducts,
    mediaImages: INITIAL_ASSETS.filter((asset) => asset.type === 'image' && asset.workflow_status === 'ready'),
  };
}
