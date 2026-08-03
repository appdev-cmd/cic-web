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
} from 'lucide-react';
import { EventItem, EventCategory } from './types';
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

  // Dropdown States for Multi-Selects
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isProdDropdownOpen, setIsProdDropdownOpen] = useState(false);

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

  // Rich Text Editor Command Mock
  const handleEditorCommand = (cmd: string) => {
    let tag = '';
    if (cmd === 'bold') tag = '<strong>nội dung đậm</strong>';
    if (cmd === 'italic') tag = '<em>nội dung nghiêng</em>';
    if (cmd === 'underline') tag = '<u>nội dung gạch chân</u>';
    if (cmd === 'h2') tag = '<h2>Tiêu đề H2</h2>';
    if (cmd === 'h3') tag = '<h3>Tiêu đề H3</h3>';
    if (cmd === 'ul') tag = '<ul><li>Mục 1</li><li>Mục 2</li></ul>';
    if (cmd === 'ol') tag = '<ol><li>Bước 1</li><li>Bước 2</li></ol>';
    if (cmd === 'link') tag = '<a href="#">Đường dẫn liên kết</a>';
    if (cmd === 'code') tag = '<code>mã code</code>';

    setContent((prev) => prev + (prev ? '\n' : '') + tag);
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
      event_related: eventRelated,
      news_related: newsRelated,
      products_related: productsRelated,
      is_new: isNew,
      is_hot: isHot,
      show_in_home: showInHome,
      published,
      ordering: Number(ordering) || 1,
      seo_title: seoTitle || title,
      seo_keyword: seoKeyword,
      seo_description: seoDescription || summary,
    });
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearchQuery.toLowerCase().trim())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg uppercase tracking-wider">
              {eventToEdit ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
            </span>
            {published ? (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-md flex items-center gap-1">
                <Check className="w-3 h-3" /> Đã xuất bản
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-bold rounded-md">
                Bản nháp
              </span>
            )}
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
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:font-normal placeholder:text-slate-400"
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
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 3. Danh mục (category_id) */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Danh mục sự kiện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>{selectedCategoryObj ? selectedCategoryObj.name : 'Chưa chọn danh mục'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isCatDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 space-y-2 animate-in fade-in duration-150">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={catSearchQuery}
                        onChange={(e) => setCatSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm danh mục..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategoryId(cat.id);
                              setIsCatDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                              categoryId === cat.id
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {categoryId === cat.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-slate-400 text-xs">
                          Không tìm thấy danh mục
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Tóm tắt (summary) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Tóm tắt giới thiệu sự kiện</span>
                <span className="text-[11px] font-normal text-slate-400 font-mono">
                  {summary.length} / 300 ký tự
                </span>
              </div>
              <textarea
                rows={3}
                value={summary}
                maxLength={300}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Nhập mô tả tóm tắt sự kiện..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-medium resize-none"
              />
            </div>

            {/* 5. Nội dung (content) Rich Text Editor */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>
                  Nội dung chi tiết chương trình <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  Rich Text Editor
                </span>
              </label>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/60">
                <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('bold')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Đậm (Bold)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('italic')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Nghiêng (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('underline')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Gạch chân (Underline)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('h2')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Tiêu đề H2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('h3')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Tiêu đề H3"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('ul')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Danh sách"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('ol')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Danh sách thứ tự"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('link')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Chèn liên kết"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditorCommand('code')}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Mã code"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  required
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung chi tiết sự kiện..."
                  className="w-full p-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-mono leading-relaxed min-h-[260px] focus:outline-none border-none resize-y"
                />
              </div>
            </div>

            {/* 6. time_event & end_time */}
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* 7. place */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Địa điểm tổ chức
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Ví dụ: Trung tâm Hội nghị Quốc gia, 57 Phạm Hùng, Hà Nội..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* 8. specific_time */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Khung giờ chi tiết
              </label>
              <input
                type="text"
                value={specificTime}
                onChange={(e) => setSpecificTime(e.target.value)}
                placeholder="Ví dụ: 8h00 - 17h00 hàng ngày"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* 9. chu_de */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Chủ đề sự kiện
              </label>
              <input
                type="text"
                value={chuDe}
                onChange={(e) => setChuDe(e.target.value)}
                placeholder="Nhập chủ đề chính của sự kiện..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* 10. link_dangky */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Đường dẫn đăng ký
              </label>
              <input
                type="url"
                value={linkDangky}
                onChange={(e) => setLinkDangky(e.target.value)}
                placeholder="https://cic.com.vn/su-kien/dang-ky-..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* 11. LIÊN KẾT: 3 ô chọn nhiều giá trị */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Liên kết nội dung
              </h3>

              {/* Group 1: Sự kiện liên quan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sự kiện liên quan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Chọn sự kiện liên quan ({eventRelated.length})</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isEventDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-52 overflow-y-auto space-y-1">
                      {mockEvents.map((ev) => {
                        const isSelected = eventRelated.includes(ev.id);
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setEventRelated(eventRelated.filter((id) => id !== ev.id));
                              } else {
                                setEventRelated([...eventRelated, ev.id]);
                              }
                            }}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <img
                              src={ev.image}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="truncate text-xs space-y-0.5">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {ev.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {ev.id}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 ml-auto shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {eventRelated.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {eventRelated.map((evId) => {
                      const ev = mockEvents.find((e) => e.id === evId);
                      if (!ev) return null;
                      return (
                        <div
                          key={evId}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-2"
                        >
                          <span className="max-w-[200px] truncate">{ev.title}</span>
                          <button
                            type="button"
                            onClick={() => setEventRelated(eventRelated.filter((id) => id !== evId))}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Group 2: Tin tức liên quan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tin tức & Bài viết liên quan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsNewsDropdownOpen(!isNewsDropdownOpen)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Chọn tin tức liên quan ({newsRelated.length})</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isNewsDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-52 overflow-y-auto space-y-1">
                      {mockArticles.map((art) => {
                        const isSelected = newsRelated.includes(art.id);
                        return (
                          <button
                            key={art.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewsRelated(newsRelated.filter((id) => id !== art.id));
                              } else {
                                setNewsRelated([...newsRelated, art.id]);
                              }
                            }}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <img
                              src={art.image}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="truncate text-xs space-y-0.5">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {art.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {art.id}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 ml-auto shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {newsRelated.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {newsRelated.map((relId) => {
                      const item = mockArticles.find((a) => a.id === relId);
                      if (!item) return null;
                      return (
                        <div
                          key={relId}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-2"
                        >
                          <span className="max-w-[200px] truncate">{item.title}</span>
                          <button
                            type="button"
                            onClick={() => setNewsRelated(newsRelated.filter((id) => id !== relId))}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Group 3: Sản phẩm liên quan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sản phẩm phần mềm liên quan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProdDropdownOpen(!isProdDropdownOpen)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Chọn sản phẩm liên quan ({productsRelated.length})</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isProdDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-52 overflow-y-auto space-y-1">
                      {mockEventProducts.map((prod) => {
                        const isSelected = productsRelated.includes(prod.id);
                        return (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setProductsRelated(
                                  productsRelated.filter((id) => id !== prod.id)
                                );
                              } else {
                                setProductsRelated([...productsRelated, prod.id]);
                              }
                            }}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <img
                              src={prod.image}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="truncate text-xs space-y-0.5">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {prod.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Mã: {prod.code}
                              </p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 ml-auto shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {productsRelated.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {productsRelated.map((pId) => {
                      const prod = mockEventProducts.find((p) => p.id === pId);
                      if (!prod) return null;
                      return (
                        <div
                          key={pId}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-2"
                        >
                          <span className="max-w-[200px] truncate">{prod.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setProductsRelated(productsRelated.filter((id) => id !== pId))
                            }
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN (CARDS) ==================== */}
        <div className="lg:col-span-4 space-y-5 sticky top-4">
          {/* CARD 1: XUẤT BẢN & CẤU HÌNH */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
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

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cấu hình Xuất bản
            </h3>

            {/* Config Toggles */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* is_new */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Sự kiện mới (is_new)</span>
                <button
                  type="button"
                  onClick={() => setIsNew(!isNew)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isNew ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
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
                    isHot ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
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
                    showInHome ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showInHome ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* published */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Xuất bản sự kiện</span>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      published ? 'translate-x-5' : 'translate-x-0'
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
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
