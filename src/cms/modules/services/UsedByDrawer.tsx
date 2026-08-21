import React from 'react';
import { X, ExternalLink, Link2, LayoutGrid, Menu, FileText, AlertTriangle } from 'lucide-react';
import { ServiceUsedByReference } from './types';

interface UsedByDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  references: ServiceUsedByReference[];
}

export const UsedByDrawer: React.FC<UsedByDrawerProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  references,
}) => {
  if (!isOpen) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'menu': return <Menu className="w-4 h-4 text-indigo-500" />;
      case 'home_block': return <LayoutGrid className="w-4 h-4 text-orange-500" />;
      case 'landing_page': return <FileText className="w-4 h-4 text-emerald-500" />;
      default: return <Link2 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Danh sách nơi sử dụng (Used-By Impact)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {serviceTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Lưu ý: Bỏ xuất bản hoặc xóa dịch vụ này sẽ ảnh hưởng trực tiếp đến các vị trí liên kết bên dưới.
            </span>
          </div>

          {references.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Dịch vụ chưa được liên kết ở vị trí menu hoặc khối nội dung nào.
            </div>
          ) : (
            <div className="space-y-3">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-2xs">
                      {renderIcon(ref.source_type)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {ref.source_title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {ref.source_url}
                      </p>
                    </div>
                  </div>

                  <a
                    href={ref.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
