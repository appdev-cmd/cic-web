import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
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
  Command,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Tag,
  Building2,
  FolderTree,
  Mail,
  Shield,
  HelpCircle,
  LucideIcon,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

import {
  executeGlobalSearch,
  highlightText,
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches,
  getRecentVisitedItems,
  saveRecentVisitedItem,
  SearchResultItem,
  SearchResultModule,
  RecentSearchItem,
  RecentVisitedItem,
} from '../services/globalSearchService';
import type { CmsLocale } from '../data/CmsDataSource';

interface CmsCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (path: string, label: string, itemData?: any) => void;
  userRole?: string;
  workspaceLocale?: CmsLocale;
  onViewAllResults?: (query: string, module?: SearchResultModule | 'all') => void;
}

export const CmsCommandPalette: React.FC<CmsCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  userRole = 'superadmin',
  workspaceLocale = 'vi',
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [recentVisited, setRecentVisited] = useState<RecentVisitedItem[]>([]);
  const [activeModuleFilter, setActiveModuleFilter] = useState<SearchResultModule | 'all'>('all');

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches & visited khi mở modal
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setRecentVisited(getRecentVisitedItems());
      setQuery('');
      setSelectedIndex(0);
      setActiveModuleFilter('all');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Shortcut toàn cục: Ctrl+K / Cmd+K hoặc nhấn phím '/'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or shortcut
        }
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        // Trigger open nếu có callback ngoài hoặc mở
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Thực hiện tìm kiếm
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return { totalResults: 0, groupedResults: [], allFlatResults: [] };
    }
    return executeGlobalSearch(query, {
      locale: workspaceLocale,
      userRole,
      maxResultsPerGroup: 5,
      moduleFilter: activeModuleFilter,
    });
  }, [query, workspaceLocale, userRole, activeModuleFilter]);

  // Tạo danh sách phẳng tất cả các items hiển thị để phục vụ điều hướng bằng phím mũi tên
  const flatSelectableItems = useMemo(() => {
    const items: Array<{ type: 'result' | 'view_all'; data?: SearchResultItem; module?: SearchResultModule; label?: string }> = [];
    searchResults.groupedResults.forEach((group) => {
      group.items.forEach((item) => {
        items.push({ type: 'result', data: item });
      });
      if (group.totalCount > group.items.length) {
        items.push({
          type: 'view_all',
          module: group.module,
          label: `Xem tất cả ${group.totalCount} kết quả trong ${group.label}`,
        });
      }
    });
    return items;
  }, [searchResults]);

  // Reset selected index khi kết quả thay đổi
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeModuleFilter]);

  // Tự động scroll đến item đang active
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleSelectItem = (item: SearchResultItem) => {
    saveRecentSearch(query);
    saveRecentVisitedItem({
      id: item.id,
      title: item.title,
      moduleLabel: item.moduleLabel,
      path: item.path,
    });
    onSelectAction(item.path, item.title, item);
    onClose();
  };

  const handleSelectRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    inputRef.current?.focus();
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, q: string) => {
    e.stopPropagation();
    removeRecentSearch(q);
    setRecentSearches(getRecentSearches());
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllRecentSearches();
    setRecentSearches([]);
  };

  const handleViewAll = (module?: SearchResultModule | 'all') => {
    saveRecentSearch(query);
    onClose();
    if (onViewAllResults) {
      onViewAllResults(query, module);
    } else {
      // Điều hướng đến trang search tổng
      const targetPath = `/cms/search?q=${encodeURIComponent(query)}${module && module !== 'all' ? `&module=${module}` : ''}`;
      onSelectAction(targetPath, `Tìm kiếm: "${query}"`);
    }
  };

  // Xử lý phím điều hướng bên trong modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatSelectableItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % flatSelectableItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatSelectableItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + flatSelectableItems.length) % flatSelectableItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatSelectableItems.length > 0 && flatSelectableItems[selectedIndex]) {
        const active = flatSelectableItems[selectedIndex];
        if (active.type === 'result' && active.data) {
          handleSelectItem(active.data);
        } else if (active.type === 'view_all') {
          handleViewAll(active.module);
        }
      } else if (query.trim()) {
        handleViewAll('all');
      }
    }
  };

  // Trợ giúp lấy màu sắc cho badge trạng thái
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

  let currentItemCounter = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm, bài viết, khách hàng, cấu hình, dữ liệu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Xóa từ khóa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-mono font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-2xs cursor-pointer"
            title="Đóng (Esc)"
          >
            ESC
          </button>
        </div>

        {/* Scrollable Results Container */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60"
        >
          {/* KHI CHƯA NHẬP TỪ KHÓA TÌM KIẾM (EMPTY QUERY) */}
          {!query.trim() && (
            <div className="space-y-4 p-1">
              {/* 1. Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Tìm kiếm gần đây
                    </span>
                    <button
                      onClick={handleClearAllRecent}
                      className="text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Xóa lịch sử
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectRecentSearch(s.query)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-500 dark:hover:bg-orange-600 text-slate-900 dark:text-slate-200 hover:text-white dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer group"
                      >
                        <Search className="w-3 h-3 text-slate-400 group-hover:text-orange-500" />
                        <span>{s.query}</span>
                        <span
                          onClick={(e) => handleRemoveRecentSearch(e, s.query)}
                          className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-2.5 h-2.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Recently Visited Items */}
              {recentVisited.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="px-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Đã truy cập gần đây
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentVisited.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelectAction(item.path, item.title);
                          onClose();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-orange-600 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.moduleLabel} · {item.path}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Lối tắt nhanh / Gợi ý chức năng phổ biến */}
              <div className="space-y-2 pt-2">
                <div className="px-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Command className="w-3.5 h-3.5 text-orange-500" />
                    Chức năng thường dùng
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { label: 'Hãng sản xuất', sub: 'Quản lý thương hiệu đối tác', path: '/cms/products/brands', icon: Building2 },
                    { label: 'SEO & URL', sub: 'Template SEO, canonical, redirect và sitemap', path: '/cms/function-seo', icon: Search },
                    { label: 'Danh mục sản phẩm', sub: 'Cây phân loại taxonomy', path: '/cms/product-settings', icon: FolderTree },
                    { label: 'Yêu cầu từ khách hàng', sub: 'Leads tư vấn & Báo giá', path: '/cms/customer-requests', icon: Inbox },
                    { label: 'Quản lý Sản phẩm', sub: 'Danh sách phần mềm & thiết bị', path: '/cms/products', icon: Package },
                    { label: 'Tin tức & Bài viết', sub: 'Biên tập bài viết chuyển giao', path: '/cms/news', icon: Newspaper },
                  ].map((act, i) => {
                    const IconComp = act.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          onSelectAction(act.path, act.label);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-orange-50/70 dark:hover:bg-orange-950/30 hover:border-orange-200 dark:hover:border-orange-900/50 text-left flex items-center gap-2.5 transition-all group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-2xs text-slate-600 dark:text-slate-300 group-hover:text-orange-600 shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 truncate">
                            {act.label}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {act.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* KHI ĐÃ CÓ TỪ KHÓA TÌM KIẾM (HAS QUERY) */}
          {query.trim() && (
            <>
              {searchResults.groupedResults.length > 0 ? (
                <div className="space-y-4 pt-1">
                  {searchResults.groupedResults.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                      <div key={group.module} className="space-y-1.5 pt-2 first:pt-0">
                        {/* Group Header */}
                        <div className="flex items-center justify-between px-2 py-1">
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <GroupIcon className="w-3.5 h-3.5 text-orange-500" />
                            {group.label}
                            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {group.totalCount}
                            </span>
                          </span>
                          {group.totalCount > group.items.length && (
                            <button
                              onClick={() => handleViewAll(group.module)}
                              className="text-[11px] font-medium text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Xem tất cả {group.totalCount}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Group Item List */}
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const thisIndex = currentItemCounter++;
                            const isSelected = selectedIndex === thisIndex;
                            const ItemIcon = item.icon;

                            return (
                              <div
                                key={item.id}
                                data-active={isSelected ? 'true' : undefined}
                                onClick={() => handleSelectItem(item)}
                                className={`w-full px-3 py-2.5 rounded-xl text-left flex items-start justify-between transition-all cursor-pointer group border ${
                                  isSelected
                                    ? 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-300 dark:border-orange-500/40 text-orange-950 dark:text-orange-100 shadow-2xs'
                                    : 'border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                  <div
                                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                      isSelected
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-orange-600'
                                    }`}
                                  >
                                    <ItemIcon className="w-4 h-4" />
                                  </div>

                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-xs sm:text-sm font-semibold truncate leading-tight">
                                        {highlightText(item.title, query)}
                                      </p>
                                      {item.statusText && (
                                        <span
                                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(
                                            item.statusColor
                                          )}`}
                                        >
                                          {item.statusText}
                                        </span>
                                      )}
                                    </div>

                                    {item.subtitle && (
                                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                        {highlightText(item.subtitle, query)}
                                      </p>
                                    )}

                                    {/* Context Details (SKU, Email, SĐT, Đường dẫn) */}
                                    <div className="flex items-center gap-2.5 text-[10px] text-slate-400 dark:text-slate-500 flex-wrap">
                                      <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">
                                        {item.path}
                                      </span>
                                      {item.metadata?.sku && (
                                        <span>• SKU: <strong className="text-slate-600 dark:text-slate-300">{item.metadata.sku}</strong></span>
                                      )}
                                      {item.metadata?.code && (
                                        <span>• Mã: <strong className="text-slate-600 dark:text-slate-300">{item.metadata.code}</strong></span>
                                      )}
                                      {item.metadata?.phone && (
                                        <span>• SĐT: <strong className="text-slate-600 dark:text-slate-300">{item.metadata.phone}</strong></span>
                                      )}
                                      {item.metadata?.email && (
                                        <span>• Email: <strong className="text-slate-600 dark:text-slate-300">{item.metadata.email}</strong></span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 ml-3 flex items-center self-center gap-1.5">
                                  {isSelected && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-1.5 py-0.5 rounded">
                                      <span>Nhấn</span>
                                      <CornerDownLeft className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                  <ChevronRight
                                    className={`w-4 h-4 transition-transform ${
                                      isSelected
                                        ? 'text-orange-600 translate-x-0.5'
                                        : 'text-slate-400 opacity-0 group-hover:opacity-100'
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}

                          {/* Link Xem tất cả kết quả của nhóm này */}
                          {group.totalCount > group.items.length && (
                            (() => {
                              const thisIndex = currentItemCounter++;
                              const isSelected = selectedIndex === thisIndex;
                              return (
                                <button
                                  data-active={isSelected ? 'true' : undefined}
                                  onClick={() => handleViewAll(group.module)}
                                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-orange-500/10 text-orange-600'
                                      : 'text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20'
                                  }`}
                                >
                                  <span>→ Xem tất cả {group.totalCount} kết quả trong {group.label}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Nút Xem tất cả kết quả toàn bộ hệ thống */}
                  <div className="pt-3 pb-1 px-1">
                    <button
                      onClick={() => handleViewAll('all')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 dark:hover:bg-orange-600 text-slate-900 dark:text-slate-200 hover:text-white dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-2xs"
                    >
                      <Search className="w-4 h-4" />
                      <span>Xem tất cả {searchResults.totalResults} kết quả trong trang tìm kiếm nâng cao</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Không tìm thấy kết quả */
                <div className="p-8 sm:p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Không tìm thấy kết quả cho "{query}"
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Hãy thử tìm với từ khóa chung hơn, không dấu hoặc tìm theo mã sản phẩm, SKU, số điện thoại hoặc email.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">
                ↓
              </kbd>
              <span>Điều hướng</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">
                ↵
              </kbd>
              <span>Đi tới bản ghi</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">
                ESC
              </kbd>
              <span>Đóng</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Command className="w-3.5 h-3.5 text-orange-500" />
            <span>CIC Command Global Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
