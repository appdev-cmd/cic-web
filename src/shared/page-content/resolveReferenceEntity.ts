import { projects, newsItems, partners } from '@web/data/mockData';
import { upcomingHomeEvents, pastHomeEvents } from '@web/data/homeData';
import type { PageBuilderEntityOption } from '@/cms/modules/static_pages/pageBuilderTypes';
import type { HomeProjectModel, HomeEventItemModel, HomeNewsItemModel, HomePartnerItemModel } from './models';

function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://www.cic.com.vn/${trimmed}`;
}

function formatDisplayDate(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

let registeredOptionsMap = new Map<string, PageBuilderEntityOption>();

export function registerEntityOptions(options: readonly PageBuilderEntityOption[]) {
  if (!options || !Array.isArray(options)) return;
  for (const opt of options) {
    registeredOptionsMap.set(opt.id, opt);
  }
}

const projectFixtureIdByEntityId: Readonly<Record<string, number>> = {
  project_landmark_81: 1,
  project_cao_toc_bac_nam: 2,
  project_dien_gio_mui_dinh: 3,
  project_enjicad: 4,
};

/**
 * Resolves a project reference entity by ID or name
 */
export function resolveProjectEntity(entityId: string): HomeProjectModel | null {
  const opt = registeredOptionsMap.get(entityId);
  if (opt && opt.entityType === 'project') {
    const meta = opt.meta ?? {};
    return {
      id: Number(opt.id) || 1,
      entityId: opt.id,
      type: 'services' as const,
      name: opt.label,
      short: opt.label,
      service: meta.category || 'Tư vấn kỹ thuật',
      client: meta.location ? `Khách hàng · ${meta.location}` : 'Đối tác',
      category: meta.category || 'Dự án trọng điểm',
      description: meta.summary || opt.description,
      img: meta.image ? normalizeImageUrl(meta.image) : (projects[0]?.img || '/banner_hero/doi_tac_cong_nghe_chien_luoc.png'),
      location: meta.location || 'Việt Nam',
      tags: ['BIM', 'Digital Twins'],
      size: 'small' as const,
    };
  }

  const fixtureId = projectFixtureIdByEntityId[entityId] ?? Number(entityId);
  const project = projects.find((candidate) => candidate.id === fixtureId || String(candidate.id) === entityId);
  return project ? { ...project, entityId } : null;
}

const eventFixtureMap: Readonly<Record<string, HomeEventItemModel>> = {
  event_bentley_2026: {
    id: 'event_bentley_2026',
    title: 'Bentley Innovation Day 2026',
    date: '15/04/2026',
    time: '08:30 - 16:30',
    loc: 'Trung tâm Hội nghị White Palace, TP.HCM',
    attendees: '500+ Khách mời',
  },
  event_bim_enterprise: {
    id: 'event_bim_enterprise',
    title: 'Hội thảo: Tư vấn Chuyển đổi số & BIM cho Doanh nghiệp Xây dựng',
    date: '25/06/2026',
    time: '08:30 - 11:30',
    loc: 'Khách sạn JW Marriott, Hà Nội',
    attendees: '300+ Doanh nghiệp',
  },
  event_net_zero: {
    id: 'event_net_zero',
    title: 'Lộ trình Net Zero và Tín chỉ Carbon trong Công trình Xanh',
    date: '12/08/2026',
    time: '09:00 - 12:00',
    loc: 'Khách sạn Melia, Hà Nội',
    attendees: '200+ Chuyên gia',
  },
  event_ai_construction: {
    id: 'event_ai_construction',
    title: 'Ứng dụng AI trong Giám sát và Quản lý Rủi ro Công trình',
    date: '18/09/2026',
    time: '14:00 - 17:00',
    loc: 'Online qua Zoom / MS Teams',
    attendees: '1000+ Kỹ sư',
  },
};

/**
 * Resolves an event reference entity by ID
 */
export function resolveEventEntity(entityId: string): HomeEventItemModel | null {
  const opt = registeredOptionsMap.get(entityId);
  if (opt && opt.entityType === 'event') {
    const meta = opt.meta ?? {};
    return {
      id: opt.id,
      title: opt.label,
      date: meta.date ? formatDisplayDate(meta.date) : '2026',
      time: '08:30 - 16:30',
      loc: meta.location || 'Trung tâm Hội nghị CIC',
      attendees: '300+ Khách mời',
    };
  }

  if (eventFixtureMap[entityId]) return eventFixtureMap[entityId];
  const allEvents = [...upcomingHomeEvents, ...pastHomeEvents];
  const found = allEvents.find((e) => (e as any).id === entityId || e.title.toLowerCase().includes(entityId.toLowerCase()));
  if (found) {
    return {
      id: entityId,
      title: found.title,
      date: found.date,
      time: found.time,
      loc: found.loc,
      attendees: found.attendees,
    };
  }
  return null;
}

const newsFixtureMap: Readonly<Record<string, number>> = {
  news_05: 5,
  news_02: 2,
  news_08: 8,
};

/**
 * Resolves a news reference entity by ID
 */
export function resolveNewsEntity(entityId: string): HomeNewsItemModel | null {
  const opt = registeredOptionsMap.get(entityId);
  if (opt && opt.entityType === 'news') {
    const meta = opt.meta ?? {};
    return {
      id: Number(opt.id) || 1,
      category: meta.category?.toLowerCase().includes('công ty') ? 'company' : 'specialty',
      title: opt.label,
      date: meta.date ? formatDisplayDate(meta.date) : '2026',
      desc: meta.summary || opt.description,
      img: meta.image ? normalizeImageUrl(meta.image) : (newsItems[0]?.img || '/banner_hero/doi_tac_cong_nghe_chien_luoc.png'),
    };
  }

  const numId = newsFixtureMap[entityId] ?? Number(entityId);
  const found = (numId > 0 && numId <= newsItems.length) ? newsItems[numId - 1] : newsItems[0];
  if (found) {
    return {
      id: numId || 1,
      category: found.category,
      title: found.title,
      date: found.date,
      desc: found.desc,
      img: found.img,
    };
  }
  return null;
}

const partnerFixtureMap: Readonly<Record<string, HomePartnerItemModel>> = {
  partner_bentley: { name: 'Bentley Systems', logo: 'https://www.cic.com.vn/images/banners/original/bentley_1584073443.jpg' },
  partner_autodesk: { name: 'Autodesk', logo: 'https://www.cic.com.vn/images/banners/original/autodesk_1692843119.jpg' },
  partner_csi: { name: 'Computers and Structures, Inc. (CSI)', logo: 'https://www.cic.com.vn/images/banners/original/csi_1584074213.jpg' },
  partner_plaxis: { name: 'PLAXIS', logo: 'https://www.cic.com.vn/images/banners/original/plaxis_1584073809.jpg' },
  partner_piletest: { name: 'Piletest', logo: 'https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg' },
  partner_ids: { name: 'IDS GeoRadar', logo: 'https://www.cic.com.vn/images/banners/original/vc-group_1584082426.jpg' },
  partner_instantel: { name: 'Instantel', logo: 'https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg' },
};

/**
 * Resolves a partner reference entity by ID
 */
export function resolvePartnerEntity(entityId: string): HomePartnerItemModel | null {
  const opt = registeredOptionsMap.get(entityId);
  if (opt && opt.entityType === 'partner') {
    const meta = opt.meta ?? {};
    return {
      name: opt.label,
      logo: meta.image ? normalizeImageUrl(meta.image) : '',
    };
  }

  if (partnerFixtureMap[entityId]) return partnerFixtureMap[entityId];
  const found = partners.find((p) => p.name.toLowerCase().includes(entityId.toLowerCase()) || (p as any).id === entityId);
  if (found) {
    return {
      name: found.name,
      logo: found.logo,
    };
  }
  return null;
}
