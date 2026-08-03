import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Star,
  Sparkles,
  Home,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Search,
  Upload,
  Video,
  Tag,
  Calendar,
  Layers,
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
  Link as LinkIcon,
  Code,
  Trash2,
  Check,
  Package,
  FileText,
  BookOpen,
  AlignLeft,
  Sliders,
} from 'lucide-react';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { SearchableSelect, SearchableMultiSelect } from '../../components/SearchableSelect';
import { NewsArticle, NewsCategory, RelatedProductItem } from './types';
import { mockNewsCategories, mockRelatedProducts, mockArticles } from './mockData';

interface NewsFormViewProps {
  articleToEdit: NewsArticle | null;
  categories: NewsCategory[];
  onSave: (data: Partial<NewsArticle>) => void;
  onCancel: () => void;
}

// Utility to convert Vietnamese title to URL slug/alias
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

// Extract YouTube Video ID
function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const NewsFormView: React.FC<NewsFormViewProps> = ({
  articleToEdit,
  categories,
  onSave,
  onCancel,
}) => {
  // Form State
  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [alias, setAlias] = useState(articleToEdit?.alias || '');
  const [categoryId, setCategoryId] = useState(
    articleToEdit?.category_id || categories[0]?.id || ''
  );
  const [summary, setSummary] = useState(articleToEdit?.summary || '');
  const [specifications, setSpecifications] = useState('');
  const [content, setContent] = useState(articleToEdit?.content || '');
  
  // 3 Rich Text Editor tabs: 'overview' | 'specifications' | 'detail'
  const [editorTab, setEditorTab] = useState<'overview' | 'specifications' | 'detail'>('overview');
  const [image, setImage] = useState(
    articleToEdit?.image ||
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80'
  );
  const [video, setVideo] = useState(articleToEdit?.video || '');
  const [tags, setTags] = useState<string[]>(articleToEdit?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const [newsRelated, setNewsRelated] = useState<string[]>(articleToEdit?.news_related || []);
  const [productsRelated, setProductsRelated] = useState<string[]>(
    articleToEdit?.products_related || []
  );

  const [startTime, setStartTime] = useState(
    articleToEdit?.start_time || new Date().toISOString().substring(0, 16)
  );
  const [endTime, setEndTime] = useState(
    articleToEdit?.end_time || '2026-12-31T23:59'
  );

  // Right Column Toggles & Settings
  const [isHot, setIsHot] = useState(articleToEdit?.is_hot ?? false);
  const [isNew, setIsNew] = useState(articleToEdit?.is_new ?? true);
  const [showInHomepage, setShowInHomepage] = useState(
    articleToEdit?.show_in_homepage ?? true
  );
  const [published, setPublished] = useState(articleToEdit?.published ?? true);
  const [ordering, setOrdering] = useState(articleToEdit?.ordering || 1);

  // SEO Fields
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState(articleToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(articleToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(
    articleToEdit?.seo_description || ''
  );

  // Category Searchable Dropdown State
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

  // Multi-select dropdown states for related news & products
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isProdDropdownOpen, setIsProdDropdownOpen] = useState(false);

  // Auto-generate alias from title if creating or user hasn't explicitly unlinked it
  const [isAliasManuallyEdited, setIsAliasManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isAliasManuallyEdited && title) {
      setAlias(slugify(title));
    }
  }, [title, isAliasManuallyEdited]);

  // Handle Tag Addition
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // YouTube Video ID Check
  const youtubeId = getYoutubeVideoId(video);

  // Rich Text Editor Mock Controls (inserts basic tags or appends formatting)
  const handleEditorCommand = (cmd: string) => {
    let tag = '';
    if (cmd === 'bold') tag = '<strong>văn bản đậm</strong>';
    if (cmd === 'italic') tag = '<em>văn bản nghiêng</em>';
    if (cmd === 'underline') tag = '<u>văn bản gạch chân</u>';
    if (cmd === 'h2') tag = '<h2>Tiêu đề H2</h2>';
    if (cmd === 'h3') tag = '<h3>Tiêu đề H3</h3>';
    if (cmd === 'ul') tag = '<ul><li>Mục danh sách 1</li><li>Mục danh sách 2</li></ul>';
    if (cmd === 'ol') tag = '<ol><li>Bước 1</li><li>Bước 2</li></ol>';
    if (cmd === 'link') tag = '<a href="#">Đường dẫn liên kết</a>';
    if (cmd === 'code') tag = '<code>code snippet</code>';

    setContent((prev) => prev + (prev ? '\n' : '') + tag);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    if (!categoryId) {
      alert('Vui lòng chọn danh mục bài viết!');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài viết!');
      return;
    }

    onSave({
      title,
      alias: alias || slugify(title),
      category_id: categoryId,
      summary,
      content,
      image,
      video,
      tags,
      news_related: newsRelated,
      products_related: productsRelated,
      start_time: startTime,
      end_time: endTime,
      is_hot: isHot,
      is_new: isNew,
      show_in_homepage: showInHomepage,
      published,
      ordering: Number(ordering) || 1,
      seo_title: seoTitle || title,
      seo_keyword: seoKeyword,
      seo_description: seoDescription || summary,
    });
  };

  // Category List filtered by search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearchQuery.toLowerCase().trim())
  );
  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER TITLE BAR */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            {published ? (
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã xuất bản
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg">
                Bản nháp
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            {title ? title : 'Tiêu đề bài viết mới...'}
          </h1>
        </div>

        {/* Top Cancel button for mobile/tablet */}
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Đóng / Hủy bỏ"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2-COLUMN PATTERN 1 LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================== LEFT COLUMN (MAIN FORM FIELDS) ==================== */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Content Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            {/* 1. Tiêu đề (title) - Large Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>
                  Tiêu đề bài viết <span className="text-red-500">*</span>
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
                placeholder="Nhập tiêu đề tin tức, bài viết chuyên ngành..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* 2. Alias (slug) - Smaller input under title */}
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
                  placeholder="alias-duong-dan-bai-viet"
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* 3. Danh mục (category_id) - Searchable Dropdown */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Danh mục bài viết <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={categories.map((c) => ({ id: c.id, label: c.name }))}
                selectedId={categoryId}
                onChange={setCategoryId}
                placeholder="Chọn danh mục bài viết..."
                searchPlaceholder="Tìm kiếm danh mục..."
              />
            </div>

            {/* 4. Tóm tắt bài viết */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Tóm tắt / Giới thiệu bài tin</span>
                <span className="text-[11px] font-normal text-slate-400 font-mono">
                  {summary.length} / 300 ký tự
                </span>
              </div>
              <textarea
                rows={3}
                value={summary}
                maxLength={300}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Nhập tóm tắt bài viết (hiển thị ngoài thẻ danh sách)..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium resize-none"
              />
            </div>

            {/* 5. Nội dung bài viết (RichTextEditor) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Nội dung chi tiết bài viết <span className="text-red-500">*</span></span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Soạn thảo HTML trực quan & xem trước live
                </span>
              </div>
              <RichTextEditor value={content} onChange={setContent} minHeight="320px" />
            </div>

            {/* 6. Video (YouTube link recognition) */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-500" />
                <span>Video nhúng (Link Youtube / Video)</span>
              </label>
              <input
                type="url"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
              />
              {youtubeId && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-xs text-red-600 dark:text-red-400 font-semibold animate-in fade-in">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold">Đã nhận diện Video YouTube!</p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      ID: {youtubeId}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Tags (Từ khóa - Chip Input) */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Từ khóa bài viết (Tags)</span>
              </label>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap items-center gap-1.5">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-lg flex items-center gap-1"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? "Nhập từ khóa rồi nhấn Enter..." : "Thêm..."}
                  className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none px-2 py-1 min-w-[140px]"
                />
              </div>
            </div>

            {/* 8. Tin liên quan (news_related) Searchable Multi-Select */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Tin tức liên quan</span>
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
                searchPlaceholder="Tìm kiếm tiêu đề tin tức..."
              />
            </div>

            {/* 9. Sản phẩm liên quan (products_related) Searchable Multi-Select */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-orange-500" />
                <span>Sản phẩm phần mềm liên quan</span>
              </label>
              <SearchableMultiSelect
                options={mockRelatedProducts.map((prod) => ({
                  id: prod.id,
                  label: prod.name,
                  subLabel: `Mã SP: ${prod.code}`,
                  image: prod.image,
                }))}
                selectedIds={productsRelated}
                onChange={setProductsRelated}
                placeholder="Chọn sản phẩm phần mềm liên quan..."
                searchPlaceholder="Tìm kiếm tên sản phẩm..."
              />
            </div>

            {/* 10. Start Time & End Time (Side-by-side in 1 row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Ngày bắt đầu hiển thị</span>
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>Ngày kết thúc hiển thị</span>
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN (CARDS: ACTIONS, PUBLISH, IMAGE, SEO) ==================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* STICKY ACTIONS BAR & CARD 1: XUẤT BẢN & CẤU HÌNH */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            {/* Top Action Buttons Sticky at top of Right Column */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu bài viết</span>
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
              Cấu hình Xuất bản & Hiển thị
            </h3>

            {/* Config Toggles */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* is_hot (Tin nổi bật) */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Tin nổi bật (is_hot)</span>
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

              {/* is_new (Tin mới) */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Tin mới (is_new)</span>
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

              {/* show_in_homepage (Hiện trang chủ) */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Hiện Trang chủ</span>
                <button
                  type="button"
                  onClick={() => setShowInHomepage(!showInHomepage)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showInHomepage ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showInHomepage ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* published (Xuất bản) */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Xuất bản bài viết</span>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    published ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      published ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* ordering (Thứ tự) */}
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Thứ tự hiển thị (Ordering)</span>
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

          {/* CARD 2: ÁNH ĐẠI DIỆN (16:9 PREVIEW) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Ảnh đại diện (16:9)</span>
              <ImageIcon className="w-4 h-4 text-slate-400" />
            </h3>

            {/* 16:9 Aspect Ratio Preview Container */}
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
                  <span className="text-xs font-medium">Chưa có ảnh đại diện</span>
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

          {/* CARD 3: CẤU HÌNH SEO (COLLAPSIBLE / ACCORDION) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsSeoOpen(!isSeoOpen)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                <span>Tối ưu hóa SEO (Search Engine)</span>
              </div>
              {isSeoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isSeoOpen && (
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs">
                {/* seo_title */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Tiêu đề SEO (seo_title)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Mặc định lấy từ Tiêu đề bài viết'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
                  />
                </div>

                {/* seo_keyword */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Từ khóa SEO (seo_keyword)
                  </label>
                  <input
                    type="text"
                    value={seoKeyword}
                    onChange={(e) => setSeoKeyword(e.target.value)}
                    placeholder="ví dụ: SAP2000 v25, phan mem ket cau"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
                  />
                </div>

                {/* seo_description */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Mô tả SEO (seo_description)
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={summary || 'Mặc định lấy từ Tóm tắt bài viết'}
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
                    {seoTitle || title || 'Tiêu đề bài viết tin tức'}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-mono truncate">
                    https://cic.com.vn/tin-tuc/{alias || slugify(title || 'bai-viet')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {seoDescription || summary || 'Mô tả bài viết tin tức hiển thị tại đây...'}
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
