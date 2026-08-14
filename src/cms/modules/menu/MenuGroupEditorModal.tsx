import React, { useState, useEffect } from 'react';
import { X, Check, Layers } from 'lucide-react';
import { MenuGroup } from './types';

interface MenuGroupEditorModalProps {
  group: MenuGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: MenuGroup) => void;
}

export const MenuGroupEditorModal: React.FC<MenuGroupEditorModalProps> = ({
  group,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<MenuGroup>>({
    name: '',
    published: true,
    ordering: 1,
  });

  useEffect(() => {
    if (group) {
      setFormData(group);
    } else {
      setFormData({
        name: '',
        published: true,
        ordering: 1,
      });
    }
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const saved: MenuGroup = {
      id: group ? group.id : `grp_${Date.now()}`,
      name: formData.name || '',
      published: formData.published !== false,
      ordering: Number(formData.ordering) || 1,
    };

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {group ? `Cấu hình Nhóm Menu: ${group.name}` : 'Tạo mới Nhóm Menu Điều Hướng'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên nhóm menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Menu chính, Liên kết chân trang"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Thứ tự
              </label>
              <input
                type="number"
                min={1}
                value={formData.ordering || 1}
                onChange={(e) => setFormData({ ...formData, ordering: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Trạng thái
              </label>
              <select
                value={formData.published === false ? '0' : '1'}
                onChange={(e) => setFormData({ ...formData, published: e.target.value === '1' })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="1">Hiển thị</option>
                <option value="0">Ẩn</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu nhóm Menu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
