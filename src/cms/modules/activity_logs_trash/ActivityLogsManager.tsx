import React, { useCallback, useState } from 'react';
import {
  Shield,
  CheckCircle2,
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
import { createAuditExportAction, getAuditExportDownloadUrlAction, getAuditLogsPageAction } from '@/features/activity-logs/server/actions';

export const ActivityLogsManager: React.FC<{ data: AuditGovernanceData; capabilities: { export: boolean } }> = ({ data, capabilities }) => {
  // State lists
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(data.auditLogs);
  const [auditTotal, setAuditTotal] = useState(data.auditTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(data.exportJobs);

  // Drawer states
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleCreateNewExport = async (range: string) => {
    const result = await createAuditExportAction({ range, workspace: 'global' });
    setExportJobs((prev) => [{ id: result.id, requestedAt: new Date().toISOString(), requestedBy: 'Bạn', scopeName: 'global', dateRange: range, filterSummary: 'Nhật ký hoạt động', status: 'completed', downloadUrl: result.id }, ...prev]);
    showToast('Đã tạo tệp xuất nhật ký an toàn.');
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
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <CmsPageHeader
        icon={<Shield />}
        title="Nhật ký hoạt động"
        description="Theo dõi các thao tác quản trị, thay đổi quyền và hoạt động xuất bản trong hệ thống."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{auditTotal} bản ghi</span>}
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
        onDownload={async (id) => { window.location.assign(await getAuditExportDownloadUrlAction(id)); }}
      />
    </div>
  );
};
