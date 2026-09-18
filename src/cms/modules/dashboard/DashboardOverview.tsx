import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Globe,
} from 'lucide-react';

import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import type { CmsDashboardData, CmsLocale } from '../../data/CmsDataSource';
import { getCmsDictionary } from '../../i18n/cmsDictionary';

import {
  ContactMessage,
  ProductRegistration,
  PendingContent,
  ActivityLog,
} from '../../types';

import {
  DashboardPreference,
  defaultDashboardPreference,
} from './types';

import { DashboardCustomizerDrawer } from './DashboardCustomizerDrawer';
import { ResetLayoutModal } from './ResetLayoutModal';

import { DashboardKpiCards } from './components/DashboardKpiCards';
import { DashboardCurrentWork } from './components/DashboardCurrentWork';
import { DashboardActionRequired } from './components/DashboardActionRequired';
import { DashboardAnalyticsCharts } from './components/DashboardAnalyticsCharts';
import { DashboardActivityTimeline } from './components/DashboardActivityTimeline';

const STORAGE_KEY = 'cic_cms_dashboard_pref';

interface DashboardOverviewProps {
  workspaceLocale: CmsLocale;
  data?: CmsDashboardData;
  onNavigate: (path: string, title: string) => void;
  onOpenDrawerItem: (type: 'contact' | 'registration' | 'pending' | 'activity', data: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  workspaceLocale,
  data,
  onNavigate,
  onOpenDrawerItem,
}) => {
  const dict = getCmsDictionary(workspaceLocale);
  const t = dict.dashboard;

  // Preference state with localStorage hydration
  const [preference, setPreference] = useState<DashboardPreference>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.widgets)) {
            return parsed as DashboardPreference;
          }
        }
      } catch {
        // ignore localStorage error
      }
    }
    return defaultDashboardPreference;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customizer Drawer & Reset Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Lists state
  const contacts: ContactMessage[] = data?.contacts ?? [];
  const registrations: ProductRegistration[] = data?.productRegistrations ?? [];
  const pendingItems: PendingContent[] = (data?.pendingContents ?? []).map((item) => ({
    ...item,
    status: item.status === 'published' ? 'published' : 'draft',
  }));
  const activityLogs: ActivityLog[] = data?.activityLogs ?? [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSavePreference = (newPref: DashboardPreference) => {
    setPreference(newPref);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPref));
      } catch {
        // ignore
      }
    }
    showToast(workspaceLocale === 'en' ? 'Dashboard layout saved!' : 'Đã lưu cấu hình Tùy chỉnh Dashboard thành công!');
  };

  const handleResetPreference = () => {
    setPreference(defaultDashboardPreference);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    showToast(workspaceLocale === 'en' ? 'Reset to default dashboard layout!' : 'Đã khôi phục Bố cục Dashboard Mặc định!');
  };

  const isWidgetVisible = (widgetId: string) => {
    const w = preference.widgets.find((item) => item.id === widgetId);
    return w ? w.visible : true;
  };

  // Sort sections by order
  const sortedWidgetIds = [...preference.widgets]
    .sort((a, b) => a.order - b.order)
    .map((w) => w.id);

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-orange-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{workspaceLocale === 'en' ? 'Dismiss' : 'Ẩn'}</span>
          </button>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <CmsPageHeader
        icon={<LayoutDashboard />}
        title={t.pageTitle}
        description={t.pageDescription}
        showStatus={true}
        actions={
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
          >
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>{t.customizeLayout}</span>
          </button>
        }
      />

      {/* DYNAMIC SECTIONS RENDERED BASED ON PREFERENCE ORDER AND VISIBILITY */}
      {!data ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <Globe className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{t.noDataEn}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.noDataEnDesc}</p>
        </div>
      ) : (
        sortedWidgetIds.map((widgetId) => {
          if (!isWidgetVisible(widgetId)) return null;

          // SECTION 1: QUICK ACTIONS / CURRENT WORK
          if (widgetId === 'quick_actions') {
            return (
              <DashboardCurrentWork
                key={widgetId}
                contacts={contacts}
                registrations={registrations}
                pendingItems={pendingItems}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
              />
            );
          }

          // SECTION 2: 5 KPI CARDS
          if (widgetId === 'kpi_cards') {
            return (
              <DashboardKpiCards
                key={widgetId}
                kpi={data.kpi}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
              />
            );
          }

          // SECTION 3: ACTION REQUIRED (CUSTOMER REQUESTS + PENDING DRAFTS)
          if (widgetId === 'action_required') {
            return (
              <DashboardActionRequired
                key={widgetId}
                contacts={contacts}
                registrations={registrations}
                pendingItems={pendingItems}
                density={preference.density}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
                onOpenDrawerItem={onOpenDrawerItem}
              />
            );
          }

          // SECTION 4: ANALYTICS CHARTS (LINE & BAR CHARTS)
          if (widgetId === 'analytics_charts') {
            return (
              <DashboardAnalyticsCharts
                key={widgetId}
                traffic7Days={data.traffic7Days}
                traffic30Days={data.traffic30Days}
                weeklyContent={data.weeklyContent}
                workspaceLocale={workspaceLocale}
              />
            );
          }

          // SECTION 5: AUDIT ACTIVITY TIMELINE
          if (widgetId === 'activity_timeline') {
            return (
              <DashboardActivityTimeline
                key={widgetId}
                activityLogs={activityLogs}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
                onOpenDrawerItem={onOpenDrawerItem}
              />
            );
          }

          return null;
        })
      )}

      {/* DRAWERS & MODALS */}
      <DashboardCustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        preference={preference}
        onSavePreference={handleSavePreference}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        workspaceLocale={workspaceLocale}
      />

      <ResetLayoutModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleResetPreference}
      />
    </div>
  );
};

