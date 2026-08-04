export type EditorialStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected' | 'archived';
export type EventProgressStatus = 'upcoming' | 'ongoing' | 'ended' | 'cancelled';

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar?: string;
}

export interface EventActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  previous_editorial_status?: EditorialStatus;
  new_editorial_status?: EditorialStatus;
  previous_event_status?: EventProgressStatus;
  new_event_status?: EventProgressStatus;
  timestamp: string;
  note?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface RelatedEventItem {
  id: string;
  title: string;
  image: string;
  time_event: string;
  event_status?: EventProgressStatus;
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
  category_id: string;
  summary: string;
  content: string;
  image: string;
  time_event: string; // Start time, e.g. "2026-08-15T08:30"
  end_time: string;   // End time, e.g. "2026-08-15T17:00"
  place: string;
  specific_time: string; // e.g. "08:30 - 17:00 hàng ngày"
  chu_de: string;
  link_dangky: string;
  organizer?: string;
  speakers?: EventSpeaker[];
  registration_count?: number;
  max_seats?: number;
  
  // Dual Status System:
  editorial_status: EditorialStatus;
  event_status: EventProgressStatus;
  
  // Toggles & Flags
  published: boolean;
  is_new: boolean;
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
