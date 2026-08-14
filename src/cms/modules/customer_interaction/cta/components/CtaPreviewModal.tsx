import React, { useState } from 'react';
import {
  X,
  Eye,
  ExternalLink,
  MessageSquare,
  Download,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  Sparkles,
  Send,
  MousePointer2,
  Copy,
  CheckCircle2,
  BarChart2,
  Layers,
  Code,
} from 'lucide-react';
import { CtaItem } from '../types';
import { ACTION_TYPES } from '../../shared/constants/actionTypes';

interface CtaPreviewModalProps {
  isOpen: boolean;
  cta: CtaItem | null;
  onClose: () => void;
}

export const CtaPreviewModal: React.FC<CtaPreviewModalProps> = ({
  isOpen,
  cta,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [clickedMessage, setClickedMessage] = useState<string | null>(null);

  if (!isOpen || !cta) return null;

  const actionInfo = ACTION_TYPES.find((a) => a.value === cta.actionConfig.type);
  const variantClass = cta.styleVariant === 'secondary'
    ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-900/20'
    : cta.styleVariant === 'outline'
      ? 'border border-orange-600 bg-transparent text-orange-600 hover:bg-orange-50 shadow-none'
      : cta.styleVariant === 'gradient'
        ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-orange-600/25'
        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/25';

  const handleCopyShortcode = () => {
    navigator.clipboard.writeText(`{{cta:${cta.code}}}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestClick = () => {
    let msg = 'Đã kích hoạt hành động nút!';
    if (cta.actionConfig.type === 'open_form') {
      msg = `Mở Popup Biểu mẫu ID: ${cta.actionConfig.formId || 'Mặc định'}`;
    } else if (cta.actionConfig.type === 'redirect_internal' || cta.actionConfig.type === 'redirect_external') {
      msg = `Chuyển hướng tới URL: ${cta.actionConfig.url || '/'}`;
    } else if (cta.actionConfig.type === 'call_phone') {
      msg = `Gọi hotline: ${cta.actionConfig.phoneNumber || '024 3976 1381'}`;
    } else if (cta.actionConfig.type === 'download_file') {
      msg = `Tải tệp tin ID: ${cta.actionConfig.fileId || 'file.pdf'}`;
    }
    setClickedMessage(msg);
    setTimeout(() => setClickedMessage(null), 3000);
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4" />;
      case 'Download':
        return <Download className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      case 'Mail':
        return <Mail className="w-4 h-4" />;
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'ArrowRight':
        return <ArrowRight className="w-4 h-4" />;
      case 'ExternalLink':
        return <ExternalLink className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Send':
        return <Send className="w-4 h-4" />;
      default:
        return <MousePointer2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Xem trước Nút CTA
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Interactive Button Box */}
          <div className="p-8 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center gap-3 min-h-[160px] text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Nút hiển thị trên giao diện Website
            </span>

            <button
              type="button"
              onClick={handleTestClick}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-all cursor-pointer active:scale-95 ${variantClass}`}
            >
              {renderIcon(cta.icon)}
              <span>{cta.displayText}</span>
            </button>

            {clickedMessage && (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-in zoom-in-95">
                {clickedMessage}
              </div>
            )}
          </div>

          {/* Details Metadata */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tên quản trị:</span>
              <span className="font-bold text-slate-900 dark:text-white">{cta.adminName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mã nhúng (Shortcode):</span>
              <div className="flex items-center gap-1.5">
                <code className="font-mono text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                  {`{{cta:${cta.code}}}`}
                </code>
                <button
                  type="button"
                  onClick={handleCopyShortcode}
                  className="p-1 text-slate-400 hover:text-orange-600 transition-colors"
                  title="Sao chép"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Hành động thực thi:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {actionInfo?.label || cta.actionConfig.type}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500">Thống kê lượt nhấn:</span>
              <span className="font-extrabold text-emerald-600">
                {cta.analytics.clicks} lượt (CTR: {cta.analytics.ctr}%)
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
