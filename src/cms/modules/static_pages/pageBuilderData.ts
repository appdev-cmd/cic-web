import rawMockData from './pageBuilderMockData.json';
import type {
  PageBuilderEntityOption,
  PageBuilderEntityType,
  PageBuilderPage,
} from './pageBuilderTypes';

const sourcePages = rawMockData.pages as Omit<PageBuilderPage, 'templateKey' | 'systemDefined'>[];

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
const sourceContact = clonePage(sourcePages.find((page) => page.code === 'contact')!);
const sourcePrivacy = clonePage(sourcePages.find((page) => page.code === 'privacy_policy')!);

const homePage: PageBuilderPage = { ...sourceHome, templateKey: 'home', systemDefined: true };
const contactPage: PageBuilderPage = { ...sourceContact, templateKey: 'contact', systemDefined: true };
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

function normalizeLegalPage(page: PageBuilderPage, idPrefix: string): PageBuilderPage {
  const normalizeVersion = (version: PageBuilderPage['draft']) => {
    const header = version.sections[0];
    return {
      ...version,
      sections: [
        { ...header, id: `${idPrefix}_header`, sectionKey: 'legal.header', sectionType: 'legal_header', position: 1 },
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
    ? { ...section, id: `${input.code}_header`, config: { ...section.config, categoryTag: 'Trang nội dung', title: input.name, subtitle: `Thông tin về ${input.name.toLowerCase()}.` } }
    : { ...section, id: `${input.code}_content`, config: { richTextHtml: '<p>Nhập nội dung tại đây.</p>' } });
  page.published = JSON.parse(JSON.stringify(page.draft)) as PageBuilderPage['published'];
  page.published.version = 0;
  page.published.status = 'published';
  return page;
}

const termsPage = createLegalPage({ id: 'page_terms_vi', code: 'terms_of_use', name: 'Điều khoản sử dụng', slug: '/dieu-khoan-su-dung' });
termsPage.systemDefined = true;

export const pageBuilderPagesMock: PageBuilderPage[] = [homePage, aboutPage, organizationPage, capacityPage, contactPage, privacyPage, termsPage];

export const pageBuilderEntityOptions: PageBuilderEntityOption[] = [
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
