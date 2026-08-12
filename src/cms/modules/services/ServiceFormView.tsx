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
  PhoneCall,
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
  ServiceStatus,
  ServiceActivityLog,
  ServiceVersion,
  ServiceUsedByReference,
  ServiceRelatedContact,
} from './types';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';
import { UsedByDrawer } from './UsedByDrawer';
import { RelatedContactsDrawer } from './RelatedContactsDrawer';

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

      {/* Main Layout Grid */}
      <div>
        {/* Form Body */}
        <div className="space-y-6">
          {/* SECTION 1: THÔNG TIN CHUNG */}
          <div
            id="section_general"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Thông tin chung dịch vụ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mã dịch vụ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  placeholder="e.g. DV-BIM-01"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đường dẫn tĩnh (Slug)
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                2. Phân loại & Phạm vi áp dụng
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhóm dịch vụ chính
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
                  Phạm vi áp dụng (Scope)
                </label>
                <input
                  type="text"
                  value={formData.scope}
                  onChange={(e) => handleChange('scope', e.target.value)}
                  placeholder="e.g. Toàn quốc, Miền Bắc, Tập đoàn FDI"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quan hệ nghiệp vụ
                </label>
                <input
                  type="text"
                  value={formData.business_relation}
                  onChange={(e) => handleChange('business_relation', e.target.value)}
                  placeholder="e.g. Dịch vụ độc lập, Đi kèm phần mềm"
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
                3. Nội dung mô tả chi tiết
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mô tả chi tiết nội dung dịch vụ (RichText HTML Editor)
              </label>
              <textarea
                rows={8}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lợi ích & Quy trình thực hiện
                </label>
                <textarea
                  rows={4}
                  value={formData.benefits_process}
                  onChange={(e) => handleChange('benefits_process', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung bổ trợ / Điều khoản / FAQ
                </label>
                <textarea
                  rows={4}
                  value={formData.supplementary_content}
                  onChange={(e) => handleChange('supplementary_content', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
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
                4. Hình ảnh & Video truyền thông
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ảnh đại diện (Thumbnail URL)
                </label>
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
                {formData.thumbnail_url && (
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    className="mt-2 h-24 w-auto rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ảnh bìa lớn (Banner Header URL)
                </label>
                <input
                  type="text"
                  value={formData.banner_url}
                  onChange={(e) => handleChange('banner_url', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
                {formData.banner_url && (
                  <img
                    src={formData.banner_url}
                    alt="Banner preview"
                    className="mt-2 h-24 w-auto rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video giới thiệu (YouTube / Vimeo URL)
                </label>
                <input
                  type="text"
                  value={formData.video_url || ''}
                  onChange={(e) => handleChange('video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả thay thế Alt Text (Accessibility Metadata)
                </label>
                <input
                  type="text"
                  value={formData.media_alt}
                  onChange={(e) => handleChange('media_alt', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: LIÊN HỆ & CHUYỂN ĐỔI */}
          <div
            id="section_conversion"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <PhoneCall className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                5. Nút Kêu gọi Hành động (CTA) & Phụ trách
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhãn nút Call To Action (CTA Label)
                </label>
                <input
                  type="text"
                  value={formData.cta_label}
                  onChange={(e) => handleChange('cta_label', e.target.value)}
                  placeholder="e.g. Đăng ký Tư vấn 1:1"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Liên kết khi nhấn nút CTA (CTA Link)
                </label>
                <input
                  type="text"
                  value={formData.cta_link}
                  onChange={(e) => handleChange('cta_link', e.target.value)}
                  placeholder="e.g. /lien-he?service=DV-BIM-01"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Người phụ trách chuyên môn (Owner)
                </label>
                <select
                  value={formData.owner_id}
                  onChange={(e) => {
                    const sel = owners.find((o) => o.id === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      owner_id: e.target.value,
                      owner_name: sel ? sel.name : prev.owner_name,
                      owner_email: sel ? sel.email : prev.owner_email,
                    }));
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                >
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quy trình điều hướng yêu cầu khách hàng
                </label>
                <input
                  type="text"
                  value={formData.request_routing}
                  onChange={(e) => handleChange('request_routing', e.target.value)}
                  placeholder="e.g. Bộ phận Tư vấn BIM (bim_consulting@cic.com.vn)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: SEO & CHIA SẺ */}
          <div
            id="section_seo"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                6. Cấu hình SEO & Chia sẻ Meta
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Open Graph Share Image URL
                </label>
                <input
                  type="text"
                  value={formData.og_image}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: XUẤT BẢN & HIỂN THỊ */}
          <div
            id="section_publishing"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Globe className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                7. Trạng thái Xuất bản & Vị trí Hiển thị
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng thái Cung cấp (Service Status)
                </label>
                <select
                  value={formData.service_status}
                  onChange={(e) => handleChange('service_status', e.target.value as ServiceStatus)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-bold"
                >
                  <option value="active">Active (Đang hoạt động)</option>
                  <option value="inactive">Inactive (Tạm ngừng)</option>
                  <option value="archived">Archived (Lưu trữ)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thời gian đặt lịch xuất bản (Publish At)
                </label>
                <input
                  type="text"
                  value={formData.publish_at || ''}
                  onChange={(e) => handleChange('publish_at', e.target.value)}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Vị trí hiển thị nổi bật (Placement Section)
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'home_featured', label: 'Khối Dịch vụ Nổi bật Trang chủ' },
                  { key: 'services_page', label: 'Trang Catalog Dịch vụ Chính' },
                  { key: 'footer_links', label: 'Liên kết Footer Chân trang' },
                ].map((p) => (
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
    </div>
  );
};
