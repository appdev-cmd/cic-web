import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  User,
  Clock,
  Globe,
  Terminal,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  FileCode,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AuditEvent } from './types';

interface EventDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: AuditEvent | null;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'diff' | 'technical'>('summary');
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(event.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* DRAWER HEADER */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl text-white shadow-md ${
                event.action.severity === 'critical'
                  ? 'bg-red-600 shadow-red-600/20'
                  : event.action.severity === 'high'
                  ? 'bg-orange-600 shadow-orange-600/20'
                  : 'bg-blue-600 shadow-blue-600/20'
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  [{event.id}]
                </span>
                <button
                  onClick={handleCopyId}
                  title="Sao chép ID sự kiện"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {event.action.label}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IMMUTABLE NOTICE BANNER */}
        <div className="bg-purple-500/10 border-b border-purple-500/20 px-5 py-2.5 flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
          <span className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            Bản ghi Nhật ký Bất biến (Immutable Audit Event) — Tuân thủ chuẩn ISO 27001
          </span>
          <span className="font-mono text-[10px] bg-purple-500/20 px-2 py-0.5 rounded font-bold">
            READ-ONLY
          </span>
        </div>

        {/* DRAWER TAB NAVIGATION */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-5 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tóm tắt Sự kiện (Event Context)
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diff'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>So sánh Thay đổi (Before / After)</span>
            {event.changes && event.changes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {event.changes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('technical')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'technical'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Thông số Kỹ thuật (Technical Correlation)
          </button>
        </div>

        {/* DRAWER BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'summary' && (
            <div className="space-y-5 text-xs">
              {/* RESULT BADGE CARD */}
              <div
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                  event.result === 'success'
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-500/5 border-red-500/20 text-red-800 dark:text-red-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {event.result === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      Kết quả Thao tác: {event.result.toUpperCase()}
                    </h4>
                    <p className="mt-1 opacity-90">{event.resultMessage || 'Hành động thực thi hoàn tất thành công.'}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase ${
                    event.action.severity === 'critical'
                      ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                      : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                  }`}
                >
                  {event.action.severity} Severity
                </span>
              </div>

              {/* ACTOR INFORMATION */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  <span>Tài khoản Thực hiện (Actor)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Họ tên & Vai trò:</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {event.actor.name} ({event.actor.role})
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Email công tác:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {event.actor.email}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Địa chỉ IP:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {event.actor.ipAddress}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Trình duyệt & OS:</span>
                    <span className="truncate block font-mono text-[11px]" title={event.actor.userAgent}>
                      {event.actor.userAgent}
                    </span>
                  </div>
                </div>
              </div>

              {/* TARGET & SCOPE DETAILS */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Đối tượng Tác động & Scope</span>
                </h4>

                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Loại đối tượng (Target Type):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {event.target.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tên/Tiêu đề đối tượng:</span>
                    <strong className="text-slate-900 dark:text-white">{event.target.title}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phạm vi Scope:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      {event.scope.siteName} [{event.scope.siteId}]
                    </span>
                  </div>

                  {event.target.url && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Đường dẫn URL:</span>
                      <span className="font-mono text-blue-500 underline truncate max-w-[250px]">
                        {event.target.url}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diff' && (
            <div className="space-y-4 text-xs">
              {!event.changes || event.changes.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                  Sự kiện này không ghi nhận biến động giá trị thuộc tính (Biến động hệ thống/Thao tác đọc hoặc xác thực).
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-500">
                    Bảng so sánh giá trị Trước (Old Value) và Sau (New Value) đối với thao tác này:
                  </p>

                  {event.changes.map((change, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 space-y-0"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span className="font-mono text-orange-600 dark:text-orange-400">
                          {change.field}
                        </span>

                        {change.isRedacted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Security Redacted
                          </span>
                        )}
                      </div>

                      {change.isRedacted ? (
                        <div className="p-3 bg-purple-500/5 text-purple-700 dark:text-purple-300 text-[11px]">
                          <strong>Giải thích Che khuất (Redaction Policy):</strong>{' '}
                          {change.redactionReason || 'Trường dữ liệu chứa thông tin nhạy cảm (API Keys/Passwords/PII) đã tự động bị che khuất tuân thủ ISO 27001.'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 text-xs">
                          <div className="p-3 space-y-1 bg-red-500/5">
                            <span className="text-[10px] font-bold uppercase text-red-600 block">
                              Giá trị Cũ (Old Value)
                            </span>
                            <pre className="font-mono whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                              {typeof change.oldValue === 'object'
                                ? JSON.stringify(change.oldValue, null, 2)
                                : String(change.oldValue ?? '(null)')}
                            </pre>
                          </div>

                          <div className="p-3 space-y-1 bg-emerald-500/5">
                            <span className="text-[10px] font-bold uppercase text-emerald-600 block">
                              Giá trị Mới (New Value)
                            </span>
                            <pre className="font-mono whitespace-pre-wrap font-bold text-emerald-700 dark:text-emerald-300">
                              {typeof change.newValue === 'object'
                                ? JSON.stringify(change.newValue, null, 2)
                                : String(change.newValue ?? '(null)')}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span>TECHNICAL CORRELATION</span>
                  <span>{event.context.environment.toUpperCase()}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400">Session ID:</span> {event.context.sessionId}
                  </div>
                  <div>
                    <span className="text-slate-400">Correlation ID:</span> {event.context.correlationId}
                  </div>
                  <div>
                    <span className="text-slate-400">Source App:</span> {event.context.sourceApp}
                  </div>
                  {event.technicalRef && (
                    <>
                      <div>
                        <span className="text-slate-400">HTTP Endpoint:</span>{' '}
                        <span className="text-amber-400">{event.technicalRef.httpMethod}</span>{' '}
                        {event.technicalRef.endpoint}
                      </div>
                      <div>
                        <span className="text-slate-400">Execution Time:</span>{' '}
                        {event.technicalRef.executionTimeMs} ms
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRAWER FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            Đóng Giao diện
          </button>
        </div>
      </div>
    </div>
  );
};
