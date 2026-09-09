import { useState, useMemo, useCallback } from 'react';
import type {
  ProductItem,
  ProductCategory,
  ProductBrand,
} from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';

export type SystemViewTab = 'all' | 'published' | 'draft' | 'is_hot';

export const removeVietnameseTones = (str: string = ''): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
};

export interface UseProductFiltersParams {
  products: ProductItem[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  productTypes: MasterProductTypeItem[];
  applications: MasterApplicationItem[];
  activeTab: SystemViewTab;
  onFilterChange?: () => void;
}

export interface UseProductFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brandId: string) => void;
  selectedProductType: string;
  setSelectedProductType: (typeId: string) => void;
  selectedApplication: string;
  setSelectedApplication: (appId: string) => void;
  handleSearchChange: (query: string) => void;
  handleCategoryChange: (catId: string) => void;
  handleBrandChange: (brandId: string) => void;
  handleProductTypeChange: (typeId: string) => void;
  handleApplicationChange: (appId: string) => void;
  handleResetFilters: () => void;
  isFilterActive: boolean;
  activeFiltersCount: number;
  filteredProducts: ProductItem[];
  getCategoryNames: (p: ProductItem) => string[];
  getBrandName: (p: ProductItem) => string;
  getProductTypeName: (p: ProductItem) => string;
  getApplicationNames: (p: ProductItem) => string[];
}

export const useProductFilters = ({
  products,
  categories,
  brands,
  productTypes,
  applications,
  activeTab,
  onFilterChange,
}: UseProductFiltersParams): UseProductFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<string>('all');

  // Helper lookups
  const getCategoryNames = useCallback(
    (p: ProductItem): string[] => {
      const ids = p.category_ids && p.category_ids.length > 0 ? p.category_ids : p.category_id ? [p.category_id] : [];
      const matched = categories.filter((c) => ids.includes(c.id) || ids.includes(c.name));
      if (matched.length > 0) return matched.map((c) => c.name);
      if (ids.length > 0) return ids;
      return ['Chưa phân loại'];
    },
    [categories]
  );

  const getBrandName = useCallback(
    (p: ProductItem): string => {
      const brandId = p.manufactory || p.brand_id;
      const found = brands.find((b) => b.id === brandId || b.name === brandId || b.name === p.brand_name);
      return found ? found.name : p.brand_name || brandId || '—';
    },
    [brands]
  );

  const getProductTypeName = useCallback(
    (p: ProductItem): string => {
      const typeId = p.types || p.product_type;
      const found = productTypes.find((t) => t.id === typeId || t.name === typeId);
      return found ? found.name : typeId || '—';
    },
    [productTypes]
  );

  const getApplicationNames = useCallback(
    (p: ProductItem): string[] => {
      const appIds = (p.application || p.application_areas || []).map(String);
      const matched = applications.filter((a) => appIds.includes(String(a.id)) || appIds.includes(a.name));
      if (matched.length > 0) return matched.map((a) => a.name);
      if (appIds.length > 0) return appIds;
      return [];
    },
    [applications]
  );

  // Filter Handlers with page reset callback
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const handleCategoryChange = useCallback(
    (catId: string) => {
      setSelectedCategory(catId);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const handleBrandChange = useCallback(
    (brandId: string) => {
      setSelectedBrand(brandId);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const handleProductTypeChange = useCallback(
    (typeId: string) => {
      setSelectedProductType(typeId);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const handleApplicationChange = useCallback(
    (appId: string) => {
      setSelectedApplication(appId);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedProductType('all');
    setSelectedApplication('all');
    onFilterChange?.();
  }, [onFilterChange]);

  const activeFiltersCount = useMemo(() => {
    return [
      searchQuery.trim() !== '',
      selectedCategory !== 'all',
      selectedBrand !== 'all',
      selectedProductType !== 'all',
      selectedApplication !== 'all',
    ].filter(Boolean).length;
  }, [searchQuery, selectedCategory, selectedBrand, selectedProductType, selectedApplication]);

  const isFilterActive = activeFiltersCount > 0;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. System View Tab
      if (activeTab === 'published' && p.editorial_status !== 'published') return false;
      if (activeTab === 'draft' && p.editorial_status !== 'draft') return false;
      if (activeTab === 'is_hot' && !p.is_hot) return false;

      // 2. Search Query (supports accented and unaccented search across all fields)
      if (searchQuery.trim()) {
        const rawQ = searchQuery.toLowerCase().trim();
        const normQ = removeVietnameseTones(searchQuery);

        const catNames = getCategoryNames(p).join(' ');
        const brandName = getBrandName(p);
        const typeName = getProductTypeName(p);
        const appNames = getApplicationNames(p).join(' ');
        const tagNames = (p.tags || []).join(' ');

        const searchableParts = [
          p.name,
          p.title,
          p.code,
          p.sku,
          p.alias,
          p.summary,
          p.short_description,
          p.description,
          p.price,
          p.price_old,
          brandName,
          typeName,
          catNames,
          appNames,
          tagNames,
        ];

        const rawText = searchableParts.filter(Boolean).join(' ').toLowerCase();
        const normText = removeVietnameseTones(rawText);

        if (!rawText.includes(rawQ) && !normText.includes(normQ)) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'all') {
        const pCatIds = [
          ...(p.category_ids || []),
          p.category_id,
        ].filter(Boolean) as string[];

        const targetCat = categories.find((c) => c.id === selectedCategory);
        const targetCatNameNorm = targetCat ? removeVietnameseTones(targetCat.name) : '';

        const hasCatMatch = pCatIds.some((catIdOrName) => {
          if (catIdOrName === selectedCategory) return true;
          if (targetCatNameNorm && removeVietnameseTones(catIdOrName).includes(targetCatNameNorm)) return true;
          return false;
        });

        if (!hasCatMatch) return false;
      }

      // 4. Brand Filter
      if (selectedBrand !== 'all') {
        const targetBrand = brands.find((b) => b.id === selectedBrand);
        const targetBrandNameNorm = targetBrand ? removeVietnameseTones(targetBrand.name) : '';

        const pBrandId = p.manufactory || p.brand_id || '';
        const pBrandNameNorm = removeVietnameseTones(p.brand_name || getBrandName(p));

        const isBrandMatch =
          pBrandId === selectedBrand ||
          (targetBrandNameNorm && (pBrandNameNorm.includes(targetBrandNameNorm) || targetBrandNameNorm.includes(pBrandNameNorm)));

        if (!isBrandMatch) return false;
      }

      // 5. Product Type Filter
      if (selectedProductType !== 'all') {
        const targetType = productTypes.find((t) => t.id === selectedProductType);
        const targetTypeNameNorm = targetType ? removeVietnameseTones(targetType.name) : '';
        const pTypeVal = p.types || p.product_type || '';
        const pTypeValNorm = removeVietnameseTones(pTypeVal);

        const isTypeMatch =
          pTypeVal === selectedProductType ||
          (targetType && pTypeVal === targetType.name) ||
          (targetTypeNameNorm && pTypeValNorm && (pTypeValNorm.includes(targetTypeNameNorm) || targetTypeNameNorm.includes(pTypeValNorm)));

        if (!isTypeMatch) return false;
      }

      // 6. Application Filter
      if (selectedApplication !== 'all') {
        const targetApp = applications.find((a) => a.id === selectedApplication);
        const targetAppNameNorm = targetApp ? removeVietnameseTones(targetApp.name) : '';
        const pAppsNorm = (p.application || p.application_areas || []).map((a) => removeVietnameseTones(a));

        const isAppMatch =
          (p.application || p.application_areas || []).includes(selectedApplication) ||
          (targetAppNameNorm && pAppsNorm.some((a) => a.includes(targetAppNameNorm) || targetAppNameNorm.includes(a)));

        if (!isAppMatch) return false;
      }

      return true;
    });
  }, [
    products,
    activeTab,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedProductType,
    selectedApplication,
    categories,
    brands,
    productTypes,
    applications,
    getCategoryNames,
    getBrandName,
    getProductTypeName,
    getApplicationNames,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedProductType,
    setSelectedProductType,
    selectedApplication,
    setSelectedApplication,
    handleSearchChange,
    handleCategoryChange,
    handleBrandChange,
    handleProductTypeChange,
    handleApplicationChange,
    handleResetFilters,
    isFilterActive,
    activeFiltersCount,
    filteredProducts,
    getCategoryNames,
    getBrandName,
    getProductTypeName,
    getApplicationNames,
  };
};
