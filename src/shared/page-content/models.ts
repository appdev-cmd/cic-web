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

export interface PageRenderPolicy {
  motionEnabled: boolean;
}

export const productionRenderPolicy: PageRenderPolicy = {
  motionEnabled: true,
};
