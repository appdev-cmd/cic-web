import { eventsData } from '../../data/eventsData';
import { getProductsData } from '../products/productsData';
import type { PublicEventsDataSet } from './types';

/** Current React mockup boundary; Next.js later replaces this with a server-side query and mapper. */
export const getEventsData = (): PublicEventsDataSet => ({
  events: eventsData,
  relatedProducts: getProductsData().products,
});
