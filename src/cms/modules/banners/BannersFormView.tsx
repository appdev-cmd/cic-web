import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Info,
  Calendar,
  Link as LinkIcon,
  Video,
  Sparkles,
  Layers,
  AlertCircle,
  Upload,
  RefreshCw,
  Maximize2,
  Tag,
  Star,
  Package,
} from 'lucide-react';
import { BannerItem, BANNER_CATEGORIES } from './types';

interface BannersFormViewProps {
  bannerToEdit: BannerItem | null;
  onSave: (formData: Partial<BannerItem>) => void;
  onCancel: () => void;
}

// Preset Icon options for icon picker preview
const PRESET_ICONS = [
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Calendar', icon: Calendar },
  { name: 'Package', icon: Package },
  { name: 'ImageIcon', icon: ImageIcon },
  { name: 'Tag', icon: Tag },
  { name: 'Star', icon: Star },
];

export const BannersFormView: React.FC<BannersFormViewProps> = ({
  bannerToEdit,
  onSave,
  onCancel,
}) => {
  // Left Column State
  const [name, setName] = useState(bannerToEdit?.name || '');
  const [alias, setAlias] = useState(bannerToEdit?.alias || '');
  const [description, setDescription] = useState(bannerToEdit?.description || '');
  const [link, setLink] = useState(bannerToEdit?.link || '');
  const [linkVideo, setLinkVideo] = useState(bannerToEdit?.link_video || '');
  const [icon, setIcon] = useState(bannerToEdit?.icon || 'Sparkles');

  // Advertiser details (Collapsible card, default collapsed)
  const [isAdvertiserCardOpen, setIsAdvertiserCardOpen] = useState(false);
  const [elUserName, setElUserName] = useState(bannerToEdit?.el_user_name || '');
  const [elInfo, setElInfo] = useState(bannerToEdit?.el_info || '');
  const [elAddress, setElAddress] = useState(bannerToEdit?.el_address || '');
  const [elMobilephone, setElMobilephone] = useState(bannerToEdit?.el_mobilephone || '');
  const [elLinkWebsite, setElLinkWebsite] = useState(bannerToEdit?.el_link_website || '');
  const [elLinkFacebook, setElLinkFacebook] = useState(bannerToEdit?.el_link_facebook || '');

  // Right Column State
  const [image, setImage] = useState(
    bannerToEdit?.image ||
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&h=300&q=80'
  );
  const [width, setWidth] = useState<number | ''>(bannerToEdit?.width ?? 1200);
  const [height, setHeight] = useState<number | ''>(bannerToEdit?.height ?? 300);

  const [categoryId, setCategoryId] = useState(bannerToEdit?.category_id || 'bcat_001');
  const [dateStart, setDateStart] = useState(bannerToEdit?.date_start || '2026-08-01');
  const [dateEnd, setDateEnd] = useState(bannerToEdit?.date_end || '2026-08-31');

  const [isUse, setIsUse] = useState(bannerToEdit ? bannerToEdit.is_use : true);
  const [status, setStatus] = useState<'running' | 'expired' | 'pending'>(
    bannerToEdit?.status || 'running'
  );
  const [published, setPublished] = useState(bannerToEdit ? bannerToEdit.published : true);
  const [ordering, setOrdering] = useState<number | ''>(bannerToEdit?.ordering ?? 1);

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});

  // Auto-slug generator for alias
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/^-+/g, '')
      .replace(/-+$/g, '');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
    if (!bannerToEdit) {
      setAlias(generateSlug(val));
    }
  };

  // Handle Category Change -> Automatically fill width & height
  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const foundCat = BANNER_CATEGORIES.find((c) => c.id === catId);
    if (foundCat) {
      setWidth(foundCat.width);
      setHeight(foundCat.height);
    }
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; image?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập Tên banner!';
    }
    if (!image.trim()) {
      newErrors.image = 'Vui lòng nhập hoặc tải ảnh banner!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSave({
      name: name.trim(),
      alias: alias.trim() || generateSlug(name),
      description: description.trim(),
      image: image.trim(),
      width: Number(width) || 1200,
      height: Number(height) || 300,
      link: link.trim(),
      category_id: categoryId,
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

  // Calculate image container aspect ratio safely
  const wNum = Number(width) > 0 ? Number(width) : 1200;
  const hNum = Number(height) > 0 ? Number(height) : 300;
  const aspectRatioStr = `${wNum} / ${hNum}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. TOP HEADER BAR */}
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
              {bannerToEdit ? 'Chỉnh sửa Banner' : 'Thêm mới Banner'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cấu hình hình ảnh, kích thước tỉ lệ, lịch hiển thị và liên kết cho banner quảng cáo.
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
            <span>{bannerToEdit ? 'Lưu cập nhật' : 'Lưu Banner'}</span>
          </button>
        </div>
      </div>

      {/* Validation Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Vui lòng kiểm tra lại thông tin bị lỗi:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.name && <li>{errors.name}</li>}
              {errors.image && <li>{errors.image}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: NỘI DUNG & THÔNG TIN NGƯỜI ĐĂNG (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Thông tin cơ bản banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <span>Nội dung Banner</span>
            </h2>

            {/* FIELD: name (Tên banner) - Mandatory */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Tên banner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên chương trình hoặc tên banner quảng cáo..."
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium rounded-xl border transition-all focus:outline-none focus:border-orange-500 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.name && <p className="text-[11px] font-medium text-red-500">{errors.name}</p>}
            </div>

            {/* FIELD: alias (Alias) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Alias (Đường dẫn tĩnh)
                </label>
                <button
                  type="button"
                  onClick={() => setAlias(generateSlug(name))}
                  className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tự tạo alias</span>
                </button>
              </div>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="khuyen-mai-banner-2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* FIELD: description (Mô tả) - Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Mô tả chi tiết banner
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Nhập ghi chú hoặc mô tả nội dung chương trình khuyến mãi..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* FIELD: link (Link khi click) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Link chuyển hướng khi click banner</span>
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://cic.com.vn/chi-tiet-khuyen-mai..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Grid 2 cols: link_video & icon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* link_video */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-500" />
                  <span>Link Video bổ trợ (Youtube/Vimeo)</span>
                </label>
                <input
                  type="text"
                  value={linkVideo}
                  onChange={(e) => setLinkVideo(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Icon biểu trưng</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Sparkles, Calendar..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  {/* Preset Icon chips */}
                  <div className="flex items-center gap-1">
                    {PRESET_ICONS.map((pIcon) => {
                      const IconComp = pIcon.icon;
                      const isSelected = icon === pIcon.name;
                      return (
                        <button
                          key={pIcon.name}
                          type="button"
                          onClick={() => setIcon(pIcon.name)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                          }`}
                          title={pIcon.name}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Thông tin người đăng (Collapsible card, default closed) */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsAdvertiserCardOpen(!isAdvertiserCardOpen)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Thông tin người đăng banner
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cấu hình thông tin khách hàng hoặc phòng ban đăng ký quảng cáo vị trí này
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[11px] font-semibold hidden sm:inline">
                  {isAdvertiserCardOpen ? 'Thu gọn' : 'Mở rộng (6 trường)'}
                </span>
                {isAdvertiserCardOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* Collapsible Content */}
            {isAdvertiserCardOpen && (
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* el_user_name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>el_user_name (Tên người đăng / Đơn vị)</span>
                  </label>
                  <input
                    type="text"
                    value={elUserName}
                    onChange={(e) => setElUserName(e.target.value)}
                    placeholder="Nguyễn Văn A - Phòng Kinh doanh..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* el_info */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>el_info (Thông tin người đăng / Ghi chú)</span>
                  </label>
                  <textarea
                    value={elInfo}
                    onChange={(e) => setElInfo(e.target.value)}
                    rows={2}
                    placeholder="Nhập thông tin liên lạc bổ sung hoặc ghi chú đơn hàng..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>

                {/* Grid 2 cols for SĐT & Địa chỉ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* el_mobilephone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>el_mobilephone (Số điện thoại)</span>
                    </label>
                    <input
                      type="text"
                      value={elMobilephone}
                      onChange={(e) => setElMobilephone(e.target.value)}
                      placeholder="0988.xxx.xxx"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* el_address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>el_address (Địa chỉ người đăng)</span>
                    </label>
                    <input
                      type="text"
                      value={elAddress}
                      onChange={(e) => setElAddress(e.target.value)}
                      placeholder="Hà Nội / TP.HCM..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Grid 2 cols for Website & Facebook */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* el_link_website */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      <span>el_link_website (Website)</span>
                    </label>
                    <input
                      type="text"
                      value={elLinkWebsite}
                      onChange={(e) => setElLinkWebsite(e.target.value)}
                      placeholder="https://domain.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* el_link_facebook */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>el_link_facebook (Facebook)</span>
                    </label>
                    <input
                      type="text"
                      value={elLinkFacebook}
                      onChange={(e) => setElLinkFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ÁNH BANNER + LỊCH CHẠY + TRẠNG THÁI (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* CARD 1: CARD ĐẦU CỘT PHẢI - Ảnh banner với khung viền nét đứt đúng tỉ lệ */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                <span>Ảnh Banner quảng cáo <span className="text-red-500">*</span></span>
              </h2>
              <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">
                {wNum} x {hNum} px
              </span>
            </div>

            {/* DASHED ASPECT-RATIO PREVIEW CONTAINER */}
            <div className="space-y-3">
              <div
                style={{ aspectRatio: aspectRatioStr }}
                className={`w-full bg-slate-900/5 dark:bg-slate-800/50 border-2 border-dashed rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-2 transition-all ${
                  errors.image
                    ? 'border-red-500 bg-red-50/20'
                    : 'border-orange-500/40 dark:border-orange-500/30 hover:border-orange-500'
                }`}
              >
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute(
                          'src',
                          'https://via.placeholder.com/600x200?text=Loi+Anh+Banner'
                        );
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-mono rounded backdrop-blur-xs">
                      Tỉ lệ chuẩn {wNum}:{hNum}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-1 text-slate-400">
                    <Upload className="w-8 h-8 mx-auto opacity-40 text-orange-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Chưa có ảnh banner
                    </p>
                    <p className="text-[10px]">
                      Vui lòng nhập URL hoặc chọn ảnh mẫu bên dưới
                    </p>
                  </div>
                )}
              </div>

              {errors.image && (
                <p className="text-[11px] font-medium text-red-500">{errors.image}</p>
              )}

              {/* Image URL Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  URL Hình ảnh
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* 2 NUMBER INPUTS: width & height immediately below image box */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                    <span>Rộng (Width - px)</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={width}
                    onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1200"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                    <span>Cao (Height - px)</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="300"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Phân loại & Lịch chạy */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Phân loại & Lịch hiển thị</span>
            </h2>

            {/* category_id (Danh mục dropdown) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Danh mục vị trí Banner
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {BANNER_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.width}x{c.height}px)
                  </option>
                ))}
              </select>
            </div>

            {/* date_start & date_end đặt cạnh nhau 1 hàng */}
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: CARD "TRẠNG THÁI & HIỂN THỊ" */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Trạng thái & Hiển thị</span>
            </h2>

            {/* is_use (Đang sử dụng): công tắc */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  Đang sử dụng (is_use)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cho phép hệ thống load banner này vào vòng xoay
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

            {/* status (Trạng thái): dropdown + Badge màu tương ứng cạnh kề */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Trạng thái vận hành
                </label>
                {/* Badge màu tương ứng: Đang chạy = success, Hết hạn = error, Chờ duyệt = warning */}
                {status === 'running' && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold rounded-full">
                    ● Đang chạy (Success)
                  </span>
                )}
                {status === 'expired' && (
                  <span className="px-2.5 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-bold rounded-full">
                    ● Hết hạn (Error)
                  </span>
                )}
                {status === 'pending' && (
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-bold rounded-full">
                    ● Chờ duyệt (Warning)
                  </span>
                )}
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="running">Đang chạy (Running)</option>
                <option value="expired">Hết hạn (Expired)</option>
                <option value="pending">Chờ duyệt (Pending)</option>
              </select>
            </div>

            {/* published (Xuất bản): công tắc */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  Xuất bản (Published)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bật để công khai trên website
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

            {/* ordering (Thứ tự): ô nhập số */}
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR */}
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
          <span>{bannerToEdit ? 'Lưu cập nhật' : 'Lưu Banner'}</span>
        </button>
      </div>
    </form>
  );
};
