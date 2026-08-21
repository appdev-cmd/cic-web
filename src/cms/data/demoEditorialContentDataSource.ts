import type { EditorialContentDataSource } from './EditorialContentDataSource';
import { mockArticles, mockNewsCategories, mockRelatedProducts } from '../modules/news/mockData';
import { mockEventProducts, mockEvents } from '../modules/events/mockData';
import {
  mockServiceActivityLogs,
  mockServiceRelatedContacts,
  mockServicesData,
  mockServiceUsedByReferences,
  mockServiceVersions,
} from '../modules/services/mockData';

export const demoEditorialContentDataSource: EditorialContentDataSource = {
  newsByLocale: {
    vi: {
      articles: mockArticles,
      categories: mockNewsCategories,
      relatedProducts: mockRelatedProducts,
    },
  },
  servicesByLocale: {
    vi: {
      services: mockServicesData,
      activityLogs: mockServiceActivityLogs,
      versions: mockServiceVersions,
      usedByReferences: mockServiceUsedByReferences,
      relatedContacts: mockServiceRelatedContacts,
    },
  },
  eventsByLocale: {
    vi: {
      events: mockEvents,
      relatedArticles: mockArticles,
      relatedProducts: mockEventProducts,
    },
  },
};
