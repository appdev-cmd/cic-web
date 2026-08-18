import React, { useState } from 'react';
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
} from 'lucide-react';
import { CmsMenuGroup } from '../types';

interface CmsSidebarProps {
  isCollapsed: boolean;
  menuGroups: CmsMenuGroup[];
  onToggleCollapse: () => void;
  activePath: string;
  onSelectMenu: (path: string, title: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
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
}) => {
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>(() =>
    menuGroups.map((group) => group.id)
  );

  // Nested sub-item expand state
  const [expandedSubItemIds, setExpandedSubItemIds] = useState<string[]>([
    'menu_products_group',
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');

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
              placeholder="Lọc menu..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
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
          title={isCollapsed ? 'Mở rộng sidebar (248px)' : 'Thu gọn sidebar (72px)'}
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
                  className="w-full px-2 py-1 text-left text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between hover:text-slate-700 dark:hover:text-slate-300 transition-colors group cursor-pointer"
                >
                  <span className="truncate">{group.groupTitle}</span>
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
                      <div key={item.id} className="relative group">
                        <div
                          className={`w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 ${
                            isActive
                              ? 'bg-orange-600 text-white shadow-xs font-semibold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                          } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        >
                          <button
                            type="button"
                            onClick={() => {
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
                              <span className="truncate flex-1 text-left">{item.title}</span>
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
                          </button>

                          {/* Nested Sub-Menu Toggle Arrow */}
                          {!isCollapsed && hasChildren && (
                            <button
                              type="button"
                              onClick={(e) => toggleSubItem(item.id, e)}
                              className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                              title={isSubExpanded ? 'Thu gọn' : 'Mở rộng'}
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isSubExpanded ? 'rotate-180' : 'rotate-0'
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Collapsed Tooltip or Flyout Submenu */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700 min-w-40 space-y-1">
                            <div className="font-bold border-b border-slate-700 pb-1 flex items-center justify-between">
                              <span>{item.title}</span>
                              {item.badgeCount && (
                                <span className="text-orange-400 font-bold ml-2">({item.badgeCount})</span>
                              )}
                            </div>
                            {hasChildren && (
                              <div className="pt-1 space-y-1">
                                {item.children?.map((child) => (
                                  <div
                                    key={child.id}
                                    onClick={() => {
                                      onSelectMenu(child.path, child.title);
                                      if (isMobileOpen) onCloseMobile();
                                    }}
                                    className={`px-2 py-1 rounded text-[11px] cursor-pointer hover:bg-orange-600 hover:text-white ${
                                      activePath === child.path ? 'text-orange-400 font-bold' : 'text-slate-300'
                                    }`}
                                  >
                                    • {child.title}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

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
                                  <button
                                    key={child.id}
                                    onClick={() => {
                                      onSelectMenu(child.path, child.title);
                                      if (isMobileOpen) onCloseMobile();
                                    }}
                                    className={`w-full px-2 py-1.5 rounded-md text-xs transition-all flex items-center justify-between cursor-pointer ${
                                      isSubActive
                                        ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border-l-2 border-orange-500 pl-2'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                    }`}
                                  >
                                    <span className="truncate">{child.title}</span>
                                    {child.badgeCount && (
                                      <span className="px-1.5 py-0.2 bg-orange-500/10 text-orange-600 text-[10px] font-bold rounded">
                                        {child.badgeCount}
                                      </span>
                                    )}
                                  </button>
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

      {/* Sidebar Footer Info */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Super Admin</span>
            <span className="text-[10px] text-slate-400">Hệ thống quản trị nội dung</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500" title="Trạng thái hệ thống online" />
        </div>
      ) : (
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500" title="Online" />
        </div>
      )}
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
    </>
  );
};
