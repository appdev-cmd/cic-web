export interface CmsProject {
  id: string;
  title: string;
  alias: string;
  tagline: string;
  summary: string;
  content: string;
  sector: string;
  solution: string;
  technologies: string[];
  customer_name: string;
  location: string;
  start_year: number | null;
  end_year: number | null;
  is_ongoing: boolean;
  image: string;
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
  productOptions: ProjectRelationOption[];
  serviceOptions: ProjectRelationOption[];
}

export interface ProjectRelationOption {
  id: string;
  label: string;
  subLabel?: string;
  image?: string;
}
