export interface HomeHeroSlideModel {
  img: string;
  badge?: string;
  title: string;
  sub: string;
}

export interface HomeHeroModel {
  badge?: string;
  slides: readonly HomeHeroSlideModel[];
  marqueeTexts?: readonly string[];
}

export interface HomeIntroModel {
  badge?: string;
  title: string;
  paragraphs: readonly string[];
  videoUrl?: string;
  profilePdfUrl?: string;
  primaryCtaId?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  primaryCtaNewTab?: boolean;
}

export interface HomeStatModel {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface HomeStatsModel {
  items: readonly HomeStatModel[];
}

export interface HomeAwardItemModel {
  name: string;
  img: string;
}

export interface HomeAwardsModel {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: readonly HomeAwardItemModel[];
}

export interface HomeEcosystemItemModel {
  id: string;
  title: string;
  desc: string;
  tag: string;
  link: string;
}

export interface HomeEcosystemModel {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: readonly HomeEcosystemItemModel[];
}

export type HomeProjectModel = Project & { entityId: string };

export interface HomeProjectsModel {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: readonly HomeProjectModel[];
}

export interface HomeEventItemModel {
  id: string | number;
  title: string;
  date: string;
  time?: string;
  loc?: string;
  attendees?: string;
  isPast?: boolean;
}

export interface HomeEventsModel {
  badge?: string;
  title?: string;
  subtitle?: string;
  upcomingEvents: readonly HomeEventItemModel[];
  pastEvents: readonly HomeEventItemModel[];
}

export interface HomeNewsItemModel {
  id: string | number;
  category: string;
  title: string;
  date: string;
  desc: string;
  img: string;
}

export interface HomeNewsModel {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: readonly HomeNewsItemModel[];
}

export interface HomePartnerItemModel {
  name: string;
  logo: string;
}

export interface HomePartnersModel {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: readonly HomePartnerItemModel[];
}

export interface HomeContactCtaModel {
  badge?: string;
  title: string;
  description?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  formId?: string;
  submitLabel?: string;
}

export interface HomePageModel {
  hero?: HomeHeroModel;
  intro?: HomeIntroModel;
  stats: HomeStatsModel;
  awards?: HomeAwardsModel;
  ecosystem?: HomeEcosystemModel;
  projects: HomeProjectsModel;
  events?: HomeEventsModel;
  news?: HomeNewsModel;
  partners?: HomePartnersModel;
  contactCta?: HomeContactCtaModel;
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

export type PageBuilderEntityType =
  | 'product'
  | 'news'
  | 'service'
  | 'project'
  | 'partner'
  | 'event';

export interface PageBuilderEntityOption {
  id: string;
  label: string;
  description: string;
  entityType: PageBuilderEntityType;
  status?: 'published' | 'unpublished' | 'deleted';
  meta?: {
    image?: string;
    location?: string;
    category?: string;
    summary?: string;
    date?: string;
    isFeatured?: boolean;
    link?: string;
  };
}

import type { Project } from '../types';
