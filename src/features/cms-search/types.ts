import type { CmsLocale } from '@/cms/data/CmsDataSource';

export type CmsSearchModule = 'command' | 'products' | 'news' | 'customer_requests' | 'events' | 'projects' | 'static_pages' | 'services' | 'forms_cta' | 'media' | 'users_permissions';

export interface CmsSearchRecord {
  id: string;
  title: string;
  subtitle?: string;
  module: Exclude<CmsSearchModule, 'command'>;
  moduleLabel: string;
  category?: string;
  statusText?: string;
  statusColor?: 'emerald' | 'amber' | 'blue' | 'slate' | 'rose' | 'orange';
  path: string;
  actionType: 'navigate' | 'edit' | 'open_modal' | 'view';
  locale?: CmsLocale;
  metadata?: { sku?: string; email?: string; phone?: string; company?: string; code?: string; slug?: string; date?: string; author?: string; location?: string; tags?: string[] };
  keywords: string[];
  requiredRole?: string[];
}
