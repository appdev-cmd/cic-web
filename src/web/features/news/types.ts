import type { EventItem, Product } from '../../../shared/types';

export interface NewsRelatedProject {
  id: string;
  name: string;
  tagline?: string;
  shortDesc?: string;
  sector?: string;
  solution?: string;
  customer?: string;
  location?: string;
  time?: string;
  img?: string;
  featured?: boolean;
  scope?: string[];
  appliedSolutions?: string[];
  results?: string[];
}

export type PublicNewsCategory = 'company' | 'specialty' | 'international' | 'recruitment' | 'promotion' | 'shareholder';

export interface PublicNewsItem {
  id: string;
  category: PublicNewsCategory;
  title: string;
  date: string;
  shortDesc: string;
  img: string;
  author?: string;
  views?: number;
  tags?: string[];
  contentMarkdown: string;
  gallery?: string[];
  video?: { title: string; embedUrl: string; thumbnail: string };
  attachments?: { title: string; size: string; url: string }[];
  relatedProductIds?: number[];
  relatedProjectIds?: string[];
  relatedEventIds?: string[];
  relatedArticleIds?: string[];
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string[];

  // Presentation-only metadata used by the current design when supplied.
  // It is not part of the PostgreSQL news schema and is optional for API data.
  subType?: string;
  position?: string;
  department?: string;
  location?: string;
  deadline?: string;
  salary?: string;
  jobType?: string;
  status?: string;
  programName?: string;
  timeFrame?: string;
  appliedTargets?: string[];
  docType?: string;
  year?: number;
  pdfUrl?: string;
  pdfSize?: string;
}

export type DetailedNewsItem = PublicNewsItem;
export type CompanyNewsItem = PublicNewsItem;
export type SpecialtyNewsItem = PublicNewsItem;
export type RecruitmentNewsItem = PublicNewsItem;
export type PromotionNewsItem = PublicNewsItem;
export type ShareholderNewsItem = PublicNewsItem;

export interface PublicNewsDataSet {
  items: DetailedNewsItem[];
  relatedProducts: Product[];
  relatedProjects: NewsRelatedProject[];
  relatedEvents: EventItem[];
}

export interface NewsApiRecord {
  id: string | number;
  alias: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  image?: string | null;
  published?: boolean;
  created_time?: string | null;
  start_time?: string | null;
  author?: { name?: string | null } | null;
  view_count?: number | null;
  tags?: string[] | string | null;
  category?: { alias?: string | null; name?: string | null } | null;
  category_alias?: string | null;
  file_upload?: string | null;
  news_related?: Array<string | number> | string | null;
  products_related?: Array<string | number> | string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keyword?: string[] | string | null;
}
