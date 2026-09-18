/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, Mail, User, MessageSquare, CheckCircle2, HelpCircle } from 'lucide-react';
import { submitCustomerInteraction } from '../services/customerInteractionSubmission';
import { SYSTEM_CTA_IDS, SYSTEM_FORM_IDS } from '../../shared/customerInteractionContract';
import { useI18n } from '@/shared/i18n';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotline?: string;
}

export const ConsultationModal = ({ isOpen, onClose, hotline = '024 3976 1381' }: ConsultationModalProps) => {
  const { t, locale } = useI18n();

  const consultationNeedsList = locale === 'en' ? [
    'Product & Solution Pricing Consultation',
    'Download Software & Request Trial',
    'Purchase Software License / Equipment',
    'Digital Transformation & BIM Consultation',
    'Training & Technical Support',
    'Other Inquiry',
  ] : [
    'Tư vấn báo giá sản phẩm & giải pháp',
    'Tải phần mềm & dùng thử',
    'Đăng ký mua bản quyền / thiết bị',
    'Tư vấn chuyển đổi số & BIM',
    'Đào tạo & Hỗ trợ kỹ thuật',
    'Nhu cầu khác',
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    consultationNeed: consultationNeedsList[0],
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = locale === 'en' ? 'Please enter your full name' : 'Vui lòng nhập họ và tên của bạn';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = locale === 'en' ? 'Please enter your phone number' : 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^[0-9+.\s]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = locale === 'en' ? 'Invalid phone number' : 'Số điện thoại không hợp lệ';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = locale === 'en' ? 'Invalid email address' : 'Địa chỉ email không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await submitCustomerInteraction({
        formId: SYSTEM_FORM_IDS.homeConsultation,
        formName: locale === 'en' ? 'Consultation Request' : 'Đăng ký tư vấn',
        values: formData,
        source: {
          pageType: 'global',
          pageId: 'consultation-modal',
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
          pageTitle: typeof document !== 'undefined' ? document.title : 'CIC',
          placementKey: 'global.consultation_modal',
          ctaId: SYSTEM_CTA_IDS.contact,
          ctaName: locale === 'en' ? 'Contact Now' : 'Liên hệ ngay'
        },
      });
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        consultationNeed: consultationNeedsList[0],
        message: ''
      });
    } catch (err) {
      setSubmitError(t.contact.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
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
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 my-8 rounded-[12px]"
          >
            {/* Top decorative line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title={t.common.close}
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {t.contact.successMessage}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        onClose();
                      }}
                      className="px-6 py-2.5 bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-orange-700 transition-all shadow-md cursor-pointer"
                    >
                      {t.common.close}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-wider rounded-[6px]">
                      <HelpCircle size={14} />
                      {t.header.consultationCta}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {t.contact.modalConsultationTitle}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {t.contact.modalConsultationSubtitle}
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          {t.contact.nameLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t.contact.namePlaceholder}
                            className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500'
                            }`}
                          />
                        </div>
                        {errors.name && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          {t.contact.phoneLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone size={16} />
                          </div>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder={t.contact.phonePlaceholder}
                            className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500'
                            }`}
                          />
                        </div>
                        {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t.contact.emailLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t.contact.emailPlaceholder}
                          className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                            errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>}
                    </div>

                    {/* Needs */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t.contact.serviceInterestLabel}
                      </label>
                      <select
                        value={formData.consultationNeed}
                        onChange={(e) => setFormData({ ...formData, consultationNeed: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                      >
                        {consultationNeedsList.map((need, idx) => (
                          <option key={idx} value={need}>{need}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t.contact.messageLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                          <MessageSquare size={16} />
                        </div>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t.contact.messagePlaceholder}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Phone size={14} className="text-orange-600" />
                        <span>Hotline: <strong className="text-slate-800">{hotline}</strong></span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>{t.contact.submittingButton}</span>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>{t.contact.submitButton}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
