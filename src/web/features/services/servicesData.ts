import { servicesData as serviceFixtures } from '../../data/servicesData';
import type { ServiceDetail } from './types';

export interface ServicesDataResult {
  services: ServiceDetail[];
}

/**
 * Current React data boundary. It reads fixtures today and can be replaced by
 * a server-side PostgreSQL query + mapper when the project moves to Next.js.
 */
export const getServicesData = (): ServicesDataResult => ({
  services: serviceFixtures,
});
