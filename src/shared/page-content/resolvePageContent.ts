import type { AboutCapacityMetricModel, CapacityExperiencePageModel, HomePageModel, HomeStatModel } from './models';

export interface PageContentSectionSource {
  sectionKey: string;
  config: Record<string, unknown>;
}

export interface PageContentVersionSource {
  sections: readonly PageContentSectionSource[];
}

export interface PageContentDiagnostic {
  code: 'INVALID_HOME_STATS' | 'UNPERSISTED_HOME_STAT_ID' | 'INVALID_ABOUT_CAPACITY' | 'UNPERSISTED_ABOUT_CAPACITY_METRIC_ID';
  sectionKey: 'home.stats' | 'about.capacity';
  path: string;
  message: string;
}

export interface ResolvedHomePageContent {
  content: HomePageModel;
  diagnostics: readonly PageContentDiagnostic[];
  source: 'page-builder' | 'legacy' | 'invalid';
}

interface ResolveHomePageContentInput {
  pageType: 'home';
  version?: PageContentVersionSource;
  legacyFallback: HomePageModel;
}

interface ResolveCapacityExperiencePageContentInput {
  pageType: 'capacity_experience';
  version?: PageContentVersionSource;
  legacyFallback: CapacityExperiencePageModel;
}

export interface ResolvedCapacityExperiencePageContent {
  content: CapacityExperiencePageModel;
  diagnostics: readonly PageContentDiagnostic[];
  source: 'page-builder' | 'legacy' | 'invalid';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveHomeStats(
  version: PageContentVersionSource | undefined,
  legacyFallback: HomePageModel,
): ResolvedHomePageContent {
  const section = version?.sections.find((item) => item.sectionKey === 'home.stats');
  if (!section) {
    return {
      content: legacyFallback,
      diagnostics: [],
      source: 'legacy',
    };
  }

  const rawItems = section.config.items;
  if (!Array.isArray(rawItems)) {
    return {
      content: { stats: { items: [] } },
      diagnostics: [{
        code: 'INVALID_HOME_STATS',
        sectionKey: 'home.stats',
        path: 'config.items',
        message: 'home.stats.config.items must be an array.',
      }],
      source: 'invalid',
    };
  }

  const diagnostics: PageContentDiagnostic[] = [];
  const items: HomeStatModel[] = [];

  for (const [index, rawItem] of rawItems.entries()) {
    const path = `config.items[${index}]`;
    if (!isRecord(rawItem)
      || typeof rawItem.value !== 'number'
      || !Number.isFinite(rawItem.value)
      || typeof rawItem.label !== 'string'
      || (rawItem.suffix !== undefined && typeof rawItem.suffix !== 'string')) {
      return {
        content: { stats: { items: [] } },
        diagnostics: [{
          code: 'INVALID_HOME_STATS',
          sectionKey: 'home.stats',
          path,
          message: 'Each home.stats item requires a finite numeric value, a string label, and an optional string suffix.',
        }],
        source: 'invalid',
      };
    }

    const hasPersistentId = typeof rawItem.id === 'string' && rawItem.id.length > 0;
    if (!hasPersistentId) {
      diagnostics.push({
        code: 'UNPERSISTED_HOME_STAT_ID',
        sectionKey: 'home.stats',
        path: `${path}.id`,
        message: 'The item has no persistent ID. A transient render key is used; reorder remains blocked.',
      });
    }

    items.push({
      id: hasPersistentId ? rawItem.id as string : `unpersisted-home-stat-${index + 1}`,
      value: rawItem.value,
      suffix: rawItem.suffix as string | undefined,
      label: rawItem.label,
    });
  }

  return {
    content: { stats: { items } },
    diagnostics,
    source: 'page-builder',
  };
}

function resolveAboutCapacity(input: ResolveCapacityExperiencePageContentInput): ResolvedCapacityExperiencePageContent {
  const section = input.version?.sections.find((item) => item.sectionKey === 'about.capacity');
  if (!section) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };
  const { description, metrics: rawMetrics } = section.config;
  if (typeof description !== 'string' || !Array.isArray(rawMetrics)) {
    return {
      content: { capacity: { description: '', metrics: [] } },
      diagnostics: [{ code: 'INVALID_ABOUT_CAPACITY', sectionKey: 'about.capacity', path: 'config', message: 'about.capacity requires a string description and a metrics array.' }],
      source: 'invalid',
    };
  }
  const diagnostics: PageContentDiagnostic[] = [];
  const metrics: AboutCapacityMetricModel[] = [];
  for (const [index, rawMetric] of rawMetrics.entries()) {
    const path = `config.metrics[${index}]`;
    if (!isRecord(rawMetric) || typeof rawMetric.value !== 'string' || typeof rawMetric.label !== 'string') {
      return {
        content: { capacity: { description: '', metrics: [] } },
        diagnostics: [{ code: 'INVALID_ABOUT_CAPACITY', sectionKey: 'about.capacity', path, message: 'Each about.capacity metric requires string value and label fields.' }],
        source: 'invalid',
      };
    }
    const hasPersistentId = typeof rawMetric.id === 'string' && rawMetric.id.length > 0;
    if (!hasPersistentId) diagnostics.push({
      code: 'UNPERSISTED_ABOUT_CAPACITY_METRIC_ID', sectionKey: 'about.capacity', path: `${path}.id`,
      message: 'The metric has no persistent ID. Inline persistence remains blocked for this item.',
    });
    metrics.push({ id: hasPersistentId ? rawMetric.id as string : `unpersisted-about-capacity-metric-${index + 1}`, value: rawMetric.value, label: rawMetric.label });
  }
  return { content: { capacity: { description, metrics } }, diagnostics, source: 'page-builder' };
}

export function resolvePageContent(input: ResolveHomePageContentInput): ResolvedHomePageContent;
export function resolvePageContent(input: ResolveCapacityExperiencePageContentInput): ResolvedCapacityExperiencePageContent;
export function resolvePageContent(input: ResolveHomePageContentInput | ResolveCapacityExperiencePageContentInput): ResolvedHomePageContent | ResolvedCapacityExperiencePageContent {
  return input.pageType === 'home' ? resolveHomeStats(input.version, input.legacyFallback) : resolveAboutCapacity(input);
}
