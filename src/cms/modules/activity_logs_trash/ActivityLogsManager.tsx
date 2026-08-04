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
  SavedViewFilter,
} from './types';

import {
  initialAuditLogsMock,
  initialExportJobsMock,
  savedViewFiltersMock,
} from './mockData';

import { AuditTab } from './AuditTab';
import { EventDetailDrawer } from './EventDetailDrawer';
import { ExportJobsDrawer } from './ExportJobsDrawer';

export const ActivityLogsManager: React.FC = () => {
  // State lists
  const [auditLogs] = useState<AuditEvent[]>(initialAuditLogsMock);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(initialExportJobsMock);
  const [savedViews] = useState<SavedViewFilter[]>(savedViewFiltersMock);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-purple-600/20 shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                QUẢN TRỊ HỆ THỐNG — AUDIT LOGS
              </span>
              <span className="text-xs text-slate-400 font-mono">v2.5.0</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Nhật ký Hoạt động (Activity Audit Logs)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Truy vết an ninh bất biến, che khuất dữ liệu nhạy cảm ISO 27001, ghi nhận thao tác phân quyền & xuất bản
            </p>
          </div>
        </div>
      </div>

      {/* AUDIT LOGS TAB VIEW */}
      <AuditTab
        logs={auditLogs}
        savedViews={savedViews}
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
