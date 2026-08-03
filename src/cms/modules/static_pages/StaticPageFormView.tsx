import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Sparkles,
  Eye,
  Image as ImageIcon,
  Upload,
  Tag,
  ChevronDown,
  ChevronUp,
  Globe,
  FileText,
  Layers,
  Check,
  ArrowLeft,
  BookOpen,
  Sliders,
  AlignLeft,
} from 'lucide-react';
import { StaticPage, StaticPageCategory } from './types';
import { RichTextEditor } from './RichTextEditor';

interface StaticPageFormViewProps {
  pageToEdit: StaticPage | null;
  categories: StaticPageCategory[];
  onSave: (data: Partial<StaticPage>) => void;
  onCancel: () => void;
}

// Utility to convert Vietnamese string to SEO-friendly slug
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

export const StaticPageFormView: React.FC<StaticPageFormViewProps> = ({
  pageToEdit,
  categories,
  onSave,
  onCancel,
}) => {
  // Form State
  const [title, setTitle] = useState(pageToEdit?.title || '');
  const [alias, setAlias] = useState(pageToEdit?.alias || '');
  const [categoryId, setCategoryId] = useState(
    pageToEdit?.category_id || categories[0]?.id || ''
  );
  
  // 3 Rich Editor Contents
  const [summary, setSummary] = useState(pageToEdit?.summary || pageToEdit?.overview || '');
  const [specifications, setSpecifications] = useState(pageToEdit?.specifications || '');
  const [content, setContent] = useState(pageToEdit?.content || '');
  
  // Rich Editor Active Sub-Tab: 'overview' | 'specifications' | 'detail'
  const [editorTab, setEditorTab] = useState<'overview' | 'specifications' | 'detail'>('overview');

  const [image, setImage] = useState(
    pageToEdit?.image ||
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
  );
  const [tags, setTags] = useState<string[]>(pageToEdit?.tags || ['CIC', 'Trang tĩnh']);
  const [tagInput, setTagInput] = useState('');

  // Right Column Toggles & Settings
  const [showInHomepage, setShowInHomepage] = useState(
    pageToEdit?.show_in_homepage ?? false
  );
  const [published, setPublished] = useState(pageToEdit?.published ?? true);
  const [ordering, setOrdering] = useState(pageToEdit?.ordering || 1);

  // SEO Fields
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState(pageToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(pageToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(pageToEdit?.seo_description || '');

  const [isAliasManuallyEdited, setIsAliasManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isAliasManuallyEdited && title) {
      setAlias(slugify(title));
    }
  }, [title, isAliasManuallyEdited]);

  // Tag Handlers
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

  // Image Upload Simulation
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề trang tĩnh!');
      return;
    }
    if (!categoryId) {
      alert('Vui lòng chọn danh mục trang tĩnh!');
      return;
    }

    onSave({
      title: title.trim(),
      alias: alias.trim() || slugify(title),
      category_id: categoryId,
      summary: summary.trim(),
      overview: summary.trim(),
      specifications: specifications.trim(),
      content: content.trim(),
      image,
      tags,
      show_in_homepage: showInHomepage,
      published,
      ordering: Number(ordering) || 1,
      seo_title: seoTitle.trim() || title.trim(),
      seo_keyword: seoKeyword.trim(),
      seo_description: seoDescription.trim() || summary.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Status Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              {published ? (
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã xuất bản
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg">
                  Bản nháp / Ẩn
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {title || 'Trang tĩnh chưa đặt tên'}
            </h1>
          </div>
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

      {/* Main Form 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Form Inputs (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Main Metadata */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>Thông tin cơ bản trang tĩnh</span>
            </h3>

            {/* Tiêu đề trang tĩnh */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tiêu đề trang tĩnh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề trang tĩnh (VD: Giới thiệu chung về CIC Technology)..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Alias & Danh mục */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alias */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Alias (Đường dẫn tĩnh / URL Slug)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAlias(slugify(title));
                      setIsAliasManuallyEdited(false);
                    }}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    Tạo từ tiêu đề
                  </button>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">/</span>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => {
                      setAlias(e.target.value);
                      setIsAliasManuallyEdited(true);
                    }}
                    placeholder="gioi-thieu-cic"
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Danh mục */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Danh mục trang tĩnh <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags (Từ khóa) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Từ khóa bài viết (Tags)</span>
              </label>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap items-center gap-2">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-lg flex items-center gap-1"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Nhập thẻ tag và ấn Enter..."
                  className="flex-1 bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none min-w-[140px]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Nội dung trang tĩnh (RichTextEditor) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
            {/* Tóm tắt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Tóm tắt / Giới thiệu ngắn</span>
                <span className="text-[11px] font-normal text-slate-400 font-mono">
                  {summary.length} / 300 ký tự
                </span>
              </div>
              <textarea
                rows={3}
                value={summary}
                maxLength={300}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Nhập mô tả tóm tắt ngắn gọn trang tĩnh..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium resize-none"
              />
            </div>

            {/* Nội dung chi tiết */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Nội dung chi tiết trang tĩnh <span className="text-red-500">*</span></span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Soạn thảo HTML trực quan & xem trước live
                </span>
              </div>
              <RichTextEditor value={content} onChange={setContent} minHeight="360px" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Cards (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Xuất bản & Thao tác */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu trang tĩnh</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Trạng thái & Xuất bản</span>
              <Layers className="w-4 h-4 text-orange-600" />
            </h3>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-1">
              {/* Xuất bản Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Trạng thái xuất bản</p>
                  <p className="text-[10px] text-slate-400">Cho phép hiển thị ra website</p>
                </div>
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

              {/* Show in Homepage Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hiển thị Trang chủ</p>
                  <p className="text-[10px] text-slate-400">Ghim vào phần giới thiệu trang chủ</p>
                </div>
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

              {/* Ordering */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Thứ tự sắp xếp (Ordering)
                </label>
                <input
                  type="number"
                  min={1}
                  value={ordering}
                  onChange={(e) => setOrdering(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Ảnh đại diện (Featured Image) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-2xs">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
              <span>Ảnh đại diện trang</span>
              <ImageIcon className="w-4 h-4 text-orange-600" />
            </h3>

            {/* Image Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <span>Chưa có ảnh</span>
                </div>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Đường dẫn hình ảnh (URL)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* File Upload Button */}
            <label className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Tải ảnh lên từ máy</span>
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
            </label>
          </div>

          {/* Card 3: Tối ưu hóa SEO (Google SERP) - Collapsible */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsSeoOpen(!isSeoOpen)}
              className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                <span>Tối ưu hóa SEO (Google)</span>
              </div>
              {isSeoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isSeoOpen && (
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3.5 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Tiêu đề SEO'}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={seoKeyword}
                    onChange={(e) => setSeoKeyword(e.target.value)}
                    placeholder="trang tinh, cic, gioi thieu..."
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    SEO Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Mô tả SEO xuất hiện trên kết quả tìm kiếm..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 resize-none"
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
                    {seoTitle || title || 'Tiêu đề trang tĩnh'}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-mono truncate">
                    https://cic.com.vn/{alias || slugify(title || 'trang-tinh')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {seoDescription || summary || 'Mô tả trang tĩnh hiển thị tại đây...'}
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
