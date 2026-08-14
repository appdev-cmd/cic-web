import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Globe,
  Link,
  Eye,
  Sparkles,
  FolderTree,
  Trash2,
} from 'lucide-react';
import { MenuItem } from './types';

interface MenuItemEditorProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
  onDelete?: (itemId: string) => void;
  maxDepth: number;
  availableParents: { id: string; label: string; depth: number }[];
}

export const MenuItemEditor: React.FC<MenuItemEditorProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  maxDepth,
  availableParents,
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    label: '',
    url: '/',
    open_in_new_tab: false,
    icon_name: '',
    is_visible: true,
    parent_id: null,
  });

  const [activeTab, setActiveTab] = useState<'general' | 'target' | 'appearance' | 'visibility'>('general');

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
      });
    } else {
      setFormData({
        label: '',
        url: '/',
        open_in_new_tab: false,
        icon_name: '',
        is_visible: true,
        parent_id: null,
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) return;

    const updated: MenuItem = {
      id: item ? item.id : `item_${Date.now()}`,
      group_id: item ? item.group_id : 'grp_header_main',
      parent_id: formData.parent_id || null,
      depth: item ? item.depth : 0,
      display_order: item ? item.display_order : 99,
      label: formData.label || '',
      url: formData.url || '/',
      open_in_new_tab: !!formData.open_in_new_tab,
      icon_name: formData.icon_name || '',
      is_visible: formData.is_visible !== false,
      children: item?.children || [],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {item ? `Chỉnh sửa Mục Menu: "${item.label}"` : 'Tạo mới Mục Điều Hướng'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cập nhật thông tin mục menu.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Nội dung</span>
          </button>

          <button
            onClick={() => setActiveTab('target')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'target'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Đích liên kết (Target)</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Giao diện & Icon</span>
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'visibility'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Phân quyền & Hiển thị</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Display label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nhãn hiển thị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ví dụ: Sản phẩm & Giải pháp, Liên hệ"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Parent Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mục cha (Parent Menu Item)
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Cấp cao nhất (Root - Level 1) --</option>
                  {availableParents
                    .filter((p) => p.id !== item?.id && p.depth < maxDepth - 1)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {'- '.repeat(p.depth)} {p.label} (Level {p.depth + 1})
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Giới hạn phân cấp độ sâu của nhóm menu này: Tối đa {maxDepth} cấp.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'target' && (
            <div className="space-y-4">
              {/* URL Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn (Target URL) <span className="text-red-500">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/san-pham hoặc https://domain.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Open target window */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Mở trong cửa sổ mới (_blank)</p>
                  <p className="text-[11px] text-slate-500">
                    Bật tùy chọn này cho các liên kết external hoặc tài liệu PDF.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!!formData.open_in_new_tab}
                  onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Biểu tượng (Icon Name)
                </label>
                <input
                  type="text"
                  value={formData.icon_name || ''}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  placeholder="Ví dụ: Home, Package, Layers, Newspaper, PhoneCall, Globe"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Hỗ trợ các icon từ thư viện Lucide React.
                </p>
              </div>

            </div>
          )}

          {activeTab === 'visibility' && (
            <div className="space-y-4">
              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Kích hoạt hiển thị (Visible)</p>
                  <p className="text-[11px] text-slate-500">
                    Ẩn hoặc hiện mục menu này trên giao diện frontend.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_visible !== false}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                />
              </div>

            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          {item && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa mục này</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{item ? 'Cập nhật bản thảo' : 'Thêm vào cây Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
