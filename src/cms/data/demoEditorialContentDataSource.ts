import type { EditorialContentDataSource } from './EditorialContentDataSource';
import { mockArticles, mockNewsCategories, mockRelatedProducts } from '../modules/news/mockData';
import { staticPageCategoriesMock, staticPagesMock } from '../modules/static_pages/mockData';
import {
  mockServiceActivityLogs,
  mockServiceRelatedContacts,
  mockServicesData,
  mockServiceUsedByReferences,
  mockServiceVersions,
  serviceGroupsMock,
} from '../modules/services/mockData';

export const demoEditorialContentDataSource: EditorialContentDataSource = {
  newsByLocale: {
    vi: {
      articles: mockArticles,
      categories: mockNewsCategories,
      relatedProducts: mockRelatedProducts,
    },
  },
  staticPagesByLocale: {
    vi: {
      pages: staticPagesMock,
      categories: staticPageCategoriesMock,
    },
  },
  servicesByLocale: {
    vi: {
      services: mockServicesData,
      groups: serviceGroupsMock,
      owners: [
        { id: 'usr_002', name: 'Trần Văn Mạnh', email: 'manh.tv@cic.com.vn' },
        { id: 'usr_003', name: 'Nguyễn Thị Bích', email: 'bich.nt@cic.com.vn' },
        { id: 'usr_004', name: 'Lê Quang Huy', email: 'huy.lq@cic.com.vn' },
      ],
      activityLogs: mockServiceActivityLogs,
      versions: mockServiceVersions,
      usedByReferences: mockServiceUsedByReferences,
      relatedContacts: mockServiceRelatedContacts,
    },
  },
};
