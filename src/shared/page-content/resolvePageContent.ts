import type { AboutCapacityMetricModel, AboutPageModel, AboutStrategyCoreValueModel, AboutTimelineMilestoneModel, CapacityExperiencePageModel, ContactBranchModel, ContactPageModel, HomePageModel, HomeProjectModel, HomeStatModel, HomeEventItemModel, HomeNewsItemModel, HomePartnerItemModel } from './models';
import { resolveProjectEntity, resolveEventEntity, resolveNewsEntity, resolvePartnerEntity } from './resolveReferenceEntity';

export interface PageContentSectionSource {
  sectionKey: string;
  config: Record<string, unknown>;
  references?: readonly { entityType: string; entityIds: readonly string[] }[];
}

export interface PageContentVersionSource {
  sections: readonly PageContentSectionSource[];
}

export interface PageContentDiagnostic {
  code: 'INVALID_HOME_STATS' | 'UNPERSISTED_HOME_STAT_ID' | 'INVALID_HOME_PROJECTS' | 'UNRESOLVED_REFERENCE_ENTITY' | 'INVALID_ABOUT_CAPACITY' | 'UNPERSISTED_ABOUT_CAPACITY_METRIC_ID' | 'INVALID_ABOUT_TIMELINE' | 'UNPERSISTED_ABOUT_TIMELINE_ID' | 'INVALID_ABOUT_STRATEGY' | 'UNPERSISTED_ABOUT_CORE_VALUE_ID' | 'INVALID_CONTACT_BRANCHES';
  sectionKey: 'home.stats' | 'home.projects' | 'about.capacity' | 'about.timeline' | 'about.strategy' | 'contact.branches';
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

interface ResolveAboutPageContentInput { pageType: 'about'; version?: PageContentVersionSource; legacyFallback: AboutPageModel }
interface ResolveContactPageContentInput { pageType: 'contact'; version?: PageContentVersionSource; legacyFallback: ContactPageModel }
export interface ResolvedAboutPageContent { content: AboutPageModel; diagnostics: readonly PageContentDiagnostic[]; source: 'page-builder' | 'legacy' | 'invalid' }
export interface ResolvedContactPageContent { content: ContactPageModel; diagnostics: readonly PageContentDiagnostic[]; source: 'page-builder' | 'legacy' | 'invalid' }

export interface ResolvedCapacityExperiencePageContent {
  content: CapacityExperiencePageModel;
  diagnostics: readonly PageContentDiagnostic[];
  source: 'page-builder' | 'legacy' | 'invalid';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveHomeContent(
  version: PageContentVersionSource | undefined,
  legacyFallback: HomePageModel,
): ResolvedHomePageContent {
  if (!version?.sections || version.sections.length === 0) {
    return { content: legacyFallback, diagnostics: [], source: 'legacy' };
  }
  const diagnostics: PageContentDiagnostic[] = [];
  const sectionMap = new Map(version.sections.map((s) => [s.sectionKey, s]));

  // Projects
  const projectSection = sectionMap.get('home.projects');
  const projectItems: HomeProjectModel[] = [];
  if (projectSection) {
    const reference = projectSection.references?.find((item) => item.entityType === 'project');
    if (reference && reference.entityIds.length > 0) {
      reference.entityIds.forEach((entityId, index) => {
        const entity = resolveProjectEntity(entityId);
        if (entity) projectItems.push(entity);
        else diagnostics.push({ code: 'UNRESOLVED_REFERENCE_ENTITY', sectionKey: 'home.projects', path: `references.project.entityIds[${index}]`, message: `Project entity ${entityId} is unavailable in the production entity resolver.` });
      });
    }
  }
  const projCfg = isRecord(projectSection?.config) ? projectSection.config : {};
  const projects = {
    ...legacyFallback.projects,
    ...(typeof projCfg.title === 'string' ? { title: projCfg.title } : {}),
    ...(typeof projCfg.subtitle === 'string' ? { subtitle: projCfg.subtitle } : {}),
    ...(typeof projCfg.ctaLabel === 'string' ? { ctaLabel: projCfg.ctaLabel } : {}),
    ...(typeof projCfg.ctaUrl === 'string' ? { ctaUrl: projCfg.ctaUrl } : {}),
    ...(projectItems.length > 0 ? { items: projectItems } : {}),
  };

  // Stats
  let stats = legacyFallback.stats;
  const statsSec = sectionMap.get('home.stats');
  if (statsSec && isRecord(statsSec.config) && Array.isArray(statsSec.config.items)) {
    const items: HomeStatModel[] = [];
    for (const [index, rawItem] of statsSec.config.items.entries()) {
      if (isRecord(rawItem) && typeof rawItem.value === 'number' && Number.isFinite(rawItem.value) && typeof rawItem.label === 'string') {
        const hasPersistentId = typeof rawItem.id === 'string' && rawItem.id.length > 0;
        items.push({
          id: hasPersistentId ? (rawItem.id as string) : `unpersisted-home-stat-${index + 1}`,
          value: rawItem.value,
          suffix: typeof rawItem.suffix === 'string' ? rawItem.suffix : undefined,
          label: rawItem.label,
        });
      }
    }
    if (items.length > 0) {
      stats = { items };
    }
  }

  // Hero
  let hero = legacyFallback.hero;
  const heroSec = sectionMap.get('home.hero');
  if (heroSec && isRecord(heroSec.config)) {
    const rawSlides = Array.isArray(heroSec.config.slides) ? heroSec.config.slides : [];
    const fallbackSlides = legacyFallback.hero?.slides ?? [];
    const slides = rawSlides
      .filter((s): s is Record<string, unknown> => isRecord(s))
      .map((s, idx) => {
        const rawImg = s.img ?? s.image ?? s.imageUrl ?? s.backgroundImageId ?? s.background;
        const defaultImg = fallbackSlides[idx % Math.max(1, fallbackSlides.length)]?.img || '/banner_hero/doi_tac_cong_nghe_chien_luoc.png';
        const img = typeof rawImg === 'string' && rawImg.trim() ? rawImg.trim() : defaultImg;
        return {
          img,
          badge: typeof s.badge === 'string' ? s.badge : undefined,
          title: typeof s.title === 'string' ? s.title : '',
          sub: typeof s.sub === 'string' ? s.sub : (typeof s.subtitle === 'string' ? s.subtitle : ''),
        };
      });
    const rawMarquee = Array.isArray(heroSec.config.marqueeTexts) ? heroSec.config.marqueeTexts : [];
    const marqueeTexts = rawMarquee.map(String);
    if (slides.length > 0) {
      hero = {
        badge: typeof heroSec.config.badge === 'string' ? heroSec.config.badge : undefined,
        slides,
        marqueeTexts: marqueeTexts.length > 0 ? marqueeTexts : hero?.marqueeTexts,
      };
    }
  }

  // Intro
  let intro = legacyFallback.intro;
  const introSec = sectionMap.get('home.intro');
  if (introSec && isRecord(introSec.config)) {
    const cfg = introSec.config;
    const rawParagraphs = Array.isArray(cfg.paragraphs) ? cfg.paragraphs : [];
    intro = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : intro?.badge,
      title: typeof cfg.title === 'string' ? cfg.title : (intro?.title || ''),
      paragraphs: rawParagraphs.length > 0 ? rawParagraphs.map(String) : (intro?.paragraphs || []),
      videoUrl: typeof cfg.videoUrl === 'string' ? cfg.videoUrl : intro?.videoUrl,
      profilePdfUrl: typeof cfg.profilePdfUrl === 'string' ? cfg.profilePdfUrl : intro?.profilePdfUrl,
      primaryCtaId: typeof cfg.primaryCtaId === 'string' ? cfg.primaryCtaId : intro?.primaryCtaId,
      primaryCtaLabel: typeof cfg.primaryCtaLabel === 'string' ? cfg.primaryCtaLabel : intro?.primaryCtaLabel,
      primaryCtaUrl: typeof cfg.primaryCtaUrl === 'string' ? cfg.primaryCtaUrl : intro?.primaryCtaUrl,
      primaryCtaNewTab: typeof cfg.primaryCtaNewTab === 'boolean' ? cfg.primaryCtaNewTab : intro?.primaryCtaNewTab,
    };
  }

  // Awards
  let awards = legacyFallback.awards;
  const awardsSec = sectionMap.get('home.awards');
  if (awardsSec && isRecord(awardsSec.config)) {
    const cfg = awardsSec.config;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items = rawItems
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item) => ({
        name: typeof item.name === 'string' ? item.name : '',
        img: typeof item.img === 'string' && item.img ? item.img : (typeof item.imageId === 'string' ? item.imageId : ''),
      }));
    if (items.length > 0) {
      awards = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : awards?.badge,
        title: typeof cfg.title === 'string' ? cfg.title : awards?.title,
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : awards?.subtitle,
        items,
      };
    }
  }

  // Ecosystem
  let ecosystem = legacyFallback.ecosystem;
  const ecoSec = sectionMap.get('home.ecosystem');
  if (ecoSec && isRecord(ecoSec.config)) {
    const cfg = ecoSec.config;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items = rawItems
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item, idx) => ({
        id: typeof item.id === 'string' ? item.id : `eco-${idx + 1}`,
        title: typeof item.title === 'string' ? item.title : '',
        desc: typeof item.description === 'string' ? item.description : (typeof item.desc === 'string' ? item.desc : ''),
        tag: typeof item.tag === 'string' ? item.tag : (typeof item.badge === 'string' ? item.badge : ''),
        link: typeof item.link === 'string' ? item.link : '',
        badge: typeof item.badge === 'string' ? item.badge : (typeof item.tag === 'string' ? item.tag : 'Công nghệ'),
        imageId: typeof item.imageId === 'string' ? item.imageId : (typeof item.image === 'string' ? item.image : ''),
        image: typeof item.image === 'string' ? item.image : (typeof item.imageId === 'string' ? item.imageId : ''),
        view: item.view === 'services' ? ('services' as const) : ('products' as const),
        activeLink: item.activeLink === 'Dịch vụ' ? ('Dịch vụ' as const) : ('Sản phẩm' as const),
        serviceId: typeof item.serviceId === 'string' ? item.serviceId : null,
      }));
    if (items.length > 0) {
      ecosystem = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : ecosystem?.badge,
        title: typeof cfg.title === 'string' ? cfg.title : (ecosystem?.title || ''),
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : ecosystem?.subtitle,
        items,
      };
    } else if (cfg.title || cfg.subtitle) {
      ecosystem = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : ecosystem?.badge,
        title: typeof cfg.title === 'string' ? cfg.title : (ecosystem?.title || ''),
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : ecosystem?.subtitle,
        items: ecosystem?.items ?? [],
      };
    }
  }

  // Partners
  let partners = legacyFallback.partners;
  const partnersSec = sectionMap.get('home.partners');
  if (partnersSec) {
    const cfg = isRecord(partnersSec.config) ? partnersSec.config : {};
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const cfgItems: HomePartnerItemModel[] = rawItems
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item, idx) => ({
        id: typeof item.id === 'string' ? item.id : `partner-${idx + 1}`,
        name: typeof item.name === 'string' ? item.name : '',
        logo: typeof item.logo === 'string' && item.logo ? item.logo : (typeof item.imageId === 'string' ? item.imageId : ''),
        imageId: typeof item.imageId === 'string' && item.imageId ? item.imageId : (typeof item.logo === 'string' ? item.logo : undefined),
        link: typeof item.link === 'string' ? item.link : undefined,
      }));
    const finalItems = cfgItems.length > 0 ? cfgItems : (partners?.items ?? []);
    partners = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : partners?.badge,
      title: typeof cfg.title === 'string' ? cfg.title : partners?.title,
      subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : partners?.subtitle,
      items: finalItems,
    };
  }

  // Contact CTA
  let contactCta = legacyFallback.contactCta;
  const ctaSec = sectionMap.get('home.contact_cta');
  if (ctaSec && isRecord(ctaSec.config)) {
    const cfg = ctaSec.config;
    contactCta = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : contactCta?.badge,
      title: typeof cfg.title === 'string' ? cfg.title : (contactCta?.title || ''),
      description: typeof cfg.description === 'string' ? cfg.description : contactCta?.description,
      phone: typeof cfg.phone === 'string' ? cfg.phone : contactCta?.phone,
      email: typeof cfg.email === 'string' ? cfg.email : contactCta?.email,
      workingHours: typeof cfg.workingHours === 'string' ? cfg.workingHours : contactCta?.workingHours,
      formId: typeof cfg.formId === 'string' ? cfg.formId : contactCta?.formId,
      submitLabel: typeof cfg.submitLabel === 'string' ? cfg.submitLabel : contactCta?.submitLabel,
    };
  }

  // Events
  let events = legacyFallback.events;
  const eventsSec = sectionMap.get('home.events');
  if (eventsSec) {
    const cfg = isRecord(eventsSec.config) ? eventsSec.config : {};
    const ref = eventsSec.references?.find((item) => item.entityType === 'event');
    const refUpcoming: HomeEventItemModel[] = [];
    if (ref && ref.entityIds.length > 0) {
      ref.entityIds.forEach((id) => {
        const item = resolveEventEntity(id);
        if (item) refUpcoming.push(item);
      });
    }
    events = {
      ...legacyFallback.events,
      ...(typeof cfg.title === 'string' ? { title: cfg.title } : {}),
      ...(typeof cfg.subtitle === 'string' ? { subtitle: cfg.subtitle } : {}),
      ...(typeof cfg.badge === 'string' ? { badge: cfg.badge } : {}),
      ...(typeof cfg.ctaLabel === 'string' ? { ctaLabel: cfg.ctaLabel } : {}),
      ...(typeof cfg.ctaUrl === 'string' ? { ctaUrl: cfg.ctaUrl } : {}),
      upcomingEvents: refUpcoming.length > 0 ? refUpcoming : (legacyFallback.events?.upcomingEvents ?? []),
      pastEvents: legacyFallback.events?.pastEvents ?? [],
    };
  }

  // News
  let news = legacyFallback.news;
  const newsSec = sectionMap.get('home.news');
  if (newsSec) {
    const cfg = isRecord(newsSec.config) ? newsSec.config : {};
    const ref = newsSec.references?.find((item) => item.entityType === 'news');
    const refNews: HomeNewsItemModel[] = [];
    if (ref && ref.entityIds.length > 0) {
      ref.entityIds.forEach((id) => {
        const item = resolveNewsEntity(id);
        if (item) refNews.push(item);
      });
    }
    news = {
      ...legacyFallback.news,
      ...(typeof cfg.title === 'string' ? { title: cfg.title } : {}),
      ...(typeof cfg.subtitle === 'string' ? { subtitle: cfg.subtitle } : {}),
      ...(typeof cfg.badge === 'string' ? { badge: cfg.badge } : {}),
      ...(typeof cfg.ctaLabel === 'string' ? { ctaLabel: cfg.ctaLabel } : {}),
      ...(typeof cfg.ctaUrl === 'string' ? { ctaUrl: cfg.ctaUrl } : {}),
      items: refNews.length > 0 ? refNews : (legacyFallback.news?.items ?? []),
    };
  }

  return {
    content: {
      hero,
      intro,
      stats,
      awards,
      ecosystem,
      projects,
      events,
      news,
      partners,
      contactCta,
    },
    diagnostics,
    source: 'page-builder',
  };
}

function resolveAboutCapacity(input: ResolveCapacityExperiencePageContentInput): ResolvedCapacityExperiencePageContent {
  const section = input.version?.sections.find((item) => item.sectionKey === 'about.capacity');
  if (!section) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };
  const rawDesc = section.config.description;
  const rawMetrics = section.config.metrics;
  const description = typeof rawDesc === 'string' && rawDesc.trim() ? rawDesc.trim() : input.legacyFallback.capacity.description;
  const diagnostics: PageContentDiagnostic[] = [];
  const metrics: AboutCapacityMetricModel[] = [];

  if (Array.isArray(rawMetrics) && rawMetrics.length > 0) {
    for (const [index, rawMetric] of rawMetrics.entries()) {
      const path = `config.metrics[${index}]`;
      if (isRecord(rawMetric) && typeof rawMetric.value === 'string' && typeof rawMetric.label === 'string') {
        const hasPersistentId = typeof rawMetric.id === 'string' && rawMetric.id.length > 0;
        if (!hasPersistentId) diagnostics.push({
          code: 'UNPERSISTED_ABOUT_CAPACITY_METRIC_ID', sectionKey: 'about.capacity', path: `${path}.id`,
          message: 'The metric has no persistent ID. Inline persistence remains blocked for this item.',
        });
        metrics.push({ id: hasPersistentId ? rawMetric.id as string : `unpersisted-about-capacity-metric-${index + 1}`, value: rawMetric.value, label: rawMetric.label });
      }
    }
  }

  const finalMetrics = metrics.length > 0 ? metrics : input.legacyFallback.capacity.metrics;
  return { content: { capacity: { description, metrics: finalMetrics } }, diagnostics, source: 'page-builder' };
}

function resolveAboutPage(input: ResolveAboutPageContentInput): ResolvedAboutPageContent {
  if (!input.version) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };
  const timelineSection = input.version.sections.find((item) => item.sectionKey === 'about.timeline');
  const strategySection = input.version.sections.find((item) => item.sectionKey === 'about.strategy');
  if (!timelineSection || !strategySection) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };

  const diagnostics: PageContentDiagnostic[] = [];
  const milestones: AboutTimelineMilestoneModel[] = [];
  const rawMilestones = Array.isArray(timelineSection.config.milestones) ? timelineSection.config.milestones : [];
  for (const [index, raw] of rawMilestones.entries()) {
    if (isRecord(raw) && typeof raw.year === 'string' && typeof raw.description === 'string') {
      const persisted = typeof raw.id === 'string' && raw.id.length > 0;
      if (!persisted) diagnostics.push({ code: 'UNPERSISTED_ABOUT_TIMELINE_ID', sectionKey: 'about.timeline', path: `config.milestones[${index}].id`, message: 'Timeline milestone identity is not persisted.' });
      milestones.push({ id: persisted ? raw.id as string : `unpersisted-about-timeline-${index + 1}`, year: raw.year, description: raw.description });
    }
  }

  const timelineTitle = typeof timelineSection.config.title === 'string' && timelineSection.config.title.trim()
    ? timelineSection.config.title.trim()
    : input.legacyFallback.timeline.title;
  const finalMilestones = milestones.length > 0 ? milestones : input.legacyFallback.timeline.milestones;

  const stratCfg = strategySection.config;
  const title = typeof stratCfg.title === 'string' && stratCfg.title.trim() ? stratCfg.title.trim() : input.legacyFallback.strategy.title;
  const subtitle = typeof stratCfg.subtitle === 'string' && stratCfg.subtitle.trim() ? stratCfg.subtitle.trim() : input.legacyFallback.strategy.subtitle;
  const vision = typeof stratCfg.vision === 'string' && stratCfg.vision.trim() ? stratCfg.vision.trim() : input.legacyFallback.strategy.vision;
  const mission = typeof stratCfg.mission === 'string' && stratCfg.mission.trim() ? stratCfg.mission.trim() : input.legacyFallback.strategy.mission;

  const coreValues: AboutStrategyCoreValueModel[] = [];
  const rawCoreValues = Array.isArray(stratCfg.coreValues) ? stratCfg.coreValues : [];
  for (const [index, raw] of rawCoreValues.entries()) {
    if (isRecord(raw) && typeof raw.value === 'string') {
      const persisted = typeof raw.id === 'string' && raw.id.length > 0;
      if (!persisted) diagnostics.push({ code: 'UNPERSISTED_ABOUT_CORE_VALUE_ID', sectionKey: 'about.strategy', path: `config.coreValues[${index}].id`, message: 'Core value identity is not persisted.' });
      coreValues.push({ id: persisted ? raw.id as string : `unpersisted-about-core-value-${index + 1}`, value: raw.value });
    }
  }
  const finalCoreValues = coreValues.length > 0 ? coreValues : input.legacyFallback.strategy.coreValues;

  return {
    content: {
      timeline: { title: timelineTitle, milestones: finalMilestones },
      strategy: { title, subtitle, vision, mission, coreValues: finalCoreValues },
    },
    diagnostics,
    source: 'page-builder',
  };
}

function resolveContactPage(input: ResolveContactPageContentInput): ResolvedContactPageContent {
  const section = input.version?.sections.find((item) => item.sectionKey === 'contact.branches');
  if (!section) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };
  if (typeof section.config.title !== 'string' || !Array.isArray(section.config.branches)) return { content: input.legacyFallback, diagnostics: [{ code: 'INVALID_CONTACT_BRANCHES', sectionKey: 'contact.branches', path: 'config', message: 'contact.branches requires a title and branches array.' }], source: 'invalid' };
  const branches: ContactBranchModel[] = [];
  for (const [index, raw] of section.config.branches.entries()) {
    if (!isRecord(raw) || typeof raw.key !== 'string' || typeof raw.name !== 'string' || typeof raw.address !== 'string' || typeof raw.phone !== 'string' || typeof raw.email !== 'string' || typeof raw.workingHours !== 'string' || typeof raw.mapUrl !== 'string') return { content: input.legacyFallback, diagnostics: [{ code: 'INVALID_CONTACT_BRANCHES', sectionKey: 'contact.branches', path: `config.branches[${index}]`, message: 'Each contact branch requires key, name, address, phone, email, workingHours, and mapUrl.' }], source: 'invalid' };
    branches.push({ id: raw.key, name: raw.name, address: raw.address, phone: raw.phone, email: raw.email, workingHours: raw.workingHours, mapUrl: raw.mapUrl, fax: typeof raw.fax === 'string' ? raw.fax : undefined, searchQuery: typeof raw.searchQuery === 'string' ? raw.searchQuery : raw.address });
  }
  return { content: { branches: { title: section.config.title, branches } }, diagnostics: [], source: 'page-builder' };
}

export function resolvePageContent(input: ResolveHomePageContentInput): ResolvedHomePageContent;
export function resolvePageContent(input: ResolveCapacityExperiencePageContentInput): ResolvedCapacityExperiencePageContent;
export function resolvePageContent(input: ResolveAboutPageContentInput): ResolvedAboutPageContent;
export function resolvePageContent(input: ResolveContactPageContentInput): ResolvedContactPageContent;
export function resolvePageContent(input: ResolveHomePageContentInput | ResolveCapacityExperiencePageContentInput | ResolveAboutPageContentInput | ResolveContactPageContentInput): ResolvedHomePageContent | ResolvedCapacityExperiencePageContent | ResolvedAboutPageContent | ResolvedContactPageContent {
  if (input.pageType === 'home') return resolveHomeContent(input.version, input.legacyFallback);
  if (input.pageType === 'about') return resolveAboutPage(input);
  if (input.pageType === 'contact') return resolveContactPage(input);
  return resolveAboutCapacity(input);
}
