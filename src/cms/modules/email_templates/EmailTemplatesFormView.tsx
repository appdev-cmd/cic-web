import React, { useState } from 'react';
import {
  MailCheck,
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Building2,
  Wrench,
  MapPin,
  Plus,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Package,
} from 'lucide-react';
import { EmailTemplate, EMAIL_TYPES, PRESET_PRODUCTS } from './types';
import { RichTextEditor } from '../static_pages/RichTextEditor';

interface EmailTemplatesFormViewProps {
  templateToEdit: EmailTemplate | null;
  onSave: (formData: Partial<EmailTemplate>) => void;
  onCancel: () => void;
}

export const EmailTemplatesFormView: React.FC<EmailTemplatesFormViewProps> = ({
  templateToEdit,
  onSave,
  onCancel,
}) => {
  // Form State
  const [name, setName] = useState(templateToEdit?.name || '');
  const [types, setTypes] = useState(templateToEdit?.types || 'quote_registration');
  const [products, setProducts] = useState<string[]>(templateToEdit?.products || []);
  const [newProductInput, setNewProductInput] = useState('');
  const [content, setContent] = useState(templateToEdit?.content || '');

  // Department content fields (in collapsible card)
  const [lienheKd, setLienheKd] = useState(templateToEdit?.lienhe_kd || '');
  const [lienheKt, setLienheKt] = useState(templateToEdit?.lienhe_kt || '');
  const [lienheKdmb, setLienheKdmb] = useState(templateToEdit?.lienhe_kdmb || '');
  const [lienheKdmn, setLienheKdmn] = useState(templateToEdit?.lienhe_kdmn || '');

  // Accordion toggle state (collapsible card default closed)
  const [isDepartmentCardOpen, setIsDepartmentCardOpen] = useState(false);

  // Status & Ordering
  const [published, setPublished] = useState(templateToEdit ? templateToEdit.published : true);
  const [ordering, setOrdering] = useState<number>(templateToEdit?.ordering || 1);

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; types?: string; content?: string }>({});

  // Handle Add Product Chip
  const handleAddProductChip = (productName: string) => {
    const trimmed = productName.trim();
    if (trimmed && !products.includes(trimmed)) {
      setProducts([...products, trimmed]);
      setNewProductInput('');
    }
  };

  const handleRemoveProductChip = (productName: string) => {
    setProducts(products.filter((p) => p !== productName));
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; types?: string; content?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập Tên mẫu email!';
    }
    if (!types) {
      newErrors.types = 'Vui lòng chọn Loại email!';
    }
    if (!content.trim()) {
      newErrors.content = 'Vui lòng nhập Nội dung mẫu email!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSave({
      name: name.trim(),
      types,
      products,
      content,
      lienhe_kd: lienheKd.trim(),
      lienhe_kt: lienheKt.trim(),
      lienhe_kdmb: lienheKdmb.trim(),
      lienhe_kdmn: lienheKdmn.trim(),
      published,
      ordering: Number(ordering) || 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
            <MailCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {templateToEdit ? 'Chỉnh sửa mẫu email' : 'Thêm mẫu email mới'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cấu hình nội dung mẫu email gửi tự động cho khách hàng và các phòng ban liên quan.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Hủy thao tác
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{templateToEdit ? 'Lưu cập nhật' : 'Lưu mẫu email'}</span>
          </button>
        </div>
      </div>

      {/* Validation Banner if Error */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Vui lòng kiểm tra các trường bị lỗi phía dưới:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.name && <li>{errors.name}</li>}
              {errors.types && <li>{errors.types}</li>}
              {errors.content && <li>{errors.content}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* 2. MAIN 1-COLUMN FULL-WIDTH FORM CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <MailCheck className="w-4 h-4 text-orange-500" />
          <span>Thông tin mẫu Email</span>
        </h2>

        {/* FIELD 1: name (Tên mẫu email) - Text Input, Mandatory */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Tên mẫu email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Ví dụ: Thông báo xác nhận Yêu cầu tư vấn & Báo giá phần mềm..."
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium rounded-xl border transition-all focus:outline-none focus:border-orange-500 ${
              errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.name && <p className="text-[11px] font-medium text-red-500">{errors.name}</p>}
        </div>

        {/* FIELD 2: types (Loại email) - Dropdown, Mandatory */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Loại email <span className="text-red-500">*</span>
          </label>
          <select
            value={types}
            onChange={(e) => {
              setTypes(e.target.value);
              if (errors.types) setErrors((prev) => ({ ...prev, types: undefined }));
            }}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium rounded-xl border transition-all focus:outline-none focus:border-orange-500 cursor-pointer ${
              errors.types
                ? 'border-red-500 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {EMAIL_TYPES.map((typeOpt) => (
              <option key={typeOpt.value} value={typeOpt.value}>
                {typeOpt.label}
              </option>
            ))}
          </select>
          {errors.types && <p className="text-[11px] font-medium text-red-500">{errors.types}</p>}
        </div>

        {/* FIELD 3: products (Sản phẩm áp dụng) - Multi-select chip input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Sản phẩm áp dụng
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              Chọn từ gợi ý hoặc tự nhập tên sản phẩm
            </span>
          </label>

          {/* Selected Product Chips List */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[50px]">
            {products.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Chưa có sản phẩm nào được chọn (Áp dụng cho tất cả hoặc tùy chọn bên dưới).
              </span>
            ) : (
              products.map((prod) => (
                <span
                  key={prod}
                  className="px-3 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-in fade-in"
                >
                  <span>{prod}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProductChip(prod)}
                    className="p-0.5 hover:bg-orange-500/20 rounded-md transition-colors cursor-pointer"
                    title="Xóa sản phẩm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Custom Input & Preset Quick Selection */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newProductInput}
                onChange={(e) => setNewProductInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddProductChip(newProductInput);
                  }
                }}
                placeholder="Nhập tên sản phẩm áp dụng và bấm Thêm..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => handleAddProductChip(newProductInput)}
                className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">Gợi ý nhanh:</span>
              {PRESET_PRODUCTS.map((preset) => {
                const isSelected = products.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      isSelected ? handleRemoveProductChip(preset) : handleAddProductChip(preset)
                    }
                    className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FIELD 4: content (Nội dung mẫu) - Rich text, Mandatory, min-height 250px */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Nội dung mẫu email <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              Biến động: {'{customer_name}'}, {'{company_name}'}, {'{product_name}'}...
            </span>
          </div>

          <RichTextEditor
            value={content}
            onChange={(val) => {
              setContent(val);
              if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
            }}
            minHeight="250px"
          />

          {errors.content && (
            <p className="text-[11px] font-medium text-red-500">{errors.content}</p>
          )}

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hướng dẫn chèn thẻ biến động (Template Variables):</p>
              <p className="mt-0.5">
                Bạn có thể gõ các thẻ thay thế tự động trong nội dung như: <code>{'{customer_name}'}</code> (Tên khách hàng), <code>{'{company_name}'}</code> (Tên đơn vị), <code>{'{product_name}'}</code> (Tên sản phẩm), <code>{'{customer_email}'}</code> (Email), <code>{'{customer_phone}'}</code> (Số điện thoại).
              </p>
            </div>
          </div>
        </div>

        {/* FIELD 5: COLLAPSIBLE CARD "Nội dung gửi theo phòng ban" (Default Closed) */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-2xs">
          {/* Card Header (Click to toggle accordion) */}
          <button
            type="button"
            onClick={() => setIsDepartmentCardOpen(!isDepartmentCardOpen)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Nội dung gửi theo phòng ban
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cấu hình các mẫu ghi chú / thông báo gửi riêng cho Kinh doanh, Kỹ thuật và Chi nhánh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[11px] font-semibold hidden sm:inline">
                {isDepartmentCardOpen ? 'Thu gọn' : 'Mở rộng (4 nội dung)'}
              </span>
              {isDepartmentCardOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Card Body (Collapsible Content) */}
          {isDepartmentCardOpen && (
            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* lienhe_kd: Nội dung gửi Kinh doanh */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>lienhe_kd (Nội dung gửi Kinh doanh)</span>
                </label>
                <textarea
                  value={lienheKd}
                  onChange={(e) => setLienheKd(e.target.value)}
                  rows={3}
                  placeholder="Nhập nội dung thông báo gửi cho bộ phận Kinh doanh chung..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* lienhe_kt: Nội dung gửi Kỹ thuật */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-purple-500" />
                  <span>lienhe_kt (Nội dung gửi Kỹ thuật)</span>
                </label>
                <textarea
                  value={lienheKt}
                  onChange={(e) => setLienheKt(e.target.value)}
                  rows={3}
                  placeholder="Nhập nội dung thông báo gửi cho bộ phận Hỗ trợ Kỹ thuật..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Grid 2 cols for KD Miền Bắc & KD Miền Nam */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* lienhe_kdmb: Nội dung gửi KD Miền Bắc */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>lienhe_kdmb (Nội dung gửi KD Miền Bắc)</span>
                  </label>
                  <textarea
                    value={lienheKdmb}
                    onChange={(e) => setLienheKdmb(e.target.value)}
                    rows={3}
                    placeholder="Nhập nội dung gửi cho KD khu vực Hà Nội & Miền Bắc..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>

                {/* lienhe_kdmn: Nội dung gửi KD Miền Nam */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>lienhe_kdmn (Nội dung gửi KD Miền Nam)</span>
                  </label>
                  <textarea
                    value={lienheKdmn}
                    onChange={(e) => setLienheKdmn(e.target.value)}
                    rows={3}
                    placeholder="Nhập nội dung gửi cho KD khu vực TP.HCM & Miền Nam..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FIELD 6 & 7: published (Xuất bản) & ordering (Thứ tự) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* published - Toggle Switch */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                Trạng thái Xuất bản (Published)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Bật để mẫu email sẵn sàng sử dụng gửi tự động trên hệ thống
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  published ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* ordering - Number Input */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Thứ tự ưu tiên (Ordering)
            </label>
            <input
              type="number"
              min={1}
              value={ordering}
              onChange={(e) => setOrdering(Number(e.target.value))}
              placeholder="1"
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR */}
      <div className="flex items-center justify-end gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Hủy thao tác
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{templateToEdit ? 'Lưu cập nhật' : 'Lưu mẫu email'}</span>
        </button>
      </div>
    </form>
  );
};
