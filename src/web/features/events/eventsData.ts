import { eventsData } from '../../data/eventsData';
import { getProductsData } from '../products/productsData';
import type { PublicEventsDataSet } from './types';

let runtimeEventsData: PublicEventsDataSet | null = null;

export const setRuntimeEventsData = (data: PublicEventsDataSet | null) => {
  runtimeEventsData = data;
};

/** Current React mockup boundary; Next.js replaces this with a server-side query and mapper. */
export const getEventsData = (): PublicEventsDataSet => {
  if (runtimeEventsData) {
    return runtimeEventsData;
  }
  return {
    events: eventsData,
    relatedProducts: getProductsData().products,
  };
};
