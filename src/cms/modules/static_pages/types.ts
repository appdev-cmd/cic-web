export interface StaticPageCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
  slug?: string;
}

export type PageTemplateType = 'standard' | 'landing' | 'policy' | 'corporate_intro';

export interface PageSectionBlock {
  id: string;
  title: string;
  type: 'text' | 'hero' | 'grid' | 'faq' | 'cta';
  content: string;
  order: number;
}

export interface UsedByReference {
  id: string;
  type: 'menu' | 'footer' | 'block' | 'context_link';
  location_name: string;
  link_url: string;
}

export interface VersionRecord {
  version: number;
  created_at: string;
  author_name: string;
  note: string;
  title: string;
  content: string;
  is_published_version?: boolean;
}

export interface ActivityLogRecord {
  id: string;
  timestamp: string;
  actor_name: string;
  action_type: 'create' | 'update' | 'submit' | 'approve' | 'return' | 'publish' | 'archive' | 'restore';
  details: string;
}

export interface StaticPageTranslation {
  title?: string;
  summary?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
}

export type WorkflowStatus =
  | 'draft'
  | 'pending'
  | 'returned'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface StaticPage {
  id: string;
  title: string;
  alias: string;
  category_id: string;
  parent_id?: string | null;
  depth?: number;
  template?: PageTemplateType;
  sections?: PageSectionBlock[];
  summary: string;
  overview?: string;
  specifications?: string;
  content: string;
  image: string;
  image_alt?: string;
  image_caption?: string;
  banner_image?: string;
  tags: string[];
  related_page_ids?: string[];
  show_in_homepage: boolean;
  show_in_footer?: boolean;
  show_in_header?: boolean;
  published: boolean;
  ordering: number;
  seo_title: string;
  seo_keyword: string;
  seo_description: string;
  created_time: string;
  updated_time?: string;
  
  // Author & Workflow details
  author?: { name: string; avatar?: string };
  assignee?: { name: string; avatar?: string };
  reviewer?: { name: string; avatar?: string };
  workflow_status: WorkflowStatus;
  start_time?: string;
  end_time?: string;
  timezone?: string;
  return_comment?: string;

  // Versioning
  working_version_number: number;
  published_version_number?: number;
  versions?: VersionRecord[];

  // Trash state
  in_trash?: boolean;
  deleted_at?: string;

  // Locales & Translations
  primary_locale: 'vi' | 'en';
  translations?: {
    en?: StaticPageTranslation;
  };
  translation_progress?: {
    vi?: 'complete';
    en?: 'missing' | 'in_progress' | 'review' | 'complete' | 'outdated';
  };

  // Nơi sử dụng (Used By references)
  used_by?: UsedByReference[];

  // Quality checks
  quality_warnings?: string[];

  // Activity log
  activities?: ActivityLogRecord[];
}
