import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  User,
  Clock,
  Globe,
  Terminal,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Code2,
  FileText,
  ArrowRight,
  ExternalLink,
  Laptop,
  Network,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AuditEvent } from './types';

interface EventDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: AuditEvent | null;
}

// 1. Thư viện chuyển đổi mã hành động sang tên tiếng Việt dễ hiểu
const ACTION_TRANSLATIONS: Record<string, { title: string; desc: string }> = {
  'audit.export_created': {
    title: 'Tạo tệp xuất nhật ký kiểm toán',
    desc: 'Hệ thống đã kết xuất dữ liệu nhật ký hoạt động ra tệp bảng tính theo khoảng thời gian yêu cầu.',
  },
  'audit.export_downloaded': {
    title: 'Tải xuống tệp xuất kiểm toán',
    desc: 'Người dùng đã tải tệp báo cáo kiểm toán về máy tính qua liên kết ký bảo mật.',
  },
  'trash.purged': {
    title: 'Dọn sạch thùng rác vĩnh viễn',
    desc: 'Thực hiện xóa vĩnh viễn các mục lưu trữ trong thùng rác không thể khôi phục.',
  },
  'trash.restored': {
    title: 'Khôi phục mục từ thùng rác',
    desc: 'Đưa mục đã bị xóa tạm trước đó trở lại trạng thái hoạt động bình thường.',
  },
  'trash.item_trashed': {
    title: 'Chuyển mục vào thùng rác',
    desc: 'Xóa tạm một bản ghi và chuyển vào thùng rác để có thể phục hồi khi cần.',
  },
  'product.created': {
    title: 'Tạo mới sản phẩm',
    desc: 'Đăng tải thông tin sản phẩm phần mềm hoặc giải pháp công nghệ mới.',
  },
  'product.updated': {
    title: 'Cập nhật thông tin sản phẩm',
    desc: 'Thay đổi các trường dữ liệu, cấu hình SEO hoặc tài liệu đính kèm của sản phẩm.',
  },
  'product.deleted': {
    title: 'Xóa sản phẩm',
    desc: 'Gỡ bỏ sản phẩm khỏi danh mục quản lý trên website.',
  },
  'static_page.updated': {
    title: 'Cập nhật trang tĩnh',
    desc: 'Thay đổi nội dung biên tập, tiêu đề hoặc cấu hình của trang nội dung tĩnh.',
  },
  'static_page.status_changed': {
    title: 'Thay đổi trạng thái trang tĩnh',
    desc: 'Chuyển đổi trạng thái xuất bản, lưu nháp hoặc ẩn trang khỏi người dùng.',
  },
  'auth.login': {
    title: 'Đăng nhập CMS thành công',
    desc: 'Tài khoản quản trị viên đã hoàn tất xác thực danh tính vào trang quản lý.',
  },
  'auth.logout': {
    title: 'Đăng xuất khỏi CMS',
    desc: 'Kết thúc phiên làm việc an toàn và thu hồi các token xác thực.',
  },
};

// 2. Thư viện chuyển đổi tên trường thuộc tính sang tiếng Việt
const FIELD_TRANSLATIONS: Record<string, string> = {
  title: 'Tiêu đề',
  name: 'Tên đối tượng',
  slug: 'Đường dẫn (Slug)',
  status: 'Trạng thái hoạt động',
  published: 'Trạng thái xuất bản',
  is_active: 'Kích hoạt',
  active: 'Kích hoạt',
  description: 'Mô tả tóm tắt',
  content: 'Nội dung chi tiết',
  category: 'Danh mục / Phân loại',
  category_id: 'Mã danh mục',
  brand_id: 'Mã hãng sản xuất',
  tags: 'Thẻ từ khóa (Tags)',
  seo_title: 'Tiêu đề SEO',
  seo_description: 'Mô tả SEO',
  seo_keywords: 'Từ khóa SEO',
  price: 'Giá niêm yết',
  account_status: 'Trạng thái tài khoản',
  role: 'Vai trò phân quyền',
  allowed: 'Cấp quyền truy cập',
  email: 'Địa chỉ Email',
  avatar_url: 'Ảnh đại diện',
  file_path: 'Đường dẫn tệp',
  file_size_bytes: 'Kích thước tệp',
  order_index: 'Thứ tự hiển thị',
  updated_at: 'Thời gian cập nhật',
};

function humanizeAction(code: string): { title: string; desc: string } {
  if (ACTION_TRANSLATIONS[code]) return ACTION_TRANSLATIONS[code];
  const formatted = code
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: formatted,
    desc: `Thao tác hệ thống với mã định danh [${code}].`,
  };
}

function humanizeFieldName(field: string): string {
  return FIELD_TRANSLATIONS[field] || field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRelativeTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    return `${Math.floor(diffSec / 86400)} ngày trước`;
  } catch {
    return dateString;
  }
}

function parseDevice(ua: string): { browser: string; os: string } {
  if (!ua || ua === '[REDACTED]') return { browser: 'Không ghi nhận', os: 'Không ghi nhận' };
  let os = 'Hệ điều hành khác';
  if (/windows/i.test(ua)) os = 'Windows PC';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android Device';
  else if (/iphone|ipad/i.test(ua)) os = 'iOS Device';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Trình duyệt Web';
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Apple Safari';

  return { browser, os };
}

function formatValueDisplay(val: unknown): string {
  if (val === null || val === undefined) return '(Chưa thiết lập)';
  if (typeof val === 'boolean') return val ? 'Có (True / Bật)' : 'Không (False / Tắt)';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const actionInfo = humanizeAction(event.action.code);
  const deviceInfo = parseDevice(event.actor.userAgent);
  const relativeTime = formatRelativeTime(event.timestamp);

  const handleCopyId = () => {
    navigator.clipboard.writeText(event.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const isFailed = event.result === 'failed' || event.result === 'denied';
  const isWarning = event.result === 'partial' || event.action.severity === 'high';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-event-title"
        tabIndex={-1}
        className="w-full max-w-4xl lg:max-w-5xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 outline-none text-slate-800 dark:text-slate-100"
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-2.5 rounded-2xl text-white shadow-md shrink-0 ${
                isFailed
                  ? 'bg-rose-600 shadow-rose-600/20'
                  : event.action.severity === 'critical'
                  ? 'bg-red-600 shadow-red-600/20'
                  : isWarning
                  ? 'bg-amber-600 shadow-amber-600/20'
                  : 'bg-orange-600 shadow-orange-600/20'
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                  ID: {event.id.slice(0, 8)}...{event.id.slice(-4)}
                </span>
                <button
                  onClick={handleCopyId}
                  title="Sao chép toàn bộ ID sự kiện"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {event.timestamp} ({relativeTime})
                </span>
              </div>
              <h2 id="audit-event-title" className="text-base font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                {actionInfo.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Trực quan</span>
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'raw'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Raw JSON</span>
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Đóng chi tiết sự kiện"
              className="min-h-11 min-w-11 inline-flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IMMUTABLE AUDIT NOTICE BANNER */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-200/60 dark:border-blue-900/40 px-4 sm:px-5 py-2 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">
              Bản ghi Kiểm toán Bất biến (Immutable Audit Event) — Được hệ thống ký bảo chứng, không thể can thiệp hay chỉnh sửa.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold uppercase shrink-0">
            READ-ONLY
          </span>
        </div>

        {/* DRAWER BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === 'raw' ? (
            /* RAW JSON MODE */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Dữ liệu Payload JSON gốc (Developer Debug)
                </span>
                <button
                  onClick={handleCopyPayload}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Đã sao chép!' : 'Sao chép toàn bộ JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed max-h-[650px]">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          ) : (
            /* VISUAL STORY MODE */
            <div className="space-y-6">
              {/* 1. EXECUTIVE STORY CARD (Bản tường trình sự kiện tự nhiên) */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isFailed
                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-100'
                    : isWarning
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-100'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Diễn biến sự kiện tóm lược
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed">
                      Vào lúc <strong className="font-semibold text-slate-900 dark:text-white">{event.timestamp}</strong>,{' '}
                      tài khoản <strong className="font-semibold text-orange-600 dark:text-orange-400">{event.actor.name}</strong>{' '}
                      ({event.actor.role || 'Người dùng'}) đã thực hiện thao tác{' '}
                      <strong className="font-semibold underline decoration-orange-400 underline-offset-4 text-slate-900 dark:text-white">
                        {actionInfo.title}
                      </strong>{' '}
                      trên đối tượng <strong className="font-semibold text-slate-900 dark:text-white">"{event.target.title || event.target.id}"</strong>{' '}
                      thuộc phân hệ <strong className="font-semibold uppercase text-slate-700 dark:text-slate-300">{event.target.module}</strong>.
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {actionInfo.desc}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        event.result === 'success'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : event.result === 'failed' || event.result === 'denied'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {event.result === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                      <span>
                        {event.result === 'success'
                          ? 'THÀNH CÔNG'
                          : event.result === 'failed'
                          ? 'THẤT BẠI'
                          : event.result === 'denied'
                          ? 'BỊ CHẶN QUYỀN'
                          : 'MỘT PHẦN'}
                      </span>
                    </span>

                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                      Mức độ: {event.action.severity}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. CHẨN ĐOÁN SỰ CỐ (Chỉ hiện khi FAILED / DENIED / WARNING) */}
              {isFailed && (
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Chẩn đoán Sự cố & Khuyến nghị Khắc phục</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Lý do thất bại ghi nhận từ hệ thống:</span>
                      <div className="mt-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60 font-mono text-rose-600 dark:text-rose-400 font-semibold break-words">
                        {event.resultMessage || 'Thao tác gặp lỗi bất ngờ trong quá trình thực thi trên máy chủ.'}
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Đánh giá an toàn dữ liệu:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Hệ thống đã tự động hủy bỏ giao dịch (Rollback) hoặc dọn dẹp các tệp tạm an toàn. Không có dữ liệu bất thường nào bị rò rỉ hoặc phá hủy.
                      </p>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      <strong>Gợi ý hành động:</strong> Kiểm tra lại cấu hình kho lưu trữ (Storage bucket), quyền hạn của tài khoản hoặc thử thao tác lại. Nếu lỗi tiếp diễn, cung cấp mã tương quan (Correlation ID) cho bộ phận kỹ thuật.
                    </div>
                  </div>
                </div>
              )}

              {/* 3. BỐ CỤC 2 CỘT (MAIN CONTENT & SIDEBAR) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* CỘT CHÍNH (7/12) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* DIFF INSPECTOR (Biến động dữ liệu Trước / Sau) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-500" />
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                          Biến động Thuộc tính Dữ liệu (Field Diff)
                        </h4>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        {event.changes?.length || 0} thay đổi
                      </span>
                    </div>

                    {!event.changes || event.changes.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
                        <FileText className="w-6 h-6 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold text-slate-600 dark:text-slate-400">Không có biến động thuộc tính bảng ghi</p>
                        <p className="mt-1 text-[11px]">
                          Đây là thao tác đọc, truy vấn báo cáo, xuất tệp hoặc xác thực không làm thay đổi các trường dữ liệu thực thể.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {event.changes.map((change, idx) => {
                          const isNew = change.oldValue === null || change.oldValue === undefined;
                          const isRemoved = change.newValue === null || change.newValue === undefined;

                          return (
                            <div
                              key={idx}
                              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-850 text-xs"
                            >
                              {/* Field Header */}
                              <div className="bg-slate-100/80 dark:bg-slate-800 px-3.5 py-2 flex items-center justify-between font-bold">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-900 dark:text-white">
                                    {humanizeFieldName(change.field)}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    ({change.field})
                                  </span>
                                </div>

                                {change.isRedacted ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Bảo mật che giấu
                                  </span>
                                ) : isNew ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                    Thêm mới
                                  </span>
                                ) : isRemoved ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                    Đã xóa
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                    Chỉnh sửa
                                  </span>
                                )}
                              </div>

                              {/* Field Body */}
                              {change.isRedacted ? (
                                <div className="p-3 bg-purple-500/5 text-purple-800 dark:text-purple-300 text-[11px] flex items-start gap-2">
                                  <Lock className="w-4 h-4 shrink-0 text-purple-500 mt-0.5" />
                                  <span>
                                    {change.redactionReason ||
                                      'Trường dữ liệu nhạy cảm (mật khẩu, khóa API hoặc thông tin cá nhân) được che giấu tự động theo chính sách an ninh.'}
                                  </span>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 text-xs">
                                  {/* Old Value */}
                                  <div className="p-3 space-y-1 bg-rose-500/5">
                                    <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 block">
                                      Trước thay đổi:
                                    </span>
                                    <pre className="font-mono whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                                      {formatValueDisplay(change.oldValue)}
                                    </pre>
                                  </div>

                                  {/* New Value */}
                                  <div className="p-3 space-y-1 bg-emerald-500/5">
                                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                                      Sau thay đổi:
                                    </span>
                                    <pre className="font-mono whitespace-pre-wrap break-words font-semibold text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
                                      {formatValueDisplay(change.newValue)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* THÔNG TIN ĐỐI TƯỢNG (Target Details) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        Đối tượng Chịu tác động (Target Object)
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400">Tiêu đề đối tượng:</span>
                        <strong className="text-slate-900 dark:text-white font-semibold">
                          {event.target.title || '(Không có tiêu đề)'}
                        </strong>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400">Loại thực thể (Type):</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                          {event.target.type}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400">Mã định danh (Entity ID):</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] break-all">
                          {event.target.id}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400">Phân hệ quản lý:</span>
                        <span className="font-bold uppercase text-orange-600 dark:text-orange-400">
                          {event.target.module}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400">Không gian (Workspace):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {event.scope.siteName} [{event.scope.siteId}]
                        </span>
                      </div>

                      {event.target.url && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400">Đường dẫn liên quan:</span>
                          <a
                            href={event.target.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-blue-600 hover:text-blue-700 dark:text-blue-400 underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Xem liên kết</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CỘT PHỤ (SIDEBAR - 5/12) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* THẺ TÁC NHÂN (ACTOR CARD) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <User className="w-4 h-4 text-orange-500" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        Người thực hiện (Actor)
                      </h4>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                        {event.actor.name.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-slate-900 dark:text-white font-bold block truncate">
                          {event.actor.name}
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 inline-block mt-0.5">
                          {event.actor.role || 'Quản trị viên'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                      {event.actor.email && (
                        <div>
                          <span className="text-slate-400 block text-[11px]">Email:</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{event.actor.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 block text-[11px]">Mã tài khoản (User ID):</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{event.actor.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* THIẾT BỊ & MẠNG (NETWORK & CLIENT DEVICE) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Laptop className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        Môi trường & Thiết bị
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Địa chỉ IP mạng:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Network className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {event.actor.ipAddress}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Trình duyệt & Nền tảng:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                          {deviceInfo.browser} ({deviceInfo.os})
                        </span>
                        <span
                          className="font-mono text-[10px] text-slate-400 block truncate mt-1 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded"
                          title={event.actor.userAgent}
                        >
                          {event.actor.userAgent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DẤU VẾT KỸ THUẬT (CORRELATION & TRACEABILITY) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Terminal className="w-4 h-4 text-purple-500" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        Dấu vết Kỹ thuật (Traceability)
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Mã tương quan (Correlation ID):</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(event.context.correlationId);
                            }}
                            title="Sao chép Correlation ID"
                            className="text-purple-600 hover:text-purple-700 text-[10px] font-bold cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                        <span className="font-mono text-[11px] text-purple-700 dark:text-purple-300 font-semibold break-all block mt-0.5 bg-purple-500/5 p-1.5 rounded border border-purple-500/10">
                          {event.context.correlationId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Môi trường (Environment):</span>
                        <span className="font-mono font-bold uppercase text-slate-900 dark:text-white">
                          {event.context.environment}
                        </span>
                      </div>

                      {event.technicalRef && (
                        <>
                          {event.technicalRef.httpMethod && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">HTTP Method:</span>
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                {event.technicalRef.httpMethod}
                              </span>
                            </div>
                          )}

                          {event.technicalRef.endpoint && (
                            <div>
                              <span className="text-slate-400 text-[11px] block">Endpoint API:</span>
                              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all block mt-0.5">
                                {event.technicalRef.endpoint}
                              </span>
                            </div>
                          )}

                          {event.technicalRef.executionTimeMs !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Thời gian thực thi:</span>
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {event.technicalRef.executionTimeMs} ms
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shrink-0">
          <button
            onClick={handleCopyId}
            className="px-3.5 py-2 bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId ? 'Đã sao chép ID!' : 'Sao chép Event ID'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
          >
            Đóng Giao diện
          </button>
        </div>
      </div>
    </div>
  );
};
