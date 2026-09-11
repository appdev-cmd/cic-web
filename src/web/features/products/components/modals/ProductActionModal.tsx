'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Download } from 'lucide-react';
import { Product } from '@shared/types';
import { submitCustomerInteractionAction } from '@/features/contact/server/actions';

export type ProductModalType = 'contact' | 'buy' | 'download';

interface ProductActionModalProps {
  modalType: ProductModalType | null;
  activeProduct: Product | null;
  onClose: () => void;
  onTabChange: (type: ProductModalType) => void;
}

const getProductType = (product: Product): string => {
  return product.productType ?? '';
};

export function ProductActionModal({
  modalType,
  activeProduct,
  onClose,
  onTabChange,
}: ProductActionModalProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [downloadFormSubmitted, setDownloadFormSubmitted] = useState(false);
  const [downloadProgress] = useState(0);
  const [downloading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    version: 'v2026-pro',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!modalType || !activeProduct) return null;

  const resetStateForTab = (type: ProductModalType) => {
    setFormSubmitted(false);
    setSubmitError('');
    setDownloadFormSubmitted(false);
    setFormErrors({});
    setFormData({
      name: '',
      phone: '',
      email: '',
      version: 'v2026-pro',
      notes: '',
    });
    onTabChange(type);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Địa chỉ email không hợp lệ';
    }

    if (modalType === 'download' && !formData.version) {
      errors.version = 'Vui lòng chọn phiên bản';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDownloadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitError('');
    try {
      await submitCustomerInteractionAction({
        formId: 'product-download',
        formName: 'Yêu cầu tải sản phẩm',
        values: {
          ...formData,
          productId: activeProduct.id,
          productName: activeProduct.name,
          requestType: 'download',
          message: formData.notes,
        },
        source: {
          pageType: 'product',
          pageId: String(activeProduct.id),
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: activeProduct.name,
          placementKey: 'product-download-modal',
        },
      });
      setDownloadFormSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể gửi yêu cầu tải. Vui lòng thử lại.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitError('');
    try {
      await submitCustomerInteractionAction({
        formId: `product-${modalType}`,
        formName:
          modalType === 'contact'
            ? 'Yêu cầu báo giá sản phẩm'
            : modalType === 'buy'
            ? 'Đăng ký mua sản phẩm'
            : 'Yêu cầu tải sản phẩm',
        values: {
          ...formData,
          productId: activeProduct.id,
          productName: activeProduct.name,
          requestType: modalType,
          message: formData.notes,
        },
        source: {
          pageType: 'product',
          pageId: String(activeProduct.id),
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: activeProduct.name,
          placementKey: `product-${modalType}-modal`,
        },
      });
      setFormSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[-1]"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.25)] rounded-2xl w-full max-w-xl p-6 md:p-8 relative z-10 text-slate-900 overflow-y-auto max-h-[92vh] sm:max-h-[94vh] custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-30"
            title="Đóng"
          >
            <X size={20} />
          </button>

          {/* Modal Tabs */}
          <div className="flex border-b border-slate-200 mb-6 mt-2">
            <button
              type="button"
              onClick={() => resetStateForTab('contact')}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                modalType === 'contact'
                  ? 'border-orange-600 text-orange-600 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Yêu cầu tư vấn
            </button>
            <button
              type="button"
              onClick={() => resetStateForTab('buy')}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                modalType === 'buy'
                  ? 'border-orange-600 text-orange-600 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {getProductType(activeProduct) === 'Thiết bị' ? 'Đăng ký mua' : 'Mua bản quyền'}
            </button>
            {getProductType(activeProduct) !== 'Thiết bị' && (
              <button
                type="button"
                onClick={() => resetStateForTab('download')}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  modalType === 'download'
                    ? 'border-orange-600 text-orange-600 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Tải phần mềm
              </button>
            )}
          </div>

          {/* Selected Product Banner */}
          <div className="p-3.5 bg-slate-50 border-l-4 border-orange-600 mb-6 rounded-r-[8px] flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                Sản phẩm đang chọn
              </span>
              <span className="text-sm font-black text-slate-800">{activeProduct.name}</span>
            </div>
          </div>

          {/* Download Modal Body */}
          {modalType === 'download' && (
            <div>
              {!downloadFormSubmitted ? (
                <form className="space-y-4" onSubmit={handleDownloadFormSubmit}>
                  {/* Row 1: Họ tên */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập họ và tên"
                      className={`w-full bg-slate-50 border ${
                        formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                    />
                    {formErrors.name && <p className="text-xs text-red-500 font-bold">{formErrors.name}</p>}
                  </div>

                  {/* Row 2: Số điện thoại */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className={`w-full bg-slate-50 border ${
                        formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                    />
                    {formErrors.phone && <p className="text-xs text-red-500 font-bold">{formErrors.phone}</p>}
                  </div>

                  {/* Row 3: Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Nhập email liên hệ"
                      className={`w-full bg-slate-50 border ${
                        formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                    />
                    {formErrors.email && <p className="text-xs text-red-500 font-bold">{formErrors.email}</p>}
                  </div>

                  {/* Row 4: Chọn phiên bản * */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Chọn phiên bản <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className={`w-full bg-slate-50 border ${
                        formErrors.version ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 rounded-[8px] transition-all cursor-pointer`}
                    >
                      <option value="">-- Chọn phiên bản tải về --</option>
                      <option value="v2026-pro">{activeProduct.name} v2026.1 (Professional Edition)</option>
                      <option value="v2026-std">{activeProduct.name} v2026.1 (Standard Edition)</option>
                      <option value="v2025-ent">{activeProduct.name} v2025.2 (Enterprise Edition)</option>
                      <option value="v2024-lts">{activeProduct.name} v2024.4 (LTS Stable Edition)</option>
                    </select>
                    {formErrors.version && <p className="text-xs text-red-500 font-bold">{formErrors.version}</p>}
                  </div>

                  {/* Row 5: Ghi chú */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Ghi chú</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mô tả nhu cầu của bạn..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all resize-none"
                    />
                  </div>

                  {/* Note block */}
                  <p className="text-[11px] text-orange-600 font-bold italic pt-0.5">
                    *Vui lòng điền đúng thông tin để chúng tôi liên hệ hỗ trợ bạn
                  </p>

                  {submitError && <p role="alert" className="text-xs font-bold text-red-600">{submitError}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 rounded-[8px]"
                  >
                    Bắt đầu tải phần mềm
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-orange-600/10 text-orange-600 flex items-center justify-center mx-auto mb-4 rounded-full">
                    <Download size={32} className={downloading ? 'animate-bounce' : ''} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight mb-2">
                    Tải phần mềm {activeProduct.name}
                  </h3>

                  {downloading ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 font-medium">
                        Đang chuẩn bị bộ cài dùng thử, brochure hướng dẫn và tài liệu đi kèm...
                      </p>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                        <div
                          style={{ width: `${downloadProgress}%` }}
                          className="h-full bg-orange-600 transition-all duration-150 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-sans font-black text-slate-700">{downloadProgress}%</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-emerald-700">
                        Đã ghi nhận yêu cầu tải. CIC sẽ kiểm tra và gửi bộ cài phù hợp tới bạn.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors rounded-[8px]"
                      >
                        Đóng cửa sổ
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Contact & Buy Modals Body */}
          {(modalType === 'contact' || modalType === 'buy') && (
            <div>
              {formSubmitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto rounded-full">
                    <Check size={24} />
                  </div>
                  <h4 className="text-lg font-black uppercase text-slate-950 tracking-tight">Gửi thông tin thành công!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-bold">
                    Cảm ơn bạn đã quan tâm. Đại diện kinh doanh và bộ phận kỹ thuật của chúng tôi sẽ liên hệ lại với bạn
                    trong vòng 1 giờ làm việc.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors rounded-[8px]"
                  >
                    Đóng
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  {/* Row 1: Họ tên */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập họ và tên"
                      className={`w-full bg-slate-50 border ${
                        formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                    />
                    {formErrors.name && <p className="text-xs text-red-500 font-bold">{formErrors.name}</p>}
                  </div>

                  {/* Row 2: Số điện thoại */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className={`w-full bg-slate-50 border ${
                        formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                    />
                    {formErrors.phone && <p className="text-xs text-red-500 font-bold">{formErrors.phone}</p>}
                  </div>

                  {/* Row 3: Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Nhập email liên hệ"
                      className={`w-full bg-slate-50 border ${
                        formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                      } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                    />
                    {formErrors.email && <p className="text-xs text-red-500 font-bold">{formErrors.email}</p>}
                  </div>

                  {/* Row 4: Ghi chú */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Ghi chú</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mô tả nhu cầu của bạn..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all resize-none"
                    />
                  </div>

                  {/* Note block */}
                  <p className="text-[11px] text-orange-600 font-bold italic pt-0.5">
                    *Vui lòng điền đúng thông tin để chúng tôi liên hệ hỗ trợ bạn
                  </p>

                  {submitError && <p role="alert" className="text-xs font-bold text-red-600">{submitError}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 rounded-[8px]"
                  >
                    {modalType === 'contact' ? 'Gửi yêu cầu báo giá' : 'Đăng ký ngay'}
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
