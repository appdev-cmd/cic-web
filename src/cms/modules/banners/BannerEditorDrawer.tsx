import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Send,
  Sliders,
  Image as ImageIcon,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  Calendar,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Edit,
  Video,
  ExternalLink,
  ChevronDown,
  Eye,
  ShieldAlert,
  GripVertical,
} from 'lucide-react';
import {
  BannerContent,
  SlideItem,
  BannerPlacementConfig,
  BannerItemType,
  WorkflowStatus,
  EffectiveStatus,
  SlideshowConfig,
  slideshowPurposeOptions,
  slideshowTemplateOptions,
  slideshowLayoutOptions,
} from './types';

interface BannerEditorDrawerProps {
  item: BannerContent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: BannerContent) => void;
  placements: BannerPlacementConfig[];
}

export const BannerEditorDrawer: React.FC<BannerEditorDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  placements,
}) => {
  const [activeTabSection, setActiveTabSection] = useState<'general' | 'placement' | 'media' | 'content' | 'display' | 'slides' | 'schedule' | 'publish'>('general');

  // Form State
  const [formData, setFormData] = useState<Partial<BannerContent>>({});
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);

  useEffect(() => {
    if (item?.id) {
      setFormData({ ...item });
      setSlides(item.slides || []);
    } else {
      setFormData({
        type: item?.type || 'banner',
        purpose: 'hero',
        template: 'visual',
        layout: 'full_width',
        title: '',
        alias: '',
        site_id: 'main_site',
        placement_id: placements[0]?.id || 'plc_hero_home',
        placement_name: placements[0]?.name || 'Hero Trang Chủ (Main Slider)',
        media_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1200&auto=format&fit=crop&q=80',
        media_type: 'image',
        crop_focal_point: 'center',
        alt_text: '',
        caption: '',
        copy_text: '',
        cta_text: 'Xem thêm',
        link_url: '/',
        link_target: '_self',
        slideshow_config: {
          auto_play: true,
          loop: true,
          interval_ms: 5000,
          effect: 'fade',
          pause_on_hover: true,
          show_dots: true,
          show_arrows: true,
          navigation: 'arrows',
          pagination: 'dots',
          slides_per_view: 1,
        },
        start_time: '2026-08-01 00:00',
        end_time: '2026-12-31 23:59',
        timezone: 'Asia/Ho_Chi_Minh',
        display_order: 1,
        priority_weight: 5,
        workflow_status: 'draft',
        effective_status: 'upcoming',
        live_version: 'v1.0.0',
        draft_version: 'v1.0.0-draft',
        has_draft_changes: true,
        owner_name: 'Trần Văn Mạnh (Editor)',
        owner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      });
      setSlides([]);
    }
  }, [item, isOpen, placements]);

  if (!isOpen) return null;

  const currentPlacement = placements.find((p) => p.id === formData.placement_id) || placements[0];

  const handlePlacementChange = (placementId: string) => {
    const sel = placements.find((p) => p.id === placementId);
    if (sel) {
      setFormData((prev) => ({
        ...prev,
        placement_id: sel.id,
        placement_name: sel.name,
      }));
    }
  };

  // Reorder Slide
  const handleMoveSlide = (idx: number, dir: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < newSlides.length) {
      const temp = newSlides[idx];
      newSlides[idx] = newSlides[targetIdx];
      newSlides[targetIdx] = temp;
      // update display_order
      newSlides.forEach((s, i) => (s.display_order = i + 1));
      setSlides(newSlides);
    }
  };

  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: `sld_${Date.now()}`,
      title: `Slide #${slides.length + 1} - Tiêu đề slide mới`,
      subtitle: 'Phụ đề giới thiệu ngắn gọn',
      media_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      media_type: 'image',
      link_url: '/products',
      link_target: '_self',
      duration_sec: 5,
      transition_effect: 'fade',
      display_order: slides.length + 1,
      focal_point: 'center',
    };
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (slideId: string) => {
    setSlides(slides.filter((s) => s.id !== slideId));
  };

  const updateSlideshowConfig = <K extends keyof SlideshowConfig>(key: K, value: SlideshowConfig[K]) => {
    setFormData((previous) => ({
      ...previous,
      slideshow_config: {
        auto_play: true,
        loop: true,
        interval_ms: 5000,
        effect: 'fade',
        pause_on_hover: true,
        show_dots: true,
        show_arrows: true,
        navigation: 'arrows',
        pagination: 'dots',
        slides_per_view: 1,
        ...previous.slideshow_config,
        [key]: value,
      },
    }));
  };

  const handleDropSlide = (targetIndex: number) => {
    if (draggedSlideIndex === null || draggedSlideIndex === targetIndex) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(draggedSlideIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setSlides(reordered.map((slide, index) => ({ ...slide, display_order: index + 1 })));
    setDraggedSlideIndex(null);
  };

  const handleSubmitSave = (status: WorkflowStatus = (formData.workflow_status as WorkflowStatus) || 'draft') => {
    const savedObj: BannerContent = {
      ...formData,
      id: formData.id || `ban_${Date.now()}`,
      type: (formData.type as BannerItemType) || 'banner',
      title: formData.title || 'Banner không tên',
      alias: formData.alias || 'banner-alias',
      slides: slides,
      workflow_status: status,
      has_draft_changes: true,
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    } as BannerContent;

    onSave(savedObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Drawer Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              {formData.type === 'slideshow' ? <Sliders className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
                {item?.id
                  ? `Chỉnh sửa ${formData.type === 'slideshow' ? 'slideshow' : 'nội dung đơn'}`
                  : `Tạo ${formData.type === 'slideshow' ? 'slideshow' : 'nội dung đơn'}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Biểu mẫu gồm 8 nhóm thông tin thống nhất.
              </p>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <button
              onClick={() => handleSubmitSave('draft')}
              className="flex min-h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            >
              <Save className="w-4 h-4" /> Lưu nháp
            </button>
            <button
              onClick={() => handleSubmitSave('approved')}
              className="flex min-h-8 items-center gap-1.5 rounded-lg bg-orange-600 px-3 text-xs font-bold text-white shadow-2xs transition hover:bg-orange-500"
            >
              <Send className="w-4 h-4" /> Gửi duyệt
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div role="tablist" aria-label="Các phần cấu hình trình chiếu" className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-100/50 dark:bg-slate-800/20">
          {[
            { id: 'general', label: 'Thông tin chung' },
            { id: 'placement', label: 'Vị trí hiển thị' },
            { id: 'media', label: 'Hình ảnh và video' },
            { id: 'content', label: 'Nội dung và liên kết' },
            ...(formData.type === 'slideshow' ? [
              { id: 'display', label: 'Cách trình chiếu' },
              { id: 'slides', label: `Danh sách slide (${slides.length})` },
            ] : []),
            { id: 'schedule', label: 'Lịch hiển thị' },
            { id: 'publish', label: 'Xuất bản' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTabSection === tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-3.5 py-3 text-xs font-bold transition border-b-2 shrink-0 ${
                activeTabSection === tab.id
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Thông tin chung */}
          {activeTabSection === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Loại nội dung hiển thị <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type || 'banner'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as BannerItemType })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="banner">Single Banner (Ảnh / Video độc lập)</option>
                    <option value="slideshow">Slideshow (Tập slide luân phiên)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Site áp dụng <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.site_id || 'main_site'}
                    onChange={(e) => setFormData({ ...formData, site_id: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="main_site">Website Tiếng Việt (cic.com.vn)</option>
                    <option value="en_site">Global English Site (en.cic.com.vn)</option>
                    <option value="jp_site">Japan Market Portal (jp.cic.com.vn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên / Tiêu đề nhận diện <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Slideshow Nổi Bật Chào Mừng 2026 - Giải Pháp BIM & SAP2000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mã Alias / Canonical Tag
                </label>
                <input
                  type="text"
                  value={formData.alias || ''}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  placeholder="VD: hero-slideshow-2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Mục đích hiển thị</label>
                  <select
                    value={formData.purpose || 'hero'}
                    onChange={(event) => setFormData({ ...formData, purpose: event.target.value as BannerContent['purpose'] })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {slideshowPurposeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Mẫu hiển thị</label>
                  <select
                    value={formData.template || 'visual'}
                    onChange={(event) => setFormData({ ...formData, template: event.target.value as BannerContent['template'] })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {slideshowTemplateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Bố cục</label>
                  <select
                    value={formData.layout || 'full_width'}
                    onChange={(event) => setFormData({ ...formData, layout: event.target.value as BannerContent['layout'] })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {slideshowLayoutOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTabSection === 'display' && formData.type === 'slideshow' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cách slideshow vận hành</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Các thiết lập này độc lập với nội dung từng slide và có thể thay đổi theo mẫu hiển thị.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs font-semibold dark:border-slate-700">
                  Tự động chuyển slide
                  <input type="checkbox" checked={formData.slideshow_config?.auto_play ?? true} onChange={(event) => updateSlideshowConfig('auto_play', event.target.checked)} className="size-4 accent-orange-600" />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs font-semibold dark:border-slate-700">
                  Lặp lại từ đầu
                  <input type="checkbox" checked={formData.slideshow_config?.loop ?? true} onChange={(event) => updateSlideshowConfig('loop', event.target.checked)} className="size-4 accent-orange-600" />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs font-semibold dark:border-slate-700">
                  Dừng khi trỏ chuột
                  <input type="checkbox" checked={formData.slideshow_config?.pause_on_hover ?? true} onChange={(event) => updateSlideshowConfig('pause_on_hover', event.target.checked)} className="size-4 accent-orange-600" />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Hiệu ứng chuyển slide</label>
                  <select value={formData.slideshow_config?.effect || 'fade'} onChange={(event) => updateSlideshowConfig('effect', event.target.value as SlideshowConfig['effect'])} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800">
                    <option value="fade">Mờ dần</option><option value="slide">Trượt ngang</option><option value="zoom">Thu phóng</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Khoảng thời gian chuyển</label>
                  <select value={formData.slideshow_config?.interval_ms || 5000} onChange={(event) => updateSlideshowConfig('interval_ms', Number(event.target.value))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800">
                    <option value={3000}>3 giây</option><option value={5000}>5 giây</option><option value={8000}>8 giây</option><option value={10000}>10 giây</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Điều hướng</label>
                  <select value={formData.slideshow_config?.navigation || 'arrows'} onChange={(event) => updateSlideshowConfig('navigation', event.target.value as SlideshowConfig['navigation'])} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800">
                    <option value="arrows">Mũi tên</option><option value="thumbnails">Ảnh thu nhỏ</option><option value="none">Không hiển thị</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Phân trang</label>
                  <select value={formData.slideshow_config?.pagination || 'dots'} onChange={(event) => updateSlideshowConfig('pagination', event.target.value as SlideshowConfig['pagination'])} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800">
                    <option value="dots">Dấu chấm</option><option value="fraction">Số thứ tự</option><option value="progress">Thanh tiến trình</option><option value="none">Không hiển thị</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Số mục cùng hiển thị</label>
                  <select value={formData.slideshow_config?.slides_per_view || 1} onChange={(event) => updateSlideshowConfig('slides_per_view', Number(event.target.value))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800">
                    {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} mục</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Vị trí & Constraint */}
          {activeTabSection === 'placement' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Vị trí hiển thị trên Website <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.placement_id || ''}
                  onChange={(e) => handlePlacementChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code}) - Tối đa {p.max_capacity} banner
                    </option>
                  ))}
                </select>
              </div>

              {/* Placement Constraint Card */}
              {currentPlacement && (
                <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-800 dark:text-orange-300">
                    <Layers className="w-4 h-4" /> Ràng buộc Kỹ thuật của Vị trí: {currentPlacement.name}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Tỷ lệ đề xuất:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        {currentPlacement.recommended_ratio}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kích thước chuẩn:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        {currentPlacement.recommended_resolution}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Sức chứa đồng thời:</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        Tối đa {currentPlacement.max_capacity} item
                      </strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentPlacement.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Media & Crop */}
          {activeTabSection === 'media' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đường dẫn Media URL / Image Asset
                  </label>
                  <input
                    type="text"
                    value={formData.media_url || ''}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Focal Point / Điểm căn lề Crop
                  </label>
                  <select
                    value={formData.crop_focal_point || 'center'}
                    onChange={(e) => setFormData({ ...formData, crop_focal_point: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="center">Center (Giữa ảnh)</option>
                    <option value="top">Top (Ưu tiên phía trên)</option>
                    <option value="bottom">Bottom (Ưu tiên phía dưới)</option>
                  </select>
                </div>
              </div>

              {/* Media Preview Box */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">Xem trước Media Asset:</span>
                <div className="relative max-h-48 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                  <img
                    src={formData.media_url}
                    alt={formData.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 text-white rounded text-[10px] font-mono">
                    Aspect Ratio: {currentPlacement.recommended_ratio}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alt Text (SEO Accessibility)
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text || ''}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    placeholder="VD: CIC Technology Solutions 2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chú thích ảnh (Caption)
                  </label>
                  <input
                    type="text"
                    value={formData.caption || ''}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Nội dung & Link */}
          {activeTabSection === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung mô tả chính (Copytext / Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={formData.copy_text || ''}
                  onChange={(e) => setFormData({ ...formData, copy_text: e.target.value })}
                  placeholder="Nhập đoạn văn bản ngắn hiển thị trên banner..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nhãn nút CTA
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text || ''}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="VD: Khám phá ngay"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đích điều hướng (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.link_url || ''}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="VD: /products/etabs"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hành vi mở liên kết (Target)
                  </label>
                  <select
                    value={formData.link_target || '_self'}
                    onChange={(e) => setFormData({ ...formData, link_target: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="_self">Chuyển trang nội bộ (_self)</option>
                    <option value="_blank">Mở cửa sổ mới (_blank)</option>
                    <option value="_modal">Mở cửa sổ Pop-up Modal (_modal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Slides Sequence (Chỉ cho Slideshow) */}
          {activeTabSection === 'slides' && formData.type === 'slideshow' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-600" /> Cấu hình các Slide luân phiên ({slides.length})
                </h3>
                <button
                  onClick={handleAddSlide}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Thêm Slide mới
                </button>
              </div>

              {/* Slides List Reorder */}
              <div className="space-y-3">
                {slides.map((sld, idx) => (
                  <div
                    key={sld.id}
                    draggable
                    onDragStart={() => setDraggedSlideIndex(idx)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDropSlide(idx)}
                    onDragEnd={() => setDraggedSlideIndex(null)}
                    className={`p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${draggedSlideIndex === idx ? 'border-orange-400 opacity-60' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab text-slate-400" title="Kéo để đổi thứ tự" aria-hidden="true">
                        <GripVertical className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === slides.length - 1}
                          onClick={() => handleMoveSlide(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <img
                        src={sld.media_url}
                        alt={sld.title}
                        className="w-16 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />

                      <div>
                        <span className="text-[10px] font-bold text-orange-600 uppercase block">
                          Slide #{idx + 1} • {sld.duration_sec}s • Hiệu ứng: {sld.transition_effect}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{sld.title}</h4>
                        <p className="text-[11px] text-slate-400">{sld.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleDeleteSlide(sld.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Xóa slide này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Lịch & Ưu tiên */}
          {activeTabSection === 'schedule' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thời điểm bắt đầu (Start Time) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.start_time || ''}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thời điểm kết thúc (End Time) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.end_time || ''}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thứ tự hiển thị (Display Order)
                  </label>
                  <input
                    type="number"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trọng số ưu tiên (Priority Weight 1-10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.priority_weight || 5}
                    onChange={(e) => setFormData({ ...formData, priority_weight: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Workflow & Phiên bản */}
          {activeTabSection === 'publish' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs">
                  <span className="text-slate-400">Phiên bản Live hiện tại: </span>
                  <strong className="text-emerald-600 font-mono">{formData.live_version}</strong>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400">Phiên bản Draft đang chỉnh sửa: </span>
                  <strong className="text-orange-600 font-mono">{formData.draft_version}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng thái Workflow
                </label>
                <select
                  value={formData.workflow_status || 'draft'}
                  onChange={(e) => setFormData({ ...formData, workflow_status: e.target.value as WorkflowStatus })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="draft">Bản thảo (Draft)</option>
                  <option value="pending_review">Chờ duyệt (Pending Review)</option>
                  <option value="approved">Đã duyệt (Approved)</option>
                  <option value="published">Đã xuất bản (Published)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
