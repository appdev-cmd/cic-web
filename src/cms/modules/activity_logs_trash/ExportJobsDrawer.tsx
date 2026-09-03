import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Clock,
  CheckCircle2,
  RefreshCw,
  Plus,
  Shield,
  FileCode,
} from 'lucide-react';
import { ExportJob } from './types';

interface ExportJobsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: ExportJob[];
  onCreateNewExport: (range: string) => Promise<void>;
  onDownload: (id: string) => Promise<void>;
  canExport: boolean;
}

export const ExportJobsDrawer: React.FC<ExportJobsDrawerProps> = ({
  isOpen,
  onClose,
  jobs,
  onCreateNewExport,
  onDownload,
  canExport,
}) => {
  const [dateRange, setDateRange] = useState('7days');
  const [isGenerating, setIsGenerating] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
      if (keyboardEvent.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable.at(-1)!;
      if (keyboardEvent.shiftKey && document.activeElement === first) { keyboardEvent.preventDefault(); last.focus(); }
      else if (!keyboardEvent.shiftKey && document.activeElement === last) { keyboardEvent.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreateExport = async () => {
    setIsGenerating(true);
    try {
      await onCreateNewExport(dateRange);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="audit-export-title" tabIndex={-1} className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 outline-none">
        {/* DRAWER HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="audit-export-title" className="text-base font-bold text-slate-900 dark:text-white">
                Quản lý Tệp Xuất Nhật ký Kiểm toán (Export Audit Jobs)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tạo và tải báo cáo CSV từ nguồn nhật ký được phân quyền
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng quản lý tệp xuất"
            className="min-h-11 min-w-11 inline-flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CREATE NEW EXPORT FORM */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" />
            <span>Tạo Báo cáo Xuất mới</span>
          </h4>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="min-h-11 w-full sm:w-auto min-w-0 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="7days">Khoảng thời gian: 7 Ngày gần nhất</option>
              <option value="30days">Khoảng thời gian: 30 Ngày gần nhất</option>
            </select>

            <button
              onClick={handleCreateExport}
              disabled={isGenerating || !canExport}
              className="min-h-11 w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Đang xuất tệp...' : 'Bắt đầu Xuất File'}</span>
            </button>
          </div>
        </div>

        {/* JOBS LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs">
          <h4 className="font-bold text-slate-700 dark:text-slate-300">
            Danh sách Tệp đã xuất gần đây:
          </h4>

          {jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800">
              Chưa có tệp xuất nào được tạo.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-white break-all">
                      [{job.id}] Audit_Export_{job.dateRange.replace(/\s+/g, '_')}.csv
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : job.status === 'failed' || job.status === 'expired' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-slate-500 text-[11px] space-y-0.5">
                  <div>Yêu cầu bởi: <strong>{job.requestedBy}</strong> lúc {job.requestedAt}</div>
                  <div>Phạm vi: {job.scopeName} • {job.filterSummary}</div>
                  {job.status === 'completed' && job.totalRecords !== undefined && <div>Dung lượng: <strong>{job.fileSizeMb} MB</strong> ({job.totalRecords.toLocaleString()} dòng)</div>}
                  {job.status === 'completed' && job.expiresAt && <div className="text-amber-600 dark:text-amber-400 font-mono text-[10px]">Hạn tải xuống an toàn: {job.expiresAt}</div>}
                  {(job.status === 'queued' || job.status === 'processing') && <div className="font-semibold text-blue-600">Tệp đang được xử lý. Nút tải sẽ xuất hiện khi hoàn tất.</div>}
                </div>

                <div className="pt-2 flex justify-end">
                  {job.status === 'completed' && job.downloadUrl && <button
                    onClick={() => { void onDownload(job.id); }}
                    className="min-h-11 px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-bold text-xs rounded-xl border border-blue-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải xuống File CSV</span>
                  </button>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* DRAWER FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
