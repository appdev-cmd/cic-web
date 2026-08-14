import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, Eye, CheckCircle, ExternalLink, Menu as MenuIcon, ChevronDown, ChevronRight, Globe, Layers, Search, Sparkles } from 'lucide-react';
import { MenuItem, MenuGroup } from './types';

interface MenuPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: MenuGroup;
  items: MenuItem[];
}

export const MenuPreviewModal: React.FC<MenuPreviewModalProps> = ({
  isOpen,
  onClose,
  group,
  items,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>('item_03');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs animate-in fade-in p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 flex flex-col h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Xem Trước Giao Diện Điều Hướng (Live Preview Simulation)
              </h3>
              <p className="text-[11px] text-slate-500">
                Nhóm: <strong className="text-slate-700 dark:text-slate-300">{group.name}</strong>
              </p>
            </div>
          </div>

          {/* Device Viewport Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                device === 'desktop'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (1280px)</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                device === 'tablet'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                device === 'mobile'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390px)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Frame Container */}
        <div className="flex-1 bg-slate-900/90 p-6 overflow-auto flex justify-center items-start">
          <div
            className={`bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col ${
              device === 'desktop'
                ? 'w-full max-w-5xl min-h-[500px]'
                : device === 'tablet'
                ? 'w-[768px] min-h-[500px]'
                : 'w-[390px] min-h-[580px]'
            }`}
          >
            {/* Simulated Website Header Bar */}
            <div className="bg-slate-900 text-white px-6 py-2 text-xs flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 text-slate-400">
                <span>Hotline: 024 3976 1381</span>
                <span>•</span>
                <span>Email: contact@cic.com.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-600/30 text-orange-400 font-bold text-[10px]">
                  Bản xem trước
                </span>
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>VIE</span>
              </div>
            </div>

            {/* Simulated Main Navigation Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between relative">
              {/* Brand Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-sm tracking-wider">
                  CIC
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    CIC TECHNOLOGY
                  </h4>
                  <p className="text-[9px] text-slate-400">CONSTRUCTION INFORMATICS CONSULTING</p>
                </div>
              </div>

              {/* Desktop Menu */}
              {device !== 'mobile' ? (
                <nav className="flex items-center gap-6">
                  {items.map((navItem) => {
                    const hasChildren = navItem.children && navItem.children.length > 0;
                    const isActive = activeSubMenu === navItem.id;

                    return (
                      <div key={navItem.id} className="relative group">
                        <button
                          onClick={() => setActiveSubMenu(isActive ? null : navItem.id)}
                          className={`text-xs font-bold py-2 flex items-center gap-1 transition ${
                            isActive
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-slate-700 dark:text-slate-200 hover:text-orange-600'
                          }`}
                        >
                          <span>{navItem.label}</span>
                          {hasChildren && <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </button>

                        {/* Dropdown Menu Preview */}
                        {hasChildren && isActive && (
                          <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                            {navItem.children!.map((child) => (
                              <div key={child.id} className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <a
                                  href={child.url}
                                  onClick={(e) => e.preventDefault()}
                                  className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-orange-600 block"
                                >
                                  {child.label}
                                </a>
                                {child.children && (
                                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-orange-200 dark:border-orange-900/50 pl-2">
                                    {child.children.map((subChild) => (
                                      <a
                                        key={subChild.id}
                                        href={subChild.url}
                                        onClick={(e) => e.preventDefault()}
                                        className="text-[11px] text-slate-500 hover:text-orange-600 block"
                                      >
                                        • {subChild.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              ) : (
                /* Mobile Menu Toggle */
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <MenuIcon className="w-5 h-5" />
                </button>
              )}

              {/* Action Button */}
              <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-500 transition shadow-2xs hidden sm:block">
                Tải Báo Giá
              </button>
            </header>

            {/* Mobile Drawer Drawer Simulation */}
            {device === 'mobile' && mobileMenuOpen && (
              <div className="bg-slate-900 text-white p-4 space-y-3 animate-in slide-in-from-top border-b border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mobile Menu Navigation
                </p>
                <div className="space-y-2">
                  {items.map((m) => (
                    <div key={m.id} className="border-b border-slate-800 pb-1">
                      <p className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{m.label}</span>
                        {m.children && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                      </p>
                      {m.children && (
                        <div className="ml-3 mt-1 space-y-1">
                          {m.children.map((c) => (
                            <p key={c.id} className="text-[11px] text-slate-300">
                              - {c.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dummy Content Body */}
            <div className="p-8 flex-1 bg-slate-50 dark:bg-slate-900/40 text-center flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-orange-400 mb-2" />
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Khu vực nội dung trang web chính (Simulated Website Content)
              </h5>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Giao diện điều hướng đang được kết nối với cây menu bản thảo hiện tại. Bạn có thể tương tác bấm mở các dropdown để thử nghiệm UX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
