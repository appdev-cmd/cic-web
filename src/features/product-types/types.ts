export type ProductTypeLocale = 'vi' | 'en';

export type ProductTypeItem = Readonly<{
  id: string;
  name: string;
  alias: string;
  ordering: number;
  published: boolean;
  usageCount: number;
  createdTime: string | null;
  updatedTime: string | null;
}>;

export type ProductTypeModuleData = Readonly<Record<ProductTypeLocale, readonly ProductTypeItem[]>>;

export type PublishedProductType = Readonly<{
  id: string;
  name: string;
  alias: string;
  ordering: number;
}>;
