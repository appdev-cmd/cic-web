import type { CmsLocale } from './CmsDataSource';
import type { NewsArticle, NewsCategory, RelatedProductItem } from '../modules/news/types';
import type { EventCategory, EventItem, RelatedProductItem as EventRelatedProductItem } from '../modules/events/types';
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

export interface ServicesModuleData {
  services: ServiceItem[];
  groups: ServiceGroup[];
  owners: { id: string; name: string; email: string }[];
  activityLogs: ServiceActivityLog[];
  versions: ServiceVersion[];
  usedByReferences: ServiceUsedByReference[];
  relatedContacts: ServiceRelatedContact[];
}

export interface EventsModuleData {
  events: EventItem[];
  categories: EventCategory[];
  relatedArticles: NewsArticle[];
  relatedProducts: EventRelatedProductItem[];
}

export interface EditorialContentDataSource {
  newsByLocale: Partial<Record<CmsLocale, NewsModuleData>>;
  servicesByLocale: Partial<Record<CmsLocale, ServicesModuleData>>;
  eventsByLocale: Partial<Record<CmsLocale, EventsModuleData>>;
}
