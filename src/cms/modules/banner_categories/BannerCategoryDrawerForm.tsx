import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Grid,
  AlertCircle,
  HelpCircle,
  DollarSign,
  Calendar,
  Layers,
  Link as LinkIcon,
  Check,
  Maximize2,
} from 'lucide-react';
import { BannerCategory } from './types';

interface BannerCategoryDrawerFormProps {
  isOpen: boolean;
  categoryToEdit: BannerCategory | null;
  onSave: (formData: Partial<BannerCategory>) => void;
  onClose: () => void;
}

export const BannerCategoryDrawerForm: React.FC<BannerCategoryDrawerFormProps> = ({
  isOpen,
  categoryToEdit,
  onSave,
  onClose,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [width, setWidth] = useState<number | ''>(300);
  const [height, setHeight] = useState<number | ''>(250);
  const [price, setPrice] = useState<number | ''>(2500000);
  const [days, setDays] = useState<number | ''>(30);
  const [quantity, setQuantity] = useState<number | ''>(5);
  const [linkPost, setLinkPost] = useState('');
  const [published, setPublished] = useState(true);
  const [ordering, setOrdering] = useState<number | ''>(1);

  // Validation state
  const [nameError, setNameError] = useState<string | null>(null);

  // Sync state when editing or opening
  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setSummary(categoryToEdit.summary || '');
      setWidth(categoryToEdit.width ?? 300);
      setHeight(categoryToEdit.height ?? 250);
      setPrice(categoryToEdit.price ?? 0);
      setDays(categoryToEdit.days ?? 30);
      setQuantity(categoryToEdit.quantity ?? 1);
      setLinkPost(categoryToEdit.link_post || '');
      setPublished(categoryToEdit.published);
      setOrdering(categoryToEdit.ordering ?? 1);
    } else {
      setName('');
      setSummary('');
      setWidth(300);
      setHeight(250);
      setPrice(2500000);
      setDays(30);
      setQuantity(5);
      setLinkPost('');
      setPublished(true);
      setOrdering(1);
    }
    setNameError(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  // Calculate Aspect Ratio box preview values
  const wNum = Number(width) > 0 ? Number(width) : 1;
  const hNum = Number(height) > 0 ? Number(height) : 1;

  // Render proportional rectangle inside a 100x80 container box
  const maxBoxSize = 70;
  let previewWidth = maxBoxSize;
  let previewHeight = maxBoxSize;

  if (wNum >= hNum) {
    previewWidth = maxBoxSize;
    previewHeight = Math.max(16, Math.round((hNum / wNum) * maxBoxSize));
  } else {
    previewHeight = maxBoxSize;
    previewWidth = Math.max(16, Math.round((wNum / hNum) * maxBoxSize));
  }

  const aspectRatioRatioStr = (wNum / hNum).toFixed(2);

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Vui lòng nhập Tên danh mục banner!');
      return;
    }

    onSave({
      name: name.trim(),
      summary: summary.trim(),
      width: Number(width) || 300,
      height: Number(height) || 250,
      price: Number(price) || 0,
      days: Number(days) || 30,
      quantity: Number(quantity) || 1,
      link_post: linkPost.trim(),
      published,
      ordering: Number(ordering) || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* 1. DRAWER HEADER */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {categoryToEdit ? 'Chỉnh sửa Danh mục Banner' : 'Thêm mới Danh mục Banner'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cấu hình kích thước chuẩn, đơn giá và số lượng banner cho vị trí quảng cáo
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. DRAWER BODY - 1 COLUMN FORM */}
          <form id="banner-cat-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
            {/* FIELD 1: name (Tên danh mục) - Text Input, Required */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Tên danh mục banner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="Ví dụ: Banner Header Trang chủ, Banner Sidebar..."
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium rounded-xl border transition-all focus:outline-none focus:border-orange-500 ${
                  nameError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {nameError && (
                <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            {/* FIELD 2: summary (Mô tả) - Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Mô tả vị trí & thông tin danh mục
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="Nhập mô tả chi tiết vị trí hiển thị, yêu cầu ảnh thiết kế..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* FIELD 3: width & height (2 ô nhập số cạnh nhau 1 hàng + ô vuông preview tỉ lệ) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Kích thước chuẩn (px)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Tỉ lệ: {wNum}:{hNum} (~{aspectRatioRatioStr}:1)
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* 2 Inputs side by side */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {/* width */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Rộng (Width - px)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={width}
                      onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="300"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* height */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Cao (Height - px)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={height}
                      onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="250"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Aspect ratio preview box illustrating proportion */}
                <div className="w-24 h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-1.5 shrink-0 shadow-2xs">
                  <div className="text-[9px] font-bold text-slate-400 mb-1">Xem trước tỉ lệ</div>
                  <div
                    style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
                    className="bg-orange-500/20 border-2 border-dashed border-orange-500 rounded flex items-center justify-center transition-all duration-200"
                  >
                    <span className="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 truncate px-0.5">
                      {wNum}x{hNum}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FIELD 4 & 5: price (với "đ") & days (với "ngày") */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* price (Giá gói, suffix "đ") */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Giá gói quảng cáo</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="2500000"
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    đ
                  </span>
                </div>
                {typeof price === 'number' && price > 0 && (
                  <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    = {price.toLocaleString('vi-VN')} đ
                  </p>
                )}
              </div>

              {/* days (Số ngày hiển thị, suffix "ngày") */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>Số ngày hiển thị</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="30"
                    className="w-full pl-3 pr-14 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                    ngày
                  </span>
                </div>
              </div>
            </div>

            {/* FIELD 6: quantity (Số lượng cho phép) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>Số lượng banner cho phép đặt</span>
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-slate-400">
                Số lượng banner xoay vòng hoặc xếp hàng tại vị trí này.
              </p>
            </div>

            {/* FIELD 7: link_post (Link đăng ký mua banner) - Text Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Link đăng ký mua banner</span>
              </label>
              <input
                type="text"
                value={linkPost}
                onChange={(e) => setLinkPost(e.target.value)}
                placeholder="https://cic.com.vn/lien-he-quang-cao..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* FIELD 8 & 9: published (Xuất bản) & ordering (Thứ tự) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {/* published toggle switch */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Trạng thái Xuất bản (Published)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bật để vị trí danh mục khả dụng trên hệ thống
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      published ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* ordering number input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Thứ tự ưu tiên (Ordering)
                </label>
                <input
                  type="number"
                  min={1}
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </form>

          {/* 3. DRAWER FOOTER */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Hủy thao tác
            </button>
            <button
              type="submit"
              form="banner-cat-form"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{categoryToEdit ? 'Lưu cập nhật' : 'Tạo mới danh mục'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
