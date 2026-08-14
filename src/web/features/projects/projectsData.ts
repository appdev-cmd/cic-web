import {
  projectsData as projectFixtures,
  type DetailedProject,
} from '../../data/projectsData';

export type { DetailedProject };

/**
 * Public Project read boundary for the current mockup. Keep the UI model stable
 * when the fixture is replaced by PostgreSQL-backed server-side data access.
 */
export const getProjectsData = (): DetailedProject[] => projectFixtures;
