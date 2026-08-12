import rawMockData from './pageBuilderMockData.json';
import type {
  PageBuilderEntityOption,
  PageBuilderEntityType,
  PageBuilderPage,
  SectionDefinition,
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
  draft: { ...sourceAbout.draft, sections: sourceAbout.draft.sections.filter((section) => ['about.hero', 'about.capacity', 'about.experience', 'about.software_partners', 'about.hardware_partners', 'about.contact_cta'].includes(section.sectionKey)) },
  published: { ...sourceAbout.published, sections: sourceAbout.published.sections.filter((section) => ['about.hero', 'about.capacity', 'about.experience', 'about.software_partners', 'about.hardware_partners', 'about.contact_cta'].includes(section.sectionKey)) },
}, 'capacity');

const privacyPage: PageBuilderPage = { ...sourcePrivacy, templateKey: 'legal_standard', systemDefined: true };

export function createLegalPage(input: { id: string; code: string; name: string; slug: string }): PageBuilderPage {
  const now = new Date().toISOString();
  const page = withSectionPrefix({
    ...sourcePrivacy,
    ...input,
    pageType: 'legal',
    templateKey: 'legal_standard',
    systemDefined: false,
    draft: { ...sourcePrivacy.draft, version: 1, status: 'draft', updatedAt: now },
    published: { ...sourcePrivacy.published, version: 0, status: 'published', updatedAt: now, publishedAt: undefined },
  }, input.code);
  page.draft.seo = { ...page.draft.seo, title: input.name, description: '' };
  page.draft.sections = page.draft.sections.map((section, index, sections) => {
    if (index === 0) return { ...section, sectionKey: 'legal.header', config: { ...section.config, categoryTag: 'Trang nội dung', title: input.name, subtitle: `Thông tin về ${input.name.toLowerCase()}.` } };
    if (index === sections.length - 1) return { ...section, sectionKey: 'legal.assistance' };
    return { ...section, sectionKey: `legal.content.${index}`, config: { ...section.config, title: `Nội dung ${index}`, blocks: [{ type: 'paragraph', text: 'Nhập nội dung tại đây.' }] } };
  });
  page.published = JSON.parse(JSON.stringify(page.draft)) as PageBuilderPage['published'];
  page.published.version = 0;
  page.published.status = 'published';
  return page;
}

const termsPage = createLegalPage({ id: 'page_terms_vi', code: 'terms_of_use', name: 'Điều khoản sử dụng', slug: '/dieu-khoan-su-dung' });
termsPage.systemDefined = true;

export const pageBuilderPagesMock: PageBuilderPage[] = [homePage, aboutPage, organizationPage, capacityPage, privacyPage, termsPage];

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

export const entityTypeLabels: Record<PageBuilderEntityType, string> = {
  product: 'Sản phẩm',
  news: 'Tin tức',
  service: 'Dịch vụ',
  project: 'Dự án',
  partner: 'Đối tác',
  event: 'Sự kiện',
};

export const sectionDefinitions: Record<string, SectionDefinition> = {
  'home.hero': { label: 'Hero', description: 'Carousel mở đầu của Trang chủ.' },
  'home.intro': { label: 'Giới thiệu ngắn', description: 'Nội dung giới thiệu và video doanh nghiệp.' },
  'home.stats': { label: 'Thống kê', description: 'Bốn chỉ số theo thiết kế hiện tại.' },
  'home.awards': { label: 'Giải thưởng', description: 'Danh sách giải thưởng trong slider.' },
  'home.ecosystem': { label: 'Hệ sinh thái công nghệ', description: 'Các slot sản phẩm và dịch vụ cố định.', referenceLimit: { product: 4, service: 3 } },
  'home.projects': { label: 'Dự án tiêu biểu', description: 'Chọn thủ công tối đa 3 dự án.', referenceLimit: { project: 3 } },
  'home.events': { label: 'Sự kiện nổi bật', description: 'Một sự kiện chính và tối đa 3 sự kiện phụ.', referenceLimit: { event: 4 } },
  'home.news': { label: 'Tin tức và Góc nhìn', description: 'Chọn thủ công tối đa 3 bài viết.', referenceLimit: { news: 3 } },
  'home.partners': { label: 'Đối tác chiến lược', description: 'Danh sách đối tác theo thứ tự marquee.', referenceLimit: { partner: 12 } },
  'home.contact_cta': { label: 'CTA & Form tư vấn', description: 'Nội dung liên hệ và form cố định.' },
  'about.hero': { label: 'Hero Giới thiệu', description: 'Tiêu đề và ảnh mở đầu.' },
  'about.overview': { label: 'Tổng quan doanh nghiệp', description: 'Giới thiệu và video doanh nghiệp.' },
  'about.timeline': { label: 'Tiến trình phát triển', description: 'Các mốc lịch sử theo thiết kế timeline.' },
  'about.strategy': { label: 'Định hướng chiến lược', description: 'Tầm nhìn, sứ mệnh và giá trị cốt lõi.' },
  'about.offerings': { label: 'Sản phẩm và dịch vụ cung cấp', description: 'Các entity được chọn cho grid cố định.', referenceLimit: { product: 2, service: 4 } },
  'about.awards': { label: 'Thành tựu & Giải thưởng', description: 'Danh sách giải thưởng.' },
  'about.partners': { label: 'Đối tác chiến lược', description: 'Danh sách đối tác.', referenceLimit: { partner: 12 } },
  'about.organization': { label: 'Cơ cấu tổ chức', description: 'Sơ đồ và topology được giữ trong code.' },
  'about.capacity': { label: 'Năng lực doanh nghiệp', description: 'Giới thiệu và bốn chỉ số năng lực.' },
  'about.experience': { label: 'Năng lực & Kinh nghiệm', description: 'Danh mục kinh nghiệm theo thiết kế.' },
  'about.software_partners': { label: 'Đối tác phần mềm', description: 'Danh sách đối tác phần mềm.', referenceLimit: { partner: 12 } },
  'about.hardware_partners': { label: 'Đối tác thiết bị', description: 'Danh sách đối tác thiết bị.', referenceLimit: { partner: 12 } },
  'about.contact_cta': { label: 'CTA liên hệ', description: 'Kêu gọi kết nối chuyên gia CIC.' },
  'contact.header': { label: 'Header Liên hệ', description: 'Tiêu đề trang Liên hệ.' },
  'contact.branches': { label: 'Chi nhánh & Bản đồ', description: 'Hai chi nhánh theo layout hiện tại.' },
  'contact.form': { label: 'Form liên hệ', description: 'Form nghiệp vụ được tham chiếu bằng ID.' },
  'contact.security': { label: 'Thông báo bảo mật', description: 'Nội dung dẫn tới chính sách bảo mật.' },
  'legal.header': { label: 'Header chính sách', description: 'Thông tin đầu trang pháp lý.' },
  'privacy.collection': { label: 'Mục đích thu thập', description: 'Mục 01 của chính sách.' },
  'privacy.usage': { label: 'Phạm vi sử dụng', description: 'Mục 02 của chính sách.' },
  'privacy.retention': { label: 'Thời gian lưu trữ', description: 'Mục 03 của chính sách.' },
  'privacy.access': { label: 'Tiếp cận và chỉnh sửa', description: 'Mục 04 của chính sách.' },
  'privacy.commitment': { label: 'Cam kết bảo mật', description: 'Mục 05 của chính sách.' },
  'legal.assistance': { label: 'Hỗ trợ pháp lý', description: 'Thông tin liên hệ giải đáp.' },
};
