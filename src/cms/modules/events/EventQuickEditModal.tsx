import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Sparkles, MapPin, Clock } from 'lucide-react';
import { EventItem, EventCategory, EditorialStatus, EventProgressStatus } from './types';

interface EventQuickEditModalProps {
  isOpen: boolean;
  event: EventItem | null;
  categories: EventCategory[];
  onSave: (updatedData: Partial<EventItem>) => void;
  onClose: () => void;
}

export const EventQuickEditModal: React.FC<EventQuickEditModalProps> = ({
  isOpen,
  event,
  categories,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [alias, setAlias] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [timeEvent, setTimeEvent] = useState('');
  const [endTime, setEndTime] = useState('');
  const [place, setPlace] = useState('');
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>('published');
  const [eventStatus, setEventStatus] = useState<EventProgressStatus>('upcoming');
  const [published, setPublished] = useState(true);
  const [isHot, setIsHot] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [showInHome, setShowInHome] = useState(true);
  const [ordering, setOrdering] = useState(1);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setAlias(event.alias || '');
      setCategoryId(event.category_id || categories[0]?.id || '');
      setTimeEvent(event.time_event || '');
      setEndTime(event.end_time || '');
      setPlace(event.place || '');
      setEditorialStatus(event.editorial_status || (event.published ? 'published' : 'draft'));
      setEventStatus(event.event_status || 'upcoming');
      setPublished(event.published ?? true);
      setIsHot(event.is_hot ?? false);
      setIsNew(event.is_new ?? false);
      setShowInHome(event.show_in_home ?? true);
      setOrdering(event.ordering || 1);
    }
  }, [event, categories]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề sự kiện!');
      return;
    }

    onSave({
      title,
      alias,
      category_id: categoryId,
      time_event: timeEvent,
      end_time: endTime,
      place,
      editorial_status: editorialStatus,
      event_status: eventStatus,
      published: editorialStatus === 'published' ? true : published,
      is_hot: isHot,
      is_new: isNew,
      show_in_home: showInHome,
      ordering: Number(ordering) || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Sửa nhanh Sự kiện
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cập nhật nhanh thông tin & 2 tầng trạng thái mà không cần vào Form đầy đủ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Tiêu đề sự kiện <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Alias & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Đường dẫn phụ (Alias)
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Danh mục sự kiện
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={timeEvent}
                onChange={(e) => setTimeEvent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Địa điểm
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Địa điểm hoặc Online"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* DUAL STATUSES (2 TẦNG TRẠNG THÁI) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold uppercase text-[10px] tracking-wider text-orange-600 dark:text-orange-400">
              Cấu hình 2 Tầng Trạng Thái Độc Lập
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Layer 1: Trạng thái biên tập */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Trạng thái Biên tập
                </label>
                <select
                  value={editorialStatus}
                  onChange={(e) => setEditorialStatus(e.target.value as EditorialStatus)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="pending_review">Chờ duyệt (Pending Review)</option>
                  <option value="approved">Đã duyệt (Approved)</option>
                  <option value="published">Đã xuất bản (Published)</option>
                  <option value="rejected">Bị trả lại (Rejected)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              {/* Layer 2: Trạng thái diễn ra */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Trạng thái Diễn ra
                </label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value as EventProgressStatus)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="upcoming">Sắp diễn ra (Upcoming)</option>
                  <option value="ongoing">Đang diễn ra (Ongoing)</option>
                  <option value="ended">Đã kết thúc (Ended)</option>
                  <option value="cancelled">Đã hủy (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isHot}
                onChange={(e) => setIsHot(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span>Nổi bật (Hot)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span>Mới (New)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showInHome}
                onChange={(e) => setShowInHome(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span>Hiện trang chủ</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Thứ tự:</span>
              <input
                type="number"
                min={1}
                value={ordering}
                onChange={(e) => setOrdering(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 text-center font-bold rounded-lg border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Cập nhật</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
