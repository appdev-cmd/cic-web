import 'server-only';
import { getPublicPublishedPage } from './repository';
import { getLegacyAboutCapacityContent, getLegacyAboutPageContent } from '@/shared/page-content/legacyPageContent';
import type { AboutCapacityModel, AboutPageModel } from '@/shared/page-content/models';

export interface ResolvedAboutSection {
  sectionKey: string;
  config: Record<string, unknown>;
  references?: Array<{ entityType: string; entityIds: string[] }>;
}

export interface ResolvedAboutResult {
  page: {
    id: number;
    code: string;
    slug: string;
    name: string;
    seoTitle: string;
    seoDescription: string;
    isPublished: boolean;
  };
  aboutContent: AboutPageModel;
  capacityContent: AboutCapacityModel;
  pageSections: ResolvedAboutSection[];
}

/**
 * Loads published content for an About page (code: 'about' | 'organization' | 'capacity_experience').
 * If the page has not been published yet or has empty sections, returns a fail-safe
 * structure populated with canonical legacy data so public rendering never breaks.
 */
export async function getPublishedAboutPage(
  workspace: 'vi' | 'en' = 'vi',
  code: 'about' | 'organization' | 'capacity_experience' = 'about'
): Promise<ResolvedAboutResult> {
  const legacyAbout = getLegacyAboutPageContent();
  const legacyCapacity = getLegacyAboutCapacityContent();

  const defaultResult: ResolvedAboutResult = {
    page: {
      id: code === 'about' ? 2 : code === 'organization' ? 3 : 4,
      code,
      slug: code === 'about' ? '/gioi-thieu' : code === 'organization' ? '/gioi-thieu/co-cau-to-chuc' : '/gioi-thieu/nang-luc-kinh-nghiem',
      name: code === 'about' ? 'Giới thiệu' : code === 'organization' ? 'Cơ cấu tổ chức' : 'Năng lực & Kinh nghiệm',
      seoTitle: '',
      seoDescription: '',
      isPublished: false,
    },
    aboutContent: legacyAbout,
    capacityContent: legacyCapacity,
    pageSections: [],
  };

  try {
    const publishedPage = await getPublicPublishedPage(workspace, code);

    if (!publishedPage || !publishedPage.sections || publishedPage.sections.length === 0) {
      return defaultResult;
    }

    const sections: ResolvedAboutSection[] = publishedPage.sections.map((s) => {
      const refGroupMap = new Map<string, string[]>();
      for (const ref of s.references || []) {
        const list = refGroupMap.get(ref.entityType) || [];
        list.push(ref.entityId);
        refGroupMap.set(ref.entityType, list);
      }
      return {
        sectionKey: s.sectionKey,
        config: (s.config ?? {}) as Record<string, unknown>,
        references: Array.from(refGroupMap.entries()).map(([entityType, entityIds]) => ({
          entityType,
          entityIds,
        })),
      };
    });

    // Resolve AboutContent (Timeline & Strategy)
    let resolvedAboutContent: AboutPageModel = { ...legacyAbout };
    const timelineSec = sections.find((s) => s.sectionKey === 'about.timeline');
    if (timelineSec && timelineSec.config) {
      const cfg = timelineSec.config;
      const rawMilestones = Array.isArray(cfg.milestones) ? cfg.milestones : [];
      if (rawMilestones.length > 0) {
        resolvedAboutContent.timeline = {
          title: typeof cfg.title === 'string' && cfg.title.trim() ? cfg.title.trim() : legacyAbout.timeline.title,
          milestones: rawMilestones
            .filter((m): m is Record<string, unknown> => typeof m === 'object' && m !== null)
            .map((m, idx) => ({
              id: typeof m.id === 'string' ? m.id : `timeline-ms-${idx + 1}`,
              year: typeof m.year === 'string' ? m.year : '',
              description: typeof m.description === 'string' ? m.description : '',
            })),
        };
      }
    }

    const strategySec = sections.find((s) => s.sectionKey === 'about.strategy');
    if (strategySec && strategySec.config) {
      const cfg = strategySec.config;
      const rawCoreValues = Array.isArray(cfg.coreValues) ? cfg.coreValues : [];
      resolvedAboutContent.strategy = {
        title: typeof cfg.title === 'string' && cfg.title.trim() ? cfg.title.trim() : legacyAbout.strategy.title,
        subtitle: typeof cfg.subtitle === 'string' && cfg.subtitle.trim() ? cfg.subtitle.trim() : legacyAbout.strategy.subtitle,
        vision: typeof cfg.vision === 'string' && cfg.vision.trim() ? cfg.vision.trim() : legacyAbout.strategy.vision,
        mission: typeof cfg.mission === 'string' && cfg.mission.trim() ? cfg.mission.trim() : legacyAbout.strategy.mission,
        coreValues: rawCoreValues.length > 0
          ? rawCoreValues
              .filter((v): v is Record<string, unknown> => typeof v === 'object' && v !== null)
              .map((v, idx) => ({
                id: typeof v.id === 'string' ? v.id : `core-value-${idx + 1}`,
                value: typeof v.value === 'string' ? v.value : String(v),
              }))
          : legacyAbout.strategy.coreValues,
      };
    }

    // Resolve CapacityContent
    let resolvedCapacityContent: AboutCapacityModel = { ...legacyCapacity };
    const capacitySec = sections.find((s) => s.sectionKey === 'about.capacity');
    if (capacitySec && capacitySec.config) {
      const cfg = capacitySec.config;
      const rawMetrics = Array.isArray(cfg.metrics) ? cfg.metrics : [];
      resolvedCapacityContent = {
        description: typeof cfg.description === 'string' && cfg.description.trim()
          ? cfg.description.trim()
          : legacyCapacity.description,
        metrics: rawMetrics.length > 0
          ? rawMetrics
              .filter((m): m is Record<string, unknown> => typeof m === 'object' && m !== null)
              .map((m, idx) => ({
                id: typeof m.id === 'string' ? m.id : `capacity-metric-${idx + 1}`,
                value: typeof m.value === 'string' ? m.value : (m.value !== undefined && m.value !== null ? String(m.value) : ''),
                label: typeof m.label === 'string' ? m.label : (m.label !== undefined && m.label !== null ? String(m.label) : ''),
              }))
          : legacyCapacity.metrics,
      };
    }

    // Sync about.awards & about.partners with home sections if enabled (default: true)
    if (code === 'about') {
      try {
        const homePage = await getPublicPublishedPage(workspace, 'home');
        const homeSections = homePage?.sections ?? [];
        const homeAwardsSec = homeSections.find((s) => s.sectionKey === 'home.awards');
        const homePartnersSec = homeSections.find((s) => s.sectionKey === 'home.partners');

        const awardsSec = sections.find((s) => s.sectionKey === 'about.awards');
        if (awardsSec) {
          const cfg = awardsSec.config;
          const sync = cfg.syncWithHome !== false;
          if (sync) {
            const homeAwardsItems = Array.isArray(homeAwardsSec?.config?.items) && homeAwardsSec.config.items.length > 0
              ? homeAwardsSec.config.items
              : undefined;
            if (homeAwardsItems) {
              cfg.items = homeAwardsItems;
            }
          }
        }

        const partnersSec = sections.find((s) => s.sectionKey === 'about.partners');
        if (partnersSec) {
          const cfg = partnersSec.config;
          const sync = cfg.syncWithHome !== false;
          if (sync) {
            const homePartnersItems = Array.isArray(homePartnersSec?.config?.items) && homePartnersSec.config.items.length > 0
              ? homePartnersSec.config.items
              : undefined;
            if (homePartnersItems) {
              cfg.items = homePartnersItems;
            }
          }
        }
      } catch (homeErr) {
        console.warn('[aboutResolver] Warning: could not load home page for sync:', homeErr);
      }
    }

    return {
      page: {
        id: Number(publishedPage.pageId),
        code: publishedPage.code,
        slug: publishedPage.slug,
        name: publishedPage.name,
        seoTitle: publishedPage.seoTitle || '',
        seoDescription: publishedPage.seoDescription || '',
        isPublished: true,
      },
      aboutContent: resolvedAboutContent,
      capacityContent: resolvedCapacityContent,
      pageSections: sections,
    };
  } catch (err) {
    console.error(`[aboutResolver] Error loading ${workspace}/${code}:`, err);
    return defaultResult;
  }
}
