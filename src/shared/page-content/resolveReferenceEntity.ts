import { projects, newsItems, partners } from '@web/data/mockData';
import { upcomingHomeEvents, pastHomeEvents } from '@web/data/homeData';
import type { 
  HomeProjectModel, 
  HomeEventItemModel, 
  HomeNewsItemModel, 
  HomePartnerItemModel,
  PageBuilderEntityOption 
} from './models';

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
    registeredOptionsMap.set(`${opt.entityType}:${opt.id}`, opt);
    registeredOptionsMap.set(opt.id, opt);
  }
}

const projectFixtureIdByEntityId: Readonly<Record<string, number>> = {
  '3': 1,
  '4': 2,
  '5': 3,
  '1': 1,
  '2': 2,
  project_landmark_81: 1,
  project_cao_toc_bac_nam: 2,
  project_dien_gio_mui_dinh: 3,
  project_enjicad: 4,
};

/**
 * Resolves a project reference entity by ID or name
 */
export function resolveProjectEntity(entityId: string): HomeProjectModel | null {
  const opt = registeredOptionsMap.get(`project:${entityId}`) ?? registeredOptionsMap.get(entityId);
  if (opt && opt.entityType === 'project') {
    const meta = opt.meta ?? {};
    return {
      id: Number(opt.id) || 1,
      entityId: opt.id,
      type: 'services' as const,
      name: opt.label,
      short: meta.summary || opt.label,
      service: meta.category || 'Tư vấn kỹ thuật',
      client: meta.client ? `Khách hàng · ${meta.client}` : (meta.location ? `Khách hàng · ${meta.location}` : 'Đối tác'),
      category: meta.category || 'Dự án trọng điểm',
      description: meta.summary || opt.description,
      img: meta.image ? normalizeImageUrl(meta.image) : (projects[0]?.img || '/banner_hero/doi_tac_cong_nghe_chien_luoc.png'),
      location: meta.location || 'Việt Nam',
      tags: Array.isArray(meta.tags) && meta.tags.length > 0 ? meta.tags : ['BIM', 'Digital Twins'],
      size: 'small' as const,
    };
  }

  const fixtureId = projectFixtureIdByEntityId[entityId] ?? Number(entityId);
  const project = projects.find((candidate) => candidate.id === fixtureId || String(candidate.id) === entityId);
  return project ? { ...project, entityId } : null;
}

const eventFixtureMap: Readonly<Record<string, HomeEventItemModel>> = {
  '40': {
    id: '40',
    title: 'Hội thảo: Đột Phá Ứng Dụng AI Trong Vận Hành Cảng Biển Việt Nam Thập Kỷ Tới',
    date: '19/08/2026',
    time: '08:30',
    loc: 'Online (Zoom)',
    attendees: '500+ Khách mời',
    img: 'https://www.cic.com.vn/images/news/2026/08/resized/tphngdngAItrongvnhnhcngbin1_1785830161.png',
    desc: 'Khám phá xu hướng Smart Port, Digital Twin kết hợp Terminal Operating System (TOS) và các giải pháp AI tối ưu hóa hoạt động khai thác cảng biển.',
  },
  '2': {
    id: '2',
    title: 'Đừng bỏ lỡ sự kiện tháng 4: Webinar CADWorx - Giải pháp hoàn thiện cho thiết kế nhà máy hiệu quả',
    date: '27/04/2024',
    time: '09:00 - 10:40',
    loc: 'Online',
    attendees: '300+ Khách mời',
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    desc: 'Giải pháp hoàn thiện cho thiết kế nhà máy hiệu quả phối hợp cùng hãng Hexagon.',
  },
  event_bentley_2026: {
    id: 'event_bentley_2026',
    title: 'Bentley Innovation Day 2026',
    date: '15/04/2026',
    time: '08:30 - 16:30',
    loc: 'Trung tâm Hội nghị White Palace, TP.HCM',
    attendees: '500+ Khách mời',
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    desc: 'Hội thảo thường niên lớn nhất của Bentley Systems tại Việt Nam giới thiệu các giải pháp chuyển đổi số hạ tầng.',
  },
  event_bim_enterprise: {
    id: 'event_bim_enterprise',
    title: 'Hội thảo: Tư vấn Chuyển đổi số & BIM cho Doanh nghiệp Xây dựng',
    date: '25/06/2026',
    time: '08:30 - 11:30',
    loc: 'Khách sạn JW Marriott, Hà Nội',
    attendees: '300+ Doanh nghiệp',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    desc: 'Chương trình tư vấn chuyên sâu về lộ trình áp dụng BIM theo đề án của Bộ Xây Dựng cho các doanh nghiệp xây dựng.',
  },
  event_net_zero: {
    id: 'event_net_zero',
    title: 'Lộ trình Net Zero và Tín chỉ Carbon trong Công trình Xanh',
    date: '12/08/2026',
    time: '09:00 - 12:00',
    loc: 'Khách sạn Melia, Hà Nội',
    attendees: '200+ Chuyên gia',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    desc: 'Giải pháp tính toán phát thải, tín chỉ carbon và các tiêu chuẩn chứng nhận xanh quốc tế LEED, EDGE, LOTUS.',
  },
  event_ai_construction: {
    id: 'event_ai_construction',
    title: 'Ứng dụng AI trong Giám sát và Quản lý Rủi ro Công trình',
    date: '18/09/2026',
    time: '14:00 - 17:00',
    loc: 'Online qua Zoom / MS Teams',
    attendees: '1000+ Kỹ sư',
    img: 'https://www.cic.com.vn/images/news/2026/08/resized/tphngdngAItrongvnhnhcngbin1_1785830161.png',
    desc: 'Công nghệ thị giác máy tính và AI phân tích hình ảnh camera tại công trường nhằm cảnh báo nguy cơ mất an toàn.',
  },
};

/**
 * Resolves an event reference entity by ID
 */
export function resolveEventEntity(entityId: string): HomeEventItemModel | null {
  const opt = registeredOptionsMap.get(`event:${entityId}`) ?? registeredOptionsMap.get(entityId);
  if (opt && opt.entityType === 'event') {
    const meta = opt.meta ?? {};
    return {
      id: opt.id,
      title: opt.label,
      date: meta.date ? formatDisplayDate(meta.date) : '2026',
      time: meta.time || '08:30 - 16:30',
      loc: meta.location || 'Online (Zoom)',
      attendees: '300+ Khách mời',
      img: meta.image ? normalizeImageUrl(meta.image) : 'https://www.cic.com.vn/images/news/2026/08/resized/tphngdngAItrongvnhnhcngbin1_1785830161.png',
      desc: meta.summary || opt.description,
      ctaUrl: meta.ctaUrl || undefined,
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
      img: (found as any).img || 'https://www.cic.com.vn/images/news/2026/08/resized/tphngdngAItrongvnhnhcngbin1_1785830161.png',
      desc: (found as any).desc || 'Sự kiện công nghệ và hội thảo chuyên sâu do CIC và các đối tác quốc tế tổ chức.',
    };
  }
  return null;
}

const newsFixtureMap: Readonly<Record<string, number>> = {
  '1719': 1,
  '1718': 2,
  '1717': 3,
  '1716': 4,
  news_05: 1,
  news_02: 2,
  news_08: 3,
};

/**
 * Resolves a news reference entity by ID
 */
export function resolveNewsEntity(entityId: string): HomeNewsItemModel | null {
  const opt = registeredOptionsMap.get(`news:${entityId}`) ?? registeredOptionsMap.get(entityId);
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
  const opt = registeredOptionsMap.get(`partner:${entityId}`) ?? registeredOptionsMap.get(entityId);
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
