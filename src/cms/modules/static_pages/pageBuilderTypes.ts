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
  code: 'home' | 'about' | 'contact' | 'privacy_policy';
  slug: string;
  name: string;
  pageType: 'home' | 'about' | 'contact' | 'legal';
  draft: PageBuilderVersion;
  published: PageBuilderVersion;
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
}
