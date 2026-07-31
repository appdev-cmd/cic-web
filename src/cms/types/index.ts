/**
 * CMS Module Types
 */

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export interface CmsPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  updatedAt: string;
  author: string;
}

export interface CmsStats {
  totalArticles: number;
  totalProducts: number;
  totalEvents: number;
  totalConsultations: number;
}
