export const fieldLabels: Record<string, string> = {
  title: 'Tiêu đề', subtitle: 'Mô tả ngắn', description: 'Nội dung mô tả', badge: 'Nhãn', eyebrow: 'Nhãn giới thiệu',
  phone: 'Số điện thoại', email: 'Email', videoUrl: 'Video URL', mapUrl: 'Google Maps URL', imageId: 'Ảnh',
  backgroundImageId: 'Ảnh nền', primaryCtaId: 'CTA chính', secondaryCtaId: 'CTA phụ', ctaId: 'CTA', formId: 'Form',
  submitLabel: 'Nhãn nút gửi', successTitle: 'Tiêu đề thành công', successMessage: 'Nội dung thành công', lastUpdated: 'Ngày cập nhật',
  readingTime: 'Thời gian đọc', categoryTag: 'Nhãn danh mục', vision: 'Tầm nhìn', mission: 'Sứ mệnh', policyPageId: 'Trang chính sách',
  name: 'Tên', address: 'Địa chỉ', workingHours: 'Giờ làm việc', year: 'Năm', value: 'Giá trị', suffix: 'Hậu tố', label: 'Nhãn',
  text: 'Nội dung', richTextHtml: 'Nội dung', downloadMediaId: 'Hồ sơ năng lực', mediaId: 'Media', targetId: 'Dữ liệu liên kết', slotKey: 'Vị trí cố định',
  logo: 'Logo', img: 'Hình ảnh', image: 'Hình ảnh', icon: 'Biểu tượng', mobileImageId: 'Ảnh mobile',
  syncWithHome: 'Đồng bộ từ Trang chủ',
};

export const imageKeys = new Set(['imageId', 'backgroundImageId', 'mobileImageId', 'image', 'logo', 'img', 'icon']);
export const readOnlyKeys = new Set(['key', 'targetId', 'categoryKeys']);
export const longTextKeys = new Set(['description', 'subtitle', 'text', 'vision', 'mission', 'address', 'workingHours']);

export const FORM_OPTIONS = [
  { value: 'form_home_consultation', label: 'Form tư vấn trang chủ (form_home_consultation)' },
  { value: 'form_contact_request', label: 'Form tiếp nhận liên hệ (form_contact_request)' },
  { value: 'form_003', label: 'Form Tải Hồ sơ năng lực CIC (form_003)' },
  { value: 'form_004', label: 'Form Khảo sát Đào tạo BIM (form_004)' },
];

export const CTA_OPTIONS = [
  { value: 'cta_explore_products', label: 'Khám phá sản phẩm (cta_explore_products)' },
  { value: 'cta_about_cic', label: 'Tìm hiểu về CIC (cta_about_cic)' },
  { value: 'cta_contact', label: 'Liên hệ ngay (cta_contact)' },
  { value: 'cta_tuvan_erp', label: 'Tư vấn giải pháp (cta_tuvan_erp)' },
  { value: 'cta_baogia_intellicad', label: 'Báo giá phần mềm (cta_baogia_intellicad)' },
  { value: 'cta_download_profile', label: 'Tải Hồ sơ năng lực (cta_download_profile)' },
  { value: 'cta_bim_consulting', label: 'Tư vấn giải pháp BIM (cta_bim_consulting)' },
];

export const POLICY_PAGE_OPTIONS = [
  { value: 'page_privacy_vi', label: 'Chính sách bảo mật thông tin (/chinh-sach-bao-mat)' },
  { value: 'page_terms_vi', label: 'Điều khoản sử dụng dịch vụ (/dieu-khoan-su-dung)' },
  { value: 'page_iso_compliance', label: 'Tiêu chuẩn bảo mật ISO 27001' },
];

export const CATEGORY_TAG_OPTIONS = [
  { value: 'Trang nội dung', label: 'Trang nội dung' },
  { value: 'Chính sách pháp lý', label: 'Chính sách pháp lý' },
  { value: 'Điều khoản sử dụng', label: 'Điều khoản sử dụng' },
  { value: 'Giới thiệu doanh nghiệp', label: 'Giới thiệu doanh nghiệp' },
  { value: 'Dịch vụ công nghệ', label: 'Dịch vụ công nghệ' },
  { value: 'Tin tức & Sự kiện', label: 'Tin tức & Sự kiện' },
];

export const DOWNLOAD_MEDIA_OPTIONS = [
  { value: 'media_company_profile', label: 'Hồ sơ năng lực CIC (PDF Tiếng Việt)' },
  { value: 'media_company_profile_en', label: 'CIC Company Profile (PDF English)' },
  { value: 'media_bim_catalog', label: 'Catalogue Giải pháp BIM & Digital Twins' },
  { value: 'media_software_brochure', label: 'Brochure Phần mềm Kỹ thuật Bản quyền' },
];

export const SLOT_KEY_OPTIONS = [
  { value: 'primary', label: 'Ô chính (AI & Công nghệ thông minh)' },
  { value: 'secondary', label: 'Ô nổi bật (BIM & Digital Twins)' },
  { value: 'small_1', label: 'Ô nhỏ 1 (Phần mềm kỹ thuật bản quyền)' },
  { value: 'small_2', label: 'Ô nhỏ 2 (Thiết bị công nghệ)' },
  { value: 'small_3', label: 'Ô nhỏ 3 (Net Zero & Phát triển bền vững)' },
  { value: 'small_4', label: 'Ô nhỏ 4 (Tư vấn & Đào tạo)' },
  { value: 'full', label: 'Ô toàn chiều rộng (Giải pháp theo ngành)' },
];
