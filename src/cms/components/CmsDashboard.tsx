import React, { lazy, Suspense, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

import { CmsHeader } from './CmsHeader';
import { CmsSidebar } from './CmsSidebar';
import { CmsBreadcrumb } from './CmsBreadcrumb';
import { CmsFooter } from './CmsFooter';
import { CmsCommandPalette } from './CmsCommandPalette';
import { CmsRightDrawer, DrawerItem } from './CmsRightDrawer';

import { ContactMessage, ProductRegistration, PendingContent } from '../types';
import { resolveCmsModule } from '../routing';
import { demoCmsDataSource } from '../data/demoCmsDataSource';
import type { CmsLocale } from '../data/CmsDataSource';

const CicUsersManager = lazy(() => import('../modules/cic_users/CicUsersManager').then((module) => ({ default: module.CicUsersManager })));
const PermissionManagement = lazy(() => import('../modules/permission_management/PermissionManagement').then((module) => ({ default: module.PermissionManagement })));
const SystemConfiguration = lazy(() => import('../modules/system_configuration/SystemConfiguration').then((module) => ({ default: module.SystemConfiguration })));
const ActivityLogsManager = lazy(() => import('../modules/activity_logs_trash/ActivityLogsManager').then((module) => ({ default: module.ActivityLogsManager })));
const TrashManager = lazy(() => import('../modules/activity_logs_trash/TrashManager').then((module) => ({ default: module.TrashManager })));
const StaticPagesManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/static_pages/StaticPagesManager'),
    import('../data/demoEditorialContentDataSource'),
  ]);

  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.StaticPagesManager
        workspaceLocale={workspaceLocale}
        data={dataModule.demoEditorialContentDataSource.staticPagesByLocale[workspaceLocale]}
      />
    ),
  };
});
const NewsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/news/NewsManager'),
    import('../data/demoEditorialContentDataSource'),
  ]);

  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.NewsManager
        workspaceLocale={workspaceLocale}
        data={dataModule.demoEditorialContentDataSource.newsByLocale[workspaceLocale]}
      />
    ),
  };
});
const EventsManager = lazy(() => import('../modules/events/EventsManager').then((module) => ({ default: module.EventsManager })));
const EmailTemplatesManager = lazy(() => import('../modules/email_templates/EmailTemplatesManager').then((module) => ({ default: module.EmailTemplatesManager })));
const BannersManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/banners/BannersManager'), import('../data/demoPresentationDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.BannersManager workspaceLocale={workspaceLocale} data={dataModule.demoPresentationDataSource.bannersByLocale[workspaceLocale]} />
  ) };
});
const ProductSettingsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/product_settings/ProductSettingsManager'),
    import('../data/demoCatalogDataSource'),
  ]);

  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.ProductSettingsManager
        workspaceLocale={workspaceLocale}
        data={dataModule.demoCatalogDataSource.productSettingsByLocale[workspaceLocale]}
      />
    ),
  };
});
const ProductsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/products/ProductsManager'),
    import('../data/demoCatalogDataSource'),
  ]);

  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.ProductsManager
        workspaceLocale={workspaceLocale}
        data={dataModule.demoCatalogDataSource.productsByLocale[workspaceLocale]}
      />
    ),
  };
});
const ServicesManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/services/ServicesManager'),
    import('../data/demoEditorialContentDataSource'),
  ]);

  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.ServicesManager
        workspaceLocale={workspaceLocale}
        data={dataModule.demoEditorialContentDataSource.servicesByLocale[workspaceLocale]}
      />
    ),
  };
});
const MenuManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/menu/MenuManager'), import('../data/demoPresentationDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.MenuManager workspaceLocale={workspaceLocale} data={dataModule.demoPresentationDataSource.menuByLocale[workspaceLocale]} />
  ) };
});
const ContentBlocksManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/content_blocks/ContentBlocksManager'), import('../data/demoPresentationDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.ContentBlocksManager workspaceLocale={workspaceLocale} data={dataModule.demoPresentationDataSource.contentBlocksByLocale[workspaceLocale]} />
  ) };
});
const MediaManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/media/MediaManager'), import('../data/demoMediaDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.MediaManager workspaceLocale={workspaceLocale} data={dataModule.demoMediaDataSource.sharedLibrary} />
  ) };
});
const ContactsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/contacts/ContactsManager'), import('../data/demoContactsDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.ContactsManager workspaceLocale={workspaceLocale} data={dataModule.demoContactsDataSource.operations} />
  ) };
});
const LocalizationManager = lazy(() => import('../modules/localization/LocalizationManager').then((module) => ({ default: module.LocalizationManager })));
const DashboardOverview = lazy(() => import('../modules/dashboard/DashboardOverview').then((module) => ({ default: module.DashboardOverview })));

interface CmsDashboardProps {
  onSwitchToWebsite?: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ onSwitchToWebsite }) => {
  // Theme & Layout States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [workspaceLocale, setWorkspaceLocale] = useState<CmsLocale>('vi');
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
  const dashboardData = demoCmsDataSource.dashboardByLocale[workspaceLocale];
  const [contacts, setContacts] = useState<ContactMessage[]>(demoCmsDataSource.dashboardByLocale.vi?.contacts ?? []);
  const [registrations, setRegistrations] = useState<ProductRegistration[]>(demoCmsDataSource.dashboardByLocale.vi?.productRegistrations ?? []);
  const [pendingItems, setPendingItems] = useState<PendingContent[]>(demoCmsDataSource.dashboardByLocale.vi?.pendingContents ?? []);
  const activeModule = resolveCmsModule(activePath);

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
        user={demoCmsDataSource.currentUser}
        initialNotifications={demoCmsDataSource.notifications}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        workspaceLocale={workspaceLocale}
        onToggleWorkspaceLocale={() => setWorkspaceLocale(workspaceLocale === 'vi' ? 'en' : 'vi')}
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
        menuGroups={demoCmsDataSource.menuGroups}
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
            items={activeModule === 'dashboard' ? [{ label: 'Tổng quan' }] : [{ label: 'Tổng quan' }, { label: currentPageTitle }]}
            pageTitle={currentPageTitle}
            hideHeaderBar
          />

          <Suspense
            fallback={(
              <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900" aria-busy="true">
                <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-4 h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              </div>
            )}
          >
          {activeModule === 'users' ? (
            <CicUsersManager />
          ) : activeModule === 'permissions' ? (
            <PermissionManagement />
          ) : activeModule === 'settings' ? (
            <SystemConfiguration />
          ) : activeModule === 'activity_logs' ? (
            <ActivityLogsManager />
          ) : activeModule === 'trash' ? (
            <TrashManager />
          ) : activeModule === 'static_pages' ? (
            <StaticPagesManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'news' ? (
            <NewsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'events' ? (
            <EventsManager />
          ) : activeModule === 'email_templates' ? (
            <EmailTemplatesManager />
          ) : activeModule === 'banners' ? (
            <BannersManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'product_settings' ? (
            <ProductSettingsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'products' ? (
            <ProductsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'services' ? (
            <ServicesManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'menu' ? (
            <MenuManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'content_blocks' ? (
            <ContentBlocksManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'media' ? (
            <MediaManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'contacts' ? (
            <ContactsManager workspaceLocale={workspaceLocale} />
          ) : activeModule === 'localization' ? (
            <LocalizationManager />
          ) : activeModule === 'dashboard' ? (
            <DashboardOverview
              workspaceLocale={workspaceLocale}
              data={dashboardData}
              onNavigate={(path, title) => {
                setActivePath(path);
                setCurrentPageTitle(title);
              }}
              onOpenDrawerItem={(type, data) => setDrawerItem({ type, data })}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Không tìm thấy trang</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Đường dẫn này không thuộc module CMS đang được hỗ trợ.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActivePath('/cms/dashboard');
                  setCurrentPageTitle('Tổng quan CMS');
                }}
                className="mt-5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Về Dashboard
              </button>
            </div>
          )}
          </Suspense>
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
