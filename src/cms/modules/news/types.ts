export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface RelatedProductItem {
  id: string;
  name: string;
  image: string;
  code: string;
}

export interface RelatedNewsItem {
  id: string;
  title: string;
  image: string;
}

export type WorkflowStatus =
  | 'draft'
  | 'pending'
  | 'returned'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface ArticleVersion {
  id: string;
  version_number: number;
  created_at: string;
  created_by: string;
  note: string;
  is_published_version?: boolean;
  title: string;
  summary: string;
}

export interface ArticleActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  alias: string;
  other_languages1?: string;
  category_id: string;
  summary: string;
  content: string;
  image: string;
  image_alt?: string;
  image_caption?: string;
  video: string;
  tags: string[];
  tawk_to?: string;
  file_upload?: string;
  news_related: string[];
  products_related: string[];
  start_time: string;
  end_time: string;
  timezone?: string;
  is_hot: boolean;
  is_new: boolean;
  show_in_homepage: boolean;
  published: boolean; // mapped to published vs working draft
  workflow_status: WorkflowStatus;
  ordering: number;
  
  // Author & Workflow Roles
  author: {
    name: string;
    avatar?: string;
    email?: string;
  };
  assignee?: {
    name: string;
    avatar?: string;
  };
  reviewer?: {
    name: string;
    avatar?: string;
  };
  return_comment?: string;

  // SEO Fields
  seo_title: string;
  seo_keyword: string;
  seo_description: string;

  // Versioning & Working Copies
  working_version_number: number;
  published_version_number?: number;
  has_unpublished_changes?: boolean;
  versions?: ArticleVersion[];
  activity_logs?: ArticleActivityLog[];

  // Trash & System
  in_trash?: boolean;
  deleted_at?: string;
  quality_warnings?: string[];
  created_time: string;
  updated_time?: string;
}
