import type { EventItem, Product } from '@shared/types';

export interface PublicEventsDataSet {
  events: EventItem[];
  relatedProducts: Product[];
}
