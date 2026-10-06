'use client';

import React, { useCallback, useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

import {
  AuditEvent,
  ExportJob,
  AuditListQuery,
} from './types';

import type { AuditGovernanceData } from '../../data/GovernanceDataSource';

import { AuditTab } from './AuditTab';
import { EventDetailDrawer } from './EventDetailDrawer';
import { ExportJobsDrawer } from './ExportJobsDrawer';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { getCmsDictionary } from '@/cms/i18n/cmsDictionary';
import { createAuditExportAction, getAuditExportDownloadUrlAction, getAuditLogsPageAction } from '@/features/activity-logs/server/actions';

export const ActivityLogsManager: React.FC<{ data: AuditGovernanceData; capabilities: { export: boolean } }> = ({ data, capabilities }) => {
  // State lists
  const workspaceLocale = useCmsWorkspaceLocale();
  const dict = getCmsDictionary(workspaceLocale);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(data.auditLogs);
  const [auditTotal, setAuditTotal] = useState(data.auditTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(data.exportJobs);

  // Drawer states
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleCreateNewExport = async (range: string) => {
    try {
      const result = await createAuditExportAction({ range, workspace: 'global' });
      setExportJobs((prev) => [
        {
          id: result.id,
          requestedAt: new Date().toISOString(),
          requestedBy: 'Bạn',
          scopeName: 'global',
          dateRange: range,
          filterSummary: 'Nhật ký hoạt động',
          status: 'completed',
          downloadUrl: result.id,
        },
        ...prev,
      ]);
      showToast('Đã tạo tệp xuất nhật ký an toàn.', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Không thể tạo tệp xuất nhật ký.',
        'error'
      );
    }
  };

  const handleLoadPage = useCallback(async (query: AuditListQuery) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await getAuditLogsPageAction(query);
      setAuditLogs(result.items);
      setAuditTotal(result.total);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Không thể tải nhật ký hoạt động.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <CmsPageHeader
        icon={<Shield />}
        title={dict.modules.system.logs.title}
        description={dict.modules.system.logs.description}
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{auditTotal} {dict.modules.system.logs.itemUnit}</span>}
      />

      {/* AUDIT LOGS TAB VIEW */}
      <AuditTab
        logs={auditLogs}
        totalCount={auditTotal}
        isLoading={isLoading}
        error={loadError}
        onLoadPage={handleLoadPage}
        onOpenEventDetail={(evt) => {
          setSelectedEvent(evt);
          setEventDetailOpen(true);
        }}
        onOpenExportDrawer={() => setExportDrawerOpen(true)}
      />

      {/* DRAWERS */}
      <EventDetailDrawer
        isOpen={eventDetailOpen}
        onClose={() => setEventDetailOpen(false)}
        event={selectedEvent}
      />

      <ExportJobsDrawer
        isOpen={exportDrawerOpen}
        onClose={() => setExportDrawerOpen(false)}
        jobs={exportJobs}
        onCreateNewExport={handleCreateNewExport}
        canExport={capabilities.export}
        onDownload={async (id) => {
          try {
            const url = await getAuditExportDownloadUrlAction(id);
            const ext = url.includes('.csv') ? 'csv' : 'xlsx';
            const filename = `Audit_Export_${id}.${ext}`;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (error) {
            showToast(
              error instanceof Error ? error.message : 'Không thể tải xuống tệp xuất.',
              'error'
            );
          }
        }}
      />

      {/* TOAST NOTIFICATION (Placed after drawers with z-[100] to ensure zero overlap) */}
      {toast && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 sm:bottom-8 z-[100] animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-3 border ${
              toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800 shadow-rose-950/50'
                : toast.type === 'warning'
                ? 'bg-amber-950 text-amber-100 border-amber-800 shadow-amber-950/50'
                : 'bg-slate-900 text-white border-slate-700 shadow-slate-950/50'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
