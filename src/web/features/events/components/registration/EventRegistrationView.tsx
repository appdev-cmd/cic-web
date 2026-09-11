import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, User, Building, Briefcase, Users, Send } from 'lucide-react';
import type { EventItem, EventRegistration } from '@shared/types';
import { getStatusBadgeStyle, getStatusLabel } from '../eventUtils';
import { EventTicketSuccess } from './EventTicketSuccess';

interface EventRegistrationViewProps {
  event: EventItem;
  fromDetail?: boolean;
  onCancel: () => void;
}

export const EventRegistrationView: React.FC<EventRegistrationViewProps> = ({
  event,
  fromDetail = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    attendeesCount: 1,
    note: '',
    consent: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<EventRegistration | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.company.trim()) errors.company = 'Vui lòng nhập tên đơn vị/công ty';
    if (!formData.position.trim()) errors.position = 'Vui lòng nhập chức vụ của bạn';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (10 số)';
    }

    if (formData.attendeesCount < 1) errors.attendeesCount = 'Số lượng tối thiểu là 1';
    if (!formData.consent) errors.consent = 'Bạn cần đồng ý với chính sách của chúng tôi';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const mockResult: EventRegistration = {
        eventId: event.id,
        eventTitle: event.title,
        fullName: formData.fullName,
        company: formData.company,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        attendeesCount: formData.attendeesCount,
        note: formData.note,
        consent: formData.consent,
        registeredAt: new Date().toISOString(),
      };

      setRegistrationResult(mockResult);
      setIsSubmitting(false);
      setFormData({
        fullName: '',
        company: '',
        position: '',
        email: '',
        phone: '',
        attendeesCount: 1,
        note: '',
        consent: false,
      });
    }, 1200);
  };

  return (
    <motion.div
      key="registration-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Navigation Header / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-orange-600 transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Quay lại {fromDetail ? 'chi tiết sự kiện' : 'danh sách sự kiện'}
        </button>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block">
            Đăng ký tham dự
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950">
            Form Đăng Ký Giữ Chỗ
          </h1>
        </div>
      </div>

      {/* Event summary banner inside form page */}
      <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <Calendar className="text-orange-600" size={28} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Sự kiện đã chọn:
            </span>
            <h2 className="font-black text-slate-950 text-base leading-snug">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-orange-600" /> {event.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-orange-600" /> {event.location.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-black uppercase tracking-wider shrink-0 ${getStatusBadgeStyle(
            event.status
          )}`}
        >
          {getStatusLabel(event.status)}
        </span>
      </div>

      {/* Form Body or Confirmation State */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm rounded-[10px]">
        {!registrationResult ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <User size={16} className="text-orange-600" /> Thông tin cá nhân & Đơn vị công tác
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Vui lòng điền thông tin chính xác để Ban tổ chức cấp mã vé tham dự và gửi tài liệu sự kiện.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User size={14} className="text-orange-600" /> Họ và tên <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                    formErrors.fullName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[10px] font-bold text-red-500">{formErrors.fullName}</p>
                )}
              </div>

              {/* Phone input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Phone size={14} className="text-orange-600" /> Số điện thoại <span className="text-orange-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                    formErrors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[10px] font-bold text-red-500">{formErrors.phone}</p>
                )}
              </div>

              {/* Email input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Mail size={14} className="text-orange-600" /> Địa chỉ Email <span className="text-orange-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Nhập email liên hệ"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                    formErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[10px] font-bold text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Company input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building size={14} className="text-orange-600" /> Tên cơ quan / Doanh nghiệp <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên doanh nghiệp của bạn"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                    formErrors.company
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                  }`}
                />
                {formErrors.company && (
                  <p className="text-[10px] font-bold text-red-500">{formErrors.company}</p>
                )}
              </div>

              {/* Position input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-orange-600" /> Vị trí công tác / Chức vụ <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kỹ sư kết cấu, Giám đốc..."
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                    formErrors.position
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                  }`}
                />
                {formErrors.position && (
                  <p className="text-[10px] font-bold text-red-500">{formErrors.position}</p>
                )}
              </div>

              {/* Number of attendees */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users size={14} className="text-orange-600" /> Số lượng người tham dự
                </label>
                <select
                  value={formData.attendeesCount}
                  onChange={(e) =>
                    setFormData({ ...formData, attendeesCount: parseInt(e.target.value) || 1 })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 rounded-[8px]"
                >
                  {[1, 2, 3, 4, 5, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} người
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note text field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Ghi chú / Câu hỏi gửi tới Ban tổ chức
              </label>
              <textarea
                placeholder="Mô tả nhu cầu của bạn..."
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 rounded-[8px]"
              />
            </div>

            {/* Consent checkbox */}
            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 rounded-[4px]"
                />
                <span className="text-xs font-medium text-slate-600 leading-normal">
                  Tôi đồng ý cung cấp thông tin phục vụ công tác tổ chức sự kiện và nhận các thông tin giải pháp công nghệ mới nhất từ CIC Tech qua Email/SMS.{' '}
                  <span className="text-orange-600">*</span>
                </span>
              </label>
              {formErrors.consent && (
                <p className="text-[10px] font-bold text-red-500 pl-7">{formErrors.consent}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-900 text-slate-700 text-xs font-black uppercase tracking-widest transition-all text-center rounded-[8px]"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg rounded-[8px]"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý đăng ký...
                  </>
                ) : (
                  <>
                    Xác nhận đăng ký giữ chỗ <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <EventTicketSuccess
            event={event}
            registrationResult={registrationResult}
            onBack={onCancel}
          />
        )}
      </div>
    </motion.div>
  );
};
