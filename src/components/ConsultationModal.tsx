/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, Mail, User, MessageSquare, CheckCircle2, HelpCircle } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Phần mềm kỹ thuật',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const servicesList = [
    'Phần mềm kỹ thuật',
    'Thiết bị & IOT',
    'Tư vấn BIM/Digital Twins',
    'Chuyển đổi số & Net Zero'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên của bạn';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^[0-9+.\s]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Địa chỉ email không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Phần mềm kỹ thuật',
        message: ''
      });
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 overflow-hidden z-10 rounded-[10px]"
          >
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 to-amber-500" />
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black tracking-widest text-orange-600 uppercase">CIC - KẾT NỐI CHUYÊN GIA</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                  ĐĂNG KÝ TƯ VẤN GIẢI PHÁP
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-[8px] focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vui lòng cung cấp đầy đủ thông tin bên dưới. Đội ngũ kỹ sư và chuyên gia tư vấn giàu kinh nghiệm của CIC sẽ chủ động liên hệ hỗ trợ bạn trong vòng 15 phút làm việc.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className={`w-full bg-slate-50 border ${
                            errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                          } pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white rounded-[8px] transition-all font-medium`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-500 font-bold">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0912xxxxxx"
                          className={`w-full bg-slate-50 border ${
                            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                          } pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white rounded-[8px] transition-all font-medium`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 font-bold">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Địa chỉ email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@congty.com.vn"
                        className={`w-full bg-slate-50 border ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white rounded-[8px] transition-all font-medium`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 font-bold">{errors.email}</p>
                    )}
                  </div>

                  {/* Service Of Interest */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Dịch vụ quan tâm <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white rounded-[8px] font-bold cursor-pointer"
                    >
                      {servicesList.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message / Nội dung */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Nội dung
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-slate-400" size={16} />
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Mô tả cụ thể nhu cầu của bạn..."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white rounded-[8px] transition-all font-medium resize-none"
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-black text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-wider rounded-[8px]"
                    >
                      Đóng lại
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50 rounded-[8px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang gửi yêu cầu...
                        </>
                      ) : (
                        <>
                          Gửi yêu cầu tư vấn
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-none mb-2 border border-green-200">
                    <CheckCircle2 size={36} className="stroke-[1.5]" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    GỬI YÊU CẦU THÀNH CÔNG!
                  </h4>
                  <div className="max-w-md mx-auto text-sm text-slate-500 space-y-2 leading-relaxed">
                    <p>
                      Xin chân thành cảm ơn quý khách hàng đã tin tưởng lựa chọn Công ty Cổ phần Công nghệ và Tư vấn CIC.
                    </p>
                    <p className="font-bold text-orange-600">
                      Chuyên gia của chúng tôi sẽ liên hệ trực tiếp với bạn qua số điện thoại đã cung cấp trong vòng tối đa 15 phút.
                    </p>
                    <p className="text-xs text-slate-400">
                      Hotline hỗ trợ khẩn cấp 24/7: <a href="tel:02439761381" className="font-black hover:underline text-slate-600">024 3976 1381</a>
                    </p>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        onClose();
                      }}
                      className="px-8 py-3 bg-slate-950 text-white text-xs font-black uppercase tracking-wider transition-all hover:bg-orange-600"
                    >
                      Xác nhận & Quay lại
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
