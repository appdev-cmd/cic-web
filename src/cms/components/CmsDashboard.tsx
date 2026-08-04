import React, { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

import { CmsHeader } from './CmsHeader';
import { CmsSidebar } from './CmsSidebar';
import { CmsBreadcrumb } from './CmsBreadcrumb';
import { CmsFooter } from './CmsFooter';
import { CmsCommandPalette } from './CmsCommandPalette';
import { CmsRightDrawer, DrawerItem } from './CmsRightDrawer';

import {
  currentUserMock,
  contactMessagesMock,
  productRegistrationsMock,
  pendingContentsMock,
} from '../data/mockCmsData';

import { ContactMessage, ProductRegistration, PendingContent } from '../types';
import { CicUsersManager } from '../modules/cic_users/CicUsersManager';
import { PermissionManagement } from '../modules/permission_management/PermissionManagement';
import { SystemConfiguration } from '../modules/system_configuration/SystemConfiguration';
import { ActivityLogsManager } from '../modules/activity_logs_trash/ActivityLogsManager';
import { TrashManager } from '../modules/activity_logs_trash/TrashManager';
import { StaticPagesManager } from '../modules/static_pages/StaticPagesManager';
import { NewsManager } from '../modules/news/NewsManager';
import { EventsManager } from '../modules/events/EventsManager';
import { EmailTemplatesManager } from '../modules/email_templates/EmailTemplatesManager';
import { BannersManager } from '../modules/banners/BannersManager';
import { ProductsManager } from '../modules/products/ProductsManager';
import { ProductSettingsManager } from '../modules/product_settings/ProductSettingsManager';
import { ServicesManager } from '../modules/services/ServicesManager';
import { MenuManager } from '../modules/menu/MenuManager';
import { ContentBlocksManager } from '../modules/content_blocks/ContentBlocksManager';
import { MediaManager } from '../modules/media/MediaManager';
import { ContactsManager } from '../modules/contacts/ContactsManager';
import { LocalizationManager } from '../modules/localization/LocalizationManager';
import { DashboardOverview } from '../modules/dashboard/DashboardOverview';

interface CmsDashboardProps {
  onSwitchToWebsite?: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ onSwitchToWebsite }) => {
  // Theme & Layout States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'VI' | 'EN'>('VI');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/cms/dashboard');
  const [currentPageTitle, setCurrentPageTitle] = useState('Tổng quan CMS');

  // Command Palette & Right Drawer
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<DrawerItem | null>(null);

  // Filter & Data States
  const [trafficRange, setTrafficRange] = useState<'7' | '30'>('7');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lists state
  const [contacts, setContacts] = useState<ContactMessage[]>(contactMessagesMock);
  const [registrations, setRegistrations] = useState<ProductRegistration[]>(productRegistrationsMock);
  const [pendingItems, setPendingItems] = useState<PendingContent[]>(pendingContentsMock);

  // Status updates handler
  const handleUpdateStatus = (type: string, id: string, newStatus: string) => {
    if (type === 'contact') {
      setContacts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'completed' } : item))
      );
    } else if (type === 'registration') {
      setRegistrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'quoted' } : item))
      );
    } else if (type === 'pending') {
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
    }
    setToastMessage(`Đã cập nhật trạng thái dữ liệu sang "${newStatus}"!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. HEADER */}
      <CmsHeader
        user={currentUserMock}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'VI' ? 'EN' : 'VI')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onQuickAction={(type) => {
          setToastMessage(`Đã mở giao diện tạo mới ${type.toUpperCase()}`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onSwitchToWebsite={onSwitchToWebsite}
      />

      {/* 2. SIDEBAR */}
      <CmsSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activePath={activePath}
        onSelectMenu={(path, title) => {
          setActivePath(path);
          setCurrentPageTitle(title);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`transition-all duration-300 pt-4 px-4 sm:px-6 lg:px-8 pb-12 ${
          isSidebarCollapsed ? 'lg:ml-18' : 'lg:ml-60'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Toast Notification with Undo */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-2 text-orange-400 hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ẩn</span>
              </button>
            </div>
          )}

          {/* Breadcrumb & Page Title */}
          <CmsBreadcrumb
            items={activePath === '/cms/dashboard' || activePath === '/cms' ? [{ label: 'Tổng quan' }] : [{ label: 'Tổng quan' }, { label: currentPageTitle }]}
            pageTitle={currentPageTitle}
            hideHeaderBar
          />

          {activePath === '/cms/users' || activePath === '/cms/accounts' || activePath === '/cms/user-management' || activePath.startsWith('/cms/user') ? (
            <CicUsersManager />
          ) : activePath === '/cms/permissions' ? (
            <PermissionManagement />
          ) : activePath === '/cms/settings' || activePath === '/cms/system-settings' || activePath.startsWith('/cms/settings') ? (
            <SystemConfiguration />
          ) : activePath === '/cms/history' || activePath === '/cms/logs' || activePath === '/cms/activity-logs' || activePath === '/cms/audit' ? (
            <ActivityLogsManager />
          ) : activePath === '/cms/trash' || activePath === '/cms/recycle-bin' ? (
            <TrashManager />
          ) : activePath === '/cms/static-pages' || activePath === '/cms/pages' ? (
            <StaticPagesManager />
          ) : activePath === '/cms/news' || activePath === '/cms/articles' ? (
            <NewsManager />
          ) : activePath === '/cms/events' ? (
            <EventsManager />
          ) : activePath === '/cms/email-templates' ? (
            <EmailTemplatesManager />
          ) : activePath === '/cms/slideshows' || activePath === '/cms/banners' || activePath.startsWith('/cms/banners') ? (
            <BannersManager />
          ) : activePath === '/cms/product-settings' || activePath === '/cms/products/settings' || activePath === '/cms/product-categories' || activePath === '/cms/manufacturers' || activePath === '/cms/applications' || activePath === '/cms/product-types' || activePath === '/cms/sales-staff' || activePath === '/cms/products/categories' || activePath === '/cms/products/brands' || activePath === '/cms/products/routing' ? (
            <ProductSettingsManager />
          ) : activePath === '/cms/products' || activePath === '/cms/products/catalog' || activePath === '/cms/catalog' ? (
            <ProductsManager />
          ) : activePath === '/cms/services' || activePath.startsWith('/cms/services') ? (
            <ServicesManager />
          ) : activePath === '/cms/menu' || activePath === '/cms/frontend-menus' || activePath === '/cms/navigation' || activePath.startsWith('/cms/menu') ? (
            <MenuManager />
          ) : activePath === '/cms/home-blocks' || activePath === '/cms/content-blocks' || activePath === '/cms/blocks' || activePath.startsWith('/cms/content-blocks') || activePath.startsWith('/cms/home-blocks') ? (
            <ContentBlocksManager />
          ) : activePath === '/cms/media' || activePath === '/cms/media-library' || activePath === '/cms/albums' || activePath.startsWith('/cms/media') ? (
            <MediaManager />
          ) : activePath === '/cms/contact-requests' || activePath === '/cms/contact-messages' || activePath === '/cms/product-registrations' || activePath === '/cms/contacts' || activePath === '/cms/customers' || activePath.startsWith('/cms/contact') ? (
            <ContactsManager />
          ) : activePath === '/cms/translation-progress' || activePath === '/cms/translation-strings' || activePath === '/cms/localization' || activePath === '/cms/translations' || activePath.startsWith('/cms/translation') || activePath.startsWith('/cms/localization') ? (
            <LocalizationManager />
          ) : (
            <DashboardOverview
              lang={lang}
              onNavigate={(path, title) => {
                setActivePath(path);
                setCurrentPageTitle(title);
              }}
              onOpenDrawerItem={(type, data) => setDrawerItem({ type, data })}
            />
          )}
        </div>

        {/* 9. FOOTER */}
        <CmsFooter />
      </div>

      {/* COMMAND PALETTE MODAL */}
      <CmsCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(path, label) => {
          setActivePath(path);
          setCurrentPageTitle(label);
          setToastMessage(`Đã chuyển sang: ${label}`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      {/* RIGHT DETAIL DRAWER */}
      <CmsRightDrawer
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
