import { eventsData } from '../../data/eventsData';
import { productsData } from '../../data/mockData';
import type { PublicEventsDataSet } from './types';

/** Current React mockup boundary; Next.js later replaces this with a server-side query and mapper. */
export const getEventsData = (): PublicEventsDataSet => ({
  events: eventsData,
  relatedProducts: productsData,
});
