import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Check,
  Image as ImageIcon,
  Video,
  Tag,
  Calendar,
  Layers,
  Globe,
  Trash2,
  Package,
  FileText,
  BookOpen,
  Eye,
  History,
  Activity,
  RotateCcw,
  Send,
  Sparkles,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { SearchableSelect, SearchableMultiSelect } from '../../components/SearchableSelect';
import { NewsArticle, NewsCategory, RelatedProductItem, WorkflowStatus, ArticleVersion } from './types';
import { ArticlePreviewModal } from './components/ArticlePreviewModal';
import { ReturnCommentModal } from './components/ReturnCommentModal';
import { VersionHistoryDrawer } from './components/VersionHistoryDrawer';
import { ActivityLogDrawer } from './components/ActivityLogDrawer';

interface NewsFormViewProps {
  articleToEdit: NewsArticle | null;
  categories: NewsCategory[];
  relatedArticles: NewsArticle[];
  relatedProducts: RelatedProductItem[];
  onSave: (data: Partial<NewsArticle>) => void;
  onCancel: () => void;
}

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

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

type ActiveTab = 'content' | 'taxonomy' | 'media' | 'seo' | 'publishing';

export const NewsFormView: React.FC<NewsFormViewProps> = ({
  articleToEdit,
  categories,
  relatedArticles,
  relatedProducts,
  onSave,
  onCancel,
}) => {
  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('content');

  // Form State
  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [alias, setAlias] = useState(articleToEdit?.alias || '');
  const [categoryId, setCategoryId] = useState(articleToEdit?.category_id || categories[0]?.id || '');
  const [summary, setSummary] = useState(articleToEdit?.summary || '');
  const [content, setContent] = useState(articleToEdit?.content || '');

  // Media
  const [image, setImage] = useState(
    articleToEdit?.image || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80'
  );
  const [imageAlt, setImageAlt] = useState(articleToEdit?.image_alt || '');
  const [imageCaption, setImageCaption] = useState(articleToEdit?.image_caption || '');
  const [video, setVideo] = useState(articleToEdit?.video || '');

  // Tags & Related
  const [tags, setTags] = useState<string[]>(articleToEdit?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [newsRelated, setNewsRelated] = useState<string[]>(articleToEdit?.news_related || []);
  const [productsRelated, setProductsRelated] = useState<string[]>(articleToEdit?.products_related || []);

  // SEO & Social
  const [seoTitle, setSeoTitle] = useState(articleToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(articleToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(articleToEdit?.seo_description || '');

  // Workflow & Time
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(articleToEdit?.workflow_status || 'draft');
  const [startTime, setStartTime] = useState(articleToEdit?.start_time || new Date().toISOString().substring(0, 16));
  const [endTime, setEndTime] = useState(articleToEdit?.end_time || '2026-12-31T23:59');
  const [timezone, setTimezone] = useState(articleToEdit?.timezone || 'Asia/Ho_Chi_Minh (UTC+7)');
  const [authorName, setAuthorName] = useState(articleToEdit?.author?.name || 'Nguyễn Văn Nam');
  const [assigneeName, setAssigneeName] = useState(articleToEdit?.assignee?.name || 'Trần Thị Mai');
  const [reviewerName, setReviewerName] = useState(articleToEdit?.reviewer?.name || 'Lê Hoàng Long');
  const [returnComment, setReturnComment] = useState(articleToEdit?.return_comment || '');

  // Visibility Flags
  const [isHot, setIsHot] = useState(articleToEdit?.is_hot ?? false);
  const [isNew, setIsNew] = useState(articleToEdit?.is_new ?? true);
  const [showInHomepage, setShowInHomepage] = useState(articleToEdit?.show_in_homepage ?? true);
  const [ordering, setOrdering] = useState(articleToEdit?.ordering || 1);

  // Auto-Save & Versioning State
  const [autoSaveText, setAutoSaveText] = useState('Đã tự động lưu nháp lúc 21:37');
  const [workingVersion, setWorkingVersion] = useState(articleToEdit?.working_version_number || 1);

  // Modals & Drawers
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  // Auto slugify
  const [isAliasManuallyEdited, setIsAliasManuallyEdited] = useState(false);
  useEffect(() => {
    if (!isAliasManuallyEdited && title) {
      setAlias(slugify(title));
    }
  }, [title, isAliasManuallyEdited]);

  // Handle Tags
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

  // Submit Handler
  const handleSaveArticle = (targetStatus?: WorkflowStatus) => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    if (!categoryId) {
      alert('Vui lòng chọn danh mục bài viết!');
      return;
    }

    const finalStatus = targetStatus || workflowStatus;

    onSave({
      title,
      alias: alias || slugify(title),
      category_id: categoryId,
      summary,
      content,
      image,
      image_alt: imageAlt,
      image_caption: imageCaption,
      video,
      tags,
      news_related: newsRelated,
      products_related: productsRelated,
      start_time: startTime,
      end_time: endTime,
      timezone,
      workflow_status: finalStatus,
      published: finalStatus === 'published',
      is_hot: isHot,
      is_new: isNew,
      show_in_homepage: showInHomepage,
      ordering: Number(ordering) || 1,
      seo_title: seoTitle || title,
      seo_keyword: seoKeyword,
      seo_description: seoDescription || summary,
      author: { name: authorName },
      assignee: { name: assigneeName },
      reviewer: { name: reviewerName },
      return_comment: returnComment,
    });
  };

  const youtubeId = getYoutubeVideoId(video);

  // Quality Warning Checks (Calculated live)
  const qualityChecks = [
    { label: 'Tiêu đề từ 40-70 ký tự (SEO tối ưu)', passed: title.length >= 40 && title.length <= 80 },
    { label: 'Có ảnh đại diện 16:9', passed: Boolean(image) },
    { label: 'Có thẻ Alt cho ảnh đại diện', passed: Boolean(imageAlt) },
    { label: 'Mô tả tóm tắt từ 100-300 ký tự', passed: summary.length >= 80 },
    { label: 'Có từ khóa SEO', passed: Boolean(seoKeyword) },
  ];

  return (
    <div className="space-y-5 relative">
      {/* ================= STICKY TOP WORKFLOW BAR ================= */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
                workflowStatus === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                workflowStatus === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                workflowStatus === 'returned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                workflowStatus === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {workflowStatus}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Working Version v{workingVersion}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
              {title || 'Tạo bài viết mới'}
            </h1>
          </div>
        </div>

        {/* Workflow Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Version History Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsVersionDrawerOpen(true)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Lịch sử v{workingVersion}</span>
          </button>

          {/* Activity Log Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsActivityDrawerOpen(true)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Audit Log</span>
          </button>

          {/* Article Preview Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span>Xem trước</span>
          </button>

          {/* Workflow Action Buttons depending on role / current state */}
          {workflowStatus === 'pending' && (
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Trả bài</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSaveArticle('draft')}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveArticle('pending')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi duyệt</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveArticle('published')}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Phê duyệt & Xuất bản</span>
          </button>
        </div>
      </div>

      {/* ================= FORM TAB NAVIGATION BAR ================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Nội dung bài viết</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('taxonomy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'taxonomy'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Phân loại & Quan hệ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'media'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>3. Media & Video</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>4. SEO & Social Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('publishing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'publishing'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>5. Xuất bản & Quy trình</span>
        </button>
      </div>

      {/* ================= MAIN CONTENT & SIDE PANEL GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE TAB PANEL */}
        <div className="lg:col-span-8 space-y-5">
          {/* TAB 1: NỘI DUNG */}
          {activeTab === 'content' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Tiêu đề bài viết (Tiếng Việt) <span className="text-red-500">*</span></span>
                  <span className="text-[11px] font-mono text-slate-400">{title.length} ký tự</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết tin tức..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Đường dẫn phụ (Alias / Slug)</span>
                  <span className="text-[10px] font-mono text-slate-400">Tự động slugify</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 text-xs font-mono">/tin-tuc/</span>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => {
                      setAlias(e.target.value);
                      setIsAliasManuallyEdited(true);
                    }}
                    className="w-full pl-18 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Tóm tắt giới thiệu</span>
                  <span className="text-[11px] font-mono text-slate-400">{summary.length} / 300</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Nhập tóm tắt hiển thị ngoài danh sách bài viết..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 resize-none focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Nội dung chi tiết bài viết HTML</span>
                </label>
                <RichTextEditor value={content} onChange={setContent} minHeight="360px" />
              </div>
            </div>
          )}

          {/* TAB 2: PHÂN LOẠI & QUAN HỆ */}
          {activeTab === 'taxonomy' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Danh mục chính <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={categories.map((c) => ({ id: c.id, label: c.name }))}
                  selectedId={categoryId}
                  onChange={setCategoryId}
                  placeholder="Chọn danh mục bài viết..."
                />
              </div>

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
                      <button type="button" onClick={() => handleRemoveTag(t)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Nhập từ khóa bấm Enter..."
                    className="bg-transparent text-xs focus:outline-none px-2 py-1 min-w-[140px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Tin tức liên quan</span>
                </label>
                <SearchableMultiSelect
                  options={relatedArticles.map((art) => ({
                    id: art.id,
                    label: art.title,
                    image: art.image,
                  }))}
                  selectedIds={newsRelated}
                  onChange={setNewsRelated}
                  placeholder="Chọn bài tin liên quan..."
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>Sản phẩm phần mềm liên quan</span>
                </label>
                <SearchableMultiSelect
                  options={relatedProducts.map((prod) => ({
                    id: prod.id,
                    label: prod.name,
                    subLabel: prod.code,
                    image: prod.image,
                  }))}
                  selectedIds={productsRelated}
                  onChange={setProductsRelated}
                  placeholder="Chọn sản phẩm phần mềm..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & VIDEO */}
          {activeTab === 'media' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ảnh đại diện chính (Tỉ lệ 16:9)
                </label>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                  {image ? (
                    <img src={image} alt={imageAlt || title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <p className="text-xs mt-1">Chưa chọn ảnh đại diện</p>
                    </div>
                  )}
                </div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Nhập URL hình ảnh (https://...)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Thẻ Alt (Mô tả ảnh cho SEO & Accessibility)</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Ví dụ: Hình ảnh phần mềm CIC-SAP2000 v25"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chú thích ảnh (Image Caption)</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Giao diện mô phỏng 3D"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-500" />
                  <span>Video Youtube đính kèm</span>
                </label>
                <input
                  type="url"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700"
                />
                {youtubeId && (
                  <p className="text-[11px] text-emerald-600 font-mono font-bold">
                    ✓ Đã nhận diện YouTube Video ID: {youtubeId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SEO & SOCIAL */}
          {activeTab === 'seo' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tiêu đề SEO (seo_title)</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Tiêu đề hiển thị kết quả tìm kiếm...'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Từ khóa SEO (seo_keyword)</label>
                <input
                  type="text"
                  value={seoKeyword}
                  onChange={(e) => setSeoKeyword(e.target.value)}
                  placeholder="SAP2000, TCVN, phan mem ket cau, CIC"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mô tả SEO (seo_description)</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={summary || 'Mô tả bài viết tìm kiếm...'}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 resize-none"
                />
              </div>

              {/* SERP PREVIEW */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Xem trước Google SERP</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline cursor-pointer">
                  {seoTitle || title || 'Tiêu đề bài viết SEO'}
                </p>
                <p className="text-emerald-600 text-xs font-mono">https://cic.com.vn/tin-tuc/{alias || 'slug'}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {seoDescription || summary || 'Mô tả SEO xuất hiện tại đây...'}
                </p>
              </div>

              {/* SOCIAL CARD PREVIEW (FB/Zalo) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Xem trước Thẻ chia sẻ Mạng xã hội (OpenGraph / Facebook / Zalo)</span>
                </p>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 max-w-md">
                  {image && <img src={image} className="w-full aspect-video object-cover" alt="" />}
                  <div className="p-3 space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-mono">CIC.COM.VN</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{seoTitle || title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{seoDescription || summary}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: XUẤT BẢN & QUY TRÌNH */}
          {activeTab === 'publishing' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Trạng thái quy trình bài viết</label>
                  <select
                    value={workflowStatus}
                    onChange={(e) => setWorkflowStatus(e.target.value as WorkflowStatus)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="pending">Chờ duyệt (Pending Review)</option>
                    <option value="returned">Bị trả lại (Returned)</option>
                    <option value="approved">Đã duyệt (Approved)</option>
                    <option value="scheduled">Lên lịch tự động (Scheduled)</option>
                    <option value="published">Đã xuất bản (Published)</option>
                    <option value="archived">Lưu trữ (Archived)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Múi giờ hệ thống (Timezone)</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Thời gian bắt đầu hiển thị</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Thời gian kết thúc</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Roles & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tác giả (Author)</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Người được giao (Assignee)</label>
                  <input
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Người duyệt (Reviewer)</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {returnComment && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs">
                  <p className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Lý do trả bài gần nhất:
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{returnComment}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUALITY CHECKLIST & CONTEXT CARDS */}
        <div className="lg:col-span-4 space-y-5">
          {/* QUALITY CHECKLIST CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Kiểm tra chất lượng bài viết</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h3>

            <div className="space-y-2 text-xs">
              {qualityChecks.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{check.label}</span>
                  {check.passed ? (
                    <span className="p-1 bg-emerald-500/10 text-emerald-600 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 bg-amber-500/10 text-amber-600 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* VISIBILITY & HOMEPAGE CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hiển thị & Cờ đánh dấu</h3>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Tin nổi bật (Hot)</span>
                <input
                  type="checkbox"
                  checked={isHot}
                  onChange={(e) => setIsHot(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Tin mới (New)</span>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Hiển thị ngoài Trang chủ</span>
                <input
                  type="checkbox"
                  checked={showInHomepage}
                  onChange={(e) => setShowInHomepage(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
              </label>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Thứ tự ưu tiên</span>
                <input
                  type="number"
                  value={ordering}
                  onChange={(e) => setOrdering(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 text-center font-bold rounded-lg border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY MODALS & DRAWERS */}
      <ArticlePreviewModal
        isOpen={isPreviewOpen}
        article={{
          id: articleToEdit?.id || 'preview',
          title,
          alias,
          category_id: categoryId,
          summary,
          content,
          image,
          image_alt: imageAlt,
          image_caption: imageCaption,
          video,
          tags,
          news_related: newsRelated,
          products_related: productsRelated,
          start_time: startTime,
          workflow_status: workflowStatus,
          author: { name: authorName },
          created_time: new Date().toISOString(),
        }}
        onClose={() => setIsPreviewOpen(false)}
      />

      <ReturnCommentModal
        isOpen={isReturnModalOpen}
        articleTitle={title}
        onClose={() => setIsReturnModalOpen(false)}
        onConfirm={(comment) => {
          setReturnComment(comment);
          setWorkflowStatus('returned');
          setIsReturnModalOpen(false);
          handleSaveArticle('returned');
        }}
      />

      <VersionHistoryDrawer
        isOpen={isVersionDrawerOpen}
        article={articleToEdit}
        onClose={() => setIsVersionDrawerOpen(false)}
        onRestoreVersion={(ver) => {
          if (ver.title) setTitle(ver.title);
          if (ver.summary) setSummary(ver.summary);
          setWorkingVersion(ver.version_number);
          setIsVersionDrawerOpen(false);
          alert(`Đã khôi phục dữ liệu về phiên bản v${ver.version_number}!`);
        }}
      />

      <ActivityLogDrawer
        isOpen={isActivityDrawerOpen}
        article={articleToEdit}
        onClose={() => setIsActivityDrawerOpen(false)}
      />
    </div>
  );
};
