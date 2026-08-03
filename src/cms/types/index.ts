/**
 * CIC CMS Database Schema & TypeScript Interfaces
 * Match 100% database snake_case field names according to specification
 */

export interface CmsUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor' | 'viewer';
  user_avatar?: string;
  status: 'active' | 'inactive';
  last_login_time?: string;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  subject: string;
  content: string;
  status: 'unread' | 'processing' | 'completed';
  created_time: string;
}

export interface ProductRegistration {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  product_id: string;
  product_name: string;
  company_name: string;
  status: 'pending' | 'contacted' | 'quoted' | 'closed';
  created_time: string;
}

export interface PendingContent {
  id: string;
  title: string;
  content_type: 'product' | 'news' | 'static_page';
  author_name: string;
  status: 'draft' | 'pending' | 'published';
  created_time: string;
}

export interface ActivityLog {
  id: string;
  username: string;
  user_avatar?: string;
  activity_type: 'create' | 'update' | 'delete' | 'publish' | 'system' | 'auth';
  description: string;
  created_time: string;
}

export interface KpiStats {
  published_products: number;
  published_news: number;
  static_pages: number;
  published_members: number;
  unprocessed_contacts: number;
  unprocessed_registrations: number;
}

export interface TrafficStat {
  date_label: string;
  visits_count: number;
  page_views_count: number;
}

export interface WeeklyContentStat {
  week_label: string;
  news_count: number;
  product_count: number;
  static_page_count: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'contact' | 'registration' | 'system' | 'backup';
  unread: boolean;
  created_time: string;
}

export interface CmsMenuItem {
  id: string;
  title: string;
  iconName: string;
  path?: string;
  badgeCount?: number;
  badgeVariant?: 'danger' | 'warning' | 'info';
  children?: {
    id: string;
    title: string;
    path: string;
    badgeCount?: number;
  }[];
}

export interface CmsMenuGroup {
  id: string;
  groupTitle: string;
  items: CmsMenuItem[];
}
