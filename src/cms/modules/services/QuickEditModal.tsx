import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { ServiceItem } from './types';

interface QuickEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  owners: { id: string; name: string }[];
  onSave: (updated: ServiceItem) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  isOpen,
  onClose,
  service,
  owners,
  onSave,
}) => {
  if (!isOpen || !service) return null;

  const [formData, setFormData] = useState({
    display_order: service.display_order,
    owner_id: service.owner_id,
    placement: service.placement || [],
  });

  const [isDirty, setIsDirty] = useState(false);
  const [toastSuccess, setToastSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      display_order: service.display_order,
      owner_id: service.owner_id,
      placement: service.placement || [],
    });
    setIsDirty(false);
  }, [service]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleTogglePlacement = (placeKey: string) => {
    const current = [...formData.placement];
    const index = current.indexOf(placeKey);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(placeKey);
    }
    handleChange('placement', current);
  };

  const handleReset = () => {
    setFormData({
      display_order: service.display_order,
      owner_id: service.owner_id,
      placement: service.placement || [],
    });
    setIsDirty(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedOwner = owners.find((o) => o.id === formData.owner_id);

    const updatedService: ServiceItem = {
      ...service,
      display_order: Number(formData.display_order),
      owner_id: formData.owner_id,
      owner_name: selectedOwner ? selectedOwner.name : service.owner_name,
      placement: formData.placement,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    onSave(updatedService);
    setToastSuccess(true);
    setTimeout(() => {
      setToastSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Sửa nhanh dịch vụ (Quick Edit)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
              {service.code} - {service.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Chỉ sửa các trường hiển thị không có rủi ro nội dung.</span>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Người phụ trách (Owner)
            </label>
            <select
              value={formData.owner_id}
              onChange={(e) => handleChange('owner_id', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
            >
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Thứ tự ưu tiên hiển thị
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => handleChange('display_order', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Placement */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Vị trí hiển thị (Placement)
            </label>
            <div className="space-y-2">
              {[
                { key: 'home_featured', label: 'Dịch vụ nổi bật trang chủ' },
                { key: 'services_page', label: 'Trang dịch vụ chính' },
                { key: 'footer_links', label: 'Khối liên kết chân trang (Footer)' },
              ].map((p) => (
                <label
                  key={p.key}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.placement.includes(p.key)}
                    onChange={() => handleTogglePlacement(p.key)}
                    className="rounded text-orange-600 focus:ring-orange-500 dark:bg-slate-800 dark:border-slate-700"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {toastSuccess && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Đã cập nhật sửa nhanh thành công!
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 ${
                isDirty
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Hoàn tác (Undo)
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!isDirty}
                className={`px-4 py-2 text-xs font-medium rounded-lg text-white flex items-center gap-1.5 transition-colors ${
                  isDirty
                    ? 'bg-orange-600 hover:bg-orange-700 shadow-2xs'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" /> Lưu cập nhật
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
