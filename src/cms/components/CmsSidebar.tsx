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
} from 'lucide-react';
import { CmsMenuGroup, CmsMenuItem } from '../types';
import { cmsMenuGroupsMock } from '../data/mockCmsData';

interface CmsSidebarProps {
  isCollapsed: boolean;
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
    default: return <FileText className={className} />;
  }
};

export const CmsSidebar: React.FC<CmsSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activePath,
  onSelectMenu,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [menuGroups] = useState<CmsMenuGroup[]>(cmsMenuGroupsMock);
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([
    'grp_tong_quan',
    'grp_noi_dung',
    'grp_san_pham',
    'grp_dia_diem',
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) return; // Ignore accordion toggle if collapsed
    setExpandedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
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
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Sidebar Header & Search */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex-1 mr-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Lọc menu..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>
        ) : (
          <div className="mx-auto text-xs font-bold text-orange-600 dark:text-orange-400">
            MENU
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
        {menuGroups.map((group) => {
          const hasMultipleItems = group.items.length > 1;
          const isGroupOpen = expandedGroupIds.includes(group.id);
          const filteredItems = group.items.filter((item) =>
            item.title.toLowerCase().includes(searchKeyword.toLowerCase())
          );

          if (searchKeyword && filteredItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Title Header */}
              {!isCollapsed ? (
                hasMultipleItems ? (
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
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                    {group.groupTitle}
                  </div>
                )
              ) : (
                <div className="w-full border-t border-slate-200 dark:border-slate-800 my-2" />
              )}

              {/* Group Items */}
              {(isGroupOpen || !hasMultipleItems || isCollapsed || searchKeyword) && (
                <div className="space-y-0.5">
                  {(searchKeyword ? filteredItems : group.items).map((item) => {
                    const isActive = activePath === item.path;

                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => {
                            if (item.path) {
                              onSelectMenu(item.path, item.title);
                              if (isMobileOpen) onCloseMobile();
                            }
                          }}
                          className={`w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                            isActive
                              ? 'bg-orange-600 text-white shadow-xs font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                          } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        >
                          <span
                            className={
                              isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                            }
                          >
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

                        {/* Hover Tooltip when Collapsed */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700">
                            {item.title}
                            {item.badgeCount && (
                              <span className="ml-1.5 text-orange-400 font-bold">
                                ({item.badgeCount})
                              </span>
                            )}
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
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>Tài khoản: Super Admin</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Trạng thái hệ thống online" />
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
