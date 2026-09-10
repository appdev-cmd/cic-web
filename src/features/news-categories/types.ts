export type NewsCategoryLocale = 'vi' | 'en';

export type NewsCategoryItem = Readonly<{
  id: string;
  name: string;
  title: string | null;
  alias: string;
  summary: string | null;
  parentId: string | null;
  parentName: string | null;
  level: number;
  ordering: number;
  image: string | null;
  published: boolean;
  showInHomepage: boolean;
  seoTitle: string | null;
  seoKeyword: string | null;
  seoDescription: string | null;
  usageCount: number;
  childCount: number;
  createdTime: string | null;
  updatedTime: string | null;
}>;

export type NewsCategoryModuleData = Readonly<Record<NewsCategoryLocale, NewsCategoryItem[]>>;

export type PublicNewsCategory = Readonly<{
  id: string;
  name: string;
  title: string | null;
  alias: string;
  parentId: string | null;
  ordering: number;
  image: string | null;
  summary: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}>;
