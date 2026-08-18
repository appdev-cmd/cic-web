import React, { useRef, useState } from 'react';
import { Upload, FileText, X, FolderOpen, CheckCircle2, Edit2, Link as LinkIcon, FileArchive, FileCode } from 'lucide-react';

interface ProductFileInputProps {
  label: string;
  value: string;
  onChange: (fileName: string) => void;
  placeholder?: string;
  accept?: string;
  onAutoFillName?: (name: string) => void;
  hint?: string;
}

export const ProductFileInput: React.FC<ProductFileInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Chọn file từ máy tính...',
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.7z,.tar,.gz,.exe,.msi,.dmg,.pkg,.apk,.txt,.csv',
  onAutoFillName,
  hint,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const cleanFileName = (filename: string) => {
    // Extract base name without extension for friendly auto-fill
    return filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file.name);
      if (onAutoFillName) {
        onAutoFillName(cleanFileName(file.name));
      }
      setIsManualEdit(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file.name);
      if (onAutoFillName) {
        onAutoFillName(cleanFileName(file.name));
      }
      setIsManualEdit(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <FileArchive className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    if (['exe', 'msi', 'dmg', 'pkg', 'bat', 'sh', 'apk'].includes(ext || '')) {
      return <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-4 h-4 text-red-500 shrink-0" />;
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileText className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-orange-500 shrink-0" />;
  };

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between min-h-[18px]">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {value && !isManualEdit && (
          <button
            type="button"
            onClick={() => setIsManualEdit(true)}
            className="text-[11px] font-semibold text-slate-500 hover:text-orange-600 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            Sửa link
          </button>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {isManualEdit ? (
        <div className="flex h-[42px] items-center gap-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập tên tệp hoặc đường dẫn..."
            className="w-full h-[42px] rounded-xl border border-slate-300 bg-white px-3 text-sm font-mono outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setIsManualEdit(false)}
            className="h-[42px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold shrink-0 flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Xong"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      ) : value ? (
        /* Selected File Card - Height matches standard inputs (h-[42px]) */
        <div className="flex h-[42px] items-center justify-between gap-2 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getFileIcon(value)}
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title={value}>
              {value}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-0.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/60 dark:bg-orange-950/40 dark:border-orange-900/50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
            >
              Đổi tệp
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title="Xóa tệp"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty File Picker - Height matches standard inputs (h-[42px]) */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex h-[42px] items-center justify-between px-3 rounded-xl border transition-all cursor-pointer ${
            isDragging
              ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/20'
              : 'border-slate-300 bg-white hover:border-orange-500 dark:border-slate-700 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Upload className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
            <span className="text-sm text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate font-normal">
              {placeholder}
            </span>
          </div>
          <span className="text-xs font-bold text-orange-600 px-2 py-0.5 rounded-lg bg-orange-50 border border-orange-200/60 dark:bg-orange-950/40 dark:border-orange-900/50 shrink-0 ml-2 group-hover:bg-orange-100 transition-colors">
            Chọn tệp
          </span>
        </div>
      )}

      {hint && <p className="mt-1 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
};
