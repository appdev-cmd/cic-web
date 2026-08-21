/**
 * MODULE 07: DỊCH VỤ (SERVICES MODULE)
 * TypeScript Types & Data Schema Specification
 */

export type EditorialStatus = 'draft' | 'published';

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags?: string;
  description: string;
  thumbnail_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  editorial_status: EditorialStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
}

export interface ServiceVersion {
  id: string;
  service_id: string;
  version_number: number;
  title: string;
  editorial_status: EditorialStatus;
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
  action_type: 'create' | 'update' | 'publish' | 'activate' | 'deactivate' | 'archive' | 'restore';
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
