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
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import {
  ServiceItem,
  EditorialStatus,
  ServiceActivityLog,
  ServiceVersion,
  ServiceUsedByReference,
  ServiceRelatedContact,
} from './types';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, pageBuilderImages, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';

interface ServiceFormViewProps {
  service: ServiceItem;
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
  onBack,
  onSave,
  onOpenPreview,
}) => {
  const [formData, setFormData] = useState<ServiceItem>({ ...service });
  const [lastAutosaved, setLastAutosaved] = useState<string>('vừa xong');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    setFormData({ ...service });
    setIsDirty(false);
  }, [service]);

  const handleChange = (field: keyof ServiceItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
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

  const completenessChecks = [
    { label: 'Tên dịch vụ', complete: Boolean(formData.title.trim()), weight: 15 },
    { label: 'Đường dẫn (Alias)', complete: Boolean(formData.slug.trim()), weight: 10 },
    { label: 'Tóm tắt', complete: Boolean(formData.summary.trim()), weight: 15 },
    { label: 'Thẻ nội dung', complete: Boolean(formData.tags?.trim()), weight: 5 },
    { label: 'Nội dung chi tiết', complete: formData.description.trim().length > 50, weight: 20 },
    { label: 'Ảnh đại diện', complete: Boolean(formData.thumbnail_url), weight: 15 },
    { label: 'SEO title và description', complete: Boolean(formData.meta_title.trim() && formData.meta_description.trim()), weight: 10 },
  ];
  const completenessScore = completenessChecks.reduce((score, item) => score + (item.complete ? item.weight : 0), 0);
  const missingFields = completenessChecks.filter((item) => !item.complete).map((item) => item.label);

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
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="font-mono text-xs font-bold text-slate-500">{formData.code}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.editorial_status === 'published'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
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
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <span className="hidden text-[11px] text-slate-400 mr-2 items-center gap-1">
            <Clock className="w-3 h-3" /> Tự động lưu nháp: {lastAutosaved}
          </span>

          <button
            onClick={() => onOpenPreview(formData)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Eye className="w-3.5 h-3.5" /> Xem trước
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-white transition-colors sm:flex-none dark:bg-slate-700"
          >
            <Save className="w-3.5 h-3.5" /> Lưu nháp
          </button>

          <button
            onClick={handlePublishAndActivate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700 sm:flex-none"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Xuất bản
          </button>
        </div>
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
                placeholder="vi-du: tu-van-chuyen-doi-so-bim"
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

          {/* SECTION 2: THẺ NỘI DUNG */}
          <div
            id="section_classification"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Layers className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Thẻ nội dung</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
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
                placeholder="Ví dụ: Tư vấn chuyển đổi số BIM | CIC"
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
                placeholder="Mô tả ngắn nội dung dịch vụ hiển thị trên kết quả tìm kiếm..."
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
                  placeholder="Ví dụ: BIM, tư vấn, chuyển đổi số"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

            </div>
          </div>


        {/* Publishing sidebar */}
        <div className="cms-sticky-aside lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Chất lượng dữ liệu</h3>
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">{completenessScore}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${completenessScore >= 80 ? 'bg-emerald-500' : completenessScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${completenessScore}%` }}
              />
            </div>
            {missingFields.length > 0 ? (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl space-y-1.5 text-xs text-red-800 dark:text-red-300">
                <p className="font-bold text-[11px] flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-600" />Cần bổ sung ({missingFields.length} mục):</p>
                <ul className="text-[10px] list-disc pl-4 space-y-0.5">{missingFields.map((field) => <li key={field}>{field}</li>)}</ul>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />Dữ liệu đạt chuẩn chất lượng 100%!
              </div>
            )}
          </div>

          {/* XUẤT BẢN & HIỂN THỊ */}
          <div
            id="section_publishing"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4"
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

          </div>
        </div>
      </div>

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
