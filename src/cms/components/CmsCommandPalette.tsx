import React, { useState, useEffect } from 'react';
import { Search, Package, FileText, Newspaper, Image as ImageIcon, Users, Settings, Plus, ExternalLink, X, ArrowRight } from 'lucide-react';

interface CmsCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (path: string, label: string) => void;
}

export const CmsCommandPalette: React.FC<CmsCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPages = [
    { label: 'Trang tổng quan', category: 'Điều hướng', path: '/cms/dashboard', icon: FileText },
    { label: 'Quản lý Trang tĩnh', category: 'Nội dung', path: '/cms/static-pages', icon: FileText },
    { label: 'Quản lý Sản phẩm phần mềm', category: 'Sản phẩm', path: '/cms/products', icon: Package },
    { label: 'Tin tức & Bài viết chuyên ngành', category: 'Nội dung', path: '/cms/news', icon: Newspaper },
    { label: 'Yêu cầu từ khách hàng', category: 'Khách hàng', path: '/cms/contact-requests', icon: FileText },
    { label: 'Quản lý Banner quảng cáo', category: 'Nội dung', path: '/cms/banners', icon: ImageIcon },
    { label: 'Quản trị viên & Phân quyền', category: 'Hệ thống', path: '/cms/users', icon: Users },
    { label: 'Cấu hình chung hệ thống CMS', category: 'Cấu hình', path: '/cms/settings', icon: Settings },
  ];

  const filteredPages = quickPages.filter(p =>
    p.label.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Gõ lệnh hoặc từ khóa tìm kiếm (VD: sản phẩm, tin tức, banner...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredPages.length > 0 ? (
            filteredPages.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectAction(item.path, item.label);
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs text-left flex items-center justify-between hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-orange-500/10 text-slate-500 group-hover:text-orange-600">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Không tìm thấy lệnh hoặc trang phù hợp với "{query}"
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Mẹo: Nhấn <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded">Esc</kbd> để đóng</span>
          </div>
          <span>CIC Command Palette v2.4</span>
        </div>
      </div>
    </div>
  );
};
