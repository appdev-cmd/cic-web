import React, { useState, useMemo } from 'react';
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
  Mail,
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
  MasterRoutingRuleItem,
  MasterDataActivityLog,
  OverviewMetrics,
} from './types';

import {
  mockMasterCategories,
  mockMasterBrands,
  mockMasterApplications,
  mockMasterProductTypes,
  mockMasterSalesStaff,
  mockMasterRoutingRules,
  mockMasterActivityLogs,
  mockOverviewMetrics,
} from './mockData';

import { UsageImpactDrawer } from './UsageImpactDrawer';
import { RoutingSimulatorModal } from './RoutingSimulatorModal';
import { ColumnSettingModal, ProductSettingsColumnVisibility } from './ColumnSettingModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { MasterDataFormDrawer } from './MasterDataFormDrawer';

type MainTab = 'overview' | 'taxonomy' | 'assignments' | 'archived' | 'audit';

export const ProductSettingsManager: React.FC = () => {
  // Master Datasets State
  const [categories, setCategories] = useState<MasterCategoryItem[]>(mockMasterCategories);
  const [brands, setBrands] = useState<MasterBrandItem[]>(mockMasterBrands);
  const [applications, setApplications] = useState<MasterApplicationItem[]>(mockMasterApplications);
  const [productTypes, setProductTypes] = useState<MasterProductTypeItem[]>(mockMasterProductTypes);
  const [salesStaff, setSalesStaff] = useState<MasterSalesStaffItem[]>(mockMasterSalesStaff);
  const [routingRules, setRoutingRules] = useState<MasterRoutingRuleItem[]>(mockMasterRoutingRules);
  const [activityLogs, setActivityLogs] = useState<MasterDataActivityLog[]>(mockMasterActivityLogs);

  // Navigation State
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('taxonomy');
  const [activeDataType, setActiveDataType] = useState<MasterDataType>('categories');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [usageFilter, setUsageFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [viewFormat, setViewFormat] = useState<'list' | 'tree'>('list');

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
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
    if (activeMainTab === 'archived') {
      const all: AnyMasterItem[] = [
        ...categories,
        ...brands,
        ...applications,
        ...productTypes,
        ...salesStaff,
        ...routingRules,
      ];
      return all.filter((i) => i.status === 'archived');
    }

    let source: AnyMasterItem[] = [];
    if (activeDataType === 'categories') source = categories;
    else if (activeDataType === 'brands') source = brands;
    else if (activeDataType === 'applications') source = applications;
    else if (activeDataType === 'product_types') source = productTypes;
    else if (activeDataType === 'sales_staff') source = salesStaff;
    else if (activeDataType === 'routing_rules') source = routingRules;

    return source.filter((i) => i.status !== 'archived');
  }, [activeMainTab, activeDataType, categories, brands, applications, productTypes, salesStaff, routingRules]);

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

      return true;
    });
  }, [currentActiveList, searchQuery, statusFilter, usageFilter]);

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
    else if (savedItem.type === 'routing_rules') setRoutingRules((prev) => updateDataset(prev, savedItem as MasterRoutingRuleItem));

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
    setRoutingRules((prev) => prev.map((i) => updateStatus(i) as MasterRoutingRuleItem));

    showToast(`Đã ngưng sử dụng (Deactivate) ${selectedIds.length} mục đã chọn!`);
    setSelectedIds([]);
  };

  const handleBatchArchive = () => {
    const updateStatus = (item: AnyMasterItem) =>
      selectedIds.includes(item.id) ? { ...item, status: 'archived' as const } : item;

    setCategories((prev) => prev.map((i) => updateStatus(i) as MasterCategoryItem));
    setBrands((prev) => prev.map((i) => updateStatus(i) as MasterBrandItem));
    setApplications((prev) => prev.map((i) => updateStatus(i) as MasterApplicationItem));
    setProductTypes((prev) => prev.map((i) => updateStatus(i) as MasterProductTypeItem));
    setSalesStaff((prev) => prev.map((i) => updateStatus(i) as MasterSalesStaffItem));
    setRoutingRules((prev) => prev.map((i) => updateStatus(i) as MasterRoutingRuleItem));

    showToast(`Đã chuyển ${selectedIds.length} mục vào Thùng rác Lưu trữ!`);
    setSelectedIds([]);
  };

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-orange-600 text-white rounded-2xl shrink-0 shadow-md shadow-orange-600/20">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Thiết lập Danh mục Sản phẩm (Module 06)
              </h1>
              <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 font-bold text-[11px] rounded-full border border-orange-500/20">
                Master Data Workspace
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hợp nhất 6 nhóm master data: Lĩnh vực, Hãng sản xuất, Lĩnh vực ứng dụng, Loại sản phẩm, Người phụ trách & Quy tắc email routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Mô phỏng Email Routing</span>
          </button>

          <button
            onClick={() => {
              setFormDrawerItem(null);
              setIsFormDrawerOpen(true);
            }}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mới Master Data</span>
          </button>
        </div>
      </div>

      {/* 2. SITEMAP SECTIONS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: '1. Tổng quan Master Data' },
          { id: 'taxonomy', label: '2. Phân loại & Taxonomy (4 loại)' },
          { id: 'assignments', label: '3. Phân công & Liên hệ (2 loại)' },
          { id: 'archived', label: '4. Mục đã lưu trữ' },
          { id: 'audit', label: '5. Lịch sử thay đổi (Audit Trail)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveMainTab(tab.id as MainTab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
              activeMainTab === tab.id
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Lĩnh vực / Danh mục', count: categories.length, type: 'categories', icon: Building2, color: 'text-blue-600 bg-blue-500/10' },
              { label: 'Hãng sản xuất', count: brands.length, type: 'brands', icon: Globe, color: 'text-emerald-600 bg-emerald-500/10' },
              { label: 'Lĩnh vực ứng dụng', count: applications.length, type: 'applications', icon: Cpu, color: 'text-purple-600 bg-purple-500/10' },
              { label: 'Loại sản phẩm', count: productTypes.length, type: 'product_types', icon: Layers, color: 'text-amber-600 bg-amber-500/10' },
              { label: 'Nhân viên phụ trách', count: salesStaff.length, type: 'sales_staff', icon: UserCheck, color: 'text-orange-600 bg-orange-500/10' },
              { label: 'Quy tắc Routing Email', count: routingRules.length, type: 'routing_rules', icon: Zap, color: 'text-rose-600 bg-rose-500/10' },
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
                      setActiveMainTab('assignments');
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
                  Cảnh báo Kiểm tra Phụ thuộc & Dependency Health (1 Issue phát hiện)
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                  Thương hiệu <strong>Glodon Company Limited</strong> đang ngưng sử dụng (Inactive) nhưng vẫn còn 8 sản phẩm kinh doanh chưa đổi hãng.
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

      {/* 4. DATA TABLES AREA (Taxonomy, Assignments, Archived) */}
      {['taxonomy', 'assignments', 'archived'].includes(activeMainTab) && (
        <div className="space-y-4">
          
          {/* Sub-type Selectors Bar */}
          {activeMainTab === 'taxonomy' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { type: 'categories', label: '1. Lĩnh vực / Danh mục (Categories)' },
                { type: 'brands', label: '2. Hãng sản xuất (Brands)' },
                { type: 'applications', label: '3. Lĩnh vực ứng dụng (Applications)' },
                { type: 'product_types', label: '4. Loại sản phẩm (Product Types)' },
              ].map((sub) => (
                <button
                  key={sub.type}
                  onClick={() => {
                    setActiveDataType(sub.type as MasterDataType);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeDataType === sub.type
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {activeMainTab === 'assignments' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { type: 'sales_staff', label: '1. Người phụ trách kinh doanh (Sales Staff)' },
                { type: 'routing_rules', label: '2. Quy tắc nhận liên hệ (Routing Rules Engine)' },
              ].map((sub) => (
                <button
                  key={sub.type}
                  onClick={() => {
                    setActiveDataType(sub.type as MasterDataType);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeDataType === sub.type
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

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
                  placeholder="Tìm theo Tên, Mã nhận diện Code, Mô tả..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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
                  <option value="active">Active (Đang dùng)</option>
                  <option value="inactive">Inactive (Ngừng sử dụng)</option>
                </select>

                {/* Usage filter */}
                <select
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
                </select>

                {/* Column settings button */}
                <button
                  onClick={() => setIsColumnModalOpen(true)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
                  <span>Cấu hình cột</span>
                </button>
              </div>
            </div>

            {/* Bulk actions bar */}
            {selectedIds.length > 0 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
                  <CheckSquare className="w-4 h-4" />
                  <span>Đã chọn {selectedIds.length} mục master data</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleBatchDeactivate}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Ngừng sử dụng (Deactivate)
                  </button>

                  <button
                    onClick={handleBatchArchive}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Chuyển sang Lưu trữ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MAIN UNIFIED MASTER DATA TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {/* Checkbox Sticky Left */}
                    <th className="py-3 px-3 w-10 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handleSelectAllOnPage}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {paginatedList.length > 0 &&
                        paginatedList.every((i) => selectedIds.includes(i.id)) ? (
                          <CheckSquare className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>

                    {/* Name & Code (Sticky Left) */}
                    <th className="py-3 px-4 min-w-[260px] sticky left-10 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                      Tên mục Master Data & Mã nhận diện
                    </th>

                    {/* Usage count */}
                    {columnVisibility.usage_count && (
                      <th className="py-3 px-4 min-w-[140px]">Số SP / Đơn hàng dùng</th>
                    )}

                    {/* Ordering */}
                    {columnVisibility.ordering && (
                      <th className="py-3 px-4 min-w-[110px]">Thứ tự (Order)</th>
                    )}

                    {/* Scope / Country / Email */}
                    {columnVisibility.scope_or_country && (
                      <th className="py-3 px-4 min-w-[200px]">Phạm vi / Thông tin liên hệ</th>
                    )}

                    {/* Status */}
                    {columnVisibility.status && (
                      <th className="py-3 px-4 min-w-[130px]">Trạng thái</th>
                    )}

                    {/* Updated Time */}
                    {columnVisibility.updated_time && (
                      <th className="py-3 px-4 min-w-[140px]">Cập nhật</th>
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
                            <button
                              onClick={() => handleToggleSelect(item.id)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-orange-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
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
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                                  {item.code}
                                </span>
                                {item.description && (
                                  <>
                                    <span>•</span>
                                    <span className="line-clamp-1 max-w-[200px]">{item.description}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Usage Count badge */}
                          {columnVisibility.usage_count && (
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
                                <span className="flex items-center gap-1 font-mono text-[11px] text-orange-600">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>{(item as MasterSalesStaffItem).email}</span>
                                </span>
                              )}
                              {item.type === 'routing_rules' && (
                                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                                  Nội bộ: {(item as MasterRoutingRuleItem).primary_sales_name}
                                </span>
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
                              {item.updated_time}
                            </td>
                          )}

                          {/* Sticky Actions */}
                          <td className="py-3 px-4 sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setFormDrawerItem(item);
                                  setIsFormDrawerOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                title="Chỉnh sửa"
                              >
                                <Zap className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setImpactDrawerItem(item)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                title="Xem tác động Dependency"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setItemToDelete(item)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                title="Ngừng dùng / Lưu trữ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
              <div>
                Hiển thị {filteredList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
                {Math.min(currentPage * pageSize, filteredList.length)} / Tổng số {filteredList.length} mục
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  <option value={25}>25 hàng/trang</option>
                  <option value={50}>50 hàng/trang</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-bold text-slate-800 dark:text-slate-200">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 5. AUDIT TRAIL LOGS TAB */}
      {activeMainTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Nhật ký Thay đổi & Lịch sử Master Data (Audit Trail)
              </h2>
              <p className="text-xs text-slate-500">Truy vết ai đã chỉnh sửa, activate hoặc deactivate danh mục master data</p>
            </div>
            <span className="px-2.5 py-1 bg-purple-500/10 text-purple-600 font-bold text-xs rounded-lg border border-purple-500/20">
              {activityLogs.length} Bản ghi
            </span>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                    {log.user_name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{log.user_name}</span>
                      <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[9px] font-bold rounded uppercase">
                        {log.action}
                      </span>
                      <span className="font-bold text-orange-600">{log.item_name}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUXILIARY DRAWERS & MODALS */}
      <UsageImpactDrawer
        isOpen={!!impactDrawerItem}
        item={impactDrawerItem}
        onClose={() => setImpactDrawerItem(null)}
      />

      <RoutingSimulatorModal
        isOpen={isSimulatorOpen}
        rules={routingRules}
        categories={categories}
        brands={brands}
        staff={salesStaff}
        onClose={() => setIsSimulatorOpen(false)}
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
            showToast(`Đã chuyển mục "${itemToDelete.name}" sang trạng thái Ngừng sử dụng (Inactive).`);
            setItemToDelete(null);
          }
        }}
        onConfirmArchive={() => {
          if (itemToDelete) {
            showToast(`Đã chuyển mục "${itemToDelete.name}" sang Thùng rác Lưu trữ.`);
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
        onSave={handleSaveMasterItem}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setFormDrawerItem(null);
        }}
      />
    </div>
  );
};
