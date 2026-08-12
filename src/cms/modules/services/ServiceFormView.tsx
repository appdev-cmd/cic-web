import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  Globe,
  Eye,
  FileText,
  Layers,
  Image as ImageIcon,
  Search,
  Clock,
  History,
  GitCommit,
  Link2,
  Inbox,
  AlertTriangle,
  Sparkles,
  MoreHorizontal,
  BadgeCheck,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ServiceItem,
  ServiceGroup,
  EditorialStatus,
  ServiceActivityLog,
  ServiceVersion,
  ServiceUsedByReference,
  ServiceRelatedContact,
} from './types';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { UsedByDrawer } from './UsedByDrawer';
import { RelatedContactsDrawer } from './RelatedContactsDrawer';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, pageBuilderImages, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';

interface ServiceFormViewProps {
  service: ServiceItem;
  groups: ServiceGroup[];
  owners: { id: string; name: string; email: string }[];
  activityLogs: ServiceActivityLog[];
  versions: ServiceVersion[];
  usedByReferences: ServiceUsedByReference[];
  relatedContacts: ServiceRelatedContact[];
  onBack: () => void;
  onSave: (updated: ServiceItem) => void;
  onOpenPreview: (item: ServiceItem) => void;
}

export const ServiceFormView: React.FC<ServiceFormViewProps> = ({
  service,
  groups,
  owners,
  activityLogs,
  versions,
  usedByReferences,
  relatedContacts,
  onBack,
  onSave,
  onOpenPreview,
}) => {
  const [formData, setFormData] = useState<ServiceItem>({ ...service });
  const [activeTab, setActiveTab] = useState<'form' | 'used_by' | 'contacts' | 'versions' | 'logs'>('form');
  const [lastAutosaved, setLastAutosaved] = useState<string>('vừa xong');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Drawers
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);
  const [isVersionsDrawerOpen, setIsVersionsDrawerOpen] = useState(false);
  const [isUsedByDrawerOpen, setIsUsedByDrawerOpen] = useState(false);
  const [isContactsDrawerOpen, setIsContactsDrawerOpen] = useState(false);

  useEffect(() => {
    setFormData({ ...service });
    setIsDirty(false);
  }, [service]);

  const handleChange = (field: keyof ServiceItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleTogglePlacement = (placeKey: string) => {
    const current = [...(formData.placement || [])];
    const index = current.indexOf(placeKey);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(placeKey);
    }
    handleChange('placement', current);
  };

  const handleSaveDraft = () => {
    const updated: ServiceItem = {
      ...formData,
      editorial_status: formData.editorial_status === 'published' ? 'published' : 'draft',
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    onSave(updated);
    setIsDirty(false);
    setLastAutosaved(new Date().toLocaleTimeString('vi-VN'));
    showToast('Đã lưu bản nháp dịch vụ thành công!');
  };

  const handleSubmitReview = () => {
    const updated: ServiceItem = {
      ...formData,
      editorial_status: 'pending',
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    onSave(updated);
    setIsDirty(false);
    showToast('Đã gửi dịch vụ vào hàng chờ phê duyệt (Pending Review)!');
  };

  const handleApprove = () => {
    const updated: ServiceItem = {
      ...formData,
      editorial_status: 'approved',
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    onSave(updated);
    setIsDirty(false);
    showToast('Đã phê duyệt nội dung dịch vụ!');
  };

  const handlePublishAndActivate = () => {
    const updated: ServiceItem = {
      ...formData,
      editorial_status: 'published',
      service_status: 'active',
      publish_at: formData.publish_at || new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    onSave(updated);
    setIsDirty(false);
    showToast('Đã xuất bản (Publish) và kích hoạt (Activate) dịch vụ trên Website!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Actions */}
      <div className="cms-sticky-action bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">{formData.code}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.editorial_status === 'published'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : formData.editorial_status === 'pending'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Editorial: {formData.editorial_status}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.service_status === 'active'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                Service: {formData.service_status}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-lg mt-0.5">
              {formData.title || 'Dịch vụ chưa đặt tên'}
            </h2>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 mr-2 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Tự động lưu nháp: {lastAutosaved}
          </span>

          <button
            onClick={() => onOpenPreview(formData)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Xem trước Live
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" /> Lưu nháp
          </button>

          {formData.editorial_status === 'draft' && (
            <button
              onClick={handleSubmitReview}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" /> Gửi Review
            </button>
          )}

          {formData.editorial_status === 'pending' && (
            <button
              onClick={handleApprove}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <BadgeCheck className="w-3.5 h-3.5" /> Phê duyệt
            </button>
          )}

          <button
            onClick={handlePublishAndActivate}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Xuất bản & Active
          </button>
        </div>
      </div>

      {/* Audit Stats Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setIsUsedByDrawerOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Nơi sử dụng (Used-By)</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {formData.used_by_count} vị trí
            </div>
          </div>
          <Link2 className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setIsContactsDrawerOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Yêu cầu báo giá liên quan</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {formData.open_contacts_count} yêu cầu
            </div>
          </div>
          <Inbox className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setIsVersionsDrawerOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Phiên bản Working Draft</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              v{formData.version_count}.0 {formData.working_version_exists ? '(Có bản thảo)' : ''}
            </div>
          </div>
          <GitCommit className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setIsLogsDrawerOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Chất lượng nội dung (Audit)</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formData.quality_score}/100 Điểm
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main two-column layout, aligned with the Product form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main form content */}
        <div className="lg:col-span-8 space-y-5">
          {/* SECTION 1: THÔNG TIN CHUNG */}
          <div
            id="section_general"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Thông tin chung dịch vụ
              </h3>
            </div>

            <div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên dịch vụ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Tư vấn Lộ trình Chuyển đổi số BIM ISO 19650"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đường dẫn (Alias)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tóm tắt ngắn dịch vụ (Summary)
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                placeholder="Mô tả tóm tắt 2-3 câu về giá trị nổi bật dịch vụ mang lại..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* SECTION 2: PHÂN LOẠI */}
          <div
            id="section_classification"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Layers className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Phân loại dịch vụ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Danh mục dịch vụ
                </label>
                <select
                  value={formData.group_id}
                  onChange={(e) => {
                    const sel = groups.find((g) => g.id === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      group_id: e.target.value,
                      group_name: sel ? sel.name : prev.group_name,
                    }));
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thẻ nội dung (Tags)
                </label>
                <input
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="Ví dụ: BIM, tư vấn, chuyển đổi số"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: NỘI DUNG MÔ TẢ */}
          <div
            id="section_content"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Nội dung mô tả chi tiết
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mô tả chi tiết nội dung dịch vụ (RichText HTML Editor)
              </label>
              <RichTextEditor value={formData.description} onChange={(value) => handleChange('description', value)} />
            </div>

          </div>

          {/* SECTION 4: MEDIA */}
          <div
            id="section_media"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ảnh đại diện
              </h3>
            </div>

            <div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ảnh chính</label>
                <button type="button" onClick={() => setIsMediaPickerOpen(true)} className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800">
                  {formData.thumbnail_url ? (
                    <><img src={formData.thumbnail_url} alt="Ảnh đại diện dịch vụ" className="aspect-[16/7] w-full object-cover" /><span className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Chọn ảnh khác từ Thư viện Media</span></>
                  ) : (
                    <span className="flex min-h-32 flex-col items-center justify-center gap-2 p-4 text-xs font-semibold text-slate-500"><ImageIcon className="h-7 w-7" />Chọn ảnh từ Thư viện Media</span>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* SECTION 5: SEO */}
          <div
            id="section_seo"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cấu hình SEO
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meta Title (Tiêu đề tìm kiếm)
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meta Description (Mô tả tìm kiếm)
              </label>
              <textarea
                rows={2}
                value={formData.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => handleChange('meta_keywords', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

            </div>
          </div>


        {/* Publishing sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* XUẤT BẢN & HIỂN THỊ */}
          <div
            id="section_publishing"
            className="cms-sticky-aside bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Globe className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Xuất bản & Hiển thị
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng thái Biên tập (Editorial Status)
                </label>
                <select
                  value={formData.editorial_status}
                  onChange={(e) => handleChange('editorial_status', e.target.value as EditorialStatus)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-bold"
                >
                  <option value="draft">Draft (Nháp)</option>
                  <option value="pending">Pending Review (Chờ duyệt)</option>
                  <option value="approved">Approved (Đã duyệt)</option>
                  <option value="published">Published (Đã xuất bản)</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thứ tự ưu tiên hiển thị (Display Order)
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hiển thị tại trang chủ
              </label>
              <div className="space-y-2">
                {[{ key: 'home_featured', label: 'Hiển thị dịch vụ trên trang chủ' }].map((p) => (
                  <label
                    key={p.key}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.placement || []).includes(p.key)}
                      onChange={() => handleTogglePlacement(p.key)}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <ActivityLogDrawer
        isOpen={isLogsDrawerOpen}
        onClose={() => setIsLogsDrawerOpen(false)}
        serviceTitle={formData.title}
        logs={activityLogs}
      />

      <VersionHistoryDrawer
        isOpen={isVersionsDrawerOpen}
        onClose={() => setIsVersionsDrawerOpen(false)}
        serviceTitle={formData.title}
        versions={versions}
        onRestoreVersion={(ver) => {
          setFormData((prev) => ({
            ...prev,
            title: ver.title,
            updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          }));
          setIsVersionsDrawerOpen(false);
          showToast(`Đã khôi phục thành công bản thảo v${ver.version_number}.0!`);
        }}
      />

      <UsedByDrawer
        isOpen={isUsedByDrawerOpen}
        onClose={() => setIsUsedByDrawerOpen(false)}
        serviceTitle={formData.title}
        references={usedByReferences}
      />

      <RelatedContactsDrawer
        isOpen={isContactsDrawerOpen}
        onClose={() => setIsContactsDrawerOpen(false)}
        serviceTitle={formData.title}
        contacts={relatedContacts}
      />
      {isMediaPickerOpen && (
        <PageMediaPickerModal
          currentId={pageBuilderImages.find((asset) => asset.url === formData.thumbnail_url || asset.thumbnail_url === formData.thumbnail_url)?.id || ''}
          onClose={() => setIsMediaPickerOpen(false)}
          onConfirm={(mediaId) => {
            const asset = findPageBuilderImage(mediaId);
            if (asset) handleChange('thumbnail_url', asset.url);
          }}
        />
      )}
    </div>
  );
};
