import { projects } from '@web/data/mockData';
import type { HomeProjectModel } from './models';

const projectFixtureIdByEntityId: Readonly<Record<string, number>> = {
  project_landmark_81: 1,
  project_cao_toc_bac_nam: 2,
  project_dien_gio_mui_dinh: 3,
};

/**
 * Transitional production entity boundary. The explicit map is identity-based;
 * reference position is never used to select a fixture entity.
 */
export function resolveProjectEntity(entityId: string): HomeProjectModel | null {
  const fixtureId = projectFixtureIdByEntityId[entityId];
  if (fixtureId === undefined) return null;
  const project = projects.find((candidate) => candidate.id === fixtureId);
  return project ? { ...project, entityId } : null;
}
