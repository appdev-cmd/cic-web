export type DraftElementKind = 'text' | 'media' | 'video' | 'cta' | 'link' | 'collection' | 'reference' | 'form' | 'richtext';

export interface DraftElementDefinition {
  key: string;
  label: string;
  kind: DraftElementKind;
  optional?: boolean;
  collection?: boolean;
}

const text = (key: string, label: string, optional = false): DraftElementDefinition => ({ key, label, kind: 'text', optional });
const media = (key: string, label: string, optional = false): DraftElementDefinition => ({ key, label, kind: 'media', optional });
const item = (key: string, label: string): DraftElementDefinition => ({ key, label, kind: 'collection', collection: true });
const reference = (key: string, label: string): DraftElementDefinition => ({ key, label, kind: 'reference', collection: true });

export const draftSectionSchemas: Record<string, DraftElementDefinition[]> = {
  'home.hero': [text('badge', 'Nhãn', true), item('slides', 'Slides'), text('tickerItems', 'Ticker', true), media('mobileImageId', 'Ảnh mobile', true), { key: 'secondaryCtaId', label: 'CTA phụ', kind: 'cta', optional: true }],
  'home.intro': [text('eyebrow', 'Nhãn'), text('title', 'Tiêu đề'), item('paragraphs', 'Các đoạn giới thiệu'), media('imageId', 'Ảnh'), { key: 'videoUrl', label: 'Video', kind: 'video', optional: true }, { key: 'primaryCtaId', label: 'CTA', kind: 'cta', optional: true }, { key: 'downloadMediaId', label: 'Tệp tải', kind: 'media', optional: true }],
  'home.stats': [item('items', 'Các chỉ số')],
  'home.awards': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), item('items', 'Giải thưởng')],
  'home.ecosystem': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), item('slots', 'Các ô giải pháp'), reference('product', 'Sản phẩm'), reference('service', 'Dịch vụ')],
  'home.projects': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), reference('project', 'Dự án')],
  'home.events': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), reference('event', 'Sự kiện')],
  'home.news': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), reference('news', 'Tin tức')],
  'home.partners': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), reference('partner', 'Đối tác')],
  'home.contact_cta': [text('title', 'Tiêu đề'), text('description', 'Mô tả'), text('phone', 'Điện thoại', true), text('email', 'Email', true), { key: 'formId', label: 'Biểu mẫu', kind: 'form' }, text('submitLabel', 'Nhãn gửi')],
  'about.hero': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả'), media('backgroundImageId', 'Ảnh nền')],
  'about.overview': [text('title', 'Tiêu đề'), item('paragraphs', 'Các đoạn nội dung'), media('imageId', 'Ảnh'), { key: 'videoUrl', label: 'Video', kind: 'video', optional: true }],
  'about.timeline': [text('title', 'Tiêu đề'), item('milestones', 'Các mốc thời gian')],
  'about.strategy': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), text('vision', 'Tầm nhìn'), text('mission', 'Sứ mệnh'), item('coreValues', 'Giá trị cốt lõi')],
  'about.offerings': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), reference('product', 'Sản phẩm'), reference('service', 'Dịch vụ')],
  'about.awards': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), item('items', 'Giải thưởng')],
  'about.partners': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả', true), reference('partner', 'Đối tác')],
  'about.organization': [text('title', 'Tiêu đề')],
  'about.capacity': [text('title', 'Tiêu đề'), text('description', 'Mô tả'), item('metrics', 'Chỉ số năng lực')],
  'about.experience': [text('title', 'Tiêu đề'), item('categoryKeys', 'Nhóm kinh nghiệm')],
  'about.software_partners': [text('title', 'Tiêu đề'), reference('partner', 'Đối tác phần mềm')],
  'about.hardware_partners': [text('title', 'Tiêu đề'), reference('partner', 'Đối tác thiết bị')],
  'about.contact_cta': [text('title', 'Tiêu đề'), text('description', 'Mô tả'), { key: 'ctaId', label: 'CTA', kind: 'cta' }],
  'contact.header': [text('title', 'Tiêu đề'), text('subtitle', 'Mô tả')],
  'contact.branches': [text('title', 'Tiêu đề'), item('branches', 'Chi nhánh và bản đồ')],
  'contact.form': [text('title', 'Tiêu đề'), { key: 'formId', label: 'Biểu mẫu', kind: 'form' }, text('submitLabel', 'Nhãn gửi'), text('successTitle', 'Tiêu đề thành công'), text('successMessage', 'Thông báo thành công')],
  'contact.security': [text('title', 'Tiêu đề'), text('description', 'Mô tả'), { key: 'policyPageId', label: 'Trang chính sách', kind: 'link' }],
  'legal.header': [text('categoryTag', 'Phân loại'), text('title', 'Tiêu đề'), text('subtitle', 'Mô tả'), text('lastUpdated', 'Ngày cập nhật'), text('readingTime', 'Thời gian đọc', true)],
  'legal.content': [{ key: 'richTextHtml', label: 'Nội dung', kind: 'richtext' }],
  'privacy.collection': [text('title', 'Tiêu đề'), item('blocks', 'Khối nội dung')],
  'privacy.usage': [text('title', 'Tiêu đề'), item('blocks', 'Khối nội dung')],
  'privacy.retention': [text('title', 'Tiêu đề'), item('blocks', 'Khối nội dung')],
  'privacy.access': [text('title', 'Tiêu đề'), item('blocks', 'Khối nội dung')],
  'privacy.commitment': [text('title', 'Tiêu đề'), item('blocks', 'Khối nội dung')],
  'legal.assistance': [text('title', 'Tiêu đề'), text('description', 'Mô tả'), text('phone', 'Điện thoại'), text('email', 'Email')],
};
