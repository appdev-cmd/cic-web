/**
 * MODULE 07: DỊCH VỤ (SERVICES MODULE)
 * TypeScript Types & Data Schema Specification
 */

export type EditorialStatus = 'draft' | 'pending' | 'approved' | 'published';
export type ServiceStatus = 'active' | 'inactive' | 'archived';
export interface ServiceGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  display_order: number;
  status: 'active' | 'inactive';
}

export interface ServiceItem {
  id: string;
  code: string; // Mã dịch vụ (e.g., DV-BIM-01)
  title: string; // Tên dịch vụ
  slug: string;
  summary: string; // Tóm tắt ngắn
  
  // Phân loại
  group_id: string;
  group_name: string;
  scope: string; // Phạm vi áp dụng (e.g. Toàn quốc, FDI, Dự án hạ tầng)
  business_relation: string; // Quan hệ nghiệp vụ (e.g. Dịch vụ độc lập, Đi kèm phần mềm)

  // Nội dung
  description: string; // Mô tả chi tiết (HTML / Markdown)
  benefits_process: string; // Lợi ích & Quy trình thực hiện
  supplementary_content: string; // Nội dung bổ trợ / Điều khoản / FAQ

  // Media
  thumbnail_url: string;
  banner_url: string;
  video_url?: string;
  media_alt: string;

  // Liên hệ & Chuyển đổi
  cta_label: string; // Nhãn nút CTA (e.g. "Nhận báo giá dịch vụ")
  cta_link: string;
  owner_id: string;
  owner_name: string;
  owner_avatar: string;
  owner_email: string;
  request_routing: string; // Quy trình nhận & điều hướng yêu cầu

  // SEO & Chia sẻ
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  quality_warning?: string; // Cảnh báo chất lượng
  quality_score: number; // 0 - 100

  // Xuất bản & Hiển thị
  editorial_status: EditorialStatus;
  service_status: ServiceStatus;
  site: string; // e.g. "cic.com.vn"
  placement: string[]; // Vị trí hiển thị: ['home_featured', 'services_page', 'footer']
  display_order: number;
  publish_at?: string;

  // Tracking
  created_at: string;
  updated_at: string;
  updated_by: string;
  is_deleted?: boolean;
  version_count: number;
  working_version_exists?: boolean;

  // Usage & Contacts count
  used_by_count: number;
  open_contacts_count: number;
}

export interface ServiceVersion {
  id: string;
  service_id: string;
  version_number: number;
  title: string;
  editorial_status: EditorialStatus;
  service_status: ServiceStatus;
  updated_by: string;
  updated_at: string;
  change_log: string;
  is_published_version?: boolean;
}

export interface ServiceActivityLog {
  id: string;
  service_id: string;
  user_name: string;
  user_avatar?: string;
  action_type: 'create' | 'update' | 'submit' | 'approve' | 'publish' | 'activate' | 'deactivate' | 'archive' | 'restore';
  description: string;
  created_at: string;
}

export interface ServiceUsedByReference {
  id: string;
  service_id: string;
  source_type: 'menu' | 'home_block' | 'static_page' | 'banner' | 'landing_page';
  source_title: string;
  source_url: string;
  status: 'active' | 'draft';
}

export interface ServiceRelatedContact {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name: string;
  subject: string;
  status: 'unread' | 'processing' | 'completed';
  created_at: string;
}
