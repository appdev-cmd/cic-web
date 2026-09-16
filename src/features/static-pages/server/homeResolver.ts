import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { getPublicPublishedPage } from './repository';
import { getLegacyHomePageContent } from '@/shared/page-content/legacyPageContent';
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

/**
 * Loads published Home page content from PostgreSQL and aggregates
 * real entity records from cic_projects, cic_event, and cic_news.
 */
export async function getPublishedHomePage(workspace: 'vi' | 'en' = 'vi'): Promise<HomePageModel> {
  const publishedRev = await getPublicPublishedPage(workspace, 'home');
  const legacy = getLegacyHomePageContent();

  if (!publishedRev || !publishedRev.sections || publishedRev.sections.length === 0) {
    return legacy;
  }

  const sql = getPostgresClient();
  const sectionMap = new Map<string, typeof publishedRev.sections[0]>();
  for (const s of publishedRev.sections) {
    sectionMap.set(s.sectionKey, s);
  }

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

    const rawMarquee = Array.isArray(cfg.marqueeTexts) ? cfg.marqueeTexts : [];
    const marqueeTexts = rawMarquee.map((t: unknown) => String(t));

    hero = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : undefined,
      slides: slides.length > 0 ? slides : (legacy.hero?.slides ?? []),
      marqueeTexts: marqueeTexts.length > 0 ? marqueeTexts : legacy.hero?.marqueeTexts,
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
        value: typeof item.value === 'number' ? item.value : (Number(item.val) || 0),
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
    if (rawItems.length > 0) {
      const items: HomeAwardItemModel[] = rawItems.map((item: Record<string, unknown>) => ({
        name: typeof item.name === 'string' ? item.name : '',
        img: normalizeImageUrl(item.img || item.imageId || item.image),
      }));
      awards = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : awards.badge,
        title: typeof cfg.title === 'string' ? cfg.title : awards.title,
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : awards.subtitle,
        items,
      };
    }
  }

  // 5. home.ecosystem
  let ecosystem: HomeEcosystemModel = legacy.ecosystem ?? { items: [] };
  const ecoSec = sectionMap.get('home.ecosystem');
  if (ecoSec && ecoSec.config) {
    const cfg = ecoSec.config as Record<string, unknown>;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    if (rawItems.length > 0) {
      const items: HomeEcosystemItemModel[] = rawItems.map((item: Record<string, unknown>, idx: number) => {
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
      });
      ecosystem = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : ecosystem.badge,
        title: typeof cfg.title === 'string' ? cfg.title : ecosystem.title,
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : ecosystem.subtitle,
        items,
      };
    }
  }

  // 6. home.projects (real entity query)
  let projects: HomeProjectsModel = legacy.projects;
  const projSec = sectionMap.get('home.projects');
  try {
    const projectRefs = projSec?.references?.filter((r) => r.entityType === 'project') ?? [];
    let projectRows: any[] = [];

    if (projectRefs.length > 0) {
      const entityIds = projectRefs.map((r) => Number(r.entityId)).filter((n) => !isNaN(n));
      if (entityIds.length > 0) {
        projectRows = await sql`
          SELECT * FROM cic_projects
          WHERE id IN ${sql(entityIds)} AND published = true
        `;
        // preserve order
        const map = new Map(projectRows.map((r) => [Number(r.id), r]));
        projectRows = entityIds.map((id) => map.get(id)).filter(Boolean);
      }
    }

    if (projectRows.length === 0) {
      projectRows = await sql`
        SELECT * FROM cic_projects
        WHERE published = true AND is_featured = true
        ORDER BY ordering, id
        LIMIT 4
      `;
      if (projectRows.length === 0) {
        projectRows = await sql`
          SELECT * FROM cic_projects
          WHERE published = true
          ORDER BY ordering, id
          LIMIT 4
        `;
      }
    }

    if (projectRows.length > 0) {
      const mappedProjects: HomeProjectModel[] = projectRows.map((p, idx) => ({
        id: Number(p.id),
        entityId: `cic-project-${p.id}`,
        type: 'services' as const,
        name: p.title || '',
        short: p.tagline || p.alias || p.title || '',
        service: p.solution || 'Tư vấn kỹ thuật',
        client: p.customer_name ? `${p.customer_name}${p.location ? ` · ${p.location}` : ''}` : (p.location || ''),
        category: p.solution || p.sector || 'Dự án trọng điểm',
        description: p.summary || p.tagline || '',
        img: normalizeImageUrl(p.image),
        location: p.location || '',
        tags: typeof p.technologies === 'string'
          ? p.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
          : ['BIM', 'Digital Twins', 'Hạ tầng'],
        size: idx === 0 ? ('full' as const) : ('small' as const),
      }));

      const cfg = (projSec?.config ?? {}) as Record<string, unknown>;
      projects = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : projects.badge,
        title: typeof cfg.title === 'string' ? cfg.title : projects.title,
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : projects.subtitle,
        items: mappedProjects,
      };
    }
  } catch (err) {
    console.error('Failed to load projects for home page:', err);
  }

  // 7. home.events (real entity query)
  let events: HomeEventsModel = legacy.events ?? { upcomingEvents: [], pastEvents: [] };
  const eventSec = sectionMap.get('home.events');
  try {
    const rawEvents = await sql`
      SELECT id, title, alias, image, summary, time_event, place, link_dangky
      FROM cic_event
      WHERE published = true AND (show_in_homepage = true OR is_hot = true)
      ORDER BY coalesce(time_event, created_time) DESC
      LIMIT 2
    `;

    const pastEventsRows = await sql`
      SELECT id, title, alias, image, summary, time_event, place
      FROM cic_event
      WHERE published = true
      ORDER BY coalesce(time_event, created_time) DESC
      OFFSET 2
      LIMIT 3
    `;

    const upcomingEvents: HomeEventItemModel[] = rawEvents.map((e) => ({
      id: Number(e.id),
      title: e.title || '',
      date: formatDate(e.time_event),
      time: '08:30 - 16:30',
      loc: e.place || 'Trung tâm Hội thảo CIC',
    }));

    const pastEvents: HomeEventItemModel[] = pastEventsRows.map((e) => ({
      id: Number(e.id),
      title: e.title || '',
      date: formatDate(e.time_event),
      attendees: '300+ Khách mời',
      isPast: true,
    }));

    const cfg = (eventSec?.config ?? {}) as Record<string, unknown>;
    events = {
      badge: typeof cfg.badge === 'string' ? cfg.badge : events.badge,
      title: typeof cfg.title === 'string' ? cfg.title : events.title,
      subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : events.subtitle,
      upcomingEvents: upcomingEvents.length > 0 ? upcomingEvents : events.upcomingEvents,
      pastEvents: pastEvents.length > 0 ? pastEvents : events.pastEvents,
    };
  } catch (err) {
    console.error('Failed to load events for home page:', err);
  }

  // 8. home.news (real entity query)
  let news: HomeNewsModel = legacy.news ?? { items: [] };
  const newsSec = sectionMap.get('home.news');
  try {
    const rawNews = await sql`
      SELECT id, title, alias, image, summary, category_name, start_time, created_time
      FROM cic_news
      WHERE published = true AND (show_in_homepage = true OR is_hot = true)
      ORDER BY coalesce(start_time, created_time) DESC
      LIMIT 4
    `;

    if (rawNews.length > 0) {
      const newsItems: HomeNewsItemModel[] = rawNews.map((n) => ({
        id: Number(n.id),
        category: n.category_name?.toLowerCase().includes('công ty') ? 'company' : 'specialty',
        title: n.title || '',
        date: formatDate(n.start_time || n.created_time),
        desc: n.summary || '',
        img: normalizeImageUrl(n.image),
      }));

      const cfg = (newsSec?.config ?? {}) as Record<string, unknown>;
      news = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : news.badge,
        title: typeof cfg.title === 'string' ? cfg.title : news.title,
        subtitle: typeof cfg.subtitle === 'string' ? cfg.subtitle : news.subtitle,
        items: newsItems,
      };
    }
  } catch (err) {
    console.error('Failed to load news for home page:', err);
  }

  // 9. home.partners
  let partners: HomePartnersModel = legacy.partners ?? { items: [] };
  const partnersSec = sectionMap.get('home.partners');
  if (partnersSec && partnersSec.config) {
    const cfg = partnersSec.config as Record<string, unknown>;
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    if (rawItems.length > 0) {
      const items: HomePartnerItemModel[] = rawItems.map((item: Record<string, unknown>) => ({
        name: typeof item.name === 'string' ? item.name : '',
        logo: normalizeImageUrl(item.logo || item.imageId || item.image),
      }));
      partners = {
        badge: typeof cfg.badge === 'string' ? cfg.badge : partners.badge,
        title: typeof cfg.title === 'string' ? cfg.title : partners.title,
        items,
      };
    }
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

  return {
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
}
