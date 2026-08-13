export type SeoOwnerStatus = 'available' | 'missing';

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
  categoryPath: string;
  categoryPattern: string;
  categoryOwner: string;
  categoryStatus: SeoOwnerStatus;
  detailPath: string;
  detailPattern: string;
  detailOwner: string;
  detailStatus: SeoOwnerStatus;
}
