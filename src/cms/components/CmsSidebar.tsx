import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard,
  UserCheck,
  ShieldAlert,
  History,
  FileText,
  Newspaper,
  Image as ImageIcon,
  Sliders,
  Grid,
  FolderOpen,
  Video,
  Calendar,
  FolderTree,
  Package,
  Building2,
  Layers,
  Filter,
  Cpu,
  UserCog,
  FileCheck,
  MailCheck,
  MapPin,
  Map,
  Navigation,
  Building,
  MessageSquare,
  Headphones,
  Users,
  Settings,
  Globe,
  Sparkles,
  TrendingUp,
  ExternalLink,
  PhoneCall,
  ListOrdered,
  Menu,
  Command,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  RotateCcw,
  Inbox,
  MousePointer2,
  FileCheck2,
  MessageSquareText,
  User,
  KeyRound,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { CmsMenuGroup, CmsUser } from '../types';
import { useCmsWorkspaceLocale } from '../context/CmsWorkspaceLocaleContext';
import { getCmsDictionary } from '../i18n/cmsDictionary';

interface CmsSidebarProps {
  isCollapsed: boolean;
  menuGroups: CmsMenuGroup[];
  onToggleCollapse: () => void;
  activePath: string;
  onSelectMenu: (path: string, title: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  user?: CmsUser;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenMyAccount?: () => void;
  onOpenChangePassword?: () => void;
  onSwitchToWebsite?: () => void;
  onLogout?: () => void;
}

const renderIcon = (iconName: string, className: string = 'w-4 h-4') => {
  switch (iconName) {
    case 'LayoutDashboard': return <LayoutDashboard className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'History': return <History className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Newspaper': return <Newspaper className={className} />;
    case 'Image': return <ImageIcon className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'Grid': return <Grid className={className} />;
    case 'FolderImage': return <FolderOpen className={className} />;
    case 'Video': return <Video className={className} />;
    case 'CalendarEvent': return <Calendar className={className} />;
    case 'FolderTree': return <FolderTree className={className} />;
    case 'Package': return <Package className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Filter': return <Filter className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'UserTie': return <UserCog className={className} />;
    case 'FileCheck': return <FileCheck className={className} />;
    case 'MailCheck': return <MailCheck className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Map': return <Map className={className} />;
    case 'Navigation': return <Navigation className={className} />;
    case 'Building': return <Building className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Settings': return <Settings className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'ExternalLink': return <ExternalLink className={className} />;
    case 'PhoneCall': return <PhoneCall className={className} />;
    case 'ListOrdered': return <ListOrdered className={className} />;
    case 'Menu': return <Menu className={className} />;
    case 'Command': return <Command className={className} />;
    case 'RotateCcw': return <RotateCcw className={className} />;
    case 'Inbox': return <Inbox className={className} />;
    case 'MousePointer2': return <MousePointer2 className={className} />;
    case 'FileCheck2': return <FileCheck2 className={className} />;
    case 'MessageSquareText': return <MessageSquareText className={className} />;
    default: return <FileText className={className} />;
  }
};

export const CmsSidebar: React.FC<CmsSidebarProps> = ({
  isCollapsed,
  menuGroups,
  onToggleCollapse,
  activePath,
  onSelectMenu,
  isMobileOpen,
  onCloseMobile,
  user,
  isDarkMode = false,
  onToggleTheme,
  onOpenMyAccount,
  onOpenChangePassword,
  onSwitchToWebsite,
  onLogout,
}) => {
  const workspaceLocale = useCmsWorkspaceLocale();
  const dict = getCmsDictionary(workspaceLocale);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>(() =>
    menuGroups.map((group) => group.id)
  );

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'superadmin':
        return workspaceLocale === 'en' ? 'Super Administrator' : 'Quản trị viên cấp cao';
      case 'admin':
        return workspaceLocale === 'en' ? 'Administrator' : 'Quản trị viên';
      case 'editor':
        return workspaceLocale === 'en' ? 'Editor' : 'Biên tập viên';
      case 'viewer':
        return workspaceLocale === 'en' ? 'Viewer' : 'Người xem';
      default:
        return workspaceLocale === 'en' ? 'Administrator' : 'Quản trị viên';
    }
  };

  // Nested sub-item expand state
  const [expandedSubItemIds, setExpandedSubItemIds] = useState<string[]>([
    'menu_products_group',
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [collapsedMenuTooltip, setCollapsedMenuTooltip] = useState<{
    id: string;
    title: string;
    badgeCount?: number;
    top: number;
    left: number;
  } | null>(null);

  const showCollapsedMenuTooltip = (
    item: CmsMenuGroup['items'][number],
    target: HTMLElement
  ) => {
    if (!isCollapsed) return;
    const rect = target.getBoundingClientRect();
    const itemTitle = dict.menu.items[item.id] || item.title;
    setCollapsedMenuTooltip({
      id: item.id,
      title: itemTitle,
      badgeCount: item.badgeCount,
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) return;
    setExpandedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const toggleSubItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) return;
    setExpandedSubItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const getBadgeStyle = (variant?: 'danger' | 'warning' | 'info') => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'info':
      default:
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Sidebar Header & Search */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex-1 mr-2 relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={dict.sidebar.filterPlaceholder}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[13px] leading-5 rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>
        ) : (
          <div className="mx-auto text-[11px] font-bold text-orange-600 dark:text-orange-400 tracking-wider">
            MENU
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isCollapsed ? dict.sidebar.expandTitle : dict.sidebar.collapseTitle}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
        {/* GROUPS LIST */}
        {menuGroups.map((group) => {
          const isGroupOpen = expandedGroupIds.includes(group.id);

          // Filter items based on search keyword (parent or sub-item match)
          const filteredItems = group.items.filter((item) => {
            if (!searchKeyword) return true;
            const kw = searchKeyword.toLowerCase();
            const parentMatch = item.title.toLowerCase().includes(kw);
            const childMatch = item.children?.some((child) => child.title.toLowerCase().includes(kw));
            return parentMatch || childMatch;
          });

          if (searchKeyword && filteredItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Title Header */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full px-2 py-1 text-left text-[11px] font-semibold leading-4 text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center justify-between hover:text-slate-500 dark:hover:text-slate-400 transition-colors group cursor-pointer"
                >
                  <span className="truncate">{dict.menu.groups[group.id] || group.groupTitle}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isGroupOpen ? 'transform rotate-0' : 'transform -rotate-90'
                    }`}
                  />
                </button>
              ) : (
                <div className="w-full border-t border-slate-200 dark:border-slate-800 my-2" />
              )}

              {/* Group Items */}
              {(isGroupOpen || isCollapsed || searchKeyword) && (
                <div className="space-y-0.5">
                  {(searchKeyword ? filteredItems : group.items).map((item) => {
                    const hasChildren = !!item.children && item.children.length > 0;
                    const isSubExpanded = expandedSubItemIds.includes(item.id) || !!searchKeyword;

                    // Check if parent or any child is active
                    const isParentActive = activePath === item.path;
                    const isChildActive = item.children?.some((child) => activePath === child.path);
                    const isActive = isParentActive || isChildActive;

                    return (
                      <div
                        key={item.id}
                        className="relative group"
                        onMouseEnter={(event) => showCollapsedMenuTooltip(item, event.currentTarget)}
                        onMouseLeave={() => setCollapsedMenuTooltip(null)}
                        onFocus={(event) => showCollapsedMenuTooltip(item, event.currentTarget)}
                        onBlur={() => setCollapsedMenuTooltip(null)}
                      >
                        <div
                          className={`w-full px-2.5 py-2 rounded-lg text-[13px] font-medium leading-5 transition-all flex items-center gap-2.5 ${
                            isActive
                              ? 'bg-orange-600 text-white shadow-xs font-semibold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                          } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        >
                          <a
                            href={item.path || '#'}
                            aria-describedby={isCollapsed ? `collapsed-menu-tooltip-${item.id}` : undefined}
                            onClick={(event) => {
                              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                              event.preventDefault();
                              if (hasChildren && !isCollapsed) {
                                setExpandedSubItemIds((prev) =>
                                  prev.includes(item.id)
                                    ? prev.filter((id) => id !== item.id)
                                    : [...prev, item.id]
                                );
                              }
                              if (item.path) {
                                onSelectMenu(item.path, item.title);
                                if (isMobileOpen) onCloseMobile();
                              }
                            }}
                            className="flex-1 flex items-center gap-2.5 text-left min-w-0 bg-transparent border-0 p-0 cursor-pointer"
                          >
                            <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                              {renderIcon(item.iconName, 'w-4 h-4')}
                            </span>

                            {!isCollapsed && (
                              <span className="truncate flex-1 text-left">{dict.menu.items[item.id] || item.title}</span>
                            )}

                            {!isCollapsed && item.badgeCount !== undefined && (
                              <span
                                className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full border ${getBadgeStyle(
                                  item.badgeVariant
                                )} ${isActive ? 'bg-white/20 text-white border-transparent' : ''}`}
                              >
                                {item.badgeCount}
                              </span>
                            )}
                          </a>

                          {/* Nested Sub-Menu Toggle Arrow */}
                          {!isCollapsed && hasChildren && (
                            <button
                              type="button"
                              onClick={(e) => toggleSubItem(item.id, e)}
                              className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                              title={isSubExpanded ? (workspaceLocale === 'en' ? 'Collapse' : 'Thu gọn') : (workspaceLocale === 'en' ? 'Expand' : 'Mở rộng')}
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isSubExpanded ? 'rotate-180' : 'rotate-0'
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Expanded Sub-items List */}
                        {!isCollapsed && hasChildren && isSubExpanded && (
                          <div className="ml-6 pl-2.5 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {item.children
                              ?.filter(
                                (child) =>
                                  !searchKeyword ||
                                  child.title.toLowerCase().includes(searchKeyword.toLowerCase())
                              )
                              .map((child) => {
                                const isSubActive = activePath === child.path;
                                return (
                                  <a
                                    key={child.id}
                                    href={child.path}
                                    onClick={(event) => {
                                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                                      event.preventDefault();
                                      onSelectMenu(child.path, child.title);
                                      if (isMobileOpen) onCloseMobile();
                                    }}
                                    className={`w-full px-2 py-1.5 rounded-md text-xs transition-all flex items-center justify-between cursor-pointer ${
                                      isSubActive
                                        ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border-l-2 border-orange-500 pl-2'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                    }`}
                                  >
                                    <span className="truncate">{dict.menu.items[child.id] || child.title}</span>
                                    {child.badgeCount && (
                                      <span className="px-1.5 py-0.2 bg-orange-500/10 text-orange-600 text-[10px] font-bold rounded">
                                        {child.badgeCount}
                                      </span>
                                    )}
                                  </a>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer User Account Menu */}
      <div className="relative p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`w-full flex items-center rounded-xl p-1.5 transition-all text-left cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 ${
            isCollapsed ? 'justify-center px-0' : 'gap-2.5'
          }`}
          title={user?.full_name || 'Tài khoản quản trị'}
          aria-label="Tùy chọn tài khoản quản trị"
        >
          <div className="relative shrink-0">
            <img
              src={user?.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.full_name || 'Admin'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                {user?.full_name || 'Super Admin'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                {getRoleDisplayName(user?.role)}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* Popover Account Menu */}
        {isUserMenuOpen && (
          <div
            className={`absolute bottom-full mb-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 rounded-2xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed ? 'left-full ml-3 w-64' : 'left-2 right-2 w-auto'
            }`}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            {/* Header Info Block */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-start gap-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-t-2xl">
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={user?.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.full_name || 'Admin'}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-xs truncate leading-snug">
                  {user?.full_name || 'Super Admin'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate leading-snug">
                  {user?.email || 'admin@cic.com.vn'}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60">
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="py-1 px-1 space-y-0.5">
              {onOpenMyAccount && (
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenMyAccount();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{workspaceLocale === 'en' ? 'My Profile' : 'Hồ sơ cá nhân'}</span>
                </button>
              )}
              {onOpenChangePassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenChangePassword();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{workspaceLocale === 'en' ? 'Change Password' : 'Đổi mật khẩu'}</span>
                </button>
              )}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleTheme();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg flex items-center justify-between cursor-pointer font-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isDarkMode ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    )}
                    <span>{isDarkMode ? (workspaceLocale === 'en' ? 'Light Mode' : 'Giao diện sáng') : (workspaceLocale === 'en' ? 'Dark Mode' : 'Giao diện tối')}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {isDarkMode ? 'Dark' : 'Light'}
                  </span>
                </button>
              )}
            </div>

            {/* View Website */}
            {onSwitchToWebsite && (
              <div className="py-1 px-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onSwitchToWebsite();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg flex items-center justify-between cursor-pointer font-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>{workspaceLocale === 'en' ? 'Visit Public Site' : 'Xem Website'}</span>
                  </div>
                  <span className="text-[10px] text-orange-500 font-semibold">↗</span>
                </button>
              </div>
            )}

            {/* Logout */}
            {onLogout && (
              <div className="pt-1 pb-0.5 px-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{workspaceLocale === 'en' ? 'Sign Out' : 'Đăng xuất'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-15 bottom-0 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-18' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {isCollapsed && collapsedMenuTooltip && typeof document !== 'undefined' &&
        createPortal(
          <div
            id={`collapsed-menu-tooltip-${collapsedMenuTooltip.id}`}
            role="tooltip"
            className="pointer-events-none fixed z-[70] -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg dark:bg-slate-700"
            style={{ top: collapsedMenuTooltip.top, left: collapsedMenuTooltip.left }}
          >
            {collapsedMenuTooltip.title}
            {collapsedMenuTooltip.badgeCount !== undefined && (
              <span className="ml-2 text-orange-300">{collapsedMenuTooltip.badgeCount}</span>
            )}
          </div>,
          document.body
        )}
    </>
  );
};
