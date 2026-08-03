import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Image as ImageIcon,
  Upload,
  Tag as TagIcon,
  Globe,
  FileText,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  Hash,
  Link,
  Eye,
} from 'lucide-react';
import { StaticPage, StaticPageCategory } from './types';
import { RichTextEditor } from './RichTextEditor';

interface StaticPageFormModalProps {
  isOpen: boolean;
  pageToEdit: StaticPage | null;
  categories: StaticPageCategory[];
  onClose: () => void;
  onSave: (pageData: Partial<StaticPage>) => void;
}

export const StaticPageFormModal: React.FC<StaticPageFormModalProps> = ({
  isOpen,
  pageToEdit,
  categories,
  onClose,
  onSave,
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [alias, setAlias] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showInHomepage, setShowInHomepage] = useState(false);
  const [published, setPublished] = useState(true);
  const [ordering, setOrdering] = useState<number>(1);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoKeyword, setSeoKeyword] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'settings' | 'seo'>('general');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to convert Vietnamese string to SEO-friendly slug
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title || '');
      setAlias(pageToEdit.alias || '');
      setCategoryId(pageToEdit.category_id || (categories[0]?.id || ''));
      setSummary(pageToEdit.summary || '');
      setContent(pageToEdit.content || '');
      setImage(pageToEdit.image || '');
      setTags(pageToEdit.tags || []);
      setShowInHomepage(pageToEdit.show_in_homepage ?? false);
      setPublished(pageToEdit.published ?? true);
      setOrdering(pageToEdit.ordering ?? 1);
      setSeoTitle(pageToEdit.seo_title || '');
      setSeoKeyword(pageToEdit.seo_keyword || '');
      setSeoDescription(pageToEdit.seo_description || '');
    } else {
      // Defaults for new page
      setTitle('');
      setAlias('');
      setCategoryId(categories[0]?.id || '');
      setSummary('');
      setContent('');
      setImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80');
      setTags(['CIC', 'Trang tĩnh']);
      setShowInHomepage(false);
      setPublished(true);
      setOrdering(1);
      setSeoTitle('');
      setSeoKeyword('');
      setSeoDescription('');
    }
    setErrors({});
    setActiveTab('general');
  }, [pageToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Auto generate alias when title changes if alias is empty or user wants
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!alias || alias === slugify(title)) {
      setAlias(slugify(val));
    }
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  // Add tag handler
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
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

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống!';
    }
    if (!categoryId) {
      newErrors.category_id = 'Vui lòng chọn Danh mục!';
    }
    if (!content.trim()) {
      newErrors.content = 'Nội dung chi tiết bắt buộc phải nhập!';
    }
    setErrors(newErrors);

    if (newErrors.title || newErrors.category_id) {
      setActiveTab('general');
      return false;
    }
    if (newErrors.content) {
      setActiveTab('content');
      return false;
    }
    return true;
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      id: pageToEdit?.id,
      title: title.trim(),
      alias: alias.trim() || slugify(title),
      category_id: categoryId,
      summary: summary.trim(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl my-auto z-10 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                {pageToEdit ? 'Chỉnh sửa Trang tĩnh' : 'Thêm mới Trang tĩnh'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pageToEdit ? `ID: ${pageToEdit.id}` : 'Nhập thông tin hoàn chỉnh cho trang tĩnh mới'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'general', label: '1. Thông tin chung', icon: FileText, error: !!errors.title || !!errors.category_id },
            { id: 'content', label: '2. Nội dung chi tiết', icon: Sparkles, error: !!errors.content },
            { id: 'settings', label: '3. Thẻ & Trạng thái', icon: TagIcon },
            { id: 'seo', label: '4. Cấu hình SEO', icon: Globe },
          ].map((tab) => {
            const IconC = tab.icon;
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isAct
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50/30 dark:bg-orange-950/20'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <IconC className={`w-4 h-4 ${tab.error ? 'text-red-500' : ''}`} />
                <span>{tab.label}</span>
                {tab.error && <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Tiêu đề (title) - REQUIRED */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>
                    Tiêu đề trang <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Ô nhập chữ bắt buộc</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề trang tĩnh (VD: Giới thiệu chung về CIC Technology)"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm rounded-xl border ${
                    errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  } focus:outline-none focus:border-orange-500 font-medium transition-colors`}
                />
                {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title}</p>}
              </div>

              {/* Alias (alias) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>Alias (Đường dẫn tĩnh / URL Slug)</span>
                    <button
                      type="button"
                      onClick={() => setAlias(slugify(title))}
                      className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      Tự động tạo từ Tiêu đề
                    </button>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">/</span>
                    <input
                      type="text"
                      placeholder="gioi-thieu-chung-cic"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Danh mục (category_id) - REQUIRED */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      if (errors.category_id) setErrors((prev) => ({ ...prev, category_id: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-semibold rounded-xl border ${
                      errors.category_id ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                    } focus:outline-none focus:border-orange-500`}
                  >
                    <option value="">-- Chọn Danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-xs text-red-500 font-medium">{errors.category_id}</p>}
                </div>
              </div>

              {/* Tóm tắt (summary) - MULTILINE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tóm tắt nội dung (Summary)
                </label>
                <textarea
                  rows={3}
                  placeholder="Nhập mô tả tóm tắt giới thiệu ngắn gọn cho trang tĩnh..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Ảnh đại diện (image) - UPLOAD & PREVIEW */}
              <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    Ảnh đại diện (Featured Image)
                  </span>
                  <span className="text-[11px] text-slate-400">Xem trước & Tải ảnh trực tiếp</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Image Preview Box */}
                  <div className="relative w-full h-36 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 flex items-center justify-center group">
                    {image ? (
                      <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setImage('')}
                            className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-[11px]">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Tải ảnh từ thiết bị</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-slate-400">hoặc dán liên kết URL</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Dán đường dẫn ảnh URL (https://images.unsplash.com/...)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT (RICH TEXT EDITOR) */}
          {activeTab === 'content' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>
                  Nội dung chi tiết (Rich Text Content) <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] text-slate-400">Trình soạn thảo văn bản có định dạng đầy đủ</span>
              </label>

              <RichTextEditor
                value={content}
                onChange={(val) => {
                  setContent(val);
                  if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
                }}
              />
              {errors.content && <p className="text-xs text-red-500 font-medium">{errors.content}</p>}
            </div>
          )}

          {/* TAB 3: TAGS & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Tags (Từ khóa / Thẻ) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Từ khóa / Thẻ phân loại (Tags)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <TagIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Gõ tag mới và nhấn Enter hoặc chọn Thêm tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    + Thêm Tag
                  </button>
                </div>

                {/* Tags Badges */}
                <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="p-0.5 hover:bg-orange-500/20 rounded-full cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Chưa có tag nào được gắn.</span>
                  )}
                </div>
              </div>

              {/* Toggles & Ordering */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
                {/* Switch: Show in homepage */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Hiện trang chủ
                    </p>
                    <p className="text-[10px] text-slate-400">show_in_homepage</p>
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

                {/* Switch: Published */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Xuất bản (Published)
                    </p>
                    <p className="text-[10px] text-slate-400">Bật/tắt công khai</p>
                  </div>
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

                {/* Number Input: Ordering */}
                <div className="space-y-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Thứ tự sắp xếp (Ordering)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ordering}
                    onChange={(e) => setOrdering(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="p-3 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl text-xs text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0" />
                <span>Tối ưu hóa các thẻ Meta SEO để trang tĩnh dễ dàng xếp hạng cao trên các công cụ tìm kiếm Google.</span>
              </div>

              {/* Tiêu đề SEO (seo_title) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Tiêu đề SEO (SEO Title)</span>
                  <span className="text-[11px] text-slate-400">{seoTitle.length}/70 ký tự</span>
                </label>
                <input
                  type="text"
                  placeholder="Tiêu đề hiển thị trên Google (VD: Giới thiệu CIC Technology - Giải pháp PM Xây dựng)"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Từ khóa SEO (seo_keyword) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Từ khóa SEO (SEO Keywords)
                </label>
                <input
                  type="text"
                  placeholder="Phân cách bằng dấu phẩy (VD: cic, phan mem xay dung, etabs, plaxis, escon)"
                  value={seoKeyword}
                  onChange={(e) => setSeoKeyword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Mô tả SEO (seo_description) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Mô tả SEO (SEO Meta Description)</span>
                  <span className="text-[11px] text-slate-400">{seoDescription.length}/160 ký tự</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt ngắn gọn xuất hiện trong kết quả tìm kiếm Google..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Live Google Search Preview */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/60 space-y-1">
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Xem trước thẻ SERP Google
                </p>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-semibold truncate hover:underline cursor-pointer">
                  {seoTitle || title || 'Tiêu đề trang tĩnh'}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-mono">
                  https://cic.com.vn/{alias || 'alias-trang-tinh'}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2">
                  {seoDescription || summary || 'Mô tả tóm tắt nội dung trang tĩnh...'}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span className="text-red-500 font-bold">*</span> Trường bắt buộc
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu trang tĩnh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
