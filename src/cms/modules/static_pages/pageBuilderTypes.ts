import type { EditableSectionContract } from '../../../shared/visual-editing/editableSectionContract';

export type PageBuilderStatus = 'draft' | 'published';

export type PageBuilderEntityType =
  | 'product'
  | 'news'
  | 'service'
  | 'project'
  | 'partner'
  | 'event';

export interface PageBuilderReference {
  entityType: PageBuilderEntityType;
  entityIds: string[];
  source?: {
    mode: 'manual' | 'featured' | 'latest' | 'taxonomy';
    taxonomyType?: 'category' | 'brand' | 'application';
    taxonomyId?: string;
    limit: number;
  };
}

export type PageBuilderConfigValue =
  | string
  | number
  | boolean
  | null
  | PageBuilderConfigValue[]
  | { [key: string]: PageBuilderConfigValue };

export interface PageBuilderSection {
  id: string;
  sectionKey: string;
  sectionType: string;
  position: number;
  visible?: boolean;
  movable?: boolean;
  config: Record<string, PageBuilderConfigValue>;
  references?: PageBuilderReference[];
}

export interface PageBuilderVersion {
  version: number;
  status: PageBuilderStatus;
  updatedAt: string;
  publishedAt?: string;
  seo: {
    title: string;
    description: string;
    imageId?: string;
  };
  sections: PageBuilderSection[];
}

export interface PageBuilderPage {
  id: string;
  code: string;
  slug: string;
  name: string;
  pageType: 'home' | 'about' | 'organization' | 'capacity_experience' | 'contact' | 'legal';
  templateKey: 'home' | 'about' | 'organization' | 'capacity_experience' | 'contact' | 'legal_standard';
  systemDefined: boolean;
  draft: PageBuilderVersion;
  published: PageBuilderVersion;
  history?: PageBuilderVersion[];
}

export interface PageBuilderEntityOption {
  id: string;
  label: string;
  description: string;
  entityType: PageBuilderEntityType;
  status?: 'published' | 'unpublished' | 'deleted';
}

export interface SectionDefinition {
  label: string;
  description: string;
  referenceLimit?: Partial<Record<PageBuilderEntityType, number>>;
  canHide?: boolean;
  canMove?: boolean;
  editableContract?: EditableSectionContract;
}
