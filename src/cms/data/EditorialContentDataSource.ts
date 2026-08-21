import type { CmsLocale } from './CmsDataSource';
import type { NewsArticle, NewsCategory, RelatedProductItem } from '../modules/news/types';
import type { CmsMediaPickerItem } from './MediaPickerDataSource';
import type { EventItem, RelatedProductItem as EventRelatedProductItem } from '../modules/events/types';
import type {
  ServiceActivityLog,
  ServiceItem,
  ServiceRelatedContact,
  ServiceUsedByReference,
  ServiceVersion,
} from '../modules/services/types';

export interface NewsModuleData {
  articles: NewsArticle[];
  categories: NewsCategory[];
  relatedProducts: RelatedProductItem[];
  mediaImages?: CmsMediaPickerItem[];
}

export interface ServicesModuleData {
  services: ServiceItem[];
  activityLogs: ServiceActivityLog[];
  versions: ServiceVersion[];
  usedByReferences: ServiceUsedByReference[];
  relatedContacts: ServiceRelatedContact[];
}

export interface EventsModuleData {
  events: EventItem[];
  relatedArticles: NewsArticle[];
  relatedProducts: EventRelatedProductItem[];
  mediaImages?: CmsMediaPickerItem[];
}

export interface EditorialContentDataSource {
  newsByLocale: Partial<Record<CmsLocale, NewsModuleData>>;
  servicesByLocale: Partial<Record<CmsLocale, ServicesModuleData>>;
  eventsByLocale: Partial<Record<CmsLocale, EventsModuleData>>;
}
