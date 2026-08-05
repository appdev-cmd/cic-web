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
  MasterRoutingRuleItem,
  MasterDataActivityLog,
  UsageImpactRecord,
} from '../modules/product_settings/types';

export interface ProductsModuleData {
  products: ProductItem[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  owners: ProductOwnerOption[];
  activityLogs: ProductActivityLog[];
  currentUserId?: string;
}

export interface ProductSettingsModuleData {
  categories: MasterCategoryItem[];
  brands: MasterBrandItem[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
  salesStaff: MasterSalesStaffItem[];
  routingRules: MasterRoutingRuleItem[];
  activityLogs: MasterDataActivityLog[];
  usageImpactRecords: UsageImpactRecord[];
}

export interface CatalogDataSource {
  productsByLocale: Partial<Record<CmsLocale, ProductsModuleData>>;
  productSettingsByLocale: Partial<Record<CmsLocale, ProductSettingsModuleData>>;
}
