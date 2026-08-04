import type { CmsLocale } from './CmsDataSource';
import type { NewsArticle, NewsCategory, RelatedProductItem } from '../modules/news/types';
import type { StaticPage, StaticPageCategory } from '../modules/static_pages/types';
import type {
  ServiceActivityLog,
  ServiceGroup,
  ServiceItem,
  ServiceRelatedContact,
  ServiceUsedByReference,
  ServiceVersion,
} from '../modules/services/types';

export interface NewsModuleData {
  articles: NewsArticle[];
  categories: NewsCategory[];
  relatedProducts: RelatedProductItem[];
}

export interface StaticPagesModuleData {
  pages: StaticPage[];
  categories: StaticPageCategory[];
}

export interface ServicesModuleData {
  services: ServiceItem[];
  groups: ServiceGroup[];
  owners: { id: string; name: string; email: string }[];
  activityLogs: ServiceActivityLog[];
  versions: ServiceVersion[];
  usedByReferences: ServiceUsedByReference[];
  relatedContacts: ServiceRelatedContact[];
}

export interface EditorialContentDataSource {
  newsByLocale: Partial<Record<CmsLocale, NewsModuleData>>;
  staticPagesByLocale: Partial<Record<CmsLocale, StaticPagesModuleData>>;
  servicesByLocale: Partial<Record<CmsLocale, ServicesModuleData>>;
}
