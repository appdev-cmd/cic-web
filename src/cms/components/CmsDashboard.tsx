import React, { lazy, Suspense, useEffect, useState } from 'react';
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
import type { MasterDataType } from '../modules/product_settings/types';

const getProductSettingsDataType = (path: string): MasterDataType => {
  if (path.endsWith('/brands') || path === '/cms/manufacturers' || path === '/cms/products/brands') return 'brands';
  if (path.endsWith('/applications') || path === '/cms/applications') return 'applications';
  if (path.endsWith('/product-types') || path === '/cms/product-types') return 'product_types';
  if (path.endsWith('/sales-staff') || path === '/cms/sales-staff') return 'sales_staff';
  return 'categories';
};

const CicUsersManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/cic_users/CicUsersManager'), import('../data/demoGovernanceDataSource')]);
  return { default: () => <module.CicUsersManager data={dataModule.demoGovernanceDataSource.users} /> };
});
const PermissionManagement = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/permission_management/PermissionManagement'), import('../data/demoGovernanceDataSource')]);
  return { default: () => <module.PermissionManagement data={dataModule.demoGovernanceDataSource.permissions} /> };
});
const SystemConfiguration = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/system_configuration/SystemConfiguration'), import('../data/demoConfigurationDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.SystemConfiguration
      websiteData={dataModule.demoConfigurationDataSource.websiteConfigByLocale[workspaceLocale]}
      globalData={dataModule.demoConfigurationDataSource.globalConfig}
    />
  ) };
});
const FunctionSeoManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/function_seo/FunctionSeoManager'),
    import('../data/FunctionSeoDataSource'),
  ]);
  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.FunctionSeoManager
        workspaceLocale={workspaceLocale}
        data={dataModule.getDemoFunctionSeoData(workspaceLocale)}
      />
    ),
  };
});
const ActivityLogsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/activity_logs_trash/ActivityLogsManager'), import('../data/demoGovernanceDataSource')]);
  return { default: () => <module.ActivityLogsManager data={dataModule.demoGovernanceDataSource.audit} /> };
});
const TrashManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/activity_logs_trash/TrashManager'), import('../data/demoGovernanceDataSource')]);
  return { default: () => <module.TrashManager data={dataModule.demoGovernanceDataSource.trash} /> };
});
const StaticPagesManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/static_pages/StaticPagesManager'),
    import('../modules/static_pages/staticPagesData'),
  ]);
  return {
    default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
      <module.StaticPagesManager
        workspaceLocale={workspaceLocale}
        data={dataModule.getCmsStaticPagesData(workspaceLocale)}
      />
    ),
  };
});
const NewsManager = lazy(() => import('../modules/news/NewsModulePage'));
const EventsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/events/EventsManager'), import('../modules/events/eventsData')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.EventsManager workspaceLocale={workspaceLocale} data={dataModule.getCmsEventsData(workspaceLocale)} />
  ) };
});
const ProjectsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/projects/ProjectsManager'), import('../modules/projects/projectsData')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.ProjectsManager data={dataModule.getCmsProjectsData(workspaceLocale)} />
  ) };
});
const EmailTemplatesManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/email_templates/EmailTemplatesManager'), import('../data/demoCustomerInteractionDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.EmailTemplatesManager workspaceLocale={workspaceLocale} data={dataModule.getDemoEmailTemplateModuleData(workspaceLocale)} />
  ) };
});
const ProductSettingsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/product_settings/ProductSettingsManager'),
    import('../data/demoCatalogDataSource'),
  ]);

  return {
    default: ({ workspaceLocale, path }: { workspaceLocale: CmsLocale; path: string }) => (
      <module.ProductSettingsManager
        taxonomy={dataModule.demoCatalogDataSource.productTaxonomyByLocale[workspaceLocale]}
        globalData={dataModule.demoCatalogDataSource.productSettingsGlobal}
        dataType={getProductSettingsDataType(path)}
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
const MediaManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/media/MediaManager'), import('../data/demoMediaDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.MediaManager data={dataModule.getDemoMediaModuleData(workspaceLocale)} />
  ) };
});
const ContactsManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/contacts/ContactsManager'), import('../data/demoContactsDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.ContactsManager
      data={dataModule.demoContactsDataSource.contactsByLocale[workspaceLocale]}
      staffMembers={dataModule.demoContactsDataSource.staffMembers}
      currentUserId={dataModule.demoContactsDataSource.currentUserId}
    />
  ) };
});
const LocalizationManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([
    import('../modules/localization/LocalizationManager'),
    import('../data/LocalizationDataSource'),
  ]);
  return { default: () => <module.LocalizationManager data={dataModule.getDemoLocalizationData()} /> };
});
const DashboardOverview = lazy(() => import('../modules/dashboard/DashboardOverview').then((module) => ({ default: module.DashboardOverview })));

// Customer Interaction Modules
const CtaManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/customer_interaction/cta/CtaManager'), import('../data/demoCustomerInteractionDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.CtaManager workspaceLocale={workspaceLocale} data={dataModule.getDemoCtaModuleData(workspaceLocale)} />
  ) };
});
const FormManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/customer_interaction/forms/FormManager'), import('../data/demoCustomerInteractionDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.FormManager workspaceLocale={workspaceLocale} data={dataModule.getDemoFormModuleData(workspaceLocale)} />
  ) };
});
const CustomerRequestManager = lazy(async () => {
  const [module, dataModule] = await Promise.all([import('../modules/customer_interaction/customer_requests/CustomerRequestManager'), import('../data/demoCustomerInteractionDataSource')]);
  return { default: ({ workspaceLocale }: { workspaceLocale: CmsLocale }) => (
    <module.CustomerRequestManager data={dataModule.getDemoCustomerRequestModuleData(workspaceLocale)} />
  ) };
});

interface CmsDashboardProps {
  onSwitchToWebsite?: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ onSwitchToWebsite }) => {
  // Theme & Layout States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [workspaceLocale, setWorkspaceLocale] = useState<CmsLocale>('vi');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(() => {
    const p = window.location.pathname;
    return p && p.startsWith('/cms') && p !== '/cms' ? p : '/cms/dashboard';
  });
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

  useEffect(() => {
    const handlePopState = () => setActivePath(window.location.pathname || '/cms/dashboard');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToCmsPath = (path: string, title: string) => {
    window.history.pushState({}, '', path);
    setActivePath(path);
    setCurrentPageTitle(title);
  };

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
    <div className={`cms-shell min-h-screen transition-colors ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
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
          navigateToCmsPath(path, title);
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
            <SystemConfiguration workspaceLocale={workspaceLocale} />
          ) : activeModule === 'function_seo' ? (
            <FunctionSeoManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'activity_logs' ? (
            <ActivityLogsManager />
          ) : activeModule === 'trash' ? (
            <TrashManager />
          ) : activeModule === 'static_pages' ? (
            <StaticPagesManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'news' ? (
            <NewsManager key={`${workspaceLocale}:${activePath}`} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'events' ? (
            <EventsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'projects' ? (
            <ProjectsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'email_templates' ? (
            <EmailTemplatesManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'product_settings' ? (
            <ProductSettingsManager key={`${workspaceLocale}:${activePath}`} workspaceLocale={workspaceLocale} path={activePath} />
          ) : activeModule === 'products' ? (
            <ProductsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'services' ? (
            <ServicesManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'menu' ? (
            <MenuManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'media' ? (
            <MediaManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'contacts' ? (
            <ContactsManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'localization' ? (
            <LocalizationManager />
          ) : activeModule === 'cta' ? (
            <CtaManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'forms' ? (
            <FormManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'customer_requests' ? (
            <CustomerRequestManager key={workspaceLocale} workspaceLocale={workspaceLocale} />
          ) : activeModule === 'dashboard' ? (
            <DashboardOverview
              workspaceLocale={workspaceLocale}
              data={dashboardData}
              onNavigate={(path, title) => {
                navigateToCmsPath(path, title);
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
                  navigateToCmsPath('/cms/dashboard', 'Tổng quan CMS');
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
          navigateToCmsPath(path, label);
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
