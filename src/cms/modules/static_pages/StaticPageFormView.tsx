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
  Send,
  CheckCircle2,
  AlertCircle,
  History,
  Activity,
  Link2,
  Share2,
  LayoutGrid,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Calendar,
  UserCheck,
} from 'lucide-react';
import {
  StaticPage,
  StaticPageCategory,
  PageTemplateType,
  PageSectionBlock,
  WorkflowStatus,
  VersionRecord,
} from './types';
import { RichTextEditor } from './RichTextEditor';
import { UsedByDrawer } from './UsedByDrawer';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { PagePreviewModal } from './PagePreviewModal';
import { ImpactWarningModal } from './ImpactWarningModal';

interface StaticPageFormViewProps {
  pageToEdit: StaticPage | null;
  categories: StaticPageCategory[];
  allPages?: StaticPage[];
  onSave: (data: Partial<StaticPage>) => void;
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

export const StaticPageFormView: React.FC<StaticPageFormViewProps> = ({
  pageToEdit,
  categories,
  allPages = [],
  onSave,
  onCancel,
}) => {
  // Main Tab Navigation: 1. Nội dung | 2. Cấu trúc | 3. Phân loại | 4. Media | 5. SEO | 6. Xuất bản
  const [activeTab, setActiveTab] = useState<
    'content' | 'structure' | 'category' | 'media' | 'seo' | 'workflow'
  >('content');

  // Form Basic Fields
  const [title, setTitle] = useState(pageToEdit?.title || '');
  const [alias, setAlias] = useState(pageToEdit?.alias || '');
  const [categoryId, setCategoryId] = useState(
    pageToEdit?.category_id || categories[0]?.id || ''
  );
  const [parentId, setParentId] = useState<string | null>(pageToEdit?.parent_id || null);

  // Template & Section blocks
  const [template, setTemplate] = useState<PageTemplateType>(pageToEdit?.template || 'standard');
  const [sections, setSections] = useState<PageSectionBlock[]>(
    pageToEdit?.sections || [
      { id: 's1', title: 'Giới thiệu chung', type: 'text', content: '', order: 1 },
      { id: 's2', title: 'Thông tin bổ sung', type: 'grid', content: '', order: 2 },
    ]
  );

  // Contents
  const [summary, setSummary] = useState(pageToEdit?.summary || pageToEdit?.overview || '');
  const [content, setContent] = useState(pageToEdit?.content || '');

  // Media
  const [image, setImage] = useState(
    pageToEdit?.image ||
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
  );
  const [imageAlt, setImageAlt] = useState(pageToEdit?.image_alt || '');
  const [imageCaption, setImageCaption] = useState(pageToEdit?.image_caption || '');
  const [bannerImage, setBannerImage] = useState(pageToEdit?.banner_image || '');

  // Tags & Ordering
  const [tags, setTags] = useState<string[]>(pageToEdit?.tags || ['CIC', 'Trang tĩnh']);
  const [tagInput, setTagInput] = useState('');
  const [ordering, setOrdering] = useState(pageToEdit?.ordering || 1);
  const [showInHomepage, setShowInHomepage] = useState(pageToEdit?.show_in_homepage ?? false);
  const [showInHeader, setShowInHeader] = useState(pageToEdit?.show_in_header ?? false);
  const [showInFooter, setShowInFooter] = useState(pageToEdit?.show_in_footer ?? true);

  // SEO & Social
  const [seoTitle, setSeoTitle] = useState(pageToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(pageToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(pageToEdit?.seo_description || '');

  // Workflow & Versioning
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(
    pageToEdit?.workflow_status || 'draft'
  );
  const [published, setPublished] = useState(pageToEdit?.published ?? false);
  const [workingVersionNumber] = useState(pageToEdit?.working_version_number || 1);
  const [returnComment, setReturnComment] = useState(pageToEdit?.return_comment || '');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Drawers & Modals
  const [isUsedByDrawerOpen, setIsUsedByDrawerOpen] = useState(false);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [impactActionType, setImpactActionType] = useState<'url_change' | 'archive' | 'delete' | 'hierarchy_change'>('url_change');

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

  // Section Reordering
  const handleAddSection = () => {
    const newSec: PageSectionBlock = {
      id: `sec_${Date.now()}`,
      title: 'Khối nội dung mới',
      type: 'text',
      content: '',
      order: sections.length + 1,
    };
    setSections([...sections, newSec]);
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
  };

  // Live Quality Warnings Calculation
  const qualityWarnings: string[] = [];
  if (title.length < 10) qualityWarnings.push('Tiêu đề quá ngắn (nên trên 10 ký tự)');
  if (!summary) qualityWarnings.push('Thiếu phần tóm tắt / giới thiệu ngắn');
  if (!imageAlt) qualityWarnings.push('Thiếu thẻ Alt mô tả ảnh đại diện (SEO image accessibility)');
  if (!seoKeyword) qualityWarnings.push('Chưa nhập từ khóa SEO');
  if (pageToEdit?.used_by && pageToEdit.used_by.length === 0) qualityWarnings.push('Trang chưa được liên kết từ Menu/Block nào (Mồ côi)');

  // Submit Handler
  const handleSaveForm = (targetStatus: WorkflowStatus) => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề trang!');
      return;
    }

    const isPublished = targetStatus === 'published' || targetStatus === 'approved';

    onSave({
      title: title.trim(),
      alias: alias.trim() || slugify(title),
      category_id: categoryId,
      parent_id: parentId,
      template,
      sections,
      summary: summary.trim(),
      overview: summary.trim(),
      content: content.trim(),
      image,
      image_alt: imageAlt,
      image_caption: imageCaption,
      banner_image: bannerImage,
      tags,
      show_in_homepage: showInHomepage,
      show_in_header: showInHeader,
      show_in_footer: showInFooter,
      published: isPublished,
      ordering: Number(ordering) || 1,
      seo_title: seoTitle.trim() || title.trim(),
      seo_keyword: seoKeyword.trim(),
      seo_description: seoDescription.trim() || summary.trim(),
      workflow_status: targetStatus,
      working_version_number: workingVersionNumber,
      published_version_number: isPublished ? workingVersionNumber : pageToEdit?.published_version_number || 1,
      quality_warnings: qualityWarnings,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sticky Top Bar & Action Bar */}
      <div className="cms-sticky-action bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-full">
                  Phiên bản v{workingVersionNumber}.0 (Draft)
                </span>
                {published && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Đã Xuất bản
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  Quản lý trang nội dung
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate mt-1">
                {title || 'Tạo trang nội dung mới'}
              </h1>
            </div>
          </div>

          {/* Quick Drawer & Action triggers */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {/* Used-by Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsUsedByDrawerOpen(true)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Link2 className="w-4 h-4 text-orange-600" />
              <span>Nơi sử dụng ({pageToEdit?.used_by?.length || 0})</span>
            </button>

            {/* Version History Trigger */}
            <button
              type="button"
              onClick={() => setIsVersionDrawerOpen(true)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <History className="w-4 h-4 text-blue-600" />
              <span>Phiên bản</span>
            </button>

            {/* Audit Log Trigger */}
            <button
              type="button"
              onClick={() => setIsActivityDrawerOpen(true)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Nhật ký</span>
            </button>

            {/* Live Preview Trigger */}
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-3 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Xem trước Live</span>
            </button>

            {/* Save Draft */}
            <button
              type="button"
              onClick={() => handleSaveForm('draft')}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Nháp</span>
            </button>

            {/* Submit for Review */}
            <button
              type="button"
              onClick={() => handleSaveForm('pending')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Gửi duyệt</span>
            </button>

            {/* Approve & Publish */}
            <button
              type="button"
              onClick={() => handleSaveForm('published')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xuất bản ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section navigation remains in document flow so it never covers form content. */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold shadow-xs dark:border-slate-800 dark:bg-slate-900 [scrollbar-width:thin]">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'content'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Nội dung
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'structure'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> 2. Cấu trúc trang
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('category')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'category'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> 3. Phân loại & Phân cấp
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 4. Media & Banner
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'seo'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" /> 5. SEO & Social
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'workflow'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" /> 6. Quy trình & Duyệt
          </button>
        </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT MAIN AREA (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: NỘI DUNG */}
          {activeTab === 'content' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Nhận diện và nội dung chính</span>
              </h3>

              {/* Tiêu đề */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tiêu đề trang nội dung <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Tổng quan & Năng lực Công ty Cổ phần CIC..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Alias Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Alias (URL Slug công khai)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAlias(slugify(title));
                      setIsAliasManuallyEdited(false);
                    }}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3" /> Tạo tự động
                  </button>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">/</span>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => {
                      setAlias(e.target.value);
                      setIsAliasManuallyEdited(true);
                    }}
                    placeholder="tong-quan-nang-luc-cic"
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Tóm tắt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Tóm tắt / Giới thiệu ngắn</span>
                  <span className="text-[11px] font-mono text-slate-400">{summary.length} / 300 ký tự</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn nội dung cốt lõi của trang..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 resize-none font-medium"
                />
              </div>

              {/* Soạn thảo RichTextEditor */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-600" /> Nội dung chi tiết trang tĩnh
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">Hỗ trợ định dạng HTML trực quan</span>
                </label>
                <RichTextEditor value={content} onChange={setContent} minHeight="380px" />
              </div>
            </div>
          )}

          {/* TAB 2: CẤU TRÚC TRANG */}
          {activeTab === 'structure' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-orange-600" />
                <span>Mẫu giao diện và sắp xếp nội dung</span>
              </h3>

              {/* Template Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mẫu giao diện (Template Layout)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setTemplate('standard')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      template === 'standard'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-xs">Tiêu chuẩn</p>
                    <p className="text-[10px] text-slate-400 font-normal">Bài viết văn bản chuẩn</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplate('landing')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      template === 'landing'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-xs">Landing Page</p>
                    <p className="text-[10px] text-slate-400 font-normal">Hero, CTA & Blocks</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplate('policy')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      template === 'policy'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-xs">Chính sách & Pháp lý</p>
                    <p className="text-[10px] text-slate-400 font-normal">Điều khoản & TOC</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplate('corporate_intro')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      template === 'corporate_intro'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-xs">Giới thiệu Công ty</p>
                    <p className="text-[10px] text-slate-400 font-normal">Năng lực & Lịch sử</p>
                  </button>
                </div>
              </div>

              {/* Sections Reordering */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Danh sách các khối nội dung (Section Blocks)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm khối mới
                  </button>
                </div>

                <div className="space-y-3">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[idx].title = e.target.value;
                              setSections(updated);
                            }}
                            className="bg-white dark:bg-slate-900 px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === sections.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sec.id)}
                            className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={sec.content}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].content = e.target.value;
                          setSections(updated);
                        }}
                        placeholder="Nội dung cho khối này..."
                        className="w-full p-2.5 bg-white dark:bg-slate-900 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHÂN LOẠI & PHÂN CẤP */}
          {activeTab === 'category' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <span>Phân loại và cây nội dung</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Danh mục */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Danh mục chuyên mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trang cha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Trang cha trực thuộc (Tree hierarchy)
                  </label>
                  <select
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value || null)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
                  >
                    <option value="">-- Trang gốc (Top level node) --</option>
                    {allPages
                      .filter((p) => p.id !== pageToEdit?.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Tags & Ordering */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-orange-500" />
                    <span>Thẻ từ khóa phân loại (Tags)</span>
                  </label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap items-center gap-2">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-500 cursor-pointer ml-1"
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
                      placeholder="Nhập thẻ tag và bấm Enter..."
                      className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none min-w-[160px]"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Thứ tự sắp xếp hiển thị trong danh mục (Ordering)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ordering}
                    onChange={(e) => setOrdering(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & BANNER */}
          {activeTab === 'media' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-600" />
                <span>Ảnh đại diện, banner và hỗ trợ tiếp cận</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Image */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Ảnh đại diện bài (Featured Image)
                  </label>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <img src={image} alt="Featured" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="URL hình ảnh..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Image Alt & Caption */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Mô tả thẻ Alt (Accessibility Metadata) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Mô tả cho trình đọc màn hình screen reader..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Chú thích ảnh (Caption)
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Chú thích hiển thị bên dưới ảnh..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Ảnh Banner Header (Tùy chọn cho Landing Page)
                    </label>
                    <input
                      type="text"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO & SOCIAL */}
          {activeTab === 'seo' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                <span>SEO và chia sẻ mạng xã hội</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={seoKeyword}
                    onChange={(e) => setSeoKeyword(e.target.value)}
                    placeholder="cic technology, gioi thieu cic, phan mem xay dung"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Mô tả ngắn hiển thị trên Google..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 resize-none"
                  />
                </div>

                {/* Google SERP Preview */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Xem trước Google SERP Search Card
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold truncate">
                    {seoTitle || title || 'Tiêu đề SEO'}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-mono">
                    https://cic.com.vn/{alias || slugify(title || 'trang-tinh')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {seoDescription || summary || 'Mô tả trang tĩnh xuất hiện ở đây...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: XUẤT BẢN & QUY TRÌNH */}
          {activeTab === 'workflow' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-600" />
                <span>Quy trình duyệt và phân công</span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Trạng thái Quy trình (Workflow Status)
                    </label>
                    <select
                      value={workflowStatus}
                      onChange={(e) => setWorkflowStatus(e.target.value as WorkflowStatus)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <option value="draft">Bản nháp (Draft)</option>
                      <option value="pending">Hàng chờ duyệt (Pending Review)</option>
                      <option value="returned">Yêu cầu sửa (Returned)</option>
                      <option value="approved">Đã duyệt (Approved)</option>
                      <option value="published">Đã xuất bản (Published)</option>
                      <option value="archived">Lưu trữ (Archived)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tác giả khởi tạo
                    </label>
                    <input
                      type="text"
                      disabled
                      value={pageToEdit?.author?.name || 'Nguyễn Văn Nam'}
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>

                {workflowStatus === 'returned' && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl space-y-2">
                    <label className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Ghi chú phản hồi từ Người duyệt (Return Comment)
                    </label>
                    <p className="text-xs text-red-700 dark:text-red-300 font-medium italic">
                      "{returnComment || pageToEdit?.return_comment || 'Cần bổ sung chi tiết theo yêu cầu.'}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR PANEL (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quality Checklist Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
              <span>Kiểm tra Chất lượng (Quality Checklist)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </h3>

            {qualityWarnings.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  Có {qualityWarnings.length} khuyến nghị cần lưu ý:
                </p>
                <ul className="space-y-1.5 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  {qualityWarnings.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Nội dung đạt chuẩn chất lượng xuất bản!</span>
              </div>
            )}
          </div>

          {/* Used-by Reference Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-orange-600" /> Nơi sử dụng
              </h3>
              <button
                type="button"
                onClick={() => setIsUsedByDrawerOpen(true)}
                className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Chi tiết
              </button>
            </div>

            {pageToEdit?.used_by && pageToEdit.used_by.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Được liên kết tại <strong>{pageToEdit.used_by.length}</strong> vị trí:
                </p>
                {pageToEdit.used_by.slice(0, 2).map((u) => (
                  <div key={u.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px]">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{u.location_name}</p>
                    <p className="font-mono text-slate-400 text-[10px]">{u.link_url}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-amber-600 dark:text-amber-400 italic">
                Trang chưa được trỏ từ vị trí giao diện nào.
              </div>
            )}
          </div>

          {/* Display & Position Flags */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
              Vị trí hiển thị trên giao diện
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Hiển thị Trang chủ</span>
                <button
                  type="button"
                  onClick={() => setShowInHomepage(!showInHomepage)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    showInHomepage ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
                      showInHomepage ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Hiển thị Header Menu</span>
                <button
                  type="button"
                  onClick={() => setShowInHeader(!showInHeader)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    showInHeader ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
                      showInHeader ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Hiển thị Footer Links</span>
                <button
                  type="button"
                  onClick={() => setShowInFooter(!showInFooter)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    showInFooter ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
                      showInFooter ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers & Modals */}
      <UsedByDrawer
        isOpen={isUsedByDrawerOpen}
        page={pageToEdit}
        onClose={() => setIsUsedByDrawerOpen(false)}
      />

      <VersionHistoryDrawer
        isOpen={isVersionDrawerOpen}
        page={pageToEdit}
        onClose={() => setIsVersionDrawerOpen(false)}
      />

      <ActivityLogDrawer
        isOpen={isActivityDrawerOpen}
        page={pageToEdit}
        onClose={() => setIsActivityDrawerOpen(false)}
      />

      <PagePreviewModal
        isOpen={isPreviewModalOpen}
        page={
          pageToEdit || {
            id: 'temp',
            title,
            alias,
            category_id: categoryId,
            summary,
            content,
            image,
            banner_image: bannerImage,
            tags,
            show_in_homepage: showInHomepage,
            published,
            ordering,
            seo_title: seoTitle,
            seo_keyword: seoKeyword,
            seo_description: seoDescription,
            created_time: new Date().toISOString(),
            working_version_number: 1,
            workflow_status: 'draft',
          }
        }
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </div>
  );
};
