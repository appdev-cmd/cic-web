export type ProductApplicationLocale = 'vi' | 'en';

export type ProductApplicationItem = Readonly<{
  id: string;
  name: string;
  alias: string;
  ordering: number;
  published: boolean;
  usageCount: number;
  createdTime: string | null;
  updatedTime: string | null;
}>;

export type ProductApplicationModuleData = Readonly<
  Record<ProductApplicationLocale, readonly ProductApplicationItem[]>
>;

export type PublishedProductApplication = Readonly<{
  id: string;
  name: string;
  alias: string;
  ordering: number;
}>;
