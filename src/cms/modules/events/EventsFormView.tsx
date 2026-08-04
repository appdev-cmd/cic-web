import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Star,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Search,
  Upload,
  ChevronDown,
  ChevronUp,
  Globe,
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Check,
  Link as LinkIcon,
  BookOpen,
  AlignLeft,
  Sliders,
  FileText,
  Users,
  Building,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { SearchableSelect, SearchableMultiSelect } from '../../components/SearchableSelect';
import { EventItem, EventCategory, EditorialStatus, EventProgressStatus, EventSpeaker } from './types';
import { mockEventCategories, mockEvents, mockEventProducts } from './mockData';
import { mockArticles } from '../news/mockData';

interface EventsFormViewProps {
  eventToEdit: EventItem | null;
  categories: EventCategory[];
  onSave: (data: Partial<EventItem>) => void;
  onCancel: () => void;
}

// Utility to convert Vietnamese text to URL slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const EventsFormView: React.FC<EventsFormViewProps> = ({
  eventToEdit,
  categories,
  onSave,
  onCancel,
}) => {
  // Form Main Fields
  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [alias, setAlias] = useState(eventToEdit?.alias || '');
  const [categoryId, setCategoryId] = useState(
    eventToEdit?.category_id || categories[0]?.id || ''
  );
  const [summary, setSummary] = useState(eventToEdit?.summary || '');
  const [content, setContent] = useState(eventToEdit?.content || '');

  const [image, setImage] = useState(
    eventToEdit?.image ||
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
  );

  // Date & Event Info
  const [timeEvent, setTimeEvent] = useState(
    eventToEdit?.time_event || new Date().toISOString().substring(0, 16)
  );
  const [endTime, setEndTime] = useState(
    eventToEdit?.end_time || '2026-12-31T17:00'
  );
  const [place, setPlace] = useState(eventToEdit?.place || '');
  const [specificTime, setSpecificTime] = useState(eventToEdit?.specific_time || '');
  const [chuDe, setChuDe] = useState(eventToEdit?.chu_de || '');
  const [linkDangky, setLinkDangky] = useState(eventToEdit?.link_dangky || '');
  const [organizer, setOrganizer] = useState(eventToEdit?.organizer || 'Công ty Cổ phần Công nghệ và Tư vấn CIC');
  const [maxSeats, setMaxSeats] = useState<number>(eventToEdit?.max_seats || 200);
  const [speakers, setSpeakers] = useState<EventSpeaker[]>(
    eventToEdit?.speakers || [
      { id: 'spk_1', name: 'TS. Nguyễn Văn Hùng', title: 'Chuyên gia Giải pháp BIM', company: 'CIC Technology' },
    ]
  );

  // 2-Layer Dual Status System
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>(
    eventToEdit?.editorial_status || (eventToEdit?.published ? 'published' : 'draft')
  );
  const [eventStatus, setEventStatus] = useState<EventProgressStatus>(
    eventToEdit?.event_status || 'upcoming'
  );

  // 3 Multi-Select Related Fields (stacked vertically)
  const [eventRelated, setEventRelated] = useState<string[]>(
    eventToEdit?.event_related || []
  );
  const [newsRelated, setNewsRelated] = useState<string[]>(
    eventToEdit?.news_related || []
  );
  const [productsRelated, setProductsRelated] = useState<string[]>(
    eventToEdit?.products_related || []
  );

  // Right Column Config Toggles
  const [isNew, setIsNew] = useState(eventToEdit?.is_new ?? true);
  const [isHot, setIsHot] = useState(eventToEdit?.is_hot ?? false);
  const [showInHome, setShowInHome] = useState(eventToEdit?.show_in_home ?? true);
  const [published, setPublished] = useState(eventToEdit?.published ?? true);
  const [ordering, setOrdering] = useState(eventToEdit?.ordering || 1);

  // SEO Fields (Collapsible)
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState(eventToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(eventToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(
    eventToEdit?.seo_description || ''
  );

  // Auto-generate alias from title
  const [isAliasManuallyEdited, setIsAliasManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isAliasManuallyEdited && title) {
      setAlias(slugify(title));
    }
  }, [title, isAliasManuallyEdited]);

  const handleAddSpeaker = () => {
    const newSpk: EventSpeaker = {
      id: `spk_${Date.now()}`,
      name: '',
      title: '',
      company: 'CIC Technology',
    };
    setSpeakers([...speakers, newSpk]);
  };

  const handleRemoveSpeaker = (id: string) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
  };

  const handleSpeakerChange = (id: string, field: keyof EventSpeaker, value: string) => {
    setSpeakers(
      speakers.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề sự kiện!');
      return;
    }
    if (!timeEvent) {
      alert('Vui lòng chọn thời gian bắt đầu sự kiện!');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung chi tiết sự kiện!');
      return;
    }

    onSave({
      title,
      alias: alias || slugify(title),
      category_id: categoryId,
      summary,
      content,
      image,
      time_event: timeEvent,
      end_time: endTime,
      place,
      specific_time: specificTime,
      chu_de: chuDe,
      link_dangky: linkDangky,
      organizer,
      speakers,
      max_seats: maxSeats,
      editorial_status: editorialStatus,
      event_status: eventStatus,
      event_related: eventRelated,
      news_related: newsRelated,
      products_related: productsRelated,
      is_new: isNew,
      is_hot: isHot,
      show_in_home: showInHome,
      published: editorialStatus === 'published' ? true : published,
      ordering: Number(ordering) || 1,
      seo_title: seoTitle || title,
      seo_keyword: seoKeyword,
      seo_description: seoDescription || summary,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Trạng thái Biên tập: {editorialStatus}
            </span>
            <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-lg flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Trạng thái Diễn ra: {eventStatus}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            {title ? title : 'Tiêu đề sự kiện / hội thảo mới...'}
          </h1>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Đóng / Hủy"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2-COLUMN PATTERN 1 LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================== LEFT COLUMN ==================== */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            {/* 1. Tiêu đề (title) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>
                  Tiêu đề sự kiện / hội thảo <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {title.length} ký tự
                </span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên sự kiện, hội thảo hoặc chương trình đào tạo..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:font-normal placeholder:text-slate-400"
              />
            </div>

            {/* 2. Alias (slug) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Đường dẫn phụ (Alias / Slug)</span>
                <span className="text-[10px] font-mono text-slate-400">Tự động tạo từ tiêu đề</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-xs font-mono">/</span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => {
                    setAlias(e.target.value);
                    setIsAliasManuallyEdited(true);
                  }}
                  placeholder="alias-duong-dan-su-kien"
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* 3. Danh mục & Đơn vị tổ chức */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Danh mục sự kiện <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={categories.map((c) => ({ id: c.id, label: c.name }))}
                  selectedId={categoryId}
                  onChange={setCategoryId}
                  placeholder="Chọn danh mục sự kiện..."
                  searchPlaceholder="Tìm kiếm danh mục..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Đơn vị tổ chức
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Công ty Cổ phần Công nghệ và Tư vấn CIC..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* 4. Speaker Lineup Manager */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Diễn giả & Chuyên gia khách mời</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddSpeaker}
                  className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-lg hover:bg-orange-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm diễn giả
                </button>
              </div>

              {speakers.map((spk, idx) => (
                <div
                  key={spk.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={spk.name}
                      onChange={(e) => handleSpeakerChange(spk.id, 'name', e.target.value)}
                      placeholder="Họ tên diễn giả..."
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={spk.title}
                      onChange={(e) => handleSpeakerChange(spk.id, 'title', e.target.value)}
                      placeholder="Chức danh / Học vị..."
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={spk.company || ''}
                      onChange={(e) => handleSpeakerChange(spk.id, 'company', e.target.value)}
                      placeholder="Tổ chức..."
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(spk.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Tóm tắt sự kiện */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Tóm tắt / Giới thiệu sự kiện</span>
                <span className="text-[11px] font-normal text-slate-400 font-mono">
                  {summary.length} / 300 ký tự
                </span>
              </div>
              <textarea
                rows={3}
                value={summary}
                maxLength={300}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Nhập tóm tắt ngắn sự kiện (hiển thị ngoài thẻ danh sách)..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium resize-none"
              />
            </div>

            {/* 6. Nội dung sự kiện (RichTextEditor) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Nội dung chi tiết chương trình sự kiện <span className="text-red-500">*</span></span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Soạn thảo HTML trực quan & xem trước live
                </span>
              </div>
              <RichTextEditor value={content} onChange={setContent} minHeight="320px" />
            </div>

            {/* 7. time_event & end_time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={timeEvent}
                  onChange={(e) => setTimeEvent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            {/* 8. place & specific_time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Địa điểm tổ chức
                </label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Ví dụ: Trung tâm Hội nghị Quốc gia, 57 Phạm Hùng, Hà Nội..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Khung giờ chi tiết
                </label>
                <input
                  type="text"
                  value={specificTime}
                  onChange={(e) => setSpecificTime(e.target.value)}
                  placeholder="Ví dụ: 8h00 - 17h00 hàng ngày"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            {/* 9. chu_de & link_dangky & maxSeats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Chủ đề sự kiện
                </label>
                <input
                  type="text"
                  value={chuDe}
                  onChange={(e) => setChuDe(e.target.value)}
                  placeholder="Chủ đề chính..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Link đăng ký
                </label>
                <input
                  type="url"
                  value={linkDangky}
                  onChange={(e) => setLinkDangky(e.target.value)}
                  placeholder="https://cic.com.vn/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Số lượng chỗ ngồi tối đa
                </label>
                <input
                  type="number"
                  min={1}
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* 10. LIÊN KẾT: 3 ô chọn nhiều giá trị Searchable Multi-Select */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Liên kết nội dung
              </h3>

              {/* Group 1: Sự kiện liên quan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sự kiện liên quan
                </label>
                <SearchableMultiSelect
                  options={mockEvents.map((ev) => ({
                    id: ev.id,
                    label: ev.title,
                    subLabel: `Mã: ${ev.id}`,
                    image: ev.image,
                  }))}
                  selectedIds={eventRelated}
                  onChange={setEventRelated}
                  placeholder="Chọn sự kiện liên quan..."
                  searchPlaceholder="Tìm kiếm tên sự kiện..."
                />
              </div>

              {/* Group 2: Tin tức liên quan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tin tức & Bài viết liên quan
                </label>
                <SearchableMultiSelect
                  options={mockArticles.map((art) => ({
                    id: art.id,
                    label: art.title,
                    subLabel: `Mã: ${art.id}`,
                    image: art.image,
                  }))}
                  selectedIds={newsRelated}
                  onChange={setNewsRelated}
                  placeholder="Chọn tin tức liên quan..."
                  searchPlaceholder="Tìm kiếm bài tin..."
                />
              </div>

              {/* Group 3: Sản phẩm phần mềm liên quan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sản phẩm phần mềm liên quan
                </label>
                <SearchableMultiSelect
                  options={mockEventProducts.map((prod) => ({
                    id: prod.id,
                    label: prod.name,
                    subLabel: `Mã SP: ${prod.code}`,
                    image: prod.image,
                  }))}
                  selectedIds={productsRelated}
                  onChange={setProductsRelated}
                  placeholder="Chọn sản phẩm liên quan..."
                  searchPlaceholder="Tìm kiếm sản phẩm..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN (CARDS) ==================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* CARD 1: DUAL STATUSES & PUBLISHING */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu sự kiện</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>

            {/* DUAL STATUSES BLOCK */}
            <div className="p-3 bg-orange-500/5 dark:bg-orange-500/10 rounded-xl border border-orange-500/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                2 Tầng Trạng Thái Độc Lập
              </h4>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  1. Trạng thái Biên tập
                </label>
                <select
                  value={editorialStatus}
                  onChange={(e) => setEditorialStatus(e.target.value as EditorialStatus)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="pending_review">Chờ duyệt (Pending Review)</option>
                  <option value="approved">Đã duyệt (Approved)</option>
                  <option value="published">Đã xuất bản (Published)</option>
                  <option value="rejected">Bị trả lại (Rejected)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  2. Trạng thái Diễn ra
                </label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value as EventProgressStatus)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
                >
                  <option value="upcoming">Sắp diễn ra (Upcoming)</option>
                  <option value="ongoing">Đang diễn ra (Ongoing)</option>
                  <option value="ended">Đã kết thúc (Ended)</option>
                  <option value="cancelled">Đã hủy (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Config Toggles */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* is_new */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Sự kiện mới (is_new)</span>
                <button
                  type="button"
                  onClick={() => setIsNew(!isNew)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isNew ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isNew ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* is_hot */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Sự kiện nổi bật (is_hot)</span>
                <button
                  type="button"
                  onClick={() => setIsHot(!isHot)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isHot ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isHot ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* show_in_home */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Hiện trang chủ</span>
                <button
                  type="button"
                  onClick={() => setShowInHome(!showInHome)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showInHome ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showInHome ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* ordering */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Thứ tự (Ordering)</span>
                <input
                  type="number"
                  min={1}
                  value={ordering}
                  onChange={(e) => setOrdering(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-center font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: ÁNH ĐẠI DIỆN */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Ảnh đại diện</span>
              <ImageIcon className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
              {image ? (
                <>
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Nhập URL hình ảnh mới:', image);
                        if (url) setImage(url);
                      }}
                      className="p-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                    >
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="p-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-400 space-y-2">
                  <Upload className="w-6 h-6 opacity-60" />
                  <span className="text-xs font-medium">Chưa chọn ảnh</span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Nhập URL hình ảnh:');
                      if (url) setImage(url);
                    }}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Thêm URL ảnh
                  </button>
                </div>
              )}
            </div>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Đường dẫn URL ảnh (https://...)"
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 font-mono focus:outline-none"
            />
          </div>

          {/* CARD 3: SEO */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsSeoOpen(!isSeoOpen)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Cấu hình Tối ưu SEO</span>
              </div>
              {isSeoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isSeoOpen && (
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Tiêu đề SEO (seo_title)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Mặc định lấy từ Tiêu đề sự kiện'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Từ khóa SEO (seo_keyword)
                  </label>
                  <input
                    type="text"
                    value={seoKeyword}
                    onChange={(e) => setSeoKeyword(e.target.value)}
                    placeholder="ví dụ: Hoi thao BIM 2026, CIC technology"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Mô tả SEO (seo_description)
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={summary || 'Mặc định lấy từ Tóm tắt sự kiện'}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium resize-none"
                  />
                </div>

                {/* SERP Preview */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>Xem trước Google SERP</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">cic.com.vn</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold truncate hover:underline cursor-pointer pt-0.5">
                    {seoTitle || title || 'Tiêu đề sự kiện'}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-mono truncate">
                    https://cic.com.vn/su-kien/{alias || slugify(title || 'su-kien')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {seoDescription || summary || 'Mô tả sự kiện hiển thị tại đây...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

