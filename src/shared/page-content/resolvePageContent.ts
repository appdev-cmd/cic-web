import type { AboutCapacityMetricModel, AboutPageModel, AboutStrategyCoreValueModel, AboutTimelineMilestoneModel, CapacityExperiencePageModel, ContactBranchModel, ContactPageModel, HomePageModel, HomeProjectModel, HomeStatModel } from './models';
import { resolveProjectEntity } from './resolveReferenceEntity';

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
  const projects = projectItems.length > 0 ? { ...legacyFallback.projects, items: projectItems } : legacyFallback.projects;

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
        img: typeof item.img === 'string' ? item.img : (typeof item.imageId === 'string' ? item.imageId : ''),
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
        desc: typeof item.desc === 'string' ? item.desc : (typeof item.description === 'string' ? item.description : ''),
        tag: typeof item.tag === 'string' ? item.tag : '',
        link: typeof item.link === 'string' ? item.link : '',
      }));
    if (items.length > 0) {
      ecosystem = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : ecosystem?.badge,
        title: typeof cfg.title === 'string' ? cfg.title : (ecosystem?.title || ''),
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : ecosystem?.subtitle,
        items,
      };
    }
  }

  // Partners
  let partners = legacyFallback.partners;
  const partnersSec = sectionMap.get('home.partners');
  if (partnersSec && isRecord(partnersSec.config)) {
    const cfg = partnersSec.config;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items = rawItems
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item) => ({
        name: typeof item.name === 'string' ? item.name : '',
        logo: typeof item.logo === 'string' ? item.logo : (typeof item.imageId === 'string' ? item.imageId : ''),
      }));
    if (items.length > 0) {
      partners = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : partners?.badge,
        title: typeof cfg.title === 'string' ? cfg.title : partners?.title,
        items,
      };
    }
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

  return {
    content: {
      hero,
      intro,
      stats,
      awards,
      ecosystem,
      projects,
      events: legacyFallback.events,
      news: legacyFallback.news,
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

function resolveAboutPage(input: ResolveAboutPageContentInput): ResolvedAboutPageContent {
  if (!input.version) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };
  const timelineSection = input.version.sections.find((item) => item.sectionKey === 'about.timeline');
  const strategySection = input.version.sections.find((item) => item.sectionKey === 'about.strategy');
  if (!timelineSection || !strategySection) return { content: input.legacyFallback, diagnostics: [], source: 'legacy' };
  if (typeof timelineSection.config.title !== 'string' || !Array.isArray(timelineSection.config.milestones)) {
    return { content: input.legacyFallback, diagnostics: [{ code: 'INVALID_ABOUT_TIMELINE', sectionKey: 'about.timeline', path: 'config', message: 'about.timeline requires title and milestones.' }], source: 'invalid' };
  }
  const diagnostics: PageContentDiagnostic[] = [];
  const milestones: AboutTimelineMilestoneModel[] = [];
  for (const [index, raw] of timelineSection.config.milestones.entries()) {
    if (!isRecord(raw) || typeof raw.year !== 'string' || typeof raw.description !== 'string') return { content: input.legacyFallback, diagnostics: [{ code: 'INVALID_ABOUT_TIMELINE', sectionKey: 'about.timeline', path: `config.milestones[${index}]`, message: 'Timeline milestones require string year and description fields.' }], source: 'invalid' };
    const persisted = typeof raw.id === 'string' && raw.id.length > 0;
    if (!persisted) diagnostics.push({ code: 'UNPERSISTED_ABOUT_TIMELINE_ID', sectionKey: 'about.timeline', path: `config.milestones[${index}].id`, message: 'Timeline milestone identity is not persisted.' });
    milestones.push({ id: persisted ? raw.id as string : `unpersisted-about-timeline-${index + 1}`, year: raw.year, description: raw.description });
  }
  const { title, subtitle, vision, mission, coreValues: rawCoreValues } = strategySection.config;
  if ([title, subtitle, vision, mission].some((value) => typeof value !== 'string') || !Array.isArray(rawCoreValues)) return { content: input.legacyFallback, diagnostics: [{ code: 'INVALID_ABOUT_STRATEGY', sectionKey: 'about.strategy', path: 'config', message: 'about.strategy requires string copy and a coreValues array.' }], source: 'invalid' };
  const coreValues: AboutStrategyCoreValueModel[] = [];
  for (const [index, raw] of rawCoreValues.entries()) {
    if (!isRecord(raw) || typeof raw.value !== 'string') return { content: input.legacyFallback, diagnostics: [{ code: 'INVALID_ABOUT_STRATEGY', sectionKey: 'about.strategy', path: `config.coreValues[${index}]`, message: 'Core values require an object with a string value.' }], source: 'invalid' };
    const persisted = typeof raw.id === 'string' && raw.id.length > 0;
    if (!persisted) diagnostics.push({ code: 'UNPERSISTED_ABOUT_CORE_VALUE_ID', sectionKey: 'about.strategy', path: `config.coreValues[${index}].id`, message: 'Core value identity is not persisted.' });
    coreValues.push({ id: persisted ? raw.id as string : `unpersisted-about-core-value-${index + 1}`, value: raw.value });
  }
  return { content: { timeline: { title: timelineSection.config.title, milestones }, strategy: { title: title as string, subtitle: subtitle as string, vision: vision as string, mission: mission as string, coreValues } }, diagnostics, source: 'page-builder' };
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
