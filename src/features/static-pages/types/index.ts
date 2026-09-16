import type { ReferenceSourceMode, SectionReferenceSourceConfig } from '../referenceContract';

export type PageBuilderStatus = 'draft' | 'published';

export type PageBuilderPageType =
  | 'home'
  | 'about'
  | 'organization'
  | 'capacity_experience'
  | 'legal';

export type PageBuilderTemplateKey =
  | 'home'
  | 'about'
  | 'organization'
  | 'capacity_experience'
  | 'legal_standard';

export interface CmsStaticPageListItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  pageType: PageBuilderPageType;
  templateKey: PageBuilderTemplateKey;
  systemDefined: boolean;
  workspace: 'vi' | 'en';
  updatedAt: string;
  sectionCount: number;
  draft: {
    revisionId: string | null;
    version: number;
    updatedAt: string | null;
    status: 'draft';
  };
  published: {
    revisionId: string | null;
    version: number;
    publishedAt: string | null;
    status: 'published';
  };
}

export interface StaticPageReferenceItem {
  id?: string;
  entityType: string;
  entityId: string;
  position: number;
}

export interface StaticPageSectionItem {
  id: string;
  sectionKey: string;
  sectionType: string;
  position: number;
  config: Record<string, unknown>;
  references?: StaticPageReferenceItem[];
}

export interface StaticPageRevisionDetail {
  id: string;
  versionNumber: number;
  state: PageBuilderStatus;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  publishedAt: string | null;
  sections: StaticPageSectionItem[];
}

export type StaticPagePublicResult = StaticPageRevisionDetail & {
  pageId: string;
  code: string;
  name: string;
  slug: string;
};

export interface StaticPageFullDetail {
  id: string;
  workspace: 'vi' | 'en';
  code: string;
  name: string;
  slug: string;
  pageType: PageBuilderPageType;
  templateKey: PageBuilderTemplateKey;
  systemDefined: boolean;
  updatedAt: string;
  draft: StaticPageRevisionDetail;
  published: StaticPageRevisionDetail | null;
  history?: {
    id: string;
    versionNumber: number;
    state: string;
    publishedAt: string | null;
    createdAt: string;
  }[];
}

export interface SaveDraftSectionInput {
  sectionKey: string;
  sectionType: string;
  position: number;
  config: Record<string, unknown>;
  references?: { entityType: string; entityId: string | number; position?: number }[];
}

export interface SaveDraftInput {
  seo?: {
    title?: string;
    description?: string;
  };
  sections: SaveDraftSectionInput[];
}

export interface CreateLegalPageInput {
  workspace: 'vi' | 'en';
  name: string;
  slug: string;
}
