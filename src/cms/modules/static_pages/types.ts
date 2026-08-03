export interface StaticPageCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface StaticPage {
  id: string;
  title: string;
  alias: string;
  category_id: string;
  summary: string;
  content: string;
  image: string;
  tags: string[];
  show_in_homepage: boolean;
  published: boolean;
  ordering: number;
  seo_title: string;
  seo_keyword: string;
  seo_description: string;
  created_time: string;
  updated_time?: string;
}
