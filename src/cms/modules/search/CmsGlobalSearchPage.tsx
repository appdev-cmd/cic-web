import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  Layers,
  Package,
  Newspaper,
  Calendar,
  Briefcase,
  Users,
  Settings,
  Sparkles,
  FileText,
  Inbox,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  FolderTree,
  Building2,
  Copy,
  Check,
  ChevronRight,
  Radio,
  FormInput,
  Image as ImageIcon,
} from 'lucide-react';

import {
  executeGlobalSearch,
  highlightText,
  SearchResultItem,
  SearchResultModule,
  saveRecentSearch,
  saveRecentVisitedItem,
} from '../../services/globalSearchService';
import type { CmsLocale } from '../../data/CmsDataSource';

interface CmsGlobalSearchPageProps {
  workspaceLocale?: CmsLocale;
  initialQuery?: string;
  initialModule?: SearchResultModule | 'all';
  userRole?: string;
  onNavigate: (path: string, title: string) => void;
}

export const CmsGlobalSearchPage: React.FC<CmsGlobalSearchPageProps> = ({
  workspaceLocale = 'vi',
  initialQuery = '',
  initialModule = 'all',
  userRole = 'superadmin',
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedModule, setSelectedModule] = useState<SearchResultModule | 'all'>(initialModule);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'title_asc' | 'title_desc'>('relevance');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Đồng bộ với URL query params nếu có
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    const modParam = urlParams.get('module') as SearchResultModule | null;

    if (qParam !== null) {
      setSearchQuery(qParam);
    }
    if (modParam) {
      setSelectedModule(modParam);
    }
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { totalResults: 0, groupedResults: [], allFlatResults: [] };
    }
    return executeGlobalSearch(searchQuery, {
      locale: workspaceLocale,
      userRole,
      maxResultsPerGroup: 100, // lấy đầy đủ cho trang toàn diện
      moduleFilter: selectedModule,
    });
  }, [searchQuery, workspaceLocale, userRole, selectedModule]);

  // Lọc thêm theo trạng thái và sắp xếp
  const filteredAndSortedResults = useMemo(() => {
    let list = [...searchResults.allFlatResults];

    // Lọc theo trạng thái nếu có
    if (selectedStatus !== 'all') {
      list = list.filter(item => item.statusText?.toLowerCase().includes(selectedStatus.toLowerCase()));
    }

    // Sắp xếp
    if (sortBy === 'title_asc') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else if (sortBy === 'title_desc') {
      list.sort((a, b) => b.title.localeCompare(a.title, 'vi'));
    }

    return list;
  }, [searchResults, selectedStatus, sortBy]);

  // Đếm số lượng kết quả theo từng module
  const moduleCounts = useMemo(() => {
    if (!searchQuery.trim()) return {};
    const fullRes = executeGlobalSearch(searchQuery, {
      locale: workspaceLocale,
      userRole,
      maxResultsPerGroup: 500,
      moduleFilter: 'all',
    });

    const counts: Record<string, number> = { all: fullRes.totalResults };
    fullRes.groupedResults.forEach(g => {
      counts[g.module] = g.totalCount;
    });
    return counts;
  }, [searchQuery, workspaceLocale, userRole]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleItemClick = (item: SearchResultItem) => {
    saveRecentSearch(searchQuery);
    saveRecentVisitedItem({
      id: item.id,
      title: item.title,
      moduleLabel: item.moduleLabel,
      path: item.path,
    });
    onNavigate(item.path, item.title);
  };

  const moduleTabs: Array<{ key: SearchResultModule | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'all', label: 'Tất cả module', icon: Layers },
    { key: 'command', label: 'Chức năng CMS', icon: Settings },
    { key: 'products', label: 'Sản phẩm', icon: Package },
    { key: 'news', label: 'Tin tức & Bài viết', icon: Newspaper },
    { key: 'customer_requests', label: 'Yêu cầu khách hàng', icon: Inbox },
    { key: 'events', label: 'Sự kiện & Hội thảo', icon: Calendar },
    { key: 'projects', label: 'Dự án tiêu biểu', icon: Briefcase },
    { key: 'static_pages', label: 'Trang nội dung', icon: FileText },
    { key: 'services', label: 'Dịch vụ', icon: Sparkles },
    { key: 'forms_cta', label: 'Biểu mẫu & CTA', icon: FormInput },
    { key: 'media', label: 'Media & File', icon: ImageIcon },
  ];

  const getStatusBadgeClass = (color?: SearchResultItem['statusColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'amber':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'blue':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'orange':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'rose':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Main Search Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Search className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              <span>Tìm kiếm tổng quan hệ thống CMS</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tra cứu nhanh bản ghi xuyên suốt các module: Sản phẩm, Tin tức, Yêu cầu khách hàng, Sự kiện, Trang tĩnh, Chức năng...
            </p>
          </div>

          {searchQuery && (
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg shrink-0 self-start md:self-auto font-medium">
              Tìm thấy <strong className="text-orange-600 dark:text-orange-400">{filteredAndSortedResults.length}</strong> kết quả phù hợp
            </div>
          )}
        </div>

        {/* Search Bar Input */}
        <div className="relative flex items-center group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center transition-colors group-focus-within:bg-orange-500 group-focus-within:text-white">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập tên sản phẩm, mã SKU, tiêu đề bài viết, email/SĐT khách hàng, đối tác..."
            className="w-full pl-14 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-200 font-normal shadow-2xs focus:shadow-md focus:shadow-orange-500/5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Module Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100 dark:border-slate-800/70">
          {moduleTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = selectedModule === tab.key;
            const count = moduleCounts[tab.key] ?? 0;

            return (
              <button
                key={tab.key}
                onClick={() => setSelectedModule(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {searchQuery && count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Options Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Lọc trạng thái:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="hiển thị">Đang hiển thị / Hoạt động</option>
            <option value="xuất bản">Đã xuất bản</option>
            <option value="nháp">Bản nháp</option>
            <option value="tiếp nhận">Mới tiếp nhận (Leads)</option>
            <option value="xử lý">Đang xử lý</option>
            <option value="hoàn thành">Đã hoàn thành</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="relevance">Độ liên quan / Mặc định</option>
            <option value="title_asc">Tên (A → Z)</option>
            <option value="title_desc">Tên (Z → A)</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {!searchQuery.trim() ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-xs">
            <Search className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Nhập từ khóa để bắt đầu tìm kiếm
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hệ thống tự động tìm kiếm không phân biệt dấu tiếng Việt (ví dụ: "intellicad", "plaxis", "bao gia", "0981234...").
            </p>
          </div>
        </div>
      ) : filteredAndSortedResults.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Không tìm thấy kết quả nào phù hợp với "{searchQuery}"
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Thử chuyển sang tab "Tất cả module" hoặc thay đổi bộ lọc trạng thái.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredAndSortedResults.map((item) => {
            const ItemIcon = item.icon;
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <ItemIcon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                        {item.moduleLabel}
                      </span>
                      {item.category && (
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                      )}
                      {item.category && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {item.category}
                        </span>
                      )}
                      {item.statusText && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeClass(
                            item.statusColor
                          )}`}
                        >
                          {item.statusText}
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => handleItemClick(item)}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      {highlightText(item.title, searchQuery)}
                    </h3>

                    {item.subtitle && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {highlightText(item.subtitle, searchQuery)}
                      </p>
                    )}

                    {/* Metadata Pill Tags */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {item.path}
                      </span>
                      {item.metadata?.sku && (
                        <span>• SKU: <strong className="text-slate-700 dark:text-slate-200">{item.metadata.sku}</strong></span>
                      )}
                      {item.metadata?.code && (
                        <span>• Mã: <strong className="text-slate-700 dark:text-slate-200">{item.metadata.code}</strong></span>
                      )}
                      {item.metadata?.phone && (
                        <span>• SĐT: <strong className="text-slate-700 dark:text-slate-200">{item.metadata.phone}</strong></span>
                      )}
                      {item.metadata?.email && (
                        <span>• Email: <strong className="text-slate-700 dark:text-slate-200">{item.metadata.email}</strong></span>
                      )}
                      {item.metadata?.date && (
                        <span>• Ngày: {item.metadata.date}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {item.metadata?.sku && (
                    <button
                      onClick={() => handleCopy(item.metadata?.sku || '', item.id)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      title="Sao chép SKU"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    onClick={() => handleItemClick(item)}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Mở / Xử lý</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
