/**
 * Module 06: Thiết lập danh mục sản phẩm (Product Master Data & Settings Specification)
 * Product taxonomy, brands, applications, product types and product owners.
 */

export type MasterDataType = 
  | 'categories' 
  | 'brands' 
  | 'applications' 
  | 'product_types' 
  | 'sales_staff';

export type MasterItemStatus = 'active' | 'inactive' | 'archived';

export interface BaseMasterItem {
  id: string;
  name: string;
  code: string;
  status: MasterItemStatus;
  ordering: number;
  usage_count: number;
  created_time: string;
  updated_time: string;
  updated_by?: string;
  description?: string;
}

// 1. Category / Lĩnh vực sản phẩm (Hierarchical Taxonomy)
export interface MasterCategoryItem extends BaseMasterItem {
  type: 'categories';
  slug: string;
  parent_id?: string | null;
  parent_name?: string;
  level: number; // 1 for Root, 2 for Subcategory
  icon?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  site_scope: ('main_website' | 'portal_bim' | 'store_software')[];
}

// 2. Brand / Hãng sản xuất
export interface MasterBrandItem extends BaseMasterItem {
  type: 'brands';
  logo?: string;
  country: string;
  website?: string;
  is_featured: boolean;
}

// 3. Application Area / Lĩnh vực ứng dụng
export interface MasterApplicationItem extends BaseMasterItem {
  type: 'applications';
  sector_group: string; // e.g., 'Kết cấu', 'Hạ tầng', 'Thủy lợi', 'Xây dựng dân dụng'
  color_badge?: string;
  icon?: string;
}

// 4. Product Type / Loại sản phẩm
export interface MasterProductTypeItem extends BaseMasterItem {
  type: 'product_types';
  type_code: string; // 'software_desktop', 'software_cloud', 'hardware_device', 'service_consulting', 'training_course'
  requires_license_key: boolean;
  pricing_model_default: 'quote' | 'fixed_price' | 'subscription';
  icon?: string;
}

// 5. Sales Representative / Nhân viên kinh doanh phụ trách
export interface MasterSalesStaffItem extends BaseMasterItem {
  type: 'sales_staff';
  phone: string;
  skype: string;
  zalo: string;
  alias: string;
  contact_product_ids: string[];
  sales_product_ids: string[];
  technical_support_product_ids: string[];
  north_sales_product_ids: string[];
  south_sales_product_ids: string[];
}

export type AnyMasterItem = 
  | MasterCategoryItem 
  | MasterBrandItem 
  | MasterApplicationItem 
  | MasterProductTypeItem 
  | MasterSalesStaffItem;

export interface UsageImpactRecord {
  id: string;
  type: 'product' | 'contact_inquiry' | 'product_registration';
  title: string;
  sku_or_code: string;
  category_name?: string;
  owner_name?: string;
  status: string;
  updated_time: string;
}
