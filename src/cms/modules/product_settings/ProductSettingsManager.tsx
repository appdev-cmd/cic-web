import React, { useEffect, useState, useMemo } from 'react';
import {
  FolderTree,
  Layers,
  Edit3,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle,
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

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { MasterDataFormDrawer } from './MasterDataFormDrawer';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { SearchableSelect } from '../../components/SearchableSelect';

const usesSystemAlias = (type: MasterDataType) => ['brands', 'applications', 'product_types'].includes(type);
const getSystemAlias = (item: AnyMasterItem) => item.alias || item.name
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

interface ProductSettingsManagerProps {
  taxonomy?: ProductTaxonomyModuleData;
  globalData: ProductSettingsGlobalData;
  dataType?: MasterDataType;
}

export const ProductSettingsManager: React.FC<ProductSettingsManagerProps> = ({ taxonomy, globalData, dataType = 'categories' }) => {
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
  const activeDataType = dataType;

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [staffProductFilter, setStaffProductFilter] = useState('all');
  const [viewFormat, setViewFormat] = useState<'list' | 'tree'>('list');

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [itemToDelete, setItemToDelete] = useState<AnyMasterItem | null>(null);
  const [formDrawerItem, setFormDrawerItem] = useState<AnyMasterItem | null>(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
        const matchCode = (usesSystemAlias(item.type) ? getSystemAlias(item) : item.code).toLowerCase().includes(q);
        const matchDesc = item.type === 'categories' && (item.description || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc) return false;
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

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
  }, [currentActiveList, searchQuery, statusFilter, activeDataType, staffProductFilter]);

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

  const setItemStatus = (id: string, status: MasterItemStatus) => {
    const update = <T extends AnyMasterItem>(items: T[]) => items.map((item) => item.id === id ? { ...item, status } as T : item);
    setCategories((items) => update(items));
    setBrands((items) => update(items));
    setApplications((items) => update(items));
    setProductTypes((items) => update(items));
    setSalesStaff((items) => update(items));
  };

  const removeItem = (id: string) => {
    const remove = <T extends AnyMasterItem>(items: T[]) => items.filter((item) => item.id !== id);
    setCategories((items) => remove(items));
    setBrands((items) => remove(items));
    setApplications((items) => remove(items));
    setProductTypes((items) => remove(items));
    setSalesStaff((items) => remove(items));
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
        title={{ categories: 'Danh mục sản phẩm', brands: 'Hãng sản xuất', applications: 'Lĩnh vực ứng dụng', product_types: 'Loại sản phẩm', sales_staff: 'Người phụ trách kinh doanh' }[activeDataType]}
        description={{ categories: 'Quản lý cấu trúc danh mục sản phẩm.', brands: 'Quản lý danh sách hãng sản xuất.', applications: 'Quản lý các lĩnh vực ứng dụng sản phẩm.', product_types: 'Quản lý các loại sản phẩm.', sales_staff: 'Quản lý người phụ trách kinh doanh sản phẩm.' }[activeDataType]}
        actions={<>
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
        </>}
      />

      {/* DATA TABLES AREA */}
      <div className="space-y-4">
          {/* TOOLBAR & FILTERS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex items-center flex-1 max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
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

                <button type="button" disabled={!searchQuery && statusFilter === 'all' && staffProductFilter === 'all'} onClick={() => { setSearchQuery(''); setStatusFilter('all'); setStaffProductFilter('all'); setCurrentPage(1); }} className="ml-auto flex h-9 w-24 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" />Đặt lại</button>

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
                      {activeDataType === 'sales_staff' ? 'Tên nhân viên' : usesSystemAlias(activeDataType) ? 'Tiêu đề dữ liệu và tên hiệu' : 'Tên và mã nhận diện'}
                    </th>

                    {/* Ordering */}
                    <th className="py-3 px-4 min-w-[110px]">Thứ tự</th>

                    {/* Scope / Contact Info - Only for sales staff */}
                    {activeDataType === 'sales_staff' && (
                      <th className="py-3 px-4 min-w-[200px]">Số điện thoại / Skype / Zalo</th>
                    )}

                    {/* Status */}
                    <th className="py-3 px-4 min-w-[130px]">Trạng thái</th>

                    {/* Updated Time */}
                    {activeDataType === 'sales_staff' && (
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
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
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
                              </div>
                              {item.type !== 'sales_staff' && (
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                                    {usesSystemAlias(item.type) ? getSystemAlias(item) : item.code}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Ordering */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">#{item.ordering}</td>

                          {/* Contact Info - Only for sales staff */}
                          {activeDataType === 'sales_staff' && (
                            <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                              <div className="space-y-1 text-[11px]">
                                <span className="flex items-center gap-1 font-mono text-orange-600"><Phone className="w-3.5 h-3.5" />{(item as MasterSalesStaffItem).phone || '—'}</span>
                                <span className="block text-slate-500">Skype: {(item as MasterSalesStaffItem).skype || '—'} · Zalo: {(item as MasterSalesStaffItem).zalo || '—'}</span>
                              </div>
                            </td>
                          )}

                          {/* Status */}
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

                          {/* Updated Time */}
                          {activeDataType === 'sales_staff' && (
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
                                icon={<Edit3 />}
                                size="sm"
                                aria-label="Chỉnh sửa thiết lập"
                                title="Chỉnh sửa"
                              />

                              <CmsIconButton
                                onClick={() => setItemToDelete(item)}
                                icon={<Trash2 />}
                                size="sm"
                                variant="danger"
                                aria-label="Xóa hoặc ngừng sử dụng"
                                title="Xóa / Ngừng sử dụng"
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
            <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredList.length} itemLabel="mục thiết lập" pageSizeOptions={[10, 20, 50, 100]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
          </div>

      </div>

      {/* AUXILIARY DRAWERS & MODALS */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        item={itemToDelete}
        onConfirmDeactivate={() => {
          if (itemToDelete) {
            setItemStatus(itemToDelete.id, 'inactive');
            showToast(`Đã ngừng sử dụng mục "${itemToDelete.name}".`);
            setItemToDelete(null);
          }
        }}
        onConfirmPermanentDelete={() => {
          if (itemToDelete) {
            removeItem(itemToDelete.id);
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
