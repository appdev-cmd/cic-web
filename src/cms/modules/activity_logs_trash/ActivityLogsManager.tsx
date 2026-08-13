import React, { useState } from 'react';
import {
  Shield,
  Download,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import {
  AuditEvent,
  ExportJob,
} from './types';

import type { AuditGovernanceData } from '../../data/GovernanceDataSource';

import { AuditTab } from './AuditTab';
import { EventDetailDrawer } from './EventDetailDrawer';
import { ExportJobsDrawer } from './ExportJobsDrawer';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';

export const ActivityLogsManager: React.FC<{ data: AuditGovernanceData }> = ({ data }) => {
  // State lists
  const [auditLogs] = useState<AuditEvent[]>(data.auditLogs);
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

  const handleCreateNewExport = (range: string, filterSummary: string) => {
    const newJob: ExportJob = {
      id: `job_exp_${Date.now().toString().slice(-4)}`,
      requestedAt: new Date().toLocaleString(),
      requestedBy: 'Nguyễn Văn Minh (Admin)',
      scopeName: 'Toàn bộ Scope Hệ thống',
      dateRange: range,
      filterSummary,
      status: 'completed',
      totalRecords: auditLogs.length,
      fileSizeMb: 1.8,
      downloadUrl: '#download_new_export',
      expiresAt: new Date(Date.now() + 7 * 86400000).toLocaleString(),
    };

    setExportJobs((prev) => [newJob, ...prev]);
    showToast(`Đã hoàn tất tạo Báo cáo Export thành công!`);
  };

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
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{auditLogs.length} bản ghi</span>}
      />

      {/* AUDIT LOGS TAB VIEW */}
      <AuditTab
        logs={auditLogs}
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
      />
    </div>
  );
};
