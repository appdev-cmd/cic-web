import React, { useState } from 'react';
import {
  Eye,
  MessageSquare,
  Download,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Send,
  MousePointer2,
} from 'lucide-react';
import { CtaFormData } from '../types';

interface CtaLivePreviewCardProps {
  formData: CtaFormData;
  buttonSize: 'sm' | 'md' | 'lg';
}

export const CtaLivePreviewCard: React.FC<CtaLivePreviewCardProps> = ({
  formData,
  buttonSize,
}) => {
  const [previewHovered, setPreviewHovered] = useState(false);
  const buttonVariant = formData.styleVariant;

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
      case 'MousePointer2':
        return <MousePointer2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-orange-500" />
          Xem trước giao diện
        </h3>
        <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-md">
          Live Preview
        </span>
      </div>

      <div className="p-6 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-3 min-h-[140px]">
        <button
          type="button"
          onMouseEnter={() => setPreviewHovered(true)}
          onMouseLeave={() => setPreviewHovered(false)}
          className={`inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-md ${
            buttonSize === 'sm'
              ? 'px-3.5 py-2 text-xs'
              : buttonSize === 'lg'
              ? 'px-6 py-3.5 text-base'
              : 'px-4 py-2.5 text-sm'
          } ${
            buttonVariant === 'primary'
              ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20'
              : buttonVariant === 'secondary'
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
              : buttonVariant === 'outline'
              ? 'bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
              : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:brightness-105'
          }`}
        >
          {renderIcon(formData.icon)}
          <span>{formData.displayText || 'Nội dung hiển thị'}</span>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          {previewHovered ? 'Trạng thái: Hover State' : 'Rê chuột để thử hiệu ứng'}
        </span>
      </div>
    </div>
  );
};
