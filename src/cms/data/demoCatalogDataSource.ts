import type { CatalogDataSource } from './CatalogDataSource';
import {
  mockProductActivityLogs,
  mockProductBrands,
  mockProductCategories,
  mockProductOwners,
  mockProducts,
} from '../modules/products/mockData';
import {
  mockMasterActivityLogs,
  mockMasterApplications,
  mockMasterBrands,
  mockMasterCategories,
  mockMasterProductTypes,
  mockMasterRoutingRules,
  mockMasterSalesStaff,
  mockUsageImpactRecords,
} from '../modules/product_settings/mockData';

export const demoCatalogDataSource: CatalogDataSource = {
  productsByLocale: {
    vi: {
      products: mockProducts,
      categories: mockProductCategories,
      brands: mockProductBrands,
      owners: mockProductOwners,
      activityLogs: mockProductActivityLogs,
      currentUserId: 'usr_002',
    },
  },
  productTaxonomyByLocale: {
    vi: {
      categories: mockMasterCategories,
      brands: mockMasterBrands,
      applications: mockMasterApplications,
      productTypes: mockMasterProductTypes,
    },
  },
  productSettingsGlobal: {
    salesStaff: mockMasterSalesStaff,
    routingRules: mockMasterRoutingRules,
    activityLogs: mockMasterActivityLogs,
    usageImpactRecords: mockUsageImpactRecords,
  },
};
