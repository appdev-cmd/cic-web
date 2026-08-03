export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
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

export interface NewsArticle {
  id: string;
  title: string;
  alias: string;
  category_id: string;
  summary: string;
  content: string;
  image: string;
  video: string;
  tags: string[];
  news_related: string[];
  products_related: string[];
  start_time: string;
  end_time: string;
  is_hot: boolean;
  is_new: boolean;
  show_in_homepage: boolean;
  published: boolean;
  ordering: number;
  seo_title: string;
  seo_keyword: string;
  seo_description: string;
  created_time: string;
  updated_time?: string;
}
