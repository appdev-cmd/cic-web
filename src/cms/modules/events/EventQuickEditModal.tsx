import React, { useEffect, useState } from 'react';
import { Save, Sparkles, X } from 'lucide-react';
import type { EditorialStatus, EventItem } from './types';

interface EventQuickEditModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onSave: (updatedData: Partial<EventItem>) => void;
  onClose: () => void;
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

export const EventQuickEditModal: React.FC<EventQuickEditModalProps> = ({ isOpen, event, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [alias, setAlias] = useState('');
  const [timeEvent, setTimeEvent] = useState('');
  const [endTime, setEndTime] = useState('');
  const [place, setPlace] = useState('');
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>('draft');
  const [isHot, setIsHot] = useState(false);
  const [showInHome, setShowInHome] = useState(false);
  const [ordering, setOrdering] = useState(1);

  useEffect(() => {
    if (!event) return;
    setTitle(event.title || '');
    setAlias(event.alias || '');
    setTimeEvent(event.time_event || '');
    setEndTime(event.end_time || '');
    setPlace(event.place || '');
    setEditorialStatus(event.editorial_status || (event.published ? 'published' : 'draft'));
    setIsHot(event.is_hot ?? false);
    setShowInHome(event.show_in_home ?? false);
    setOrdering(event.ordering || 1);
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    if (!title.trim() || !timeEvent || !endTime) {
      window.alert('Vui lòng nhập tiêu đề, thời gian bắt đầu và thời gian kết thúc.');
      return;
    }
    if (new Date(endTime).getTime() <= new Date(timeEvent).getTime()) {
      window.alert('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }
    onSave({
      title: title.trim(), alias, time_event: timeEvent, end_time: endTime, place,
      editorial_status: editorialStatus,
      published: editorialStatus === 'published',
      is_hot: isHot, show_in_home: showInHome,
      ordering: Number(ordering) || 1,
    });
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5"><span className="rounded-xl bg-orange-500/10 p-2 text-orange-600"><Sparkles className="h-5 w-5" /></span><div><h2 className="text-sm font-bold">Sửa nhanh sự kiện</h2><p className="text-xs text-slate-500">Cập nhật các trường chính theo dữ liệu sự kiện hiện có.</p></div></div>
        <button type="button" onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label="Đóng"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <label className="block space-y-1.5 text-xs font-bold"><span>Tiêu đề sự kiện *</span><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} /></label>
        <label className="block space-y-1.5 text-xs font-bold"><span>Alias</span><input value={alias} onChange={(e) => setAlias(e.target.value)} className={inputClass} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-1.5 text-xs font-bold"><span>Thời gian bắt đầu *</span><input required type="datetime-local" value={timeEvent} onChange={(e) => setTimeEvent(e.target.value)} className={inputClass} /></label><label className="block space-y-1.5 text-xs font-bold"><span>Thời gian kết thúc *</span><input required type="datetime-local" min={timeEvent} value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} /></label></div>
        <label className="block space-y-1.5 text-xs font-bold"><span>Địa điểm</span><input value={place} onChange={(e) => setPlace(e.target.value)} className={inputClass} /></label>
        <label className="block space-y-1.5 text-xs font-bold"><span>Trạng thái</span><select value={editorialStatus} onChange={(e) => setEditorialStatus(e.target.value as EditorialStatus)} className={inputClass}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option></select></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={isHot} onChange={(e) => setIsHot(e.target.checked)} />Sự kiện nổi bật</label>
          <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={showInHome} onChange={(e) => setShowInHome(e.target.checked)} />Hiện trang chủ</label>
          <label className="flex items-center gap-2 text-xs font-semibold"><span>Thứ tự</span><input type="number" min={1} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} className={`${inputClass} w-20`} /></label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800"><button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold">Hủy</button><button type="submit" className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white"><Save className="h-4 w-4" />Lưu thay đổi</button></div>
      </form>
    </div>
  </div>;
};
