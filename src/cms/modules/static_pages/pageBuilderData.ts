import rawMockData from './pageBuilderMockData.json';
import type {
  PageBuilderEntityOption,
  PageBuilderEntityType,
  PageBuilderPage,
} from './pageBuilderTypes';

const sourcePages = rawMockData.pages as unknown as Omit<PageBuilderPage, 'templateKey' | 'systemDefined'>[];

function clonePage(page: Omit<PageBuilderPage, 'templateKey' | 'systemDefined'>): PageBuilderPage {
  return JSON.parse(JSON.stringify(page)) as PageBuilderPage;
}

function withSectionPrefix(page: PageBuilderPage, idPrefix: string): PageBuilderPage {
  const mapVersion = (version: PageBuilderPage['draft']) => ({
    ...version,
    sections: version.sections.map((section, index) => ({ ...section, id: `${idPrefix}_${index + 1}` })),
  });
  return { ...page, draft: mapVersion(page.draft), published: mapVersion(page.published) };
}

const sourceHome = clonePage(sourcePages.find((page) => page.code === 'home')!);
const sourceAbout = clonePage(sourcePages.find((page) => page.code === 'about')!);
const sourcePrivacy = clonePage(sourcePages.find((page) => page.code === 'privacy_policy')!);

const homePage: PageBuilderPage = { ...sourceHome, templateKey: 'home', systemDefined: true };
const aboutSectionKeys = new Set(['about.hero', 'about.overview', 'about.timeline', 'about.strategy', 'about.offerings', 'about.awards', 'about.partners', 'about.contact_cta']);
const aboutPage: PageBuilderPage = {
  ...sourceAbout,
  templateKey: 'about',
  systemDefined: true,
  draft: { ...sourceAbout.draft, sections: sourceAbout.draft.sections.filter((section) => aboutSectionKeys.has(section.sectionKey)) },
  published: { ...sourceAbout.published, sections: sourceAbout.published.sections.filter((section) => aboutSectionKeys.has(section.sectionKey)) },
};

const organizationPage = withSectionPrefix({
  ...sourceAbout,
  id: 'page_organization_vi',
  code: 'organization',
  slug: '/gioi-thieu/co-cau-to-chuc',
  name: 'Cơ cấu tổ chức',
  pageType: 'organization',
  templateKey: 'organization',
  systemDefined: true,
  draft: { ...sourceAbout.draft, sections: sourceAbout.draft.sections.filter((section) => ['about.hero', 'about.organization'].includes(section.sectionKey)) },
  published: { ...sourceAbout.published, sections: sourceAbout.published.sections.filter((section) => ['about.hero', 'about.organization'].includes(section.sectionKey)) },
}, 'organization');

const capacityPage = withSectionPrefix({
  ...sourceAbout,
  id: 'page_capacity_experience_vi',
  code: 'capacity_experience',
  slug: '/gioi-thieu/nang-luc-kinh-nghiem',
  name: 'Năng lực & Kinh nghiệm',
  pageType: 'capacity_experience',
  templateKey: 'capacity_experience',
  systemDefined: true,
  draft: { ...sourceAbout.draft, sections: sourceAbout.draft.sections.filter((section) => ['about.hero', 'about.capacity', 'about.experience', 'about.contact_cta'].includes(section.sectionKey)) },
  published: { ...sourceAbout.published, sections: sourceAbout.published.sections.filter((section) => ['about.hero', 'about.capacity', 'about.experience', 'about.contact_cta'].includes(section.sectionKey)) },
}, 'capacity');

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function legacyLegalSectionsToHtml(sections: PageBuilderPage['draft']['sections']): string {
  return sections.slice(1).map((section) => {
    const title = typeof section.config.title === 'string' ? `<h2>${escapeHtml(section.config.title)}</h2>` : '';
    const blocks = Array.isArray(section.config.blocks)
      ? section.config.blocks.map((block) => {
          if (!block || typeof block !== 'object' || Array.isArray(block)) return '';
          const item = block as Record<string, unknown>;
          if (Array.isArray(item.items)) return `<ul>${item.items.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;
          return item.text ? `<p>${escapeHtml(item.text)}</p>` : '';
        }).join('')
      : typeof section.config.description === 'string' ? `<p>${escapeHtml(section.config.description)}</p>` : '';
    const contact = [section.config.phone, section.config.email]
      .filter((value): value is string => typeof value === 'string' && Boolean(value))
      .map((value) => `<p>${escapeHtml(value)}</p>`)
      .join('');
    return `${title}${blocks}${contact}`;
  }).join('');
}

function legacyLegalHeaderToHtml(config: PageBuilderPage['draft']['sections'][number]['config']): string {
  if (typeof config.richTextHtml === 'string') return config.richTextHtml;
  const category = typeof config.categoryTag === 'string' && config.categoryTag ? `<p><strong>${escapeHtml(config.categoryTag)}</strong></p>` : '';
  const title = `<h1>${escapeHtml(config.title)}</h1>`;
  const subtitle = typeof config.subtitle === 'string' && config.subtitle ? `<p>${escapeHtml(config.subtitle)}</p>` : '';
  const meta = [config.lastUpdated ? `Cập nhật: ${escapeHtml(config.lastUpdated)}` : '', config.readingTime ? escapeHtml(config.readingTime) : ''].filter(Boolean).join(' · ');
  return `${category}${title}${subtitle}${meta ? `<p>${meta}</p>` : ''}`;
}

function normalizeLegalPage(page: PageBuilderPage, idPrefix: string): PageBuilderPage {
  const normalizeVersion = (version: PageBuilderPage['draft']) => {
    const header = version.sections[0];
    return {
      ...version,
      sections: [
        { ...header, id: `${idPrefix}_header`, sectionKey: 'legal.header', sectionType: 'rich_text_header', position: 1, config: { richTextHtml: legacyLegalHeaderToHtml(header.config) } },
        {
          id: `${idPrefix}_content`,
          sectionKey: 'legal.content',
          sectionType: 'rich_text',
          position: 2,
          config: { richTextHtml: legacyLegalSectionsToHtml(version.sections) },
        },
      ],
    };
  };
  return { ...page, draft: normalizeVersion(page.draft), published: normalizeVersion(page.published) };
}

const privacyPage: PageBuilderPage = normalizeLegalPage(
  { ...sourcePrivacy, templateKey: 'legal_standard', systemDefined: true },
  'privacy',
);

export function createLegalPage(input: { id: string; code: string; name: string; slug: string }): PageBuilderPage {
  const now = new Date().toISOString();
  const page = withSectionPrefix({
    ...privacyPage,
    ...input,
    pageType: 'legal',
    templateKey: 'legal_standard',
    systemDefined: false,
    draft: { ...privacyPage.draft, version: 1, status: 'draft', updatedAt: now },
    published: { ...privacyPage.published, version: 0, status: 'published', updatedAt: now, publishedAt: undefined },
  }, input.code);
  page.draft.seo = { ...page.draft.seo, title: input.name, description: '' };
  page.draft.sections = page.draft.sections.map((section, index) => index === 0
    ? { ...section, id: `${input.code}_header`, sectionType: 'rich_text_header', config: { richTextHtml: `<h1>${escapeHtml(input.name)}</h1>` } }
    : { ...section, id: `${input.code}_content`, config: { richTextHtml: '<p>Nhập nội dung tại đây.</p>' } });
  page.published = JSON.parse(JSON.stringify(page.draft)) as PageBuilderPage['published'];
  page.published.version = 0;
  page.published.status = 'published';
  return page;
}

const termsPage = createLegalPage({ id: 'page_terms_vi', code: 'terms_of_use', name: 'Điều khoản sử dụng', slug: '/dieu-khoan-su-dung' });
termsPage.systemDefined = true;

export const pageBuilderPagesMock: PageBuilderPage[] = [homePage, aboutPage, organizationPage, capacityPage, privacyPage, termsPage];

export const pageBuilderEntityOptions: PageBuilderEntityOption[] = [
  // Real DB Projects
  {
    id: '3',
    label: 'Áp Dụng Công Nghệ BIM 5D Cho Toà Siêu Nhà Cao Tầng Landmark 81',
    description: 'Dự án · Tư vấn BIM/Digital Twins · Nổi bật',
    entityType: 'project',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      location: 'Bình Thạnh, TP. Hồ Chí Minh',
      category: 'Tư vấn BIM/Digital Twins',
      summary: 'Số hóa toàn diện dữ liệu thiết kế, phát hiện xung đột và quản lý khối lượng vật tư chính xác hơn 98%.',
      client: 'Tập đoàn Vingroup',
      tags: ['Autodesk Revit', 'Navisworks Manage', 'CDE Autodesk Construction Cloud (ACC)'],
      isFeatured: true,
    },
  },
  {
    id: '4',
    label: 'Mô Hình Hóa Digital Twins Tuyến Cao Tốc Bắc - Nam (Đoạn Cam Lộ - La Sơn)',
    description: 'Dự án · Hạ tầng số · Nổi bật',
    entityType: 'project',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80',
      location: 'Quảng Trị - Thừa Thiên Huế',
      category: 'Hạ tầng số & Digital Twins',
      summary: 'Ứng dụng công nghệ bản sao số iTwin và GIS để quản lý bảo trì hạ tầng giao thông thông minh.',
      client: 'Bộ Giao thông Vận tải',
      tags: ['Bentley iTwin', 'GIS 3D', 'IoT Sensors'],
      isFeatured: true,
    },
  },
  {
    id: '5',
    label: 'Đánh Giá Sản Lượng Điện Gió Đạt Chuẩn Bankable Dự Án Điện Gió Mũi Dinh',
    description: 'Dự án · Năng lượng tái tạo · Nổi bật',
    entityType: 'project',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80',
      location: 'Ninh Thuận',
      category: 'Năng lượng tái tạo',
      summary: 'Thẩm định số liệu gió chi tiết, phục vụ mục đích gọi vốn đầu tư quốc tế thành công.',
      client: 'Tập đoàn Điện lực Việt Nam (EVN)',
      tags: ['WindSim CFD', 'Bankable', 'Net Zero'],
      isFeatured: true,
    },
  },
  // Real DB Events
  {
    id: '40',
    label: 'Hội thảo: Đột Phá Ứng Dụng AI Trong Vận Hành Cảng Biển Việt Nam Thập Kỷ Tới',
    description: 'Sự kiện · Online (Zoom) · Nổi bật',
    entityType: 'event',
    status: 'published',
    meta: {
      image: 'https://www.cic.com.vn/images/news/2026/08/resized/tphngdngAItrongvnhnhcngbin1_1785830161.png',
      location: 'Online (Zoom)',
      date: '19/08/2026',
      time: '08:30',
      summary: 'Khám phá xu hướng Smart Port, Digital Twin kết hợp Terminal Operating System (TOS) và các giải pháp AI tối ưu hóa hoạt động khai thác cảng biển.',
      isFeatured: true,
    },
  },
  {
    id: '11',
    label: 'Webinar: Phần mềm Cage Carbon - Cage CBAM trong kiểm kê phát thải khí nhà kính và lập hồ sơ CBAM - Thuế carbon Châu Âu',
    description: 'Sự kiện · Online · Nổi bật',
    entityType: 'event',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
      location: 'Online',
      date: '08/06/2026',
      time: '09:00 - 11:30',
      summary: 'Tư vấn Chuyển đổi số & Lộ trình Net Zero và Tín chỉ Carbon cho Doanh nghiệp.',
      isFeatured: true,
    },
  },
  {
    id: '9',
    label: 'Webinar: Cập nhật tính năng mới trong Opera Job Management cho nhà thầu nhôm kính',
    description: 'Sự kiện · TP. Hồ Chí Minh · Nổi bật',
    entityType: 'event',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      location: 'TP. Hồ Chí Minh',
      date: '20/05/2026',
      time: '08:30 - 11:30',
      summary: 'Tư vấn Chuyển đổi số & BIM cho Doanh nghiệp.',
      isFeatured: true,
    },
  },
  {
    id: '13',
    label: 'Webinar: Tương lai bắt đầu từ hiện tại: Tăng tốc Chuyển đổi BIM 5D với Cubicost',
    description: 'Sự kiện · Hà Nội · Nổi bật',
    entityType: 'event',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      location: 'Hà Nội',
      date: '15/06/2026',
      time: '14:00 - 17:00',
      summary: 'Workshop: Ứng dụng AI và BIM trong Giám sát Công trình.',
      isFeatured: true,
    },
  },
  // Real DB News
  {
    id: '1719',
    label: 'Giải pháp AI và Digital Twin trong Vận hành Cảng biển Smart Port: Đột phá Hạ tầng & Tối ưu Năng suất',
    description: 'Tin tức · Tin Chuyên ngành · Nổi bật',
    entityType: 'news',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      category: 'specialty',
      date: '10/05/2024',
      summary: 'Hợp tác chiến lược mang đến các giải pháp iTwin và Digital Twins tiên tiến cho các dự án trọng điểm tại Việt Nam.',
      isFeatured: true,
    },
  },
  {
    id: '1718',
    label: 'KOMPAS-3D V24 ra mắt với loạt nâng cấp cho thiết kế cơ khí',
    description: 'Tin tức · Tin Chuyên ngành · Nổi bật',
    entityType: 'news',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
      category: 'specialty',
      date: '28/04/2024',
      summary: 'Cập nhật tính năng mô hình hóa 3D tham số hóa nhanh hơn, tích hợp xuất trực tiếp sang mô hình phân tích CAE.',
      isFeatured: true,
    },
  },
  {
    id: '1717',
    label: 'Mô Hình Hóa Địa Chất Thủy Văn 3D: Giảm Thiểu Rủi Ro Trong Điều Kiện Địa Chất Phức Tạp',
    description: 'Tin tức · Tin Chuyên ngành · Nổi bật',
    entityType: 'news',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      category: 'specialty',
      date: '15/04/2024',
      summary: 'Ứng dụng các công cụ mô phỏng dòng thấm ngầm và ổn định hố đào sâu cho các siêu dự án đô thị ngầm.',
      isFeatured: true,
    },
  },
  {
    id: '1716',
    label: 'CIC tổ chức thành công Hội thảo ứng dụng AI trong vận hành cảng biển Việt Nam',
    description: 'Tin tức · Tin Công ty · Nổi bật',
    entityType: 'news',
    status: 'published',
    meta: {
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
      category: 'company',
      date: '02/04/2024',
      summary: 'Sự kiện quy tụ hơn 200 chuyên gia hàng hải, logistics và công nghệ cảng thông minh cùng thảo luận về lộ trình chuyển đổi số.',
      isFeatured: true,
    },
  },
  // Legacy / generic fixtures
  { id: 'product_ai_platform', label: 'Nền tảng AI CIC', description: 'Sản phẩm · AI và dữ liệu', entityType: 'product' },
  { id: 'product_software_catalog', label: 'Phần mềm kỹ thuật bản quyền', description: 'Sản phẩm · Danh mục phần mềm', entityType: 'product' },
  { id: 'product_equipment_catalog', label: 'Thiết bị công nghệ', description: 'Sản phẩm · Thiết bị', entityType: 'product' },
  { id: 'product_industry_solutions', label: 'Giải pháp theo ngành', description: 'Sản phẩm · Giải pháp', entityType: 'product' },
  { id: 'service_tu_van_bim', label: 'Tư vấn BIM', description: 'Dịch vụ · BIM', entityType: 'service' },
  { id: 'service_digital_transformation', label: 'Tư vấn chuyển đổi số', description: 'Dịch vụ · Chuyển đổi số', entityType: 'service' },
  { id: 'service_training', label: 'Đào tạo và chuyển giao', description: 'Dịch vụ · Đào tạo', entityType: 'service' },
  { id: 'service_bim', label: 'BIM & Digital Twins', description: 'Dịch vụ · BIM', entityType: 'service' },
  { id: 'service_smart_technology', label: 'Giải pháp công nghệ thông minh', description: 'Dịch vụ · Công nghệ', entityType: 'service' },
  { id: 'service_sustainability', label: 'Phát triển bền vững', description: 'Dịch vụ · Net Zero', entityType: 'service' },
  { id: 'service_consulting', label: 'Tư vấn chuyên sâu', description: 'Dịch vụ · Tư vấn', entityType: 'service' },
  { id: 'project_landmark_81', label: 'Landmark 81 BIM', description: 'Dự án · BIM', entityType: 'project' },
  { id: 'project_cao_toc_bac_nam', label: 'Cao tốc Bắc Nam Digital Twin', description: 'Dự án · Hạ tầng', entityType: 'project' },
  { id: 'project_dien_gio_mui_dinh', label: 'Điện gió Mũi Dinh', description: 'Dự án · Năng lượng', entityType: 'project' },
  { id: 'news_05', label: 'CIC và hành trình chuyển đổi số', description: 'Tin tức · Công ty', entityType: 'news' },
  { id: 'news_02', label: 'Xu hướng BIM năm 2026', description: 'Tin tức · Chuyên ngành', entityType: 'news' },
  { id: 'news_08', label: 'Giải pháp Net Zero cho doanh nghiệp', description: 'Tin tức · Chuyên ngành', entityType: 'news' },
  { id: 'partner_bentley', label: 'Bentley Systems', description: 'Đối tác công nghệ', entityType: 'partner' },
  { id: 'partner_autodesk', label: 'Autodesk', description: 'Đối tác công nghệ', entityType: 'partner' },
  { id: 'partner_csi', label: 'Computers and Structures, Inc.', description: 'Đối tác phần mềm', entityType: 'partner' },
  { id: 'partner_plaxis', label: 'PLAXIS', description: 'Đối tác phần mềm', entityType: 'partner' },
  { id: 'partner_piletest', label: 'Piletest', description: 'Đối tác thiết bị', entityType: 'partner' },
  { id: 'partner_ids', label: 'IDS GeoRadar', description: 'Đối tác thiết bị', entityType: 'partner' },
  { id: 'partner_instantel', label: 'Instantel', description: 'Đối tác thiết bị', entityType: 'partner' },
  { id: 'event_bentley_2026', label: 'Bentley Innovation Day 2026', description: 'Sự kiện · TP. Hồ Chí Minh', entityType: 'event' },
  { id: 'event_bim_enterprise', label: 'Tư vấn Chuyển đổi số & BIM', description: 'Sự kiện · TP. Hồ Chí Minh', entityType: 'event' },
  { id: 'event_net_zero', label: 'Lộ trình Net Zero và Tín chỉ Carbon', description: 'Sự kiện · Hà Nội', entityType: 'event' },
  { id: 'event_ai_construction', label: 'Ứng dụng AI trong Giám sát Công trình', description: 'Sự kiện · Online', entityType: 'event' },
];

import { registerEntityOptions } from '@/shared/page-content/resolveReferenceEntity';
registerEntityOptions(pageBuilderEntityOptions);

