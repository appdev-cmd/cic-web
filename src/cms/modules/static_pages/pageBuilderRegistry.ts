import type { PageBuilderEntityType, SectionDefinition } from './pageBuilderTypes';
import type { EditableSectionContract } from '../../../shared/visual-editing/editableSectionContract';

const blockedContract = (sectionKey: string, extra: Partial<EditableSectionContract> = {}): EditableSectionContract => ({
  sectionKey,
  fields: [],
  ...extra,
});

/** Labels and fixed section capabilities are code-owned, not database content. */
export const entityTypeLabels: Record<PageBuilderEntityType, string> = {
  product: 'Sản phẩm',
  news: 'Tin tức',
  service: 'Dịch vụ',
  project: 'Dự án',
  partner: 'Đối tác',
  event: 'Sự kiện',
};

export const sectionDefinitions: Record<string, SectionDefinition> = {
  'home.hero': { label: 'Hero', description: 'Carousel mở đầu của Trang chủ.', canHide: false, canMove: false, editableContract: blockedContract('home.hero', { fields: [{ path: 'slides.*.title', semantic: 'rich-text', ownership: 'static-unwired', valueKind: 'string', editing: 'blocked', blockedReason: 'representation-mismatch' }, { path: 'slides.*.subtitle', semantic: 'text', ownership: 'static-unwired', valueKind: 'string', editing: 'blocked', blockedReason: 'data-unwired' }], media: { background: { path: 'slides.*.backgroundImageId', semantic: 'background-image', ownership: 'static-unwired', replace: 'blocked', blockedReason: 'data-unwired' }, mobileBackground: { path: 'slides.*.mobileImageId', semantic: 'background-image', ownership: 'static-unwired', replace: 'blocked', optional: true, blockedReason: 'data-unwired' } }, actions: { primary: { path: 'slides.*.primaryCtaId', semantic: 'cta', ownership: 'reference', editing: 'blocked', replace: 'blocked', blockedReason: 'data-unwired' }, secondary: { path: 'slides.*.secondaryCtaId', semantic: 'cta', ownership: 'reference', editing: 'blocked', replace: 'blocked', optional: true, blockedReason: 'data-unwired' } } }) },
  'home.intro': { label: 'Giới thiệu ngắn', description: 'Nội dung giới thiệu và video doanh nghiệp.', canHide: true, canMove: true, editableContract: blockedContract('home.intro', { media: { image: { path: 'imageId', semantic: 'image', ownership: 'static-unwired', replace: 'blocked', optional: true, blockedReason: 'data-unwired' }, video: { path: 'videoUrl', semantic: 'video', ownership: 'static-unwired', replace: 'blocked', optional: true, blockedReason: 'data-unwired' } }, actions: { primary: { path: 'primaryCtaId', semantic: 'cta', ownership: 'reference', editing: 'blocked', replace: 'blocked', optional: true, blockedReason: 'data-unwired' }, profile: { path: 'downloadMediaId', semantic: 'link', ownership: 'reference', editing: 'blocked', replace: 'blocked', optional: true, blockedReason: 'data-unwired' } } }) },
  'home.stats': {
    label: 'Thống kê', description: 'Bốn chỉ số theo thiết kế hiện tại.', canHide: true, canMove: true,
    editableContract: {
      sectionKey: 'home.stats',
      fields: [
        { path: 'items.*.value', semantic: 'text', ownership: 'embedded', valueKind: 'number', editing: 'enabled' },
        { path: 'items.*.suffix', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'blocked', blockedReason: 'representation-mismatch' },
        { path: 'items.*.label', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
      ],
      collections: {
        items: { path: 'items', identity: 'persistent-item-id', capabilities: { reorder: 'enabled', add: 'blocked', remove: 'blocked' }, layoutBehavior: { wrap: true } },
      },
    },
  },
  'home.awards': { label: 'Giải thưởng', description: 'Danh sách giải thưởng trong slider.', canHide: true, canMove: true, editableContract: blockedContract('home.awards', { media: { images: { path: 'items.*.imageId', semantic: 'image', ownership: 'embedded', replace: 'blocked', blockedReason: 'identity-unresolved' } } }) },
  'home.ecosystem': {
    label: 'Hệ sinh thái công nghệ', description: 'Carousel nội dung nhập trực tiếp, mỗi mục có ảnh và liên kết riêng.', canHide: true, canMove: true,
    editableContract: {
      sectionKey: 'home.ecosystem',
      fields: [
        { path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'subtitle', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'items.*.badge', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'items.*.title', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'items.*.description', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'items.*.link', semantic: 'link', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
      ],
      media: { images: { path: 'items.*.imageId', semantic: 'image', ownership: 'embedded', replace: 'enabled' } },
      collections: { items: { path: 'items', identity: 'persistent-item-id', capabilities: { reorder: 'enabled', add: 'enabled', remove: 'enabled' }, layoutBehavior: { wrap: true } } },
    },
  },
  'home.projects': {
    label: 'Dự án tiêu biểu', description: 'Chọn thủ công tối đa 3 dự án.', referenceLimit: { project: 3 }, canHide: true, canMove: true,
    editableContract: {
      sectionKey: 'home.projects',
      fields: [],
      references: {
        items: { path: 'items', entityType: 'project', identity: 'entity-id', capabilities: { replace: 'enabled', reorder: 'blocked', add: 'blocked', remove: 'blocked' }, allowDuplicates: false, maxItems: 3, layoutBehavior: { wrap: false } },
      },
    },
  },
  'home.events': { label: 'Sự kiện nổi bật', description: 'Một sự kiện chính và tối đa 3 sự kiện phụ.', referenceLimit: { event: 4 }, canHide: true, canMove: true, editableContract: blockedContract('home.events') },
  'home.news': { label: 'Tin tức và Góc nhìn', description: 'Chọn thủ công tối đa 3 bài viết.', referenceLimit: { news: 3 }, canHide: true, canMove: true, editableContract: blockedContract('home.news') },
  'home.partners': { label: 'Đối tác chiến lược', description: 'Danh sách đối tác theo thứ tự marquee.', referenceLimit: { partner: 12 }, canHide: true, canMove: true, editableContract: blockedContract('home.partners') },
  'home.contact_cta': { label: 'CTA & Form tư vấn', description: 'Nội dung liên hệ và form cố định.', editableContract: blockedContract('home.contact_cta') },
  'about.hero': { label: 'Hero Giới thiệu', description: 'Tiêu đề và ảnh mở đầu.', editableContract: { sectionKey: 'about.hero', fields: [{ path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }, { path: 'subtitle', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }], media: { background: { path: 'backgroundImageId', semantic: 'background-image', ownership: 'section-config', replace: 'enabled' } } } },
  'about.overview': { label: 'Tổng quan doanh nghiệp', description: 'Nội dung giới thiệu và video doanh nghiệp.', editableContract: { sectionKey: 'about.overview', fields: [{ path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }], media: { video: { path: 'videoUrl', semantic: 'video', ownership: 'section-config', replace: 'enabled', optional: true } } } },
  'about.timeline': {
    label: 'Tiến trình phát triển', description: 'Các mốc lịch sử theo thiết kế timeline.',
    editableContract: {
      sectionKey: 'about.timeline',
      fields: [
        { path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'description', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'milestones.*.year', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'milestones.*.title', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'blocked', blockedReason: 'representation-mismatch' },
        { path: 'milestones.*.description', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
      ],
      collections: { milestones: { path: 'milestones', identity: 'persistent-item-id', capabilities: { reorder: 'blocked', add: 'blocked', remove: 'blocked' }, layoutBehavior: { wrap: true } } },
    },
  },
  'about.strategy': {
    label: 'Định hướng chiến lược', description: 'Tầm nhìn, sứ mệnh và giá trị cốt lõi.',
    editableContract: {
      sectionKey: 'about.strategy',
      fields: [
        { path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'subtitle', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'vision', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'mission', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'coreValues.*.value', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
      ],
      media: { image: { path: 'imageId', semantic: 'image', ownership: 'section-config', replace: 'enabled' } },
      collections: { coreValues: { path: 'coreValues', identity: 'persistent-item-id', capabilities: { reorder: 'blocked', add: 'blocked', remove: 'blocked' }, layoutBehavior: { wrap: true } } },
    },
  },
  'about.offerings': { label: 'Sản phẩm và dịch vụ cung cấp', description: 'Các nội dung được chọn cho lưới cố định.', referenceLimit: { product: 2, service: 4 }, editableContract: { sectionKey: 'about.offerings', fields: [{ path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }, { path: 'subtitle', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }] } },
  'about.awards': { label: 'Thành tựu & Giải thưởng', description: 'Danh sách giải thưởng.', editableContract: { sectionKey: 'about.awards', fields: [{ path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }, { path: 'subtitle', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }], media: { images: { path: 'items.*.imageId', semantic: 'image', ownership: 'embedded', replace: 'enabled' } }, collections: { items: { path: 'items', identity: 'persistent-item-id', capabilities: { reorder: 'enabled', add: 'enabled', remove: 'enabled' }, layoutBehavior: { wrap: true } } } } },
  'about.partners': { label: 'Đối tác chiến lược', description: 'Dải logo đối tác cuối khu vực, hiển thị dạng carousel.', editableContract: { sectionKey: 'about.partners', fields: [{ path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }, { path: 'subtitle', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }, { path: 'description', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }], media: { images: { path: 'items.*.imageId', semantic: 'image', ownership: 'embedded', replace: 'enabled' } }, collections: { items: { path: 'items', identity: 'persistent-item-id', capabilities: { reorder: 'enabled', add: 'enabled', remove: 'enabled' }, layoutBehavior: { wrap: true } } } } },
  'about.organization': { label: 'Cơ cấu tổ chức', description: 'Sơ đồ và topology được giữ trong code.', editableContract: blockedContract('about.organization') },
  'about.capacity': {
    label: 'Năng lực doanh nghiệp', description: 'Giới thiệu và bốn chỉ số năng lực.',
    editableContract: {
      sectionKey: 'about.capacity',
      fields: [
        { path: 'title', semantic: 'rich-text', ownership: 'static-unwired', valueKind: 'string', editing: 'blocked', blockedReason: 'representation-mismatch' },
        { path: 'description', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'separator', semantic: 'decorative', ownership: 'decorative', editing: 'disabled' },
        { path: 'metrics.*.value', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'metrics.*.label', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
      ],
      collections: {
        metrics: { path: 'metrics', identity: 'persistent-item-id', capabilities: { reorder: 'blocked', add: 'blocked', remove: 'blocked' }, layoutBehavior: { wrap: true } },
      },
    },
  },
  'about.experience': { label: 'Năng lực & Kinh nghiệm', description: 'Danh mục kinh nghiệm theo thiết kế.', editableContract: blockedContract('about.experience') },
  'about.software_partners': { label: 'Đối tác phần mềm', description: 'Danh sách đối tác phần mềm.', referenceLimit: { partner: 12 }, editableContract: blockedContract('about.software_partners') },
  'about.hardware_partners': { label: 'Đối tác thiết bị', description: 'Danh sách đối tác thiết bị.', referenceLimit: { partner: 12 }, editableContract: blockedContract('about.hardware_partners') },
  'about.contact_cta': { label: 'CTA liên hệ', description: 'Kêu gọi kết nối chuyên gia CIC.', editableContract: blockedContract('about.contact_cta') },
  'contact.header': { label: 'Header Liên hệ', description: 'Tiêu đề trang Liên hệ.', editableContract: blockedContract('contact.header') },
  'contact.branches': {
    label: 'Chi nhánh & Bản đồ', description: 'Hai chi nhánh theo layout hiện tại.',
    editableContract: {
      sectionKey: 'contact.branches',
      fields: [
        { path: 'title', semantic: 'text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' },
        { path: 'branches.*.name', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'branches.*.address', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'branches.*.phone', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'branches.*.email', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'branches.*.workingHours', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'enabled' },
        { path: 'branches.*.fax', semantic: 'text', ownership: 'embedded', valueKind: 'string', editing: 'blocked', blockedReason: 'data-unwired' },
      ],
      collections: { branches: { path: 'branches', identity: 'slot-key', capabilities: { reorder: 'disabled', add: 'blocked', remove: 'blocked' }, layoutBehavior: { wrap: false } } },
    },
  },
  'contact.form': { label: 'Form liên hệ', description: 'Form nghiệp vụ được tham chiếu bằng ID.', editableContract: blockedContract('contact.form') },
  'contact.security': { label: 'Thông báo bảo mật', description: 'Nội dung dẫn tới chính sách bảo mật.', editableContract: blockedContract('contact.security') },
  'legal.header': {
    label: 'Phần đầu trang',
    description: 'Soạn tự do toàn bộ phần đầu trang bằng Rich Text Editor.',
    editableContract: blockedContract('legal.header', {
      fields: [{ path: 'richTextHtml', semantic: 'rich-text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }],
    }),
  },
  'legal.content': {
    label: 'Nội dung',
    description: 'Soạn thảo trực quan hoặc chỉnh HTML bằng Rich Text Editor đầy đủ.',
    editableContract: blockedContract('legal.content', {
      fields: [{ path: 'richTextHtml', semantic: 'rich-text', ownership: 'section-config', valueKind: 'string', editing: 'enabled' }],
    }),
  },
  'privacy.collection': { label: 'Mục đích thu thập', description: 'Mục 01 của chính sách.', editableContract: blockedContract('privacy.collection') },
  'privacy.usage': { label: 'Phạm vi sử dụng', description: 'Mục 02 của chính sách.', editableContract: blockedContract('privacy.usage') },
  'privacy.retention': { label: 'Thời gian lưu trữ', description: 'Mục 03 của chính sách.', editableContract: blockedContract('privacy.retention') },
  'privacy.access': { label: 'Tiếp cận và chỉnh sửa', description: 'Mục 04 của chính sách.', editableContract: blockedContract('privacy.access') },
  'privacy.commitment': { label: 'Cam kết bảo mật', description: 'Mục 05 của chính sách.', editableContract: blockedContract('privacy.commitment') },
  'legal.assistance': { label: 'Hỗ trợ pháp lý', description: 'Thông tin liên hệ giải đáp.', editableContract: blockedContract('legal.assistance') },
};
