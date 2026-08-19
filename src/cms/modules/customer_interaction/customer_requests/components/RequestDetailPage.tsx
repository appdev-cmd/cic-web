import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Globe,
  ExternalLink,
  Send,
  Tag,
  History,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Laptop,
  UserCheck,
  Plus,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { CustomerRequest } from '../types';
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, REQUEST_STATUSES } from '../../shared/constants/statusTypes';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../shared/constants/statusTypes';

interface RequestDetailPageProps {
  requestId: string;
  request: CustomerRequest | null;
  onBack: () => void;
  onAssignUser?: (requestId: string, userId: string) => void;
  onReassignRequest?: (request: CustomerRequest) => void;
  onUpdateStatus: (requestId: string, newStatus: string) => void;
  onAddNote: (requestId: string, noteContent: string) => void;
}

export const RequestDetailPage: React.FC<RequestDetailPageProps> = ({
  requestId,
  request,
  onBack,
  onAssignUser,
  onReassignRequest,
  onUpdateStatus,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'source' | 'logs'>('info');
  const [noteInput, setNoteInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [localTags, setLocalTags] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (request) {
      setLocalTags(request.tags || []);
    }
  }, [request]);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-3" />
        <p className="text-base font-bold text-slate-700 dark:text-slate-300">Không tìm thấy yêu cầu khách hàng</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const getFieldValue = (keys: string[]): string => {
    const found = request.submissionValues.find((v) =>
      keys.includes(v.fieldKey.toLowerCase()) || keys.includes(v.fieldType)
    );
    return found?.valueText || '';
  };

  const getCustomerName = (): string => {
    return getFieldValue(['full_name', 'name', 'ho_ten', 'text']) || 'Khách hàng ẩn danh';
  };

  const getCustomerEmail = (): string => {
    return getFieldValue(['email']);
  };

  const getCustomerPhone = (): string => {
    return getFieldValue(['phone', 'sdt', 'dien_thoai']);
  };

  const getCustomerCompany = (): string => {
    return getFieldValue(['company', 'cong_ty', 'doanh_nghiep']);
  };

  const getNoteMessage = (): string => {
    return getFieldValue(['message', 'noi_dung', 'note', 'textarea', 'comments']) || 'Không có nội dung tin nhắn bổ sung.';
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(request.id, noteInput.trim());
    setNoteInput('');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!localTags.includes(newTagInput.trim())) {
        setLocalTags([...localTags, newTagInput.trim()]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setLocalTags(localTags.filter((t) => t !== tagToRemove));
  };

  const customerName = getCustomerName();
  const customerEmail = getCustomerEmail();
  const customerPhone = getCustomerPhone();
  const customerCompany = getCustomerCompany();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                #{request.id}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Gửi lúc: {formatDate(request.sourceConfig.submittedAt)}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Chi tiết Yêu cầu Khách hàng
            </h1>
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-wrap items-center gap-2">
          {customerPhone && (
            <a
              href={`tel:${customerPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded-xl text-xs font-bold transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi ngay</span>
            </a>
          )}

          {customerEmail && (
            <a
              href={`mailto:${customerEmail}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 rounded-xl text-xs font-bold transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Gửi Mail</span>
            </a>
          )}

          {/* Quick Status Select */}
          <div className="relative">
            <select
              value={request.status}
              onChange={(e) => onUpdateStatus(request.id, e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer transition-all"
            >
              {REQUEST_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  Trạng thái: {st.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Hero Customer Card Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700/80">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-orange-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-orange-600/30 shrink-0">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">{customerName}</h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                    REQUEST_STATUS_COLORS[request.status as keyof typeof REQUEST_STATUS_COLORS] || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {REQUEST_STATUS_LABELS[request.status] || request.status}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    PRIORITY_COLORS[request.priority as keyof typeof PRIORITY_COLORS] || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Độ ưu tiên: {PRIORITY_LABELS[request.priority] || request.priority}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                {customerPhone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(customerPhone, 'phone')}
                    className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-400" />
                    <span>{customerPhone}</span>
                    {copiedField === 'phone' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60" />
                    )}
                  </button>
                )}

                {customerEmail && (
                  <button
                    type="button"
                    onClick={() => handleCopy(customerEmail, 'email')}
                    className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>{customerEmail}</span>
                    {copiedField === 'email' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60" />
                    )}
                  </button>
                )}

                {customerCompany && (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>{customerCompany}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 p-3 rounded-xl backdrop-blur-xs">
            <UserCheck className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">Người phụ trách</span>
              <span className="font-bold text-slate-200">
                {request.assignedUserName || 'Chưa phân công'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onReassignRequest?.(request)}
              className="ml-2 px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              <span>{request.assignedUserName ? 'Đổi người phụ trách' : 'Gán người phụ trách'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Submission Data, Notes, Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card: Dữ liệu Form đã gửi */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Thông tin dữ liệu gửi từ Biểu mẫu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Toàn bộ các trường dữ liệu do khách hàng cung cấp
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                {request.submissionValues.length} trường
              </span>
            </div>

            {/* Structured Fields Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.submissionValues.map((field) => (
                <div
                  key={field.fieldKey}
                  className={`p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1 ${
                    field.fieldType === 'textarea' || field.fieldKey.includes('message') ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {field.fieldLabel}
                    </span>
                    {field.valueText && (
                      <button
                        type="button"
                        onClick={() => handleCopy(field.valueText, field.fieldKey)}
                        className="text-slate-400 hover:text-orange-600 transition-colors p-0.5"
                        title="Sao chép"
                      >
                        {copiedField === field.fieldKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {field.valueText || field.valueJson?.toString() || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Ghi chú nội bộ ({request.internalNotes.length})
                  </h3>
                  <p className="text-xs text-slate-500">Trao đổi và lưu lại tiến độ xử lý</p>
                </div>
              </div>
            </div>

            {/* Note Input Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <div className="relative">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Nhập nội dung ghi chú xử lý (VD: Đã gọi điện tư vấn, hẹn gửi báo giá lúc 15h)..."
                  rows={3}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!noteInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu ghi chú</span>
                </button>
              </div>
            </form>

            {/* Existing Notes Timeline */}
            {request.internalNotes.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                Chưa có ghi chú nội bộ nào.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {request.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[10px]">
                          {note.createdByName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {note.createdByName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Audit Logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Nhật ký hoạt động (Audit Trail)
                </h3>
                <p className="text-xs text-slate-500">Lịch sử thay đổi và cập nhật trạng thái</p>
              </div>
            </div>

            <div className="space-y-3 pl-2">
              {request.logs.map((log, idx) => (
                <div key={log.id} className="relative flex items-start gap-3 text-xs">
                  {idx !== request.logs.length - 1 && (
                    <span className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
                  )}
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {log.createdByName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {log.actionType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Source, Marketing Attribution & Tag Management */}
        <div className="space-y-6">
          {/* Card: Source & Page Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
              Nguồn & Xuất xứ
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Biểu mẫu gốc:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {request.sourceConfig.formName}
                </p>
              </div>

              {request.sourceConfig.ctaName && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Kích hoạt từ CTA:</span>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {request.sourceConfig.ctaName}
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Trang gửi yêu cầu:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {request.sourceConfig.pageTitle}
                </p>
                <a
                  href={request.sourceConfig.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:underline truncate"
                >
                  <span>{request.sourceConfig.pageUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Card: Marketing UTM Parameters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
              Chiến dịch Marketing (UTM)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500">Source:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {request.sourceConfig.utmSource || 'Trực tiếp (Direct)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500">Medium:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {request.sourceConfig.utmMedium || 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500">Campaign:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {request.sourceConfig.utmCampaign || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Device Info */}
          {request.sourceConfig.deviceInfo && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
                Thiết bị Khách hàng
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" /> Trình duyệt:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {request.sourceConfig.deviceInfo.browser}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Hệ điều hành:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {request.sourceConfig.deviceInfo.os} ({request.sourceConfig.deviceInfo.device})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card: Tags Management */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
              Thẻ phân loại (Tags)
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {localTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-semibold"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Nhập tag rồi ấn Enter..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
