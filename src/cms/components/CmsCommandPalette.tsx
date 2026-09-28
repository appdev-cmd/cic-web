'use client';

import React, { useState, useEffect, useRef, useMemo, useTransition } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Clock,
  Trash2,
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
  Building2,
  FolderTree,
  FormInput,
  Image as ImageIcon,
  Loader2,
  type LucideIcon,
} from 'lucide-react';

import {
  highlightText,
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches,
  getRecentVisitedItems,
  saveRecentVisitedItem,
  normalizeVietnamese,
  type RecentSearchItem,
  type RecentVisitedItem,
} from '../services/globalSearchRuntime';
import type { CmsLocale } from '../data/CmsDataSource';
import type { CmsQuickSearchResult, CmsSearchRecord } from '@/features/cms-search/types';
import { searchCmsQuickJumpAction } from '@/features/cms-search/server/actions';

interface NavigationCommandItem {
  id: string;
  title: string;
  subtitle: string;
  moduleLabel: string;
  category: string;
  path: string;
  icon: LucideIcon;
  keywords: string[];
}

const STATIC_NAVIGATION_COMMANDS: NavigationCommandItem[] = [
  { id: 'nav_dash', title: 'Bảng điều khiển Tổng quan', subtitle: '/cms/dashboard', moduleLabel: 'Điều hướng', category: 'Chức năng', path: '/cms/dashboard', icon: Layers, keywords: ['dashboard', 'tong quan', 'báo cáo', 'overview'] },
  { id: 'nav_prod', title: 'Quản lý Sản phẩm', subtitle: '/cms/products', moduleLabel: 'Sản phẩm', category: 'Nội dung', path: '/cms/products', icon: Package, keywords: ['san pham', 'software', 'phan mem', 'products'] },
  { id: 'nav_prod_brands', title: 'Hãng sản xuất / Thương hiệu', subtitle: '/cms/products/brands', moduleLabel: 'Sản phẩm', category: 'Cấu hình', path: '/cms/products/brands', icon: Building2, keywords: ['hang san xuat', 'brands', 'manufacturers', 'doi tac'] },
  { id: 'nav_prod_tax', title: 'Danh mục & Cây phân loại', subtitle: '/cms/product-settings', moduleLabel: 'Sản phẩm', category: 'Cấu hình', path: '/cms/product-settings', icon: FolderTree, keywords: ['danh muc', 'taxonomy', 'categories', 'phan loai'] },
  { id: 'nav_news', title: 'Quản lý Tin tức & Bài viết', subtitle: '/cms/news', moduleLabel: 'Tin tức', category: 'Nội dung', path: '/cms/news', icon: Newspaper, keywords: ['tin tuc', 'bai viet', 'news', 'articles', 'chuyen giao'] },
  { id: 'nav_events', title: 'Quản lý Sự kiện & Hội thảo', subtitle: '/cms/events', moduleLabel: 'Sự kiện', category: 'Nội dung', path: '/cms/events', icon: Calendar, keywords: ['su kien', 'hoi thao', 'webinar', 'events'] },
  { id: 'nav_projects', title: 'Quản lý Dự án tiêu biểu', subtitle: '/cms/projects', moduleLabel: 'Dự án', category: 'Nội dung', path: '/cms/projects', icon: Briefcase, keywords: ['du an', 'case study', 'projects', 'cong trinh'] },
  { id: 'nav_services', title: 'Quản lý Dịch vụ tư vấn', subtitle: '/cms/services', moduleLabel: 'Dịch vụ', category: 'Nội dung', path: '/cms/services', icon: Sparkles, keywords: ['dich vu', 'services', 'tu van', 'giai phap'] },
  { id: 'nav_static', title: 'Quản lý Trang nội dung', subtitle: '/cms/static-pages', moduleLabel: 'Trang', category: 'Nội dung', path: '/cms/static-pages', icon: FileText, keywords: ['trang tinh', 'static pages', 'pages', 'gioi thieu'] },
  { id: 'nav_leads', title: 'Yêu cầu khách hàng & Leads', subtitle: '/cms/contact-requests', moduleLabel: 'Khách hàng', category: 'Khách hàng', path: '/cms/contact-requests', icon: Inbox, keywords: ['lien he', 'leads', 'khach hang', 'contacts', 'bao gia'] },
  { id: 'nav_media', title: 'Thư viện Media & Tệp tin', subtitle: '/cms/media', moduleLabel: 'Media', category: 'Tài nguyên', path: '/cms/media', icon: ImageIcon, keywords: ['media', 'anh', 'tai lieu', 'assets', 'hinh anh'] },
  { id: 'nav_cta', title: 'Biểu mẫu & CTA Blocks', subtitle: '/cms/cta', moduleLabel: 'Tương tác', category: 'Chuyển đổi', path: '/cms/cta', icon: FormInput, keywords: ['cta', 'forms', 'bieu mau', 'banner'] },
  { id: 'nav_seo', title: 'Cấu hình SEO & Redirects', subtitle: '/cms/function-seo', moduleLabel: 'Hệ thống', category: 'Kỹ thuật', path: '/cms/function-seo', icon: Search, keywords: ['seo', 'redirect', 'sitemap', 'meta', 'the tag'] },
  { id: 'nav_users', title: 'Quản trị viên & Phân quyền', subtitle: '/cms/users', moduleLabel: 'Quản trị viên', category: 'Bảo mật', path: '/cms/users', icon: Users, keywords: ['users', 'nguoi dung', 'tai khoan', 'phan quyen', 'permissions'] },
  { id: 'nav_settings', title: 'Cấu hình Hệ thống & Email SMTP', subtitle: '/cms/settings', moduleLabel: 'Hệ thống', category: 'Kỹ thuật', path: '/cms/settings', icon: Settings, keywords: ['cai dat', 'he thong', 'smtp', 'settings', 'email'] },
  { id: 'nav_trash', title: 'Thùng rác & Khôi phục', subtitle: '/cms/trash', moduleLabel: 'Hệ thống', category: 'Bảo mật', path: '/cms/trash', icon: Trash2, keywords: ['thung rac', 'khoi phuc', 'trash', 'recycle', 'da xoa'] },
];

const MODULE_ICONS: Record<string, LucideIcon> = {
  products: Package,
  news: Newspaper,
  services: Sparkles,
  projects: Briefcase,
  events: Calendar,
  customer_requests: Inbox,
  static_pages: FileText,
  media: ImageIcon,
  forms_cta: FormInput,
  users_permissions: Users,
  command: Layers,
};

export interface DisplayItem {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  moduleLabel: string;
  category?: string;
  statusText?: string;
  statusColor?: string;
  icon: LucideIcon;
  isViewAll?: boolean;
}

interface CmsCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (path: string, label: string, itemData?: unknown) => void;
  userRole?: string;
  workspaceLocale?: CmsLocale;
  onViewAllResults?: (query: string, module?: string) => void;
  records?: CmsSearchRecord[];
}

export const CmsCommandPalette: React.FC<CmsCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  workspaceLocale = 'vi',
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [recentVisited, setRecentVisited] = useState<RecentVisitedItem[]>([]);
  const [serverResults, setServerResults] = useState<CmsQuickSearchResult[]>([]);
  const [isSearching, startSearchingTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches & visited on open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setRecentVisited(getRecentVisitedItems());
      setQuery('');
      setSelectedIndex(0);
      setServerResults([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Debounced server search when query length >= 2
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setServerResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startSearchingTransition(async () => {
        try {
          const results = await searchCmsQuickJumpAction(trimmed, workspaceLocale);
          setServerResults(results);
        } catch {
          setServerResults([]);
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [query, workspaceLocale]);

  // Client-side filtered navigation commands
  const filteredNavigation = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const norm = normalizeVietnamese(trimmed);
    const tokens = norm.split(/\s+/).filter(Boolean);
    return STATIC_NAVIGATION_COMMANDS.filter((cmd) => {
      const candidate = normalizeVietnamese(`${cmd.title} ${cmd.subtitle} ${cmd.keywords.join(' ')}`);
      return candidate.includes(norm) || tokens.every((token) => candidate.includes(token));
    });
  }, [query]);

  // Grouped results for rendering
  const groupedSections = useMemo(() => {
    const sections: Array<{ key: string; label: string; icon: LucideIcon; items: DisplayItem[] }> = [];

    // 1. Navigation matches
    if (filteredNavigation.length > 0) {
      sections.push({
        key: 'navigation',
        label: workspaceLocale === 'en' ? 'Quick Navigation' : 'Chức năng & Điều hướng',
        icon: Command,
        items: filteredNavigation.slice(0, 5).map((cmd) => ({
          id: cmd.id,
          title: cmd.title,
          subtitle: cmd.subtitle,
          path: cmd.path,
          moduleLabel: cmd.moduleLabel,
          category: cmd.category,
          icon: cmd.icon,
        })),
      });
    }

    // 2. Server entity results grouped by module
    if (serverResults.length > 0) {
      const moduleMap: Record<string, { label: string; icon: LucideIcon; items: DisplayItem[] }> = {
        products: { label: workspaceLocale === 'en' ? 'Products' : 'Sản phẩm', icon: Package, items: [] },
        news: { label: workspaceLocale === 'en' ? 'News & Articles' : 'Tin tức & Bài viết', icon: Newspaper, items: [] },
        services: { label: workspaceLocale === 'en' ? 'Services' : 'Dịch vụ', icon: Sparkles, items: [] },
        projects: { label: workspaceLocale === 'en' ? 'Projects' : 'Dự án tiêu biểu', icon: Briefcase, items: [] },
        customer_requests: { label: workspaceLocale === 'en' ? 'Customer Requests' : 'Khách hàng & Leads', icon: Inbox, items: [] },
        static_pages: { label: workspaceLocale === 'en' ? 'Content Pages' : 'Trang nội dung', icon: FileText, items: [] },
      };

      for (const res of serverResults) {
        const target = moduleMap[res.module];
        if (target) {
          target.items.push({
            id: res.id,
            title: res.title,
            subtitle: res.subtitle,
            path: res.path,
            moduleLabel: res.moduleLabel,
            statusText: res.statusText,
            statusColor: res.statusColor,
            icon: MODULE_ICONS[res.module] || FileText,
          });
        }
      }

      for (const [key, group] of Object.entries(moduleMap)) {
        if (group.items.length > 0) {
          sections.push({ key, label: group.label, icon: group.icon, items: group.items });
        }
      }
    }

    return sections;
  }, [filteredNavigation, serverResults, workspaceLocale]);

  // Flat list for keyboard navigation
  const flatSelectableItems = useMemo(() => {
    const list: DisplayItem[] = [];
    groupedSections.forEach((sec) => list.push(...sec.items));
    if (query.trim()) {
      list.push({
        id: 'view_all_action',
        title: workspaceLocale === 'en' ? `View all results for "${query}"` : `Xem tất cả kết quả cho "${query}" trong trang tìm kiếm`,
        subtitle: '/cms/search',
        path: `/cms/search?q=${encodeURIComponent(query.trim())}`,
        moduleLabel: 'Tìm kiếm nâng cao',
        icon: Search,
        isViewAll: true,
      });
    }
    return list;
  }, [groupedSections, query, workspaceLocale]);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleSelectItem = (item: DisplayItem) => {
    if (query.trim()) {
      saveRecentSearch(query);
    }
    if (!item.isViewAll) {
      saveRecentVisitedItem({
        id: item.id,
        title: item.title,
        moduleLabel: item.moduleLabel,
        path: item.path,
      });
    }
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

  const handleViewAll = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    onClose();
    if (onViewAllResults) {
      onViewAllResults(trimmed, 'all');
    } else {
      const targetPath = `/cms/search?q=${encodeURIComponent(trimmed)}`;
      onSelectAction(targetPath, `Tìm kiếm: "${trimmed}"`);
    }
  };

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
        handleSelectItem(flatSelectableItems[selectedIndex]);
      } else if (query.trim()) {
        handleViewAll();
      }
    }
  };

  const getStatusBadgeClass = (color?: string) => {
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

  let globalIndexCounter = 0;

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
            {isSearching ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Search className="w-4.5 h-4.5" />}
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={workspaceLocale === 'en' ? 'Search products, news, services, leads, navigation...' : 'Tìm kiếm sản phẩm, tin tức, dịch vụ, khách hàng, điều hướng...'}
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
          {/* EMPTY QUERY: RECENT & POPULAR SHORTCUTS */}
          {!query.trim() && (
            <div className="space-y-4 p-1">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {workspaceLocale === 'en' ? 'Recent Searches' : 'Tìm kiếm gần đây'}
                    </span>
                    <button
                      onClick={handleClearAllRecent}
                      className="text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {workspaceLocale === 'en' ? 'Clear history' : 'Xóa lịch sử'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectRecentSearch(s.query)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-500 dark:hover:bg-orange-600 text-slate-900 dark:text-slate-200 hover:text-white dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer group"
                      >
                        <Search className="w-3 h-3 text-slate-400 group-hover:text-white" />
                        <span>{s.query}</span>
                        <span
                          onClick={(e) => handleRemoveRecentSearch(e, s.query)}
                          className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 group-hover:text-white"
                        >
                          <X className="w-2.5 h-2.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Visited */}
              {recentVisited.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="px-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {workspaceLocale === 'en' ? 'Recently Visited' : 'Đã truy cập gần đây'}
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

              {/* Popular Navigation Shortcuts */}
              <div className="space-y-2 pt-2">
                <div className="px-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Command className="w-3.5 h-3.5 text-orange-500" />
                    {workspaceLocale === 'en' ? 'Common Navigation' : 'Chức năng thường dùng'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { label: 'Quản lý Sản phẩm', sub: 'Danh sách phần mềm & thiết bị', path: '/cms/products', icon: Package },
                    { label: 'Tin tức & Bài viết', sub: 'Biên tập bài viết chuyển giao', path: '/cms/news', icon: Newspaper },
                    { label: 'Dự án tiêu biểu', sub: 'Quản lý hồ sơ công trình & đối tác', path: '/cms/projects', icon: Briefcase },
                    { label: 'Yêu cầu từ khách hàng', sub: 'Leads tư vấn & Báo giá', path: '/cms/contact-requests', icon: Inbox },
                    { label: 'Hãng sản xuất', sub: 'Quản lý thương hiệu đối tác', path: '/cms/products/brands', icon: Building2 },
                    { label: 'Cấu hình SEO & URL', sub: 'Canonical, redirects và sitemap', path: '/cms/function-seo', icon: Search },
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

          {/* HAS QUERY: GROUPED RESULTS */}
          {query.trim() && (
            <div className="space-y-4 pt-1">
              {groupedSections.length > 0 ? (
                groupedSections.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.key} className="space-y-1.5 pt-2 first:pt-0">
                      {/* Group Header */}
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <GroupIcon className="w-3.5 h-3.5 text-orange-500" />
                          {group.label}
                          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {group.items.length}
                          </span>
                        </span>
                      </div>

                      {/* Group Item List */}
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const thisIndex = globalIndexCounter++;
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
                                      ? 'bg-orange-500 text-white shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-orange-600'
                                  }`}
                                >
                                  <ItemIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold truncate">
                                      {highlightText(item.title, query)}
                                    </span>
                                    {item.statusText && (
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(
                                          item.statusColor
                                        )}`}
                                      >
                                        {item.statusText}
                                      </span>
                                    )}
                                  </div>
                                  {item.subtitle && (
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                      {highlightText(item.subtitle, query)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2 mt-1">
                                <span className="text-[10px] text-slate-400 hidden sm:inline">
                                  {item.moduleLabel}
                                </span>
                                <ArrowRight
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    isSelected
                                      ? 'text-orange-600 dark:text-orange-400 translate-x-0.5'
                                      : 'text-slate-400 opacity-0 group-hover:opacity-100'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : isSearching ? (
                <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Đang tìm kiếm dữ liệu...</span>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <Search className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Không tìm thấy kết quả nào cho &quot;{query}&quot;
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Thử tìm với từ khóa ngắn hơn, không dấu hoặc xem trong trang tìm kiếm nâng cao.
                  </p>
                </div>
              )}

              {/* View all in advanced search link */}
              {query.trim() && (
                <div className="pt-2">
                  {(() => {
                    const thisIndex = globalIndexCounter++;
                    const isSelected = selectedIndex === thisIndex;
                    return (
                      <button
                        data-active={isSelected ? 'true' : undefined}
                        onClick={handleViewAll}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                            : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-orange-500" />
                          <span>Xem tất cả kết quả cho &quot;{query}&quot; trong trang tìm kiếm</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Shortcuts Guide */}
        <div className="px-3 sm:px-4 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                ↓
              </kbd>
              <span className="hidden sm:inline">Di chuyển</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs flex items-center">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </kbd>
              <span className="hidden sm:inline">Chọn</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                ESC
              </kbd>
              <span className="hidden sm:inline">Đóng</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <Command className="w-3 h-3 text-orange-500" />
            <span>CIC Command Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
