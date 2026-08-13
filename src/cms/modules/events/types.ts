export type EditorialStatus = 'draft' | 'published';

export interface EventActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  previous_editorial_status?: EditorialStatus;
  new_editorial_status?: EditorialStatus;
  timestamp: string;
  note?: string;
}

export interface RelatedEventItem {
  id: string;
  title: string;
  image: string;
  time_event: string;
}

export interface RelatedNewsItem {
  id: string;
  title: string;
  image: string;
}

export interface RelatedProductItem {
  id: string;
  name: string;
  code: string;
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  alias: string;
  summary: string;
  content: string;
  tags?: string[];
  tawk_to?: string;
  image: string;
  time_event: string; // Start time, e.g. "2026-08-15T08:30"
  place: string;
  specific_time: string; // e.g. "08:30 - 17:00 hàng ngày"
  chu_de: string;
  link_dangky: string;
  // Draft / Published only. No approval workflow.
  editorial_status: EditorialStatus;
  
  // Toggles & Flags
  published: boolean;
  is_hot: boolean;
  show_in_home: boolean;
  ordering: number;
  
  // Related Relationships
  event_related: string[];
  news_related: string[];
  products_related: string[];
  
  // SEO
  seo_title: string;
  seo_keyword: string;
  seo_description: string;
  
  // Audit & Metadata
  created_by?: string;
  created_time: string;
  updated_time?: string;
  activity_logs?: EventActivityLog[];
}
