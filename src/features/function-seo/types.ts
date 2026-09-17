export type SeoOwnerStatus = 'available' | 'missing';

export interface SeoFacetLevel {
  id: string;
  number: string;
  title: string;
  facetType: 'category' | 'brand' | 'application' | 'product_type' | 'custom';
  pattern: string;
  owner: string;
  status: SeoOwnerStatus;
  href?: string;
  description: string;
  titleTemplate?: string;
  keywordsTemplate?: string;
  descriptionTemplate?: string;
}

export interface FunctionSeoRecord {
  id: string;
  routeKey: string;
  path: string;
  module: string;
  view: string;
  label: string;
  intent: string;
  title: string;
  keywords: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
  updatedAt: string;
  categoryPath?: string;
  categoryPattern?: string;
  categoryOwner?: string;
  categoryStatus?: SeoOwnerStatus;
  detailPath: string;
  detailPattern: string;
  detailOwner: string;
  detailStatus: SeoOwnerStatus;
  facetLevels?: SeoFacetLevel[];
}

export interface RedirectRule {
  id: number;
  from: string;
  to: string;
  type: '301' | '302';
  source: string;
  active: boolean;
  hitCount: number;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeoWarningItem {
  id: string;
  path: string;
  label: string;
  severity: 'high' | 'medium' | 'low';
  issues: string[];
  editUrl: string;
}

export interface SeoHealthMetrics {
  totalPages: number;
  missingDescriptionCount: number;
  missingTitleCount: number;
  noindexCount: number;
  missingOwnerCount: number;
  warnings: SeoWarningItem[];
}
