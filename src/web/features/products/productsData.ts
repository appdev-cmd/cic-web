import { productsData } from '../../data/mockData';
import type { PublicProductsDataSet } from './types';

/** Current React mock boundary; replace this function with a server-side query and mapper in Next.js. */
export const getProductsData = (): PublicProductsDataSet => ({
  products: productsData,
});
