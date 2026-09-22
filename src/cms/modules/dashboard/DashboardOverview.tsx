'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Globe,
  ShieldCheck,
} from 'lucide-react';

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

import { WebsiteOperationsHero } from './components/WebsiteOperationsHero';
import { WebsiteHealthDrawer } from './components/WebsiteHealthDrawer';
import { ActionableQueue } from './components/ActionableQueue';
import { CustomerRequestsLivePanel } from './components/CustomerRequestsLivePanel';
import { PopularContentPanel } from './components/PopularContentPanel';
import { CompactContentStrip } from './components/CompactContentStrip';
import { DashboardActivityTimeline } from './components/DashboardActivityTimeline';

const STORAGE_KEY = 'cic_cms_dashboard_pref_v2';

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
  const isEn = workspaceLocale === 'en';

  // Preference state with localStorage hydration & automatic version upgrade
  const [preference, setPreference] = useState<DashboardPreference>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.widgets)) {
            const hasHero = parsed.widgets.some((w: any) => w.id === 'operations_hero');
            if (hasHero) {
              return parsed as DashboardPreference;
            }
          }
        }
      } catch {
        // ignore localStorage error
      }
    }
    return defaultDashboardPreference;
  });

  // Health Drawer state
  const [isHealthDrawerOpen, setIsHealthDrawerOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customizer Drawer & Reset Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Lists state
  const contacts: ContactMessage[] = data?.contacts ?? [];
  const registrations: ProductRegistration[] = data?.productRegistrations ?? [];
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
    showToast(isEn ? 'Dashboard layout saved!' : 'Đã lưu cấu hình Tùy chỉnh Dashboard thành công!');
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
    showToast(isEn ? 'Reset to default dashboard layout!' : 'Đã khôi phục Bố cục Dashboard Mặc định!');
  };

  const isWidgetVisible = (widgetId: string) => {
    const w = preference.widgets.find((item) => item.id === widgetId);
    return w ? w.visible : true;
  };

  // Sort sections by order
  const sortedWidgetIds = [...preference.widgets]
    .sort((a, b) => a.order - b.order)
    .map((w) => w.id);

  const healthScore = data?.health?.score ?? 80;

  return (
    <div className="space-y-5">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-orange-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEn ? 'Dismiss' : 'Ẩn'}</span>
          </button>
        </div>
      )}

      {/* 1. STREAMLINED OPERATIONAL PAGE HEADER (Lean toolbar, no bulky card wrap) */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Operations Control Center' : 'Trung Tâm Vận Hành Website'}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              CIC CMS
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Real-time telemetry: visitor traffic, system health, inquiry queue, and publishing activity.'
              : 'Giám sát vận hành thời gian thực: lưu lượng, sức khỏe hệ thống, hàng đợi xử lý và xuất bản.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsHealthDrawerOpen(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{isEn ? 'Health Audit' : 'Kiểm tra Sức khỏe'}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              {healthScore}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{t.customizeLayout}</span>
          </button>
        </div>
      </header>

      {/* DYNAMIC SECTIONS RENDERED BASED ON PREFERENCE ORDER AND VISIBILITY */}
      {!data ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <Globe className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{t.noDataEn}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.noDataEnDesc}</p>
        </div>
      ) : (
        sortedWidgetIds.map((widgetId) => {
          if (!isWidgetVisible(widgetId)) return null;

          // SECTION 1: WEBSITE OPERATIONS HERO (Today Analytics 65% + Health Card 35%)
          if (widgetId === 'operations_hero' || widgetId === 'analytics_charts') {
            return (
              <WebsiteOperationsHero
                key={widgetId}
                data={data}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
                onOpenHealthDrawer={() => setIsHealthDrawerOpen(true)}
              />
            );
          }

          // SECTION 2: PRIORITIZED ACTION QUEUE
          if (widgetId === 'actionable_queue' || widgetId === 'quick_actions') {
            return (
              <ActionableQueue
                key={widgetId}
                data={data}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
                onOpenHealthDrawer={() => setIsHealthDrawerOpen(true)}
              />
            );
          }

          // SECTION 3: CUSTOMER REQUESTS LIVE FEED + MOST VIEWED POPULAR CONTENT
          if (widgetId === 'requests_and_popular' || widgetId === 'action_required') {
            return (
              <div key={widgetId} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <CustomerRequestsLivePanel
                    contacts={contacts}
                    registrations={registrations}
                    workspaceLocale={workspaceLocale}
                    onNavigate={onNavigate}
                    onOpenDrawerItem={onOpenDrawerItem}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PopularContentPanel
                    popularContent={data.popularContent}
                    workspaceLocale={workspaceLocale}
                    onNavigate={onNavigate}
                  />
                </div>
              </div>
            );
          }

          // SECTION 4: AUDIT ACTIVITY TIMELINE
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

          // SECTION 5: COMPACT CONTENT INVENTORY TOTALS STRIP
          if (widgetId === 'content_totals' || widgetId === 'kpi_cards') {
            return (
              <CompactContentStrip
                key={widgetId}
                kpi={data.kpi}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
              />
            );
          }

          return null;
        })
      )}

      {/* DRAWERS & MODALS */}
      <WebsiteHealthDrawer
        isOpen={isHealthDrawerOpen}
        onClose={() => setIsHealthDrawerOpen(false)}
        health={data?.health}
        workspaceLocale={workspaceLocale}
        onNavigate={onNavigate}
      />

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
