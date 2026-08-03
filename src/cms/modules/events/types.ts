export interface EventCategory {
  id: string;
  name: string;
  slug: string;
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
  event_related: string[];
  news_related: string[];
  products_related: string[];
  is_new: boolean;
  is_hot: boolean;
  show_in_home: boolean;
  published: boolean;
  ordering: number;
  seo_title: string;
  seo_keyword: string;
  seo_description: string;
  created_time: string;
  updated_time?: string;
}
