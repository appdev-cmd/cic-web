import { eventsData } from '../../data/eventsData';
import { getProductsData } from '../products/productsData';
import { newsData } from '../../data/newsData';
import { getProjectsData } from '../projects/projectsData';
import type { PublicNewsDataSet } from './types';

/**
 * Single data-access boundary for the current React mockup.
 * A future Next.js page can replace this implementation with server-side data access
 * while keeping the public News view model stable.
 */
export const getNewsData = (): PublicNewsDataSet => ({
  items: newsData,
  relatedProducts: getProductsData().products,
  relatedProjects: getProjectsData(),
  relatedEvents: eventsData,
});
