'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '@shared/types';
import { ProductDetailView } from './ProductDetailView';
import type { PublicProductContactMap } from '@/features/sales-owners/types';
import { ProductFilterSidebar } from '../features/products/components/list/ProductFilterSidebar';
import { ProductGridSection } from '../features/products/components/list/ProductGridSection';
import { ProductActionModal, ProductModalType } from '../features/products/components/modals/ProductActionModal';

interface ProductsViewProps {
  key?: string | number;
  previewProduct?: Product;
  products?: Product[];
  categoryOptions?: string[];
  applicationOptions?: string[];
  productTypeOptions?: string[];
  contactsByProductId?: PublicProductContactMap;
}

const getProductType = (product: Product): string => {
  return product.productType ?? '';
};

export function ProductsView({
  previewProduct,
  products,
  categoryOptions,
  applicationOptions,
  productTypeOptions,
  contactsByProductId = {},
}: ProductsViewProps = {}) {
  const productsData = useMemo(() => {
    const source = products ?? [];
    return previewProduct ? [previewProduct, ...source.filter((item) => item.id !== previewProduct.id)] : source;
  }, [previewProduct, products]);

  const [search, setSearch] = useState('');
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [sortBy, setSortBy] = useState<'default' | 'name-asc'>('default');

  // Mobile filter menu state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Interactive modal states
  const [modalType, setModalType] = useState<ProductModalType | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(previewProduct || null);

  // Filter items toggler
  const toggleFilterItem = (currentList: string[], setList: (val: string[]) => void, item: string) => {
    if (currentList.includes(item)) {
      setList(currentList.filter((i) => i !== item));
    } else {
      setList([...currentList, item]);
    }
    setCurrentPage(1);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return selectedProductTypes.length + selectedFields.length + selectedBrands.length + selectedApps.length + (search.trim() ? 1 : 0);
  }, [selectedProductTypes, selectedFields, selectedBrands, selectedApps, search]);

  // Dynamic filter values generated from data
  const fields = useMemo(() => {
    const relatedCategories = productsData.flatMap((product) =>
      product.categories?.length ? product.categories : product.field ? [product.field] : [],
    );
    return Array.from(new Set(categoryOptions ?? relatedCategories)).filter(Boolean);
  }, [categoryOptions, productsData]);

  const brands = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.brand)));
  }, [productsData]);

  const apps = useMemo(() => {
    const relatedApplications = productsData.flatMap((product) =>
      product.applications?.length ? product.applications : product.app ? [product.app] : [],
    );
    return Array.from(new Set(applicationOptions ?? relatedApplications)).filter(Boolean);
  }, [applicationOptions, productsData]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = productsData.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const pType = getProductType(p);
      const matchesProductType = selectedProductTypes.length === 0 || selectedProductTypes.includes(pType);
      const productApplications = p.applications?.length ? p.applications : p.app ? [p.app] : [];
      const productCategories = p.categories?.length ? p.categories : p.field ? [p.field] : [];
      const matchesField = selectedFields.length === 0 || selectedFields.some((field) => productCategories.includes(field));
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesApp = selectedApps.length === 0 || selectedApps.some((app) => productApplications.includes(app));

      return matchesSearch && matchesProductType && matchesField && matchesBrand && matchesApp;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return result;
  }, [productsData, search, selectedProductTypes, selectedFields, selectedBrands, selectedApps, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedProductTypes([]);
    setSelectedFields([]);
    setSelectedBrands([]);
    setSelectedApps([]);
    setSortBy('default');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const paginationItems = useMemo<(number | 'ellipsis')[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    if (currentPage >= totalPages - 3) return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Action trigger helpers
  const triggerDownload = (product: Product) => {
    setActiveProduct(product);
    setModalType('download');
  };

  const triggerContact = (product: Product) => {
    setActiveProduct(product);
    setModalType('contact');
  };

  const triggerBuy = (product: Product) => {
    setActiveProduct(product);
    setModalType('buy');
  };

  if (selectedProduct) {
    return (
      <>
        <ProductDetailView
          product={selectedProduct}
          products={productsData}
          contacts={contactsByProductId[String(selectedProduct.id)]}
          onBack={() => setSelectedProduct(null)}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onContact={triggerContact}
          onDownload={triggerDownload}
          onBuy={triggerBuy}
        />

        <ProductActionModal
          modalType={modalType}
          activeProduct={activeProduct}
          onClose={() => setModalType(null)}
          onTabChange={(type) => setModalType(type)}
        />
      </>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 pb-20 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-none" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-slate-900/5 blur-[100px] rounded-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Banner Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold uppercase text-[#444] tracking-tighter mb-4"
          >
            Hệ thống <span className="text-orange-600">Sản phẩm & Giải pháp</span>
          </motion.h1>
          <div className="w-20 h-1 bg-orange-600 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed"
          >
            Khám phá danh mục phần mềm bản quyền thay thế, mô phỏng chuyên sâu và các dòng thiết bị quan trắc thông minh hàng đầu phục vụ chuyển đổi số kỹ thuật tại Việt Nam.
          </motion.p>
        </div>

        {/* Filters and Catalog Grid Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex gap-2 w-full mb-2">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all hover:border-orange-600 hover:text-orange-600 rounded-[8px]"
            >
              <SlidersHorizontal size={14} className="text-orange-600" />
              {isMobileFilterOpen ? 'Đóng bộ lọc' : 'Bộ lọc tìm kiếm'}
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-[8px]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Sidebar */}
          <ProductFilterSidebar
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            selectedFields={selectedFields}
            onToggleField={(field) => toggleFilterItem(selectedFields, setSelectedFields, field)}
            onClearFields={() => setSelectedFields([])}
            selectedBrands={selectedBrands}
            onToggleBrand={(brand) => toggleFilterItem(selectedBrands, setSelectedBrands, brand)}
            onClearBrands={() => setSelectedBrands([])}
            selectedApps={selectedApps}
            onToggleApp={(app) => toggleFilterItem(selectedApps, setSelectedApps, app)}
            onClearApps={() => setSelectedApps([])}
            selectedProductTypes={selectedProductTypes}
            onToggleProductType={(type) => toggleFilterItem(selectedProductTypes, setSelectedProductTypes, type)}
            onClearProductTypes={() => setSelectedProductTypes([])}
            fields={fields}
            brands={brands}
            apps={apps}
            productTypeOptions={productTypeOptions}
            productsData={productsData}
            activeFiltersCount={activeFiltersCount}
            isMobileFilterOpen={isMobileFilterOpen}
            getProductType={getProductType}
          />

          {/* Catalog Listing Area */}
          <ProductGridSection
            products={filteredProducts}
            paginatedProducts={paginatedProducts}
            totalProductsCount={filteredProducts.length}
            activeFiltersCount={activeFiltersCount}
            search={search}
            onClearSearch={() => {
              setSearch('');
              setCurrentPage(1);
            }}
            selectedFields={selectedFields}
            onToggleField={(f) => toggleFilterItem(selectedFields, setSelectedFields, f)}
            selectedBrands={selectedBrands}
            onToggleBrand={(b) => toggleFilterItem(selectedBrands, setSelectedBrands, b)}
            selectedApps={selectedApps}
            onToggleApp={(a) => toggleFilterItem(selectedApps, setSelectedApps, a)}
            selectedProductTypes={selectedProductTypes}
            onToggleProductType={(pt) => toggleFilterItem(selectedProductTypes, setSelectedProductTypes, pt)}
            onResetFilters={handleResetFilters}
            sortBy={sortBy}
            onToggleSort={() => {
              setSortBy(sortBy === 'name-asc' ? 'default' : 'name-asc');
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            paginationItems={paginationItems}
            onPageChange={handlePageChange}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContact={triggerContact}
            onDownload={triggerDownload}
            onBuy={triggerBuy}
          />
        </div>
      </div>

      {/* Interactive Action Modals */}
      <ProductActionModal
        modalType={modalType}
        activeProduct={activeProduct}
        onClose={() => setModalType(null)}
        onTabChange={(type) => setModalType(type)}
      />
    </div>
  );
}
