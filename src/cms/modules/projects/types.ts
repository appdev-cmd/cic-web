export interface CmsProject {
  id: string;
  title: string;
  alias: string;
  tagline: string;
  summary: string;
  content: string;
  sector: string;
  solution: string;
  customer_name: string;
  location: string;
  start_year: number | null;
  end_year: number | null;
  is_ongoing: boolean;
  image: string;
  gallery: string[];
  video_title: string;
  video_url: string;
  video_thumbnail: string;
  document_title: string;
  document_url: string;
  document_size: string;
  products_related: string[];
  services_related: string[];
  is_featured: boolean;
  published: boolean;
  ordering: number;
  seo_title: string;
  seo_keyword: string;
  seo_description: string;
  created_time: string;
  updated_time: string;
}

export interface ProjectsModuleData {
  projects: CmsProject[];
}
