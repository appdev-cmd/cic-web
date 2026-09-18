import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { getPublicPublishedPage } from './repository';
import { getLegacyHomePageContent } from '@/shared/page-content/legacyPageContent';
import { parseLocaleNumber } from '@/shared/visual-editing/inlineTextEditing';
import type {
  HomePageModel,
  HomeHeroModel,
  HomeHeroSlideModel,
  HomeIntroModel,
  HomeStatsModel,
  HomeStatModel,
  HomeAwardsModel,
  HomeAwardItemModel,
  HomeEcosystemModel,
  HomeEcosystemItemModel,
  HomeProjectsModel,
  HomeProjectModel,
  HomeEventsModel,
  HomeEventItemModel,
  HomeNewsModel,
  HomeNewsItemModel,
  HomePartnersModel,
  HomePartnerItemModel,
  HomeContactCtaModel,
} from '@/shared/page-content/models';

function normalizeImageUrl(url: unknown): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://www.cic.com.vn/${trimmed}`;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const homePageCache: { vi?: { data: HomePageModel; exp: number }; en?: { data: HomePageModel; exp: number } } = {};

export function invalidateHomePageCache() {
  delete homePageCache.vi;
  delete homePageCache.en;
}

/**
 * Loads published Home page content from PostgreSQL and aggregates
 * real entity records from cic_projects, cic_event, and cic_news.
 */
export async function getPublishedHomePage(workspace: 'vi' | 'en' = 'vi'): Promise<HomePageModel> {
  const now = Date.now();
  const cached = homePageCache[workspace];
  if (cached && cached.exp > now) {
    return cached.data;
  }

  const publishedRev = await getPublicPublishedPage(workspace, 'home');
  const legacy = getLegacyHomePageContent(workspace);

  if (!publishedRev || !publishedRev.sections || publishedRev.sections.length === 0) {
    return legacy;
  }

  const sql = getPostgresClient();
  const isEn = workspace === 'en';
  const newsTable = isEn ? sql`cic_news_en` : sql`cic_news`;
  const projTable = isEn ? sql`cic_projects_en` : sql`cic_projects`;
  const eventTable = isEn ? sql`cic_event_en` : sql`cic_event`;

  const sectionMap = new Map<string, typeof publishedRev.sections[0]>();
  for (const s of publishedRev.sections) {
    sectionMap.set(s.sectionKey, s);
  }

  // Concurrent resolver functions to avoid sequential database waterfall
  const resolveHotNews = async (): Promise<string[]> => {
    const heroSec = sectionMap.get('home.hero');
    const cfg = (heroSec?.config ?? {}) as Record<string, unknown>;
    const rawMarquee = Array.isArray(cfg.marqueeTexts) && cfg.marqueeTexts.length > 0
      ? cfg.marqueeTexts
      : (Array.isArray(cfg.tickerItems) && cfg.tickerItems.length > 0 ? cfg.tickerItems : []);
    const marqueeTexts = rawMarquee.map((t: unknown) => String(t)).filter((t: string) => t.trim().length > 0);
    if (marqueeTexts.length > 0) return marqueeTexts;
    try {
      let hotNewsRows = await sql`
        SELECT title
        FROM ${newsTable}
        WHERE published = true AND is_hot = true
        ORDER BY coalesce(start_time, created_time) DESC
        LIMIT 6
      `;
      if (hotNewsRows.length === 0) {
        hotNewsRows = await sql`
          SELECT title
          FROM ${newsTable}
          WHERE published = true
          ORDER BY coalesce(start_time, created_time) DESC
          LIMIT 6
        `;
      }
      return hotNewsRows.map((r: any) => String(r.title).trim()).filter(Boolean);
    } catch (tickerErr) {
      console.warn('[homeResolver] Failed to load hot news ticker from news table:', tickerErr);
      return [];
    }
  };

  const resolveProjects = async (): Promise<any[]> => {
    const projSec = sectionMap.get('home.projects');
    try {
      const projectRefs = projSec?.references?.filter((r) => r.entityType === 'project') ?? [];
      if (projectRefs.length > 0) {
        const entityIds = projectRefs.map((r) => Number(r.entityId)).filter((n) => !isNaN(n));
        if (entityIds.length > 0) {
          const rows = await sql`
            SELECT * FROM ${projTable}
            WHERE id IN ${sql(entityIds)} AND published = true
          `;
          const map = new Map(rows.map((r) => [Number(r.id), r]));
          const ordered = entityIds.map((id) => map.get(id)).filter(Boolean);
          if (ordered.length > 0) return ordered;
        }
      }
      let rows = await sql`
        SELECT * FROM ${projTable}
        WHERE published = true AND is_featured = true
        ORDER BY ordering, id
        LIMIT 4
      `;
      if (rows.length === 0) {
        rows = await sql`
          SELECT * FROM ${projTable}
          WHERE published = true
          ORDER BY ordering, id
          LIMIT 4
        `;
      }
      return rows;
    } catch (err) {
      console.error('Failed to load projects for home page:', err);
      return [];
    }
  };

  const resolveEvents = async (): Promise<any[]> => {
    const eventSec = sectionMap.get('home.events');
    try {
      const eventRefs = eventSec?.references?.filter((r) => r.entityType === 'event') ?? [];
      if (eventRefs.length > 0) {
        const entityIds = eventRefs.map((r) => Number(r.entityId)).filter((n) => !isNaN(n));
        if (entityIds.length > 0) {
          const rows = await sql`
            SELECT id, title, alias, image, summary, time_event, place, link_dangky
            FROM ${eventTable}
            WHERE id IN ${sql(entityIds)} AND published = true
          `;
          const map = new Map(rows.map((r) => [Number(r.id), r]));
          const ordered = entityIds.map((id) => map.get(id)).filter(Boolean);
          if (ordered.length > 0) return ordered;
        }
      }
      let rows = await sql`
        SELECT id, title, alias, image, summary, time_event, place, link_dangky
        FROM ${eventTable}
        WHERE published = true AND (show_in_homepage = true OR is_hot = true)
        ORDER BY coalesce(time_event, created_time) DESC
        LIMIT 4
      `;
      if (rows.length === 0) {
        rows = await sql`
          SELECT id, title, alias, image, summary, time_event, place, link_dangky
          FROM ${eventTable}
          WHERE published = true
          ORDER BY coalesce(time_event, created_time) DESC
          LIMIT 4
        `;
      }
      return rows;
    } catch (err) {
      console.error('Failed to load events for home page:', err);
      return [];
    }
  };

  const resolveNews = async (): Promise<any[]> => {
    const newsSec = sectionMap.get('home.news');
    try {
      const newsRefs = newsSec?.references?.filter((r) => r.entityType === 'news') ?? [];
      if (newsRefs.length > 0) {
        const entityIds = newsRefs.map((r) => Number(r.entityId)).filter((n) => !isNaN(n));
        if (entityIds.length > 0) {
          const rows = await sql`
            SELECT id, title, alias, image, summary, category_name, start_time, created_time
            FROM ${newsTable}
            WHERE id IN ${sql(entityIds)} AND published = true
          `;
          const map = new Map(rows.map((r) => [Number(r.id), r]));
          const ordered = entityIds.map((id) => map.get(id)).filter(Boolean);
          if (ordered.length > 0) return ordered;
        }
      }
      let rows = await sql`
        SELECT id, title, alias, image, summary, category_name, start_time, created_time
        FROM ${newsTable}
        WHERE published = true AND (show_in_homepage = true OR is_hot = true)
        ORDER BY coalesce(start_time, created_time) DESC
        LIMIT 4
      `;
      if (rows.length === 0) {
        rows = await sql`
          SELECT id, title, alias, image, summary, category_name, start_time, created_time
          FROM ${newsTable}
          WHERE published = true
          ORDER BY coalesce(start_time, created_time) DESC
          LIMIT 4
        `;
      }
      return rows;
    } catch (err) {
      console.error('Failed to load news for home page:', err);
      return [];
    }
  };

  const [resolvedMarquee, projectRows, eventRows, rawNews] = await Promise.all([
    resolveHotNews(),
    resolveProjects(),
    resolveEvents(),
    resolveNews(),
  ]);

  // 1. home.hero
  let hero: HomeHeroModel = legacy.hero ?? { slides: [] };
  const heroSec = sectionMap.get('home.hero');
  if (heroSec && heroSec.config) {
    const cfg = heroSec.config as Record<string, unknown>;
    const rawSlides = Array.isArray(cfg.slides) ? cfg.slides : [];
    const fallbackSlides = legacy.hero?.slides ?? [];
    const slides: HomeHeroSlideModel[] = rawSlides.map((s: Record<string, unknown>, idx: number) => {
      const rawImg = s.img || s.image || s.imageUrl || s.backgroundImageId || s.background;
      const normalized = typeof rawImg === 'string' && rawImg.trim() ? normalizeImageUrl(rawImg) : '';
      const defaultImg = fallbackSlides[idx % Math.max(1, fallbackSlides.length)]?.img || '/banner_hero/doi_tac_cong_nghe_chien_luoc.png';
      return {
        img: normalized || defaultImg,
        badge: typeof s.badge === 'string' ? s.badge : undefined,
        title: typeof s.title === 'string' ? s.title : '',
        sub: typeof s.sub === 'string' ? s.sub : (typeof s.subtitle === 'string' ? s.subtitle : ''),
      };
    });

    hero = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : undefined,
      slides: slides.length > 0 ? slides : (legacy.hero?.slides ?? []),
      marqueeTexts: resolvedMarquee.length > 0 ? resolvedMarquee : legacy.hero?.marqueeTexts,
    };
  }

  // 2. home.intro
  let intro: HomeIntroModel = legacy.intro ?? {
    title: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
    paragraphs: [],
  };
  const introSec = sectionMap.get('home.intro');
  if (introSec && introSec.config) {
    const cfg = introSec.config as Record<string, unknown>;
    const rawParagraphs = Array.isArray(cfg.paragraphs) ? cfg.paragraphs : [];
    intro = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : intro.badge,
      title: typeof cfg.title === 'string' ? cfg.title : intro.title,
      paragraphs: rawParagraphs.length > 0 ? rawParagraphs.map((p: unknown) => String(p)) : intro.paragraphs,
      videoUrl: typeof cfg.videoUrl === 'string' ? cfg.videoUrl : intro.videoUrl,
      profilePdfUrl: typeof cfg.profilePdfUrl === 'string' ? cfg.profilePdfUrl : intro.profilePdfUrl,
    };
  }

  // 3. home.stats
  let stats: HomeStatsModel = legacy.stats;
  const statsSec = sectionMap.get('home.stats');
  if (statsSec && statsSec.config) {
    const cfg = statsSec.config as Record<string, unknown>;
    if (Array.isArray(cfg.items) && cfg.items.length > 0) {
      const items: HomeStatModel[] = cfg.items.map((item: Record<string, unknown>, idx: number) => ({
        id: String(item.id || `home-stat-${idx + 1}`),
        value: typeof item.value === 'number'
          ? item.value
          : (parseLocaleNumber(String(item.value ?? item.val ?? '')) ?? 0),
        suffix: typeof item.suffix === 'string' ? item.suffix : undefined,
        label: typeof item.label === 'string' ? item.label : '',
      }));
      stats = { items };
    }
  }

  // 4. home.awards
  let awards: HomeAwardsModel = legacy.awards ?? { items: [] };
  const awardsSec = sectionMap.get('home.awards');
  if (awardsSec && awardsSec.config) {
    const cfg = awardsSec.config as Record<string, unknown>;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items: readonly HomeAwardItemModel[] = rawItems.length > 0
      ? rawItems.map((item: Record<string, unknown>) => ({
          name: typeof item.name === 'string' ? item.name : '',
          img: normalizeImageUrl(item.img || item.imageId || item.image),
        }))
      : awards.items;
    awards = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : awards.badge,
      title: typeof cfg.title === 'string' ? cfg.title : awards.title,
      subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : awards.subtitle,
      items,
    };
  }

  // 5. home.ecosystem
  let ecosystem: HomeEcosystemModel = legacy.ecosystem ?? { items: [] };
  const ecoSec = sectionMap.get('home.ecosystem');
  if (ecoSec && ecoSec.config) {
    const cfg = ecoSec.config as Record<string, unknown>;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items: readonly HomeEcosystemItemModel[] = rawItems.length > 0
      ? rawItems.map((item: Record<string, unknown>, idx: number) => {
          const desc = typeof item.desc === 'string' && item.desc ? item.desc : (typeof item.description === 'string' ? item.description : '');
          const badge = typeof item.badge === 'string' && item.badge ? item.badge : (typeof item.tag === 'string' && item.tag ? item.tag : 'Công nghệ');
          const img = normalizeImageUrl(item.image || item.imageId || item.img);
          return {
            id: String(item.id || `eco-${idx + 1}`),
            title: typeof item.title === 'string' ? item.title : '',
            desc,
            tag: badge,
            badge,
            link: typeof item.link === 'string' ? item.link : '',
            image: img,
            imageId: typeof item.imageId === 'string' ? item.imageId : undefined,
            view: item.view === 'services' ? ('services' as const) : ('products' as const),
            activeLink: item.activeLink === 'Dịch vụ' ? ('Dịch vụ' as const) : ('Sản phẩm' as const),
            serviceId: typeof item.serviceId === 'string' ? item.serviceId : (item.serviceId === null ? null : undefined),
          };
        })
      : ecosystem.items;
    ecosystem = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : ecosystem.badge,
      title: typeof cfg.title === 'string' ? cfg.title : ecosystem.title,
      subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : ecosystem.subtitle,
      items,
    };
  }

  // 6. home.projects (real entity query)
  let projects: HomeProjectsModel = legacy.projects;
  const projSec = sectionMap.get('home.projects');
  if (projectRows.length > 0) {
    const mappedProjects: HomeProjectModel[] = projectRows.map((p, idx) => ({
      id: Number(p.id),
      entityId: `cic-project-${p.id}`,
      type: 'services' as const,
      name: p.title || '',
      short: p.title || '',
      service: p.solution || (isEn ? 'Technical Consulting' : 'Tư vấn kỹ thuật'),
      client: p.customer_name ? `${p.customer_name}${p.location ? ` · ${p.location}` : ''}` : (p.location || ''),
      category: p.solution || p.sector || (isEn ? 'Flagship Project' : 'Dự án trọng điểm'),
      description: p.summary || p.tagline || '',
      img: normalizeImageUrl(p.image),
      location: p.location || '',
      tags: typeof p.technologies === 'string'
        ? p.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
        : (isEn ? ['BIM', 'Digital Twins', 'Infrastructure'] : ['BIM', 'Digital Twins', 'Hạ tầng']),
      size: idx === 0 ? ('full' as const) : ('small' as const),
    }));
    projects = { ...projects, items: mappedProjects };
  }
  const projCfg = (projSec?.config ?? {}) as Record<string, unknown>;
  projects = {
    badge: typeof projCfg.badge === 'string' ? projCfg.badge : projects.badge,
    title: typeof projCfg.title === 'string' ? projCfg.title : projects.title,
    subtitle: typeof projCfg.subtitle === 'string' ? projCfg.subtitle : projects.subtitle,
    items: projects.items,
  };

  // 7. home.events (real entity query)
  let events: HomeEventsModel = legacy.events ?? { upcomingEvents: [], pastEvents: [] };
  const eventSec = sectionMap.get('home.events');
  if (eventRows.length > 0) {
    const mappedEvents: HomeEventItemModel[] = eventRows.map((e) => {
      const isPast = e.time_event ? new Date(e.time_event).getTime() < Date.now() : false;
      return {
        id: Number(e.id),
        title: e.title || '',
        date: formatDate(e.time_event),
        time: '08:30 - 16:30',
        loc: e.place || (isEn ? 'CIC Technology Convention Center' : 'Trung tâm Hội thảo CIC'),
        attendees: isPast ? (isEn ? '300+ Attendees' : '300+ Khách mời') : (isEn ? '500+ Attendees' : '500+ Khách mời'),
        isPast,
        img: normalizeImageUrl(e.image),
        desc: e.summary || '',
        ctaUrl: e.link_dangky || (e.alias ? (isEn ? `/en/events/${e.alias}` : `/events/${e.alias}`) : (isEn ? `/en/events/${e.id}` : `/events/${e.id}`)),
      };
    });
    events = { ...events, upcomingEvents: mappedEvents, pastEvents: [] };
  }
  const eventCfg = (eventSec?.config ?? {}) as Record<string, unknown>;
  events = {
    badge: typeof eventCfg.badge === 'string' ? eventCfg.badge : events.badge,
    title: typeof eventCfg.title === 'string' ? eventCfg.title : events.title,
    subtitle: typeof eventCfg.subtitle === 'string' ? eventCfg.subtitle : events.subtitle,
    ctaLabel: typeof eventCfg.ctaLabel === 'string' ? eventCfg.ctaLabel : (isEn ? 'Explore Events' : 'Xem sự kiện'),
    ctaUrl: typeof eventCfg.ctaUrl === 'string' ? eventCfg.ctaUrl : (isEn ? '/en/events' : '/events'),
    upcomingEvents: events.upcomingEvents,
    pastEvents: events.pastEvents,
  };

  // 8. home.news (real entity query)
  let news: HomeNewsModel = legacy.news ?? { items: [] };
  const newsSec = sectionMap.get('home.news');
  if (rawNews.length > 0) {
    const mappedNews: HomeNewsItemModel[] = rawNews.map((n) => ({
      id: Number(n.id),
      title: n.title || '',
      category: n.category_name || (isEn ? 'Technology News' : 'Tin tức công nghệ'),
      date: formatDate(n.start_time || n.created_time),
      readTime: isEn ? '5 min read' : '5 phút đọc',
      author: isEn ? 'CIC Editorial Team' : 'Ban biên tập CIC',
      desc: n.summary || '',
      img: normalizeImageUrl(n.image),
      featured: false,
      slug: n.alias ? String(n.alias) : undefined,
    }));
    news = { ...news, items: mappedNews };
  }
  const newsCfg = (newsSec?.config ?? {}) as Record<string, unknown>;
  news = {
    badge: typeof newsCfg.badge === 'string' ? newsCfg.badge : news.badge,
    title: typeof newsCfg.title === 'string' ? newsCfg.title : news.title,
    subtitle: typeof newsCfg.subtitle === 'string' ? newsCfg.subtitle : news.subtitle,
    ctaLabel: typeof newsCfg.ctaLabel === 'string' ? newsCfg.ctaLabel : news.ctaLabel,
    ctaUrl: typeof newsCfg.ctaUrl === 'string' ? newsCfg.ctaUrl : news.ctaUrl,
    items: news.items,
  };

  // 9. home.partners
  let partners: HomePartnersModel = legacy.partners ?? { items: [] };
  const partnersSec = sectionMap.get('home.partners');
  if (partnersSec && partnersSec.config) {
    const cfg = partnersSec.config as Record<string, unknown>;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items: readonly HomePartnerItemModel[] = rawItems.length > 0
      ? rawItems.map((item: Record<string, unknown>) => ({
          name: typeof item.name === 'string' ? item.name : '',
          logo: normalizeImageUrl(item.logo || item.imageId || item.image),
        }))
      : partners.items;
    partners = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : partners.badge,
      title: typeof cfg.title === 'string' ? cfg.title : partners.title,
      subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : partners.subtitle,
      items,
    };
  }

  // 10. home.contact_cta
  let contactCta: HomeContactCtaModel = legacy.contactCta ?? {
    title: 'Sẵn sàng kiến tạo Tương lai số',
  };
  const ctaSec = sectionMap.get('home.contact_cta');
  if (ctaSec && ctaSec.config) {
    const cfg = ctaSec.config as Record<string, unknown>;
    contactCta = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : contactCta.badge,
      title: typeof cfg.title === 'string' ? cfg.title : contactCta.title,
      description: typeof cfg.description === 'string' ? cfg.description : contactCta.description,
      phone: typeof cfg.phone === 'string' ? cfg.phone : contactCta.phone,
      email: typeof cfg.email === 'string' ? cfg.email : contactCta.email,
      workingHours: typeof cfg.workingHours === 'string' ? cfg.workingHours : contactCta.workingHours,
      formId: typeof cfg.formId === 'string' ? cfg.formId : contactCta.formId,
      submitLabel: typeof cfg.submitLabel === 'string' ? cfg.submitLabel : contactCta.submitLabel,
    };
  }

  const result: HomePageModel = {
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
  };
  homePageCache[workspace] = { data: result, exp: now + 30_000 };
  return result;
}
