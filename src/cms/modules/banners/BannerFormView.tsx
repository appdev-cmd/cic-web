import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Video,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  Phone,
  Globe,
  Facebook,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Banner, BANNER_STATUS_OPTIONS } from './types';
import { mockBannerCategories } from '../banner_categories/mockData';

interface BannerFormViewProps {
  bannerToEdit: Banner | null;
  onSave: (formData: Partial<Banner>) => void;
  onCancel: () => void;
}

export const BannerFormView: React.FC<BannerFormViewProps> = ({
  bannerToEdit,
  onSave,
  onCancel,
}) => {
  // Form State - Core Content
  const [name, setName] = useState(bannerToEdit?.name || '');
  const [alias, setAlias] = useState(bannerToEdit?.alias || '');
  const [description, setDescription] = useState(bannerToEdit?.description || '');
  const [link, setLink] = useState(bannerToEdit?.link || '');
  const [categoryId, setCategoryId] = useState(
    bannerToEdit?.category_id || mockBannerCategories[0]?.id || 'bcat_001'
  );
  const [linkVideo, setLinkVideo] = useState(bannerToEdit?.link_video || '');
  const [icon, setIcon] = useState(bannerToEdit?.icon || 'Sparkles');

  // Form State - Image & Dimensions
  const [image, setImage] = useState(
    bannerToEdit?.image ||
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop'
  );
  const [width, setWidth] = useState<number | ''>(bannerToEdit?.width ?? 1200);
  const [height, setHeight] = useState<number | ''>(bannerToEdit?.height ?? 300);

  // Form State - Schedule & Status
  const [dateStart, setDateStart] = useState(bannerToEdit?.date_start || '2026-08-01');
  const [dateEnd, setDateEnd] = useState(bannerToEdit?.date_end || '2026-08-31');
  const [isUse, setIsUse] = useState(bannerToEdit ? bannerToEdit.is_use : true);
  const [status, setStatus] = useState<'running' | 'expired' | 'pending'>(
    bannerToEdit?.status || 'running'
  );
  const [published, setPublished] = useState(bannerToEdit ? bannerToEdit.published : true);
  const [ordering, setOrdering] = useState<number | ''>(bannerToEdit?.ordering ?? 1);

  // Form State - Publisher Info (Collapsible Card default closed)
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [elUserName, setElUserName] = useState(bannerToEdit?.el_user_name || '');
  const [elInfo, setElInfo] = useState(bannerToEdit?.el_info || '');
  const [elAddress, setElAddress] = useState(bannerToEdit?.el_address || '');
  const [elMobilephone, setElMobilephone] = useState(bannerToEdit?.el_mobilephone || '');
  const [elLinkWebsite, setElLinkWebsite] = useState(bannerToEdit?.el_link_website || '');
  const [elLinkFacebook, setElLinkFacebook] = useState(bannerToEdit?.el_link_facebook || '');

  // Validation state
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});

  // Auto-generate alias from name
  useEffect(() => {
    if (!bannerToEdit && name && !alias) {
      const generatedAlias = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setAlias(generatedAlias);
    }
  }, [name, alias, bannerToEdit]);

  // Update dimensions when category changes
  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const selectedCat = mockBannerCategories.find((c) => c.id === catId);
    if (selectedCat) {
      setWidth(selectedCat.width);
      setHeight(selectedCat.height);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; image?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập Tên banner!';
    }
    if (!image.trim()) {
      newErrors.image = 'Vui lòng chọn hoặc nhập URL ảnh banner!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const selectedCat = mockBannerCategories.find((c) => c.id === categoryId);

    onSave({
      name: name.trim(),
      alias: alias.trim(),
      description: description.trim(),
      image: image.trim(),
      width: Number(width) || 1200,
      height: Number(height) || 300,
      link: link.trim(),
      category_id: categoryId,
      category_name: selectedCat?.name || 'Danh mục Banner',
      date_start: dateStart,
      date_end: dateEnd,
      is_use: isUse,
      status,
      link_video: linkVideo.trim(),
      icon: icon.trim(),
      el_user_name: elUserName.trim(),
      el_info: elInfo.trim(),
      el_address: elAddress.trim(),
      el_mobilephone: elMobilephone.trim(),
      el_link_website: elLinkWebsite.trim(),
      el_link_facebook: elLinkFacebook.trim(),
      published,
      ordering: Number(ordering) || 1,
    });
  };

  // Aspect ratio calculation for dashed frame preview
  const wNum = Number(width) > 0 ? Number(width) : 1200;
  const hNum = Number(height) > 0 ? Number(height) : 300;
  const aspectRatioVal = `${wNum} / ${hNum}`;

  // Current status option object
  const currentStatusObj = BANNER_STATUS_OPTIONS.find((s) => s.value === status);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {bannerToEdit ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cấu hình hình ảnh, kích thước chuẩn, liên kết điều hướng và lịch trình xuất bản banner.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Hủy thao tác
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{bannerToEdit ? 'Lưu cập nhật' : 'Lưu banner'}</span>
          </button>
        </div>
      </div>

      {/* Validation Banner if Error */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Vui lòng kiểm tra các trường bị lỗi phía dưới:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.name && <li>{errors.name}</li>}
              {errors.image && <li>{errors.image}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* LAYOUT 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: NỘI DUNG & THÔNG TIN NGƯỜI ĐĂNG (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Thông tin cơ bản Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <span>Nội dung Banner</span>
            </h2>

            {/* FIELD: name (Tên banner) - Required */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Tên banner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ví dụ: Khuyến mãi Bản quyền CSI ETABS Ultimate v21..."
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium rounded-xl border transition-all focus:outline-none focus:border-orange-500 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-red-500">{errors.name}</p>
              )}
            </div>

            {/* FIELD: alias */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Đường dẫn Alias
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="khuyen-mai-etabs-v21"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* FIELD: category_id (Danh mục banner dropdown) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Vị trí Danh mục Banner
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {mockBannerCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.width}x{cat.height}px)
                  </option>
                ))}
              </select>
            </div>

            {/* FIELD: link (Link khi click) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Liên kết đích khi nhấp vào Banner (Link)</span>
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://cic.com.vn/khuyen-mai..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* FIELD: description (Mô tả) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Mô tả chi tiết banner
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Nhập nội dung tóm tắt hoặc ghi chú chiến dịch quảng cáo..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* FIELD: link_video & icon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* link_video */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-500" />
                  <span>Link Video nhúng</span>
                </label>
                <input
                  type="text"
                  value={linkVideo}
                  onChange={(e) => setLinkVideo(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mã Icon đại diện</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Sparkles, Calendar, Star..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  <div className="w-9 h-9 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Collapsible Card "Thông tin người đăng" (Default Closed) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsUserCardOpen(!isUserCardOpen)}
              className="w-full p-4 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Thông tin người đăng / Đơn vị đặt quảng cáo
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ghi nhận thông tin liên hệ, hợp đồng và đối tác quảng cáo (Tùy chọn)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[11px] font-semibold hidden sm:inline">
                  {isUserCardOpen ? 'Thu gọn' : 'Mở rộng'}
                </span>
                {isUserCardOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {isUserCardOpen && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* el_user_name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span>Tên người đăng / Đại diện khách hàng (el_user_name)</span>
                  </label>
                  <input
                    type="text"
                    value={elUserName}
                    onChange={(e) => setElUserName(e.target.value)}
                    placeholder="Nguyễn Văn A (Trưởng phòng PR)..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* el_info */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Thông tin thêm người đăng (el_info)
                  </label>
                  <textarea
                    value={elInfo}
                    onChange={(e) => setElInfo(e.target.value)}
                    rows={2}
                    placeholder="Ghi chú về đơn vị đối tác, mã hợp đồng quảng cáo..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* el_address & el_mobilephone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Địa chỉ (el_address)</span>
                    </label>
                    <input
                      type="text"
                      value={elAddress}
                      onChange={(e) => setElAddress(e.target.value)}
                      placeholder="Số 37 Lê Thanh Nghị, Hà Nội"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-orange-500" />
                      <span>Số điện thoại (el_mobilephone)</span>
                    </label>
                    <input
                      type="text"
                      value={elMobilephone}
                      onChange={(e) => setElMobilephone(e.target.value)}
                      placeholder="0988.xxx.xxx"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* el_link_website & el_link_facebook */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Website đối tác (el_link_website)</span>
                    </label>
                    <input
                      type="text"
                      value={elLinkWebsite}
                      onChange={(e) => setElLinkWebsite(e.target.value)}
                      placeholder="https://doitac.com.vn"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook đối tác (el_link_facebook)</span>
                    </label>
                    <input
                      type="text"
                      value={elLinkFacebook}
                      onChange={(e) => setElLinkFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ÁNH + TRẠNG THÁI + LỊCH CHẠY (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Ảnh Banner (Dashed frame matching configured ratio) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                <span>Ảnh Banner chính</span> <span className="text-red-500">*</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {wNum} x {hNum} px
              </span>
            </div>

            {/* Dash Frame Container scaling dynamically to aspect ratio */}
            <div className="space-y-3">
              <div
                style={{ aspectRatio: aspectRatioVal }}
                className={`w-full bg-slate-100 dark:bg-slate-800/80 border-2 border-dashed rounded-xl overflow-hidden relative flex flex-col items-center justify-center transition-all ${
                  errors.image
                    ? 'border-red-500'
                    : 'border-orange-500/60 dark:border-orange-500/40 hover:border-orange-500'
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Preview banner"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="p-4 text-center text-slate-400 space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-semibold">Khung căn ảnh tỉ lệ {wNum}:{hNum}</p>
                  </div>
                )}

                {/* Overlay Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-md">
                  Tỉ lệ {wNum}x{hNum}
                </div>
              </div>

              {/* Image URL Input & Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Đường dẫn URL ảnh banner:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Preset image buttons */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-medium">Gợi ý mẫu:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImage(
                        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop'
                      )
                    }
                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 hover:text-orange-600 rounded text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Mẫu Top Leaderboard
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImage(
                        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop'
                      )
                    }
                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 hover:text-orange-600 rounded text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Mẫu Sidebar
                  </button>
                </div>
              </div>

              {/* width & height side-by-side inputs directly underneath frame */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Chiều rộng (Width - px)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={width}
                    onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Chiều cao (Height - px)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Lịch chạy (date_start & date_end) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Thời gian & Lịch chạy</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* date_start */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Ngày bắt đầu chạy
                </label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                />
              </div>

              {/* date_end */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Ngày kết thúc chạy
                </label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Trạng thái & Xuất bản */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <span>Cấu hình Trạng thái & Ưu tiên</span>
            </h2>

            {/* status (Trạng thái dropdown + Badge màu cạnh dropdown) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Trạng thái hoạt động
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {BANNER_STATUS_OPTIONS.map((stOpt) => (
                    <option key={stOpt.value} value={stOpt.value}>
                      {stOpt.label}
                    </option>
                  ))}
                </select>

                {currentStatusObj && (
                  <span
                    className={`px-3 py-2 text-xs font-bold rounded-xl border shrink-0 ${currentStatusObj.badgeClass} ${currentStatusObj.badgeDarkClass}`}
                  >
                    {currentStatusObj.label}
                  </span>
                )}
              </div>
            </div>

            {/* is_use (Đang sử dụng) switch */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  Đang sử dụng (is_use)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Kích hoạt banner chạy trên giao diện public
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsUse(!isUse)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isUse ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isUse ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* published (Xuất bản) switch */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  Xuất bản (published)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bật để công khai dữ liệu trên CMS
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

            {/* ordering */}
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
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-end gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Hủy thao tác
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{bannerToEdit ? 'Lưu cập nhật' : 'Lưu banner'}</span>
        </button>
      </div>
    </form>
  );
};
