export interface HomeStatModel {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface HomeStatsModel {
  items: readonly HomeStatModel[];
}

export interface HomePageModel {
  stats: HomeStatsModel;
  projects: HomeProjectsModel;
}

export type HomeProjectModel = Project & { entityId: string };

export interface HomeProjectsModel {
  items: readonly HomeProjectModel[];
}

export interface AboutTimelineMilestoneModel {
  id: string;
  year: string;
  description: string;
}

export interface AboutTimelineModel {
  title: string;
  milestones: readonly AboutTimelineMilestoneModel[];
}

export interface AboutStrategyCoreValueModel {
  id: string;
  value: string;
}

export interface AboutStrategyModel {
  title: string;
  subtitle: string;
  vision: string;
  mission: string;
  coreValues: readonly AboutStrategyCoreValueModel[];
}

export interface AboutPageModel {
  timeline: AboutTimelineModel;
  strategy: AboutStrategyModel;
}

export interface AboutCapacityMetricModel {
  id: string;
  value: string;
  label: string;
}

export interface AboutCapacityModel {
  description: string;
  metrics: readonly AboutCapacityMetricModel[];
}

export interface CapacityExperiencePageModel {
  capacity: AboutCapacityModel;
}

export interface ContactBranchModel {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapUrl: string;
  fax?: string;
  searchQuery: string;
}

export interface ContactBranchesModel {
  title: string;
  branches: readonly ContactBranchModel[];
}

export interface ContactPageModel {
  branches: ContactBranchesModel;
}

export interface PageRenderPolicy {
  motionEnabled: boolean;
}

export const productionRenderPolicy: PageRenderPolicy = {
  motionEnabled: true,
};
import type { Project } from '../types';
