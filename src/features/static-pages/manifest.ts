/**
 * Canonical System Pages Manifest & Legacy Import Manifest
 *
 * SCOPE:
 * Page Builder Core strictly manages:
 * 1. Home
 * 2. About Group (about, organization, capacity_experience)
 * 3. Privacy Policy
 * 4. Terms of Use
 * 5. Custom legal pages (legal_standard)
 *
 * NOTE: CONTACT IS OUT OF PAGE BUILDER.
 * Runtime authority for Contact remains: System Settings + Branches + Contact Form.
 */

export interface SystemPageDefinition {
  code: string;
  name: { vi: string; en: string };
  slug: { vi: string; en: string };
  pageType: 'home' | 'about' | 'organization' | 'capacity_experience' | 'legal';
  templateKey: 'home' | 'about' | 'organization' | 'capacity_experience' | 'legal_standard';
  systemDefined: true;
  creatable: false;
  deletable: false;
  protectedSlug: true;
  protectedTemplate: true;
  allowedSections: readonly string[];
  defaultSectionOrder: readonly string[];
  initialLifecycleState: {
    vi: 'DRAFT_ONLY' | 'PUBLISHED_FROM_APPROVED_LEGACY';
    en: 'DRAFT_ONLY';
  };
}

export const CANONICAL_SYSTEM_PAGES: readonly SystemPageDefinition[] = [
  {
    code: 'home',
    name: { vi: 'Trang chủ', en: 'Home' },
    slug: { vi: '/', en: '/en' },
    pageType: 'home',
    templateKey: 'home',
    systemDefined: true,
    creatable: false,
    deletable: false,
    protectedSlug: true,
    protectedTemplate: true,
    allowedSections: [
      'home.hero',
      'home.intro',
      'home.stats',
      'home.awards',
      'home.ecosystem',
      'home.projects',
      'home.events',
      'home.news',
      'home.partners',
      'home.contact_cta',
    ],
    defaultSectionOrder: [
      'home.hero',
      'home.intro',
      'home.stats',
      'home.awards',
      'home.ecosystem',
      'home.projects',
      'home.events',
      'home.news',
      'home.partners',
      'home.contact_cta',
    ],
    initialLifecycleState: {
      vi: 'DRAFT_ONLY',
      en: 'DRAFT_ONLY',
    },
  },
  {
    code: 'about',
    name: { vi: 'Giới thiệu', en: 'About Us' },
    slug: { vi: '/gioi-thieu', en: '/about' },
    pageType: 'about',
    templateKey: 'about',
    systemDefined: true,
    creatable: false,
    deletable: false,
    protectedSlug: true,
    protectedTemplate: true,
    allowedSections: [
      'about.hero',
      'about.overview',
      'about.timeline',
      'about.strategy',
      'about.offerings',
      'about.awards',
      'about.partners',
      'about.contact_cta',
    ],
    defaultSectionOrder: [
      'about.hero',
      'about.overview',
      'about.timeline',
      'about.strategy',
      'about.offerings',
      'about.awards',
      'about.partners',
      'about.contact_cta',
    ],
    initialLifecycleState: {
      vi: 'DRAFT_ONLY',
      en: 'DRAFT_ONLY',
    },
  },
  {
    code: 'organization',
    name: { vi: 'Cơ cấu tổ chức', en: 'Organization Structure' },
    slug: { vi: '/gioi-thieu/co-cau-to-chuc', en: '/about/organization' },
    pageType: 'organization',
    templateKey: 'organization',
    systemDefined: true,
    creatable: false,
    deletable: false,
    protectedSlug: true,
    protectedTemplate: true,
    allowedSections: ['about.hero', 'about.organization'],
    defaultSectionOrder: ['about.hero', 'about.organization'],
    initialLifecycleState: {
      vi: 'DRAFT_ONLY',
      en: 'DRAFT_ONLY',
    },
  },
  {
    code: 'capacity_experience',
    name: { vi: 'Năng lực & Kinh nghiệm', en: 'Capacity & Experience' },
    slug: { vi: '/gioi-thieu/nang-luc-kinh-nghiem', en: '/about/capacity-experience' },
    pageType: 'capacity_experience',
    templateKey: 'capacity_experience',
    systemDefined: true,
    creatable: false,
    deletable: false,
    protectedSlug: true,
    protectedTemplate: true,
    allowedSections: [
      'about.hero',
      'about.capacity',
      'about.experience',
      'about.contact_cta',
    ],
    defaultSectionOrder: [
      'about.hero',
      'about.capacity',
      'about.experience',
      'about.contact_cta',
    ],
    initialLifecycleState: {
      vi: 'DRAFT_ONLY',
      en: 'DRAFT_ONLY',
    },
  },
  {
    code: 'privacy_policy',
    name: { vi: 'Chính sách bảo mật', en: 'Privacy Policy' },
    slug: { vi: '/chinh-sach-bao-mat', en: '/privacy-policy' },
    pageType: 'legal',
    templateKey: 'legal_standard',
    systemDefined: true,
    creatable: false,
    deletable: false,
    protectedSlug: true,
    protectedTemplate: true,
    allowedSections: ['legal.header', 'legal.content'],
    defaultSectionOrder: ['legal.header', 'legal.content'],
    initialLifecycleState: {
      vi: 'PUBLISHED_FROM_APPROVED_LEGACY',
      en: 'DRAFT_ONLY',
    },
  },
  {
    code: 'terms_of_use',
    name: { vi: 'Điều khoản sử dụng', en: 'Terms of Use' },
    slug: { vi: '/dieu-khoan-su-dung', en: '/terms-of-use' },
    pageType: 'legal',
    templateKey: 'legal_standard',
    systemDefined: true,
    creatable: false,
    deletable: false,
    protectedSlug: true,
    protectedTemplate: true,
    allowedSections: ['legal.header', 'legal.content'],
    defaultSectionOrder: ['legal.header', 'legal.content'],
    initialLifecycleState: {
      vi: 'DRAFT_ONLY',
      en: 'DRAFT_ONLY',
    },
  },
];

/**
 * Custom Legal Page Contract.
 * Dynamically created pages must strictly abide by these constraints.
 */
export const CUSTOM_LEGAL_PAGE_CONTRACT = {
  pageType: 'legal',
  templateKey: 'legal_standard',
  systemDefined: false,
  creatable: true,
  deletable: true,
  requiredPermission: 'create_legal',
  allowedSections: ['legal.header', 'legal.content'] as const,
  slugPolicy: {
    prefix: '/',
    pattern: /^\/[a-z0-9]+(-[a-z0-9]+)*$/,
    reservedSlugs: [
      '/',
      '/gioi-thieu',
      '/gioi-thieu/co-cau-to-chuc',
      '/gioi-thieu/nang-luc-kinh-nghiem',
      '/chinh-sach-bao-mat',
      '/dieu-khoan-su-dung',
      '/lien-he',
      '/tin-tuc',
      '/san-pham',
      '/dich-vu',
      '/du-an',
      '/su-kien',
    ],
  },
};

/**
 * Legacy Import Manifest for cic_contents (VI) and cic_contents_en (EN).
 */
export type LegacyImportClassification =
  | 'DIRECT_MAP'
  | 'PARTIAL_REFERENCE'
  | 'MANUAL_REVIEW'
  | 'NOT_USED';

export interface LegacyImportRecord {
  legacyId: number;
  locale: 'vi' | 'en';
  title: string;
  alias: string;
  categoryId: number;
  published: boolean;
  classification: LegacyImportClassification;
  targetPageCode?: string;
  targetSectionKey?: string;
  rationale: string;
}

export const LEGACY_IMPORT_MANIFEST: readonly LegacyImportRecord[] = [
  // --- VIETNAMESE (cic_contents) ---
  {
    legacyId: 1,
    locale: 'vi',
    title: 'Giới thiệu CIC',
    alias: 'gioi-thieu',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'about',
    rationale: 'Bài giới thiệu tổng quan 2019. Cần biên tập tách vào about.overview và about.timeline, không nhồi HTML blob.',
  },
  {
    legacyId: 2,
    locale: 'vi',
    title: 'Cơ cấu tổ chức',
    alias: 'co-cau-to-chuc',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'organization',
    targetSectionKey: 'about.organization',
    rationale: 'Chỉ chứa 1 ảnh sơ đồ tổ chức. Dùng làm reference ảnh cho section about.organization.',
  },
  {
    legacyId: 3,
    locale: 'vi',
    title: 'Năng lực và kinh nghiệm',
    alias: 'nang-luc-va-kinh-nghiem',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'capacity_experience',
    targetSectionKey: 'about.capacity',
    rationale: 'Văn bản năng lực, vốn, quyết định thành lập. Cần biên tập vào metrics và copy, không nhồi HTML thô.',
  },
  {
    legacyId: 4,
    locale: 'vi',
    title: 'Một số thành tựu đạt được',
    alias: 'mot-so-thanh-tuu-dat-duoc',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'about',
    targetSectionKey: 'about.awards',
    rationale: 'Hình ảnh bằng khen, huân chương. Tham chiếu cho about.awards.',
  },
  {
    legacyId: 5,
    locale: 'vi',
    title: 'Tư vấn BIM',
    alias: 'tu-van-bim',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services riêng biệt; bản nháp cũ 2018 chưa publish.',
  },
  {
    legacyId: 6,
    locale: 'vi',
    title: 'Tư vấn xây dựng',
    alias: 'tu-van-xay-dung',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services riêng biệt; bản nháp cũ 2018 chưa publish.',
  },
  {
    legacyId: 7,
    locale: 'vi',
    title: 'Tư vấn dự án',
    alias: 'tu-van-du-an',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services riêng biệt; bản nháp cũ 2019 chưa publish.',
  },
  {
    legacyId: 8,
    locale: 'vi',
    title: 'Tư vấn lập đơn giá, chỉ số giá',
    alias: 'tu-van-lap-don-gia-chi-so-gia',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services riêng biệt; bản nháp cũ 2019 chưa publish.',
  },
  {
    legacyId: 9,
    locale: 'vi',
    title: 'Xuất khẩu phần mềm',
    alias: 'xuat-khau-phan-mem',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services riêng biệt; bản nháp cũ 2019 chưa publish.',
  },
  {
    legacyId: 11,
    locale: 'vi',
    title: 'Backup Năng lực',
    alias: 'backup-nang-luc',
    categoryId: 1,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Bản backup chưa hoàn thiện (published=false).',
  },
  {
    legacyId: 12,
    locale: 'vi',
    title: 'Chính sách sử dụng và Bảo Mật Thông Tin trên Website',
    alias: 'chinh-sach-su-dung-va-bao-mat-thong-tin-tren-website',
    categoryId: 3,
    published: true,
    classification: 'DIRECT_MAP',
    targetPageCode: 'privacy_policy',
    targetSectionKey: 'legal.content',
    rationale: 'Chính sách bảo mật website chính thức đang áp dụng (cập nhật 2024). Map trực tiếp vào legal.content.richTextHtml.',
  },
  {
    legacyId: 13,
    locale: 'vi',
    title: 'HỒ SƠ NĂNG LỰC',
    alias: 'ho-so-nang-luc',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'capacity_experience',
    rationale: 'Chứa link flipbook PDF profile 2024. Dùng làm reference download profile.',
  },

  // --- ENGLISH (cic_contents_en) ---
  {
    legacyId: 1,
    locale: 'en',
    title: 'About us',
    alias: 'gioi-thieu',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'about',
    rationale: 'Bài giới thiệu tiếng Anh 2018. Dùng làm tài liệu tham khảo biên tập cho about (EN).',
  },
  {
    legacyId: 2,
    locale: 'en',
    title: 'Organization Structure',
    alias: 'organization-structure',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'organization',
    targetSectionKey: 'about.organization',
    rationale: 'Ảnh sơ đồ tổ chức tiếng Anh. Tham chiếu cho about.organization (EN).',
  },
  {
    legacyId: 3,
    locale: 'en',
    title: 'Competence & Experience',
    alias: 'competence-amp;-experience',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'capacity_experience',
    targetSectionKey: 'about.capacity',
    rationale: 'Văn bản năng lực tiếng Anh. Dùng làm reference biên tập.',
  },
  {
    legacyId: 4,
    locale: 'en',
    title: 'Achivements',
    alias: 'mot-so-thanh-tuu-dat-duoc',
    categoryId: 1,
    published: true,
    classification: 'PARTIAL_REFERENCE',
    targetPageCode: 'about',
    targetSectionKey: 'about.awards',
    rationale: 'Bằng khen, giải thưởng tiếng Anh. Tham chiếu cho about.awards (EN).',
  },
  {
    legacyId: 5,
    locale: 'en',
    title: 'Tư vấn BIM',
    alias: 'tu-van-bim',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services; bản nháp cũ chưa publish.',
  },
  {
    legacyId: 6,
    locale: 'en',
    title: 'Tư vấn xây dựng',
    alias: 'tu-van-xay-dung',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services; bản nháp cũ chưa publish.',
  },
  {
    legacyId: 7,
    locale: 'en',
    title: 'Tư vấn dự án',
    alias: 'tu-van-du-an',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services; bản nháp cũ chưa publish.',
  },
  {
    legacyId: 8,
    locale: 'en',
    title: 'Tư vấn lập đơn giá, chỉ số giá',
    alias: 'tu-van-lap-don-gia-chi-so-gia',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services; bản nháp cũ chưa publish.',
  },
  {
    legacyId: 9,
    locale: 'en',
    title: 'Xuất khẩu phần mềm',
    alias: 'xuat-khau-phan-mem',
    categoryId: 2,
    published: false,
    classification: 'NOT_USED',
    rationale: 'Dịch vụ thuộc module cic_services; bản nháp cũ chưa publish.',
  },
];
