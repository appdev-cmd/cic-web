import React, { useEffect, useState, useMemo } from 'react';
import {
  FolderTree,
  Building2,
  Cpu,
  Layers,
  UserCheck,
  Zap,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Trash2,
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  History,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Archive,
  ArrowUpDown,
  Tag,
  Globe,
  PauseCircle,
  Play,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  List,
  ChevronDown,
  User,
  Phone,
  FileCheck,
} from 'lucide-react';

import {
  MasterDataType,
  MasterItemStatus,
  AnyMasterItem,
  MasterCategoryItem,
  MasterBrandItem,
  MasterApplicationItem,
  MasterProductTypeItem,
  MasterSalesStaffItem,
} from './types';
import type { ProductSettingsGlobalData, ProductTaxonomyModuleData } from '../../data/CatalogDataSource';

import { UsageImpactDrawer } from './UsageImpactDrawer';
import { ColumnSettingModal, ProductSettingsColumnVisibility } from './ColumnSettingModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { MasterDataFormDrawer } from './MasterDataFormDrawer';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { SearchableSelect } from '../../components/SearchableSelect';

type MainTab = 'overview' | 'taxonomy';

interface ProductSettingsManagerProps {
  taxonomy?: ProductTaxonomyModuleData;
  globalData: ProductSettingsGlobalData;
}

export const ProductSettingsManager: React.FC<ProductSettingsManagerProps> = ({ taxonomy, globalData }) => {
  const createLabels: Record<MasterDataType, string> = {
    categories: 'Thêm danh mục sản phẩm',
    brands: 'Thêm hãng sản xuất',
    applications: 'Thêm lĩnh vực ứng dụng',
    product_types: 'Thêm loại sản phẩm',
    sales_staff: 'Thêm người phụ trách',
  };
  // Master Datasets State
  const [categories, setCategories] = useState<MasterCategoryItem[]>(taxonomy?.categories ?? []);
  const [brands, setBrands] = useState<MasterBrandItem[]>(taxonomy?.brands ?? []);
  const [applications, setApplications] = useState<MasterApplicationItem[]>(taxonomy?.applications ?? []);
  const [productTypes, setProductTypes] = useState<MasterProductTypeItem[]>(taxonomy?.productTypes ?? []);
  const [salesStaff, setSalesStaff] = useState<MasterSalesStaffItem[]>(globalData.salesStaff);

  useEffect(() => {
    setCategories(taxonomy?.categories ?? []);
    setBrands(taxonomy?.brands ?? []);
    setApplications(taxonomy?.applications ?? []);
    setProductTypes(taxonomy?.productTypes ?? []);
  }, [taxonomy]);

  // Navigation State
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('taxonomy');
  const [activeDataType, setActiveDataType] = useState<MasterDataType>('categories');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [usageFilter, setUsageFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [staffProductFilter, setStaffProductFilter] = useState('all');
  const [viewFormat, setViewFormat] = useState<'list' | 'tree'>('list');

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [impactDrawerItem, setImpactDrawerItem] = useState<AnyMasterItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AnyMasterItem | null>(null);
  const [formDrawerItem, setFormDrawerItem] = useState<AnyMasterItem | null>(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);

  // Table Density & Column Visibility
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');
  const [columnVisibility, setColumnVisibility] = useState<ProductSettingsColumnVisibility>({
    code: true,
    type_badge: true,
    usage_count: true,
    status: true,
    ordering: true,
    scope_or_country: true,
    updated_time: true,
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Current Active List Array based on activeDataType
  const currentActiveList: AnyMasterItem[] = useMemo(() => {
    let source: AnyMasterItem[] = [];
    if (activeDataType === 'categories') source = categories;
    else if (activeDataType === 'brands') source = brands;
    else if (activeDataType === 'applications') source = applications;
    else if (activeDataType === 'product_types') source = productTypes;
    else if (activeDataType === 'sales_staff') source = salesStaff;

    return source.filter((i) => i.status !== 'archived');
  }, [activeDataType, categories, brands, applications, productTypes, salesStaff]);

  // Filter Logic
  const filteredList = useMemo(() => {
    return currentActiveList.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc) return false;
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Usage
      if (usageFilter === 'used' && item.usage_count === 0) return false;
      if (usageFilter === 'unused' && item.usage_count > 0) return false;

      if (activeDataType === 'sales_staff' && staffProductFilter !== 'all') {
        const staffItem = item as MasterSalesStaffItem;
        const assignedProductIds = [
          ...(staffItem.contact_product_ids ?? []),
          ...(staffItem.sales_product_ids ?? []),
          ...(staffItem.technical_support_product_ids ?? []),
          ...(staffItem.north_sales_product_ids ?? []),
          ...(staffItem.south_sales_product_ids ?? []),
        ];
        if (!assignedProductIds.includes(staffProductFilter)) return false;
      }

      return true;
    });
  }, [currentActiveList, searchQuery, statusFilter, usageFilter, activeDataType, staffProductFilter]);

  // Paginated Output
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;

  // Selection Checkbox Handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedList.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Save Master Data Item
  const handleSaveMasterItem = (savedItem: AnyMasterItem) => {
    const updateDataset = <T extends AnyMasterItem>(list: T[], newItem: T): T[] => {
      const idx = list.findIndex((i) => i.id === newItem.id);
      if (idx >= 0) {
        const copy = [...list];
        copy[idx] = newItem;
        return copy;
      }
      return [newItem, ...list];
    };

    if (savedItem.type === 'categories') setCategories((prev) => updateDataset(prev, savedItem as MasterCategoryItem));
    else if (savedItem.type === 'brands') setBrands((prev) => updateDataset(prev, savedItem as MasterBrandItem));
    else if (savedItem.type === 'applications') setApplications((prev) => updateDataset(prev, savedItem as MasterApplicationItem));
    else if (savedItem.type === 'product_types') setProductTypes((prev) => updateDataset(prev, savedItem as MasterProductTypeItem));
    else if (savedItem.type === 'sales_staff') setSalesStaff((prev) => updateDataset(prev, savedItem as MasterSalesStaffItem));

    showToast(`Đã lưu thành công mục "${savedItem.name}"!`);
    setIsFormDrawerOpen(false);
    setFormDrawerItem(null);
  };

  // Bulk Actions
  const handleBatchDeactivate = () => {
    const updateStatus = (item: AnyMasterItem) =>
      selectedIds.includes(item.id) ? { ...item, status: 'inactive' as const } : item;

    setCategories((prev) => prev.map((i) => updateStatus(i) as MasterCategoryItem));
    setBrands((prev) => prev.map((i) => updateStatus(i) as MasterBrandItem));
    setApplications((prev) => prev.map((i) => updateStatus(i) as MasterApplicationItem));
    setProductTypes((prev) => prev.map((i) => updateStatus(i) as MasterProductTypeItem));
    setSalesStaff((prev) => prev.map((i) => updateStatus(i) as MasterSalesStaffItem));

    showToast(`Đã ngừng sử dụng ${selectedIds.length} mục đã chọn.`);
    setSelectedIds([]);
  };

  if (isFormDrawerOpen && activeDataType === 'sales_staff') {
    return (
      <MasterDataFormDrawer
        isOpen
        presentation="page"
        item={formDrawerItem}
        targetType="sales_staff"
        categories={categories}
        brands={brands}
        staff={salesStaff}
        productOptions={globalData.productOptions}
        onSave={handleSaveMasterItem}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setFormDrawerItem(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP MODULE HEADER CARD */}
      <CmsPageHeader
        icon={<FolderTree />}
        title="Thiết lập sản phẩm"
        description="Quản lý danh mục, hãng, lĩnh vực ứng dụng, loại sản phẩm và người phụ trách sản phẩm."
        actions={activeMainTab === 'taxonomy' ? <>
          <CmsButton
            onClick={() => {
              setFormDrawerItem(null);
              setIsFormDrawerOpen(true);
            }}
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
          >
            {createLabels[activeDataType]}
          </CmsButton>
        </> : undefined}
      />

      {/* 2. SITEMAP SECTIONS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Tổng quan' },
          { id: 'categories', label: 'Danh mục sản phẩm' },
          { id: 'brands', label: 'Hãng sản xuất' },
          { id: 'applications', label: 'Lĩnh vực ứng dụng' },
          { id: 'product_types', label: 'Loại sản phẩm' },
          { id: 'sales_staff', label: 'Người phụ trách kinh doanh' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'overview') {
                setActiveMainTab('overview');
              } else {
                setActiveMainTab('taxonomy');
                setActiveDataType(tab.id as MasterDataType);
              }
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
              (tab.id === 'overview' && activeMainTab === 'overview') || (tab.id !== 'overview' && activeMainTab === 'taxonomy' && activeDataType === tab.id)
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. OVERVIEW TAB DASHBOARD */}
      {activeMainTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Danh mục sản phẩm', count: categories.length, type: 'categories', icon: Building2, color: 'text-blue-600 bg-blue-500/10' },
              { label: 'Hãng sản xuất', count: brands.length, type: 'brands', icon: Globe, color: 'text-emerald-600 bg-emerald-500/10' },
              { label: 'Lĩnh vực ứng dụng', count: applications.length, type: 'applications', icon: Cpu, color: 'text-purple-600 bg-purple-500/10' },
              { label: 'Loại sản phẩm', count: productTypes.length, type: 'product_types', icon: Layers, color: 'text-amber-600 bg-amber-500/10' },
              { label: 'Nhân viên phụ trách', count: salesStaff.length, type: 'sales_staff', icon: UserCheck, color: 'text-orange-600 bg-orange-500/10' },
            ].map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (['categories', 'brands', 'applications', 'product_types'].includes(stat.type)) {
                      setActiveMainTab('taxonomy');
                      setActiveDataType(stat.type as MasterDataType);
                    } else {
                      setActiveMainTab('taxonomy');
                      setActiveDataType(stat.type as MasterDataType);
                    }
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-orange-500/50 transition-all cursor-pointer shadow-2xs space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${stat.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      {stat.count}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-orange-600 transition-colors">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Persistent Dependency & Health Banner */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600 text-white rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Có 1 dữ liệu cần kiểm tra
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                  Hãng <strong>Glodon Company Limited</strong> đã ngừng sử dụng nhưng vẫn còn 8 sản phẩm đang dùng hãng này.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveMainTab('taxonomy');
                setActiveDataType('brands');
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0 cursor-pointer"
            >
              Xem chi tiết Hãng Glodon
            </button>
          </div>
        </div>
      )}

      {/* DATA TABLES AREA */}
      {activeMainTab === 'taxonomy' && (
        <div className="space-y-4">
          {/* TOOLBAR & FILTERS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={activeDataType === 'sales_staff' ? 'Tìm theo tên nhân viên...' : 'Tìm theo tên, mã hoặc mô tả...'}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Filters */}
              <div className={`flex items-center gap-2 text-xs ${activeDataType === 'sales_staff' ? 'overflow-visible' : 'overflow-x-auto pb-1'}`}>
                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang sử dụng</option>
                  <option value="inactive">Ngừng sử dụng</option>
                </select>

                {/* Usage filter */}
                {activeDataType !== 'sales_staff' && <select
                  value={usageFilter}
                  onChange={(e) => {
                    setUsageFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả Mức sử dụng</option>
                  <option value="used">Đang được dùng (&gt;0)</option>
                  <option value="unused">Chưa sử dụng (=0)</option>
                </select>}

                {activeDataType === 'sales_staff' && (
                  <div className="w-64 shrink-0">
                    <SearchableSelect
                      options={[{ id: 'all', name: 'Tất cả sản phẩm' }, ...globalData.productOptions]}
                      selectedId={staffProductFilter}
                      onChange={(productId) => {
                        setStaffProductFilter(productId);
                        setCurrentPage(1);
                      }}
                      placeholder="Lọc theo sản phẩm"
                      searchPlaceholder="Tìm tên sản phẩm..."
                    />
                  </div>
                )}

                {/* Column settings button */}
                {activeDataType !== 'sales_staff' && <button
                  onClick={() => setIsColumnModalOpen(true)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
                  <span>Cấu hình cột</span>
                </button>}
              </div>
            </div>

            {/* Bulk actions bar */}
            <CmsBulkActionBar selectedCount={selectedIds.length} itemLabel="mục thiết lập" onClear={() => setSelectedIds([])} actions={[
              { label: 'Ngừng sử dụng', onClick: handleBatchDeactivate, icon: Archive },
            ]} />
          </div>

          {/* MAIN UNIFIED MASTER DATA TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="cms-data-table text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {/* Checkbox Sticky Left */}
                    <th className="py-3 px-3 w-10 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                      <CmsSelectionCheckbox checked={paginatedList.length > 0 && paginatedList.every((item) => selectedIds.includes(item.id))} indeterminate={selectedIds.some((id) => paginatedList.some((item) => item.id === id)) && !paginatedList.every((item) => selectedIds.includes(item.id))} onChange={handleSelectAllOnPage} label="Chọn tất cả mục thiết lập trên trang" />
                    </th>

                    {/* Name & Code (Sticky Left) */}
                    <th className="py-3 px-4 min-w-[260px] sticky left-10 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                      {activeDataType === 'sales_staff' ? 'Tên nhân viên' : 'Tên và mã nhận diện'}
                    </th>

                    {/* Usage count */}
                    {columnVisibility.usage_count && activeDataType !== 'sales_staff' && (
                      <th className="py-3 px-4 min-w-[140px]">Số SP / Đơn hàng dùng</th>
                    )}

                    {/* Ordering */}
                    {columnVisibility.ordering && (
                      <th className="py-3 px-4 min-w-[110px]">Thứ tự (Order)</th>
                    )}

                    {/* Scope / Country / Email */}
                    {columnVisibility.scope_or_country && (
                      <th className="py-3 px-4 min-w-[200px]">{activeDataType === 'sales_staff' ? 'Số điện thoại / Skype / Zalo' : 'Phạm vi / Thông tin liên hệ'}</th>
                    )}

                    {/* Status */}
                    {columnVisibility.status && (
                      <th className="py-3 px-4 min-w-[130px]">Trạng thái</th>
                    )}

                    {/* Updated Time */}
                    {columnVisibility.updated_time && (
                      <th className="py-3 px-4 min-w-[140px]">{activeDataType === 'sales_staff' ? 'Ngày tạo / ID' : 'Cập nhật'}</th>
                    )}

                    {/* Sticky Right Actions */}
                    <th className="py-3 px-4 w-24 text-center sticky right-0 z-20 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-800">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => {
                      const isSelected = selectedIds.includes(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                            isSelected ? 'bg-orange-500/5 dark:bg-orange-950/20' : ''
                          } ${density === 'compact' ? 'py-1' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-3 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                            <CmsSelectionCheckbox checked={isSelected} onChange={() => handleToggleSelect(item.id)} label={`Chọn mục ${item.name}`} />
                          </td>

                          {/* Name & Code */}
                          <td className="py-3 px-4 sticky left-10 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                            <div className="space-y-0.5">
                              <div
                                onClick={() => {
                                  setFormDrawerItem(item);
                                  setIsFormDrawerOpen(true);
                                }}
                                className="font-bold text-slate-900 dark:text-white hover:text-orange-600 cursor-pointer flex items-center gap-2"
                              >
                                <span>{item.name}</span>
                                {item.type === 'categories' && (item as MasterCategoryItem).parent_name && (
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    (Con của: {(item as MasterCategoryItem).parent_name})
                                  </span>
                                )}
                              </div>
                              {item.type !== 'sales_staff' && <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                                  {item.code}
                                </span>
                                {item.description && (
                                  <>
                                    <span>•</span>
                                    <span className="line-clamp-1 max-w-[200px]">{item.description}</span>
                                  </>
                                )}
                              </div>}
                            </div>
                          </td>

                          {/* Usage Count badge */}
                          {columnVisibility.usage_count && item.type !== 'sales_staff' && (
                            <td className="py-3 px-4">
                              <button
                                onClick={() => setImpactDrawerItem(item)}
                                className={`px-2.5 py-1 font-bold text-[11px] rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                                  item.usage_count > 0
                                    ? 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <span>{item.usage_count} đối tượng</span>
                                <Eye className="w-3 h-3" />
                              </button>
                            </td>
                          )}

                          {/* Ordering */}
                          {columnVisibility.ordering && (
                            <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                              #{item.ordering}
                            </td>
                          )}

                          {/* Scope / Country / Email */}
                          {columnVisibility.scope_or_country && (
                            <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                              {item.type === 'brands' && (
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{(item as MasterBrandItem).country}</span>
                                </span>
                              )}
                              {item.type === 'sales_staff' && (
                                <div className="space-y-1 text-[11px]">
                                  <span className="flex items-center gap-1 font-mono text-orange-600"><Phone className="w-3.5 h-3.5" />{(item as MasterSalesStaffItem).phone || '—'}</span>
                                  <span className="block text-slate-500">Skype: {(item as MasterSalesStaffItem).skype || '—'} · Zalo: {(item as MasterSalesStaffItem).zalo || '—'}</span>
                                </div>
                              )}
                              {['categories', 'applications', 'product_types'].includes(item.type) && (
                                <span className="text-slate-400 italic">Mặc định Toàn quốc</span>
                              )}
                            </td>
                          )}

                          {/* Status */}
                          {columnVisibility.status && (
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                                  item.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : item.status === 'inactive'
                                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                    : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          )}

                          {/* Updated Time */}
                          {columnVisibility.updated_time && (
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                              {item.type === 'sales_staff' ? <><div>{item.created_time}</div><div className="mt-1 font-bold text-slate-700 dark:text-slate-300">ID: {item.id}</div></> : item.updated_time}
                            </td>
                          )}

                          {/* Sticky Actions */}
                          <td className="py-3 px-4 sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <CmsIconButton
                                onClick={() => {
                                  setFormDrawerItem(item);
                                  setIsFormDrawerOpen(true);
                                }}
                                icon={<Zap />}
                                size="sm"
                                aria-label="Chỉnh sửa thiết lập"
                                title="Chỉnh sửa"
                              />

                              <CmsIconButton
                                onClick={() => setImpactDrawerItem(item)}
                                icon={<Eye />}
                                size="sm"
                                aria-label="Xem nơi đang sử dụng"
                                title="Xem nơi đang sử dụng"
                              />

                              <CmsIconButton
                                onClick={() => setItemToDelete(item)}
                                icon={<Trash2 />}
                                size="sm"
                                variant="danger"
                                aria-label="Ngừng sử dụng hoặc lưu trữ"
                                title="Ngừng dùng / Lưu trữ"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 text-xs italic">
                        Không tìm thấy mục master data nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredList.length} itemLabel="mục thiết lập" pageSizeOptions={[25, 50]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
          </div>

        </div>
      )}

      {/* AUXILIARY DRAWERS & MODALS */}
      <UsageImpactDrawer
        isOpen={!!impactDrawerItem}
        item={impactDrawerItem}
        records={globalData.usageImpactRecords}
        onClose={() => setImpactDrawerItem(null)}
      />


      <ColumnSettingModal
        isOpen={isColumnModalOpen}
        columns={columnVisibility}
        density={density}
        onToggleColumn={(colKey) =>
          setColumnVisibility((prev) => ({ ...prev, [colKey]: !prev[colKey] }))
        }
        onChangeDensity={setDensity}
        onReset={() =>
          setColumnVisibility({
            code: true,
            type_badge: true,
            usage_count: true,
            status: true,
            ordering: true,
            scope_or_country: true,
            updated_time: true,
          })
        }
        onClose={() => setIsColumnModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        item={itemToDelete}
        onConfirmDeactivate={() => {
          if (itemToDelete) {
            showToast(`Đã ngừng sử dụng mục "${itemToDelete.name}".`);
            setItemToDelete(null);
          }
        }}
        onConfirmPermanentDelete={() => {
          if (itemToDelete) {
            showToast(`Đã xóa vĩnh viễn mục "${itemToDelete.name}".`);
            setItemToDelete(null);
          }
        }}
        onClose={() => setItemToDelete(null)}
      />

      <MasterDataFormDrawer
        isOpen={isFormDrawerOpen}
        item={formDrawerItem}
        targetType={activeDataType}
        categories={categories}
        brands={brands}
        staff={salesStaff}
        productOptions={globalData.productOptions}
        onSave={handleSaveMasterItem}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setFormDrawerItem(null);
        }}
      />
    </div>
  );
};
