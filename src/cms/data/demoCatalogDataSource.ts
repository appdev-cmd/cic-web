import type { CatalogDataSource } from './CatalogDataSource';
import {
  mockProductActivityLogs,
  mockProductBrands,
  mockProductCategories,
  mockProductOwners,
  mockProducts,
} from '../modules/products/mockData';
import {
  mockMasterApplications,
  mockMasterBrands,
  mockMasterCategories,
  mockMasterProductTypes,
  mockMasterSalesStaff,
  mockUsageImpactRecords,
} from '../modules/product_settings/mockData';

export const demoCatalogDataSource: CatalogDataSource = {
  productsByLocale: {
    vi: {
      products: mockProducts,
      categories: mockProductCategories,
      brands: mockProductBrands,
      applications: mockMasterApplications,
      productTypes: mockMasterProductTypes,
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
    productOptions: [
      ...mockProducts.map(({ id, name, title }) => ({ id, name: name || title })),
      { id: 'prod_demo_006', name: 'SAFE - Phần mềm phân tích thiết kế sàn' },
      { id: 'prod_demo_007', name: 'SAP2000 - Phân tích thiết kế kết cấu tổng hợp' },
      { id: 'prod_demo_008', name: 'CSiBridge - Phần mềm phân tích thiết kế cầu' },
      { id: 'prod_demo_009', name: 'PLAXIS 2D - Phân tích địa kỹ thuật và nền móng' },
      { id: 'prod_demo_010', name: 'PLAXIS 3D - Phân tích địa kỹ thuật và nền móng 3D' },
      { id: 'prod_demo_011', name: 'GeoStudio - Phân tích ổn định mái dốc' },
      { id: 'prod_demo_012', name: 'enjiCAD - Phần mềm CAD thay thế' },
      { id: 'prod_demo_013', name: 'Escon - Phần mềm dự toán' },
      { id: 'prod_demo_014', name: 'SketchUp Pro - Phần mềm mô hình 3D' },
      { id: 'prod_demo_015', name: 'Autodesk Revit - Phần mềm thiết kế BIM' },
      { id: 'prod_demo_016', name: 'OpenRoads - Phần mềm mô hình hạ tầng đường' },
      { id: 'prod_demo_017', name: 'WaterGEMS - Thiết kế hệ thống phân phối nước' },
      { id: 'prod_demo_018', name: 'Cabinet Vision - Thiết kế sản xuất nội thất gỗ' },
      { id: 'prod_demo_019', name: 'FIFISH PRO W6 - Rô bốt lặn biển' },
      { id: 'prod_demo_020', name: 'CubiCost - Bóc tách khối lượng trên nền tảng BIM' },
    ],
    usageImpactRecords: mockUsageImpactRecords,
  },
};
