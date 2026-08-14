import type { CmsLocale } from './CmsDataSource';
import type {
  ProductActivityLog,
  ProductBrand,
  ProductCategory,
  ProductItem,
  ProductOwnerOption,
} from '../modules/products/types';
import type {
  MasterCategoryItem,
  MasterBrandItem,
  MasterApplicationItem,
  MasterProductTypeItem,
  MasterSalesStaffItem,
  MasterDataActivityLog,
  UsageImpactRecord,
} from '../modules/product_settings/types';

export interface ProductsModuleData {
  products: ProductItem[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
  owners: ProductOwnerOption[];
  activityLogs: ProductActivityLog[];
  currentUserId?: string;
}

export interface ProductTaxonomyModuleData {
  categories: MasterCategoryItem[];
  brands: MasterBrandItem[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
}

export interface ProductSettingsGlobalData {
  salesStaff: MasterSalesStaffItem[];
  productOptions: Pick<ProductItem, 'id' | 'name'>[];
  activityLogs: MasterDataActivityLog[];
  usageImpactRecords: UsageImpactRecord[];
}

export interface CatalogDataSource {
  productsByLocale: Partial<Record<CmsLocale, ProductsModuleData>>;
  productTaxonomyByLocale: Partial<Record<CmsLocale, ProductTaxonomyModuleData>>;
  productSettingsGlobal: ProductSettingsGlobalData;
}
