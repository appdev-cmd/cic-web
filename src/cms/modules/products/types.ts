/**
 * Module 05: Sản phẩm (Products Catalog Management) Types
 * Strict specification compliance for dual status, taxonomy, commercial, 11 form sections, quality checklist & audit history.
 */

export type EditorialStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected' | 'archived';

export type CatalogStatus = 'active' | 'inactive' | 'archived';

export type AvailabilitySignal = 'in_stock' | 'pre_order' | 'contact' | 'out_of_stock';

export interface TechSpecParam {
  id: string;
  key: string;
  value: string;
  group?: string;
}

export interface ProductDocument {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: string;
  version: string;
  access: 'public' | 'require_email';
}

export interface ProductItem {
  name?: string;
  code?: string;
  other_languages1?: string;
  icon?: string;
  category_ids?: string[];
  manufactory?: string;
  application?: string[];
  types?: string;
  products_relates?: string[];
  summary?: string;
  description?: string;
  feature_details?: string;
  video?: string;
  tawk_to?: string;
  tags?: string[];
  price_old?: string;
  teamview?: boolean;
  landing_page?: string;
  seo_title?: string;
  seo_keyword?: string;
  seo_description?: string;
  file_catalogue?: string;
  file_price?: string;
  link_catalogue?: string;
  file_driver_name?: string;
  file_driver?: string;
  link_driver?: string;
  file_name1?: string; file_download1?: string; link_download1?: string;
  file_name2?: string; file_download2?: string; link_download2?: string;
  file_name3?: string; file_download3?: string; link_download3?: string;
  file_name4?: string; file_download4?: string; link_download4?: string;
  file_name5?: string; file_download5?: string; link_download5?: string;
  file_name6?: string; file_download6?: string; link_download6?: string;
  id: string;
  sku: string; // Mã sản phẩm / SKU
  title: string;
  alias: string; // Slug
  tagline?: string;
  short_description: string;
  product_type: string; // e.g., 'Phần mềm', 'Thiết bị', 'Dịch vụ', 'Bản quyền'
  
  // Taxonomy
  category_id: string;
  brand_id: string;
  brand_name: string;
  application_areas: string[]; // Lĩnh vực ứng dụng (BIM, Kết cấu, Xây dựng...)

  // Commercial
  price: string; // e.g. 'Báo giá theo license', '15.000.000 VNĐ'
  currency: 'VND' | 'USD';
  unit: string; // License, Bộ, Năm...
  origin: string; // Mỹ (CSI), Nhật Bản, Việt Nam...
  warranty: string;
  availability_signal: AvailabilitySignal;

  // Content
  content_html: string;
  highlights: string[]; // Đặc điểm nổi bật
  
  // Tech Specs
  tech_specs: TechSpecParam[];

  // Media
  image: string; // Thumbnail chính
  gallery: string[];
  video_url?: string;
  og_image?: string;

  // Documents
  documents: ProductDocument[];

  // SEO & Social
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;

  // Contact & Owner
  owner_id: string;
  owner_name: string;
  owner_avatar?: string;
  inquiry_routing: string; // Bộ phận tiếp nhận liên hệ

  // Dual Statuses
  editorial_status: EditorialStatus;
  catalog_status: CatalogStatus;
  published: boolean; // Computed or alias for published editorial
  
  // Placement & Ordering
  is_hot: boolean;
  ordering: number;
  site_placement: string[]; // e.g. ['home_featured', 'catalog_grid', 'footer_links']
  scheduled_publish_time?: string;

  // Quality & Versions
  completeness_score: number; // 0 - 100%
  missing_fields?: string[];
  working_version_id?: string;
  has_working_draft?: boolean;

  // Timestamps & Audit
  created_time: string;
  updated_time: string;
  published_time?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface ProductBrand {
  id: string;
  name: string;
  logo?: string;
  country?: string;
  website?: string;
  description?: string;
}

export interface ProductActivityLog {
  id: string;
  product_id: string;
  product_title: string;
  user_name: string;
  user_avatar?: string;
  user_role: string;
  action: 'create' | 'update' | 'working_draft' | 'review_submit' | 'approve' | 'reject' | 'publish' | 'activate' | 'deactivate' | 'archive';
  details: string;
  timestamp: string;
  version_tag?: string;
}

export interface ProductOwnerOption {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}
