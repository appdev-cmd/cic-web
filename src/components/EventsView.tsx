import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Download, 
  User, 
  ChevronLeft, 
  CheckCircle, 
  Phone, 
  Building, 
  Briefcase, 
  Mail, 
  Users,
  Filter, 
  Check, 
  Send, 
  ArrowLeft,
  Video,
  Sparkles,
  Bell,
  PlayCircle,
  Eye,
  FileText,
  Map as MapIcon,
  Timer,
  Share2,
  ExternalLink,
  Tag
} from 'lucide-react';
import { eventsData } from '../data/eventsData';
import { EventItem, EventRegistration } from '../types';

interface EventsViewProps {
  key?: string | number;
  initialEventId?: string | null;
  initialIsRegistering?: boolean;
  onNavigateHome?: () => void;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProduct?: (productId: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ 
  initialEventId,
  initialIsRegistering,
}) => {
  // Navigation & details state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Filters & Searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, sortBy]);

  // Registration form state
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);

  // Footer Email Notification State
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberTopic, setSubscriberTopic] = useState('BIM & Hạ tầng số');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // Handle initial event selection / registration view routing
  useEffect(() => {
    if (initialEventId) {
      const found = eventsData.find(e => e.id === initialEventId);
      if (found) {
        if (initialIsRegistering) {
          setRegisterEvent(found);
          setSelectedEvent(found);
        } else {
          setSelectedEvent(found);
        }
      }
    }
  }, [initialEventId, initialIsRegistering]);

  // Form submission state
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    attendeesCount: 1,
    note: '',
    consent: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<EventRegistration | null>(null);

  // Countdown timer for hero & detail view
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Identify Hero Event (featured or first upcoming)
  const heroEvent = eventsData.find(e => e.isFeatured && e.status === 'upcoming') || 
                    eventsData.find(e => e.status === 'upcoming') || 
                    eventsData[0];

  // Calculate days remaining helper
  const getDaysRemaining = (isoDateStr: string) => {
    const diffMs = new Date(isoDateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Update countdown timer for active event
  useEffect(() => {
    const targetEvent = selectedEvent || heroEvent;
    if (!targetEvent) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetEvent.startDate) - +new Date();
      let left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        left = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(left);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [selectedEvent, heroEvent]);

  // Handle filtering & sorting
  const filteredEvents = eventsData
    .filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.eventType && event.eventType.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Separate events by status for sectioned layout
  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const ongoingEvents = filteredEvents.filter(e => e.status === 'ongoing');
  const pastEvents = filteredEvents.filter(e => e.status === 'past');

  // Format date helper for Agenda Column
  const formatAgendaDate = (isoStr: string, dateStr: string) => {
    try {
      const d = new Date(isoStr);
      const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = monthNames[d.getMonth()] || 'T' + (d.getMonth() + 1);
      const time = isoStr.includes('T') ? isoStr.split('T')[1].slice(0, 5) : '08:30';
      return { day, month, time };
    } catch {
      const parts = dateStr.split('/');
      return { day: parts[0] || '15', month: 'THÁNG ' + (parts[1] || '8'), time: '08:30' };
    }
  };

  // Validate registration form
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

  // Handle Register Form Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !registerEvent) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const mockResult: EventRegistration = {
        eventId: registerEvent.id,
        eventTitle: registerEvent.title,
        fullName: formData.fullName,
        company: formData.company,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        attendeesCount: formData.attendeesCount,
        note: formData.note,
        consent: formData.consent,
        registeredAt: new Date().toISOString()
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
        consent: false
      });
    }, 1200);
  };

  // Handle footer newsletter subscription
  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail || !subscriberEmail.includes('@')) return;
    setSubscriptionSuccess(true);
    setTimeout(() => {
      setSubscriptionSuccess(false);
      setSubscriberEmail('');
    }, 4000);
  };

  // Helper status label & badge style
  const getStatusLabel = (status: 'upcoming' | 'ongoing' | 'past') => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'past': return 'Đã kết thúc';
    }
  };

  const getStatusBadgeStyle = (status: 'upcoming' | 'ongoing' | 'past') => {
    switch (status) {
      case 'upcoming': return 'bg-orange-600 text-white';
      case 'ongoing': return 'bg-slate-900 text-white';
      case 'past': return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getStatusColor = getStatusBadgeStyle;

  return (
    <div className="pt-24 pb-20 relative min-h-screen bg-[#F5F6F8] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <AnimatePresence mode="wait">
          
          {/* =========================================================
              VIEW 3: EVENT REGISTRATION FORM PAGE
             ========================================================= */}
          {registerEvent ? (
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
                  onClick={() => {
                    setRegisterEvent(null);
                    setRegistrationResult(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-orange-600 transition-colors w-fit"
                >
                  <ArrowLeft size={16} /> Quay lại {selectedEvent ? 'chi tiết sự kiện' : 'danh sách sự kiện'}
                </button>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block">Đăng ký tham dự</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Sự kiện đã chọn:</span>
                    <h2 className="font-black text-slate-950 text-base leading-snug">{registerEvent.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-orange-600" /> {registerEvent.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-orange-600" /> {registerEvent.location.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider shrink-0 ${getStatusBadgeStyle(registerEvent.status)}`}>
                  {getStatusLabel(registerEvent.status)}
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
                          placeholder="Ví dụ: Nguyễn Văn A"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                            formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.fullName && <p className="text-[10px] font-bold text-red-500">{formErrors.fullName}</p>}
                      </div>

                      {/* Phone input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Phone size={14} className="text-orange-600" /> Số điện thoại <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Ví dụ: 0912345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                            formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.phone && <p className="text-[10px] font-bold text-red-500">{formErrors.phone}</p>}
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Mail size={14} className="text-orange-600" /> Địa chỉ Email <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Ví dụ: email@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                            formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.email && <p className="text-[10px] font-bold text-red-500">{formErrors.email}</p>}
                      </div>

                      {/* Company input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Building size={14} className="text-orange-600" /> Đơn vị công tác <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Tổng công ty Tư vấn Thiết kế Giao thông"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                            formErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.company && <p className="text-[10px] font-bold text-red-500">{formErrors.company}</p>}
                      </div>

                      {/* Position input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-orange-600" /> Chức vụ <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Kỹ sư trưởng, BIM Manager"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 rounded-[8px] ${
                            formErrors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.position && <p className="text-[10px] font-bold text-red-500">{formErrors.position}</p>}
                      </div>

                      {/* Number of attendees */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Users size={14} className="text-orange-600" /> Số người tham dự <span className="text-orange-600">*</span>
                        </label>
                        <select
                          value={formData.attendeesCount}
                          onChange={(e) => setFormData({ ...formData, attendeesCount: Number(e.target.value) })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 rounded-[8px]"
                        >
                          {[1, 2, 3, 4, 5, 10].map((num) => (
                            <option key={num} value={num}>{num} người</option>
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
                        placeholder="Nhập câu hỏi hoặc yêu cầu đặc biệt của bạn..."
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
                          Tôi đồng ý cung cấp thông tin phục vụ công tác tổ chức sự kiện và nhận các thông tin giải pháp công nghệ mới nhất từ CIC Tech qua Email/SMS. <span className="text-orange-600">*</span>
                        </span>
                      </label>
                      {formErrors.consent && <p className="text-[10px] font-bold text-red-500 pl-7">{formErrors.consent}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterEvent(null);
                          setRegistrationResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
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
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                  
                  /* SUCCESS TICKET CONFIRMATION */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 text-center py-4 max-w-2xl mx-auto"
                  >
                    <div className="w-16 h-16 bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto">
                      <CheckCircle className="text-orange-600" size={36} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold uppercase text-slate-950">Đăng ký tham dự thành công!</h3>
                      <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                        Cảm ơn quý khách <strong className="text-slate-900">{registrationResult.fullName}</strong>. Mã xác nhận vé điện tử của bạn đã được khởi tạo thành công trên hệ thống CIC Tech.
                      </p>
                    </div>

                    <div className="bg-orange-50/50 border border-orange-200 p-4 text-left space-y-2">
                      <div className="flex items-center gap-2 text-orange-900 font-bold text-xs uppercase">
                        <Check size={16} className="bg-orange-600 text-white rounded-full p-0.5" />
                        <span>Email xác nhận đã được gửi thành công</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Ban tổ chức đã gửi vé điện tử cùng link tham dự/QR code check-in tới email: <strong className="text-slate-900">{registrationResult.email}</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 text-left space-y-4 font-sans">
                      <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Thông tin vé điện tử</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-slate-500">Mã vé:</span>
                        <strong className="text-slate-900 text-right font-semibold">CIC-EVT-{Math.floor(10000 + Math.random() * 90000)}</strong>
                        
                        <span className="text-slate-500">Họ tên:</span>
                        <span className="text-slate-800 text-right font-bold">{registrationResult.fullName}</span>
                        
                        <span className="text-slate-500">Đơn vị:</span>
                        <span className="text-slate-800 text-right font-medium truncate">{registrationResult.company}</span>

                        <span className="text-slate-500">Số lượng:</span>
                        <span className="text-slate-800 text-right font-bold">{registrationResult.attendeesCount} vé</span>

                        <span className="text-slate-500">Thời gian:</span>
                        <span className="text-slate-800 text-right font-medium">{registerEvent.date}</span>
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
                        <div className="w-28 h-28 bg-white border border-slate-200 p-2 flex items-center justify-center">
                          <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100">
                            <path d="M5 5h30v30H5zm5 5h20v20H10zm65-5h30v30H65zm5 5h20v20H70zm-65 65h30v30H5zm5 5h20v20H10zm40-35h10v10H50zm15 15h10v10H65zm15-15h10v10H80zm-15 15h15v10H65zm15 15h10v15H80zm-15-40h10v10H65zm-30 0h10v10H35zm0 15h10v10H35zm15 0h10v10H50z" fill="currentColor" />
                          </svg>
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Check-in QR Code</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={() => {
                          setRegisterEvent(null);
                          setRegistrationResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-slate-950 hover:bg-orange-600 text-white px-8 py-3 text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Quay lại trang sự kiện
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : selectedEvent ? (
            
            /* =========================================================
               VIEW 2: EVENT DETAILS PAGE
               ========================================================= */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft size={16} /> Quay lại danh sách sự kiện
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* MAIN CONTENT COLUMN */}
                <div className="lg:col-span-8 space-y-10">
                  
                  {/* HERO BANNER & MAIN METADATA */}
                  <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img 
                        src={selectedEvent.img} 
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md ${getStatusColor(selectedEvent.status)}`}>
                          {getStatusLabel(selectedEvent.status)}
                        </span>
                        {selectedEvent.isOpenRegistration && (
                          <span className="bg-orange-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
                            Mở Đăng Ký
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight uppercase tracking-tight">
                        {selectedEvent.title}
                      </h1>

                      {/* Meta quick badges */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-100 py-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Calendar className="text-orange-600" size={18} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Thời gian</span>
                            <span className="font-bold text-slate-800 text-sm leading-snug block">{selectedEvent.date}</span>
                            <span className="text-xs text-slate-500 font-medium">Bắt đầu: {selectedEvent.startDate.split('T')[1].slice(0, 5)}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <MapPin className="text-orange-600" size={18} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Địa điểm tổ chức</span>
                            <span className="font-bold text-slate-800 text-sm leading-snug block">{selectedEvent.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Countdown widget if upcoming */}
                      {(selectedEvent.status === 'upcoming' || selectedEvent.status === 'ongoing') && (
                        <div className="bg-slate-950 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[10px]">
                          <div className="flex items-center gap-3">
                            <Timer className="text-orange-500 shrink-0" size={32} />
                            <div>
                              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Đếm ngược sự kiện</span>
                              <span className="text-sm font-bold text-slate-200">Sắp sửa diễn ra chương trình</span>
                            </div>
                          </div>

                          {/* Flip clock numbers */}
                          <div className="flex gap-2 text-center">
                            {[
                              { value: timeLeft.days, label: 'NGÀY' },
                              { value: timeLeft.hours, label: 'GIỜ' },
                              { value: timeLeft.minutes, label: 'PHÚT' },
                              { value: timeLeft.seconds, label: 'GIÂY' }
                            ].map((unit, i) => (
                              <div key={i} className="bg-slate-900 border border-white/10 p-2.5 min-w-[65px] rounded-[8px]">
                                <span className="block text-2xl font-extrabold text-orange-500 leading-none">
                                  {String(unit.value).padStart(2, '0')}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 block">
                                  {unit.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LONG FORM DESCRIPTION */}
                  <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 rounded-[10px]">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-orange-600 rounded-[2px]"></span> Giới thiệu chương trình
                    </h2>
                    <div className="text-slate-600 text-sm leading-relaxed font-medium space-y-4 whitespace-pre-line">
                      {selectedEvent.longDesc}
                    </div>
                  </div>

                  {/* AUDIENCE / TARGET GROUP */}
                  {selectedEvent.targetAudience && selectedEvent.targetAudience.length > 0 && (
                    <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 rounded-[10px]">
                      <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-[2px]"></span> Đối tượng tham dự phù hợp
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {selectedEvent.targetAudience.map((aud, i) => (
                          <div key={i} className="flex gap-3 items-start bg-slate-50 border border-slate-100 p-4 rounded-[8px]">
                            <CheckCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                            <span className="text-xs font-bold text-slate-700 leading-relaxed">{aud}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AGENDA TIMELINE */}
                  {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
                    <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 rounded-[10px]">
                      <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-[2px]"></span> Agenda chi tiết chương trình
                      </h2>
                      
                      <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-8 py-2">
                        {selectedEvent.agenda.map((item, i) => (
                          <div key={i} className="relative group">
                            
                            {/* Timeline point */}
                            <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-white border-2 border-orange-600 rounded-full group-hover:bg-orange-600 transition-all"></div>
                            
                            <div className="space-y-1">
                              <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <span className="px-2.5 py-1 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider shrink-0 w-fit rounded-[6px]">
                                  {item.time}
                                </span>
                                {item.speaker && (
                                  <span className="text-xs font-bold text-orange-600">
                                    • Diễn giả: {item.speaker}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-slate-950">{item.title}</h4>
                              {item.description && (
                                <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-2xl">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SPEAKERS / PRESENTERS */}
                  {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                    <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 rounded-[10px]">
                      <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-[2px]"></span> Ban diễn giả & Chuyên gia
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedEvent.speakers.map((speaker, i) => (
                          <div key={i} className="border border-slate-200 bg-slate-50 p-6 flex flex-col md:flex-row gap-4 items-start rounded-[10px]">
                            <img 
                              src={speaker.avatar} 
                              alt={speaker.name}
                              className="w-16 h-16 object-cover border border-slate-300 shrink-0 rounded-[10px]"
                            />
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm font-bold text-slate-950">{speaker.name}</h4>
                                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">{speaker.role}</p>
                                <p className="text-xs font-bold text-slate-400">{speaker.company}</p>
                              </div>
                              {speaker.bio && (
                                <p className="text-slate-500 text-xs font-medium leading-relaxed border-t border-slate-200 pt-2 mt-1">
                                  {speaker.bio}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LOCATION VISUAL MAP & GOOGLE MAPS SIMULATION */}
                  {selectedEvent.address && (
                    <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 rounded-[10px]">
                      <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-[2px]"></span> Bản đồ địa điểm sự kiện
                      </h2>
                      
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 leading-relaxed font-bold flex items-start gap-1.5 bg-slate-50 p-3.5 border-l-2 border-orange-600 rounded-[8px]">
                          <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                          <span>{selectedEvent.address}</span>
                        </p>

                        {/* Map graphic mock */}
                        <div className="h-64 bg-slate-900 relative border border-slate-200 overflow-hidden flex items-center justify-center rounded-[10px]">
                          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          
                          <div className="text-center z-10 px-6 space-y-3">
                            <MapIcon className="text-orange-500 mx-auto animate-bounce" size={40} />
                            <div>
                              <span className="block text-sm font-bold text-white">{selectedEvent.location.split(',')[0]}</span>
                              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Mô phỏng bản đồ tương tác GIS</span>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.address)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all rounded-[8px]"
                            >
                              Mở Google Maps <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* FLOATING ACTION SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* QUICK CTA BOX */}
                  <div className="bg-white border border-slate-950 p-6 shadow-sm space-y-6 sticky top-24 rounded-[10px]">
                    <div className="text-center pb-4 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Đăng ký tham dự</span>
                      <h3 className="text-base font-bold text-slate-950 uppercase">Giữ chỗ sự kiện</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 border border-slate-200 rounded-[8px]">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Trạng thái</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 ${selectedEvent.isOpenRegistration ? 'bg-emerald-500' : 'bg-slate-400 animate-none'} rounded-full animate-pulse`}></span>
                          <span className="text-xs font-bold uppercase text-slate-700">
                            {selectedEvent.isOpenRegistration ? 'Đang mở đăng ký trực tuyến' : 'Đã dừng đăng ký trực tuyến'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-bold text-slate-600">
                        <div className="flex justify-between">
                          <span>Chi phí:</span>
                          <span className="text-orange-600 font-extrabold">MIỄN PHÍ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hình thức:</span>
                          <span className="text-slate-800">Trực tiếp / Hybrid</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chứng nhận hoàn thành:</span>
                          <span className="text-slate-800">Cấp bản cứng & PDF</span>
                        </div>
                      </div>

                      {selectedEvent.isOpenRegistration ? (
                        <button
                          onClick={() => {
                            setRegisterEvent(selectedEvent);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-sm rounded-[8px]"
                        >
                          Đăng ký ngay tại đây <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-slate-200 text-slate-400 py-3.5 text-xs font-bold uppercase tracking-wider text-center cursor-not-allowed rounded-[8px]"
                        >
                          Đã đóng đăng ký
                        </button>
                      )}
                    </div>

                    {/* DOCUMENT DOWNLOADS */}
                    {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                      <div className="pt-6 border-t border-slate-100 space-y-3.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Tài liệu đính kèm</span>
                        <div className="space-y-2">
                          {selectedEvent.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Đã bắt đầu tải file: ${doc.name}`);
                              }}
                              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 hover:border-orange-600 text-xs font-bold text-slate-700 hover:text-orange-600 transition-all rounded-[8px]"
                            >
                              <span className="truncate max-w-[200px]">{doc.name}</span>
                              <span className="text-[9px] text-slate-400 shrink-0 flex items-center gap-1">
                                {doc.size} <Download size={12} />
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NAVIGATE BUTTON */}
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-center border border-slate-200 hover:border-slate-950 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-950 py-2.5 transition-all rounded-[8px]"
                    >
                      Quay về danh sách
                    </button>
                  </div>

                </div>

                {/* RELATED EVENTS CONTAINER */}
                <div className="lg:col-span-12 mt-8 pt-8 border-t border-slate-200 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Sự kiện liên quan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {eventsData
                      .filter(e => e.id !== selectedEvent.id)
                      .slice(0, 4)
                      .map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            setSelectedEvent(item);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white hover:bg-white rounded-xl border border-slate-200/80 p-2.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group space-y-2.5"
                        >
                          <div className="aspect-[16/9] bg-slate-100 overflow-hidden rounded-lg">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                          </div>
                          <div className="px-1.5 space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-[#6B7280] font-semibold">
                              <span className="text-orange-600 font-bold">{item.date}</span>
                              <span className="truncate max-w-[110px] text-slate-400">{item.location.split(',')[0]}</span>
                            </div>
                            <h4 className="text-xs font-bold text-[#222222] group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                              {item.shortDesc}
                            </p>
                            <div className="pt-1 flex items-center text-[10px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                              <span>Xem chi tiết</span>
                              <span className="ml-1">→</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (

            /* =========================================================
               VIEW 1: MAIN EVENTS OVERVIEW & LIST (4 TẦNG DESIGN)
               ========================================================= */
            <motion.div
              key="overview-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              
              {/* PAGE TITLE BANNER */}
              <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block">Sự kiện & Hội thảo CIC</span>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 mt-1">
                    Cổng Sự Kiện Công Nghệ
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium">
                    Tham dự các buổi Webinar, Workshop chuyên sâu và Lễ ra mắt công nghệ BIM, AI, CAD và Hạ tầng số do CIC cùng các đối tác quốc tế tổ chức.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <div className="bg-white border border-slate-200 px-4 py-2 text-center shadow-sm">
                    <span className="text-xl font-black text-slate-950 block">{eventsData.filter(e => e.status === 'upcoming').length}</span>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Sắp diễn ra</span>
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-2 text-center shadow-sm">
                    <span className="text-xl font-black text-orange-600 block">{eventsData.filter(e => e.isOpenRegistration).length}</span>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Mở Đăng ký</span>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  TẦNG 1: HERO EVENT (SỰ KIỆN GẦN NHẤT / NỔI BẬT)
                 ========================================================= */}
              {heroEvent && statusFilter === 'all' && !searchTerm && (
                <section className="bg-white rounded-[12px] border border-slate-200/90 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group p-2.5 sm:p-3">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                    
                    {/* Left: Image Hero Banner */}
                    <div className="lg:col-span-7 relative bg-slate-950 min-h-[280px] sm:min-h-[360px] overflow-hidden rounded-[10px]">
                      <img 
                        src={heroEvent.img} 
                        alt={heroEvent.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                      
                      {/* Badge Overlay */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="bg-[#FC5115] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 rounded-[8px]">
                          <Sparkles size={12} /> Sự kiện sắp tới nổi bật
                        </span>
                        {heroEvent.eventType && (
                          <span className="bg-slate-900/90 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-slate-700 shadow-md rounded-[8px]">
                            {heroEvent.eventType}
                          </span>
                        )}
                      </div>

                      {/* Remaining Days Counter (NO fake FOMO) */}
                      <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md text-white border border-slate-800 px-3.5 py-1.5 text-xs font-bold font-mono shadow-lg flex items-center gap-2 rounded-[8px]">
                        <Clock size={14} className="text-orange-500" />
                        <span>Còn {getDaysRemaining(heroEvent.startDate)} ngày nữa diễn ra</span>
                      </div>
                    </div>

                    {/* Right: Content Details */}
                    <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#6B7280]">
                          <span className="flex items-center gap-1 text-[#FC5115]">
                            <Calendar size={14} /> {heroEvent.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {heroEvent.startDate.split('T')[1].slice(0, 5)} - 11:30
                          </span>
                        </div>

                        <h2 
                          onClick={() => {
                            setSelectedEvent(heroEvent);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-xl sm:text-2xl font-black text-[#222222] leading-tight uppercase group-hover:text-[#FC5115] cursor-pointer transition-colors"
                        >
                          {heroEvent.title}
                        </h2>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white/70 p-2.5 border-l-2 border-[#FC5115] rounded-r-[8px]">
                          <MapPin size={16} className="text-[#FC5115] shrink-0" />
                          <span className="truncate">{heroEvent.location}</span>
                        </div>

                        <p className="text-[#6B7280] text-xs sm:text-sm line-clamp-3 leading-relaxed font-medium">
                          {heroEvent.shortDesc}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="pt-4 border-t border-slate-200/60 flex flex-wrap sm:flex-nowrap gap-3 items-center">
                        {heroEvent.isOpenRegistration && (
                          <button
                            onClick={() => {
                              setRegisterEvent(heroEvent);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto bg-[#FC5115] hover:bg-orange-700 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 rounded-[8px]"
                          >
                            Đăng ký tham dự <ArrowRight size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedEvent(heroEvent);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full sm:w-auto border border-slate-300 hover:border-slate-900 text-slate-800 hover:text-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all text-center rounded-[8px]"
                        >
                          Xem chi tiết
                        </button>
                      </div>

                    </div>

                  </div>
                </section>
              )}

              {/* =========================================================
                  TẦNG 2: TÌM KIẾM + BỘ LỌC TĨNH
                 ========================================================= */}
              <div className="bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-4 rounded-[10px]">
                
                {/* Search Field */}
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sự kiện, địa điểm, chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-[8px]"
                  />
                </div>

                {/* Filter Tabs & Sort Dropdown */}
                <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end w-full lg:w-auto">
                  
                  {/* Status Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-[8px] border border-slate-200 text-xs">
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'upcoming', label: 'Sắp diễn ra' },
                      { key: 'ongoing', label: 'Đang diễn ra' },
                      { key: 'past', label: 'Đã kết thúc' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key as any)}
                        className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-all rounded-[8px] ${
                          statusFilter === tab.key
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-950'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Select */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 rounded-[8px]">
                    <span className="text-slate-400 font-medium hidden sm:inline">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-800"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* =========================================================
                  UNIFIED MIXED EVENTS LIST (3-4 COLS) WITH PAGINATION
                 ========================================================= */}
              {filteredEvents.length > 0 ? (() => {
                const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
                const currentEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                return (
                  <div className="space-y-8">
                    {/* Mixed Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {currentEvents.map((event) => {
                        const dateObj = formatAgendaDate(event.startDate, event.date);
                        return (
                          <motion.div
                            key={event.id}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => {
                              setSelectedEvent(event);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-white rounded-[10px] border border-slate-200/90 p-2.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                          >
                            <div>
                              {/* Thumbnail Image */}
                              <div className="aspect-[16/10] bg-slate-950 rounded-[8px] overflow-hidden relative">
                                <img 
                                  src={event.img} 
                                  alt={event.title} 
                                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${
                                    event.status === 'past' ? 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100' : ''
                                  }`}
                                />
                                
                                {/* Status Indicator Badge in Top-Left */}
                                <div className="absolute top-2.5 left-2.5 z-10">
                                  {event.status === 'upcoming' && (
                                    <span className="bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-700 shadow-sm rounded-[8px]">
                                      SẮP DIỄN RA
                                    </span>
                                  )}
                                  {event.status === 'ongoing' && (
                                    <span className="bg-[#FC5115] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm rounded-[8px]">
                                      ĐANG DIỄN RA
                                    </span>
                                  )}
                                  {event.status === 'past' && (
                                    <span className="bg-slate-700/90 backdrop-blur-sm text-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-600 shadow-sm rounded-[8px]">
                                      ĐÃ KẾT THÚC
                                    </span>
                                  )}
                                </div>

                                {/* Days Remaining Pill for Upcoming */}
                                {event.status === 'upcoming' && (
                                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-orange-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 shadow-sm rounded-[8px]">
                                    Còn {getDaysRemaining(event.startDate)} ngày
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="p-3.5 space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-semibold">
                                  <span className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-[#FC5115] shrink-0" />
                                    {event.date}
                                  </span>
                                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                                    <MapPin size={12} className="text-slate-400 shrink-0" />
                                    {event.location}
                                  </span>
                                </div>

                                <h3 className="text-sm font-bold text-[#222222] group-hover:text-[#FC5115] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
                                  {event.title}
                                </h3>

                                <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed pt-0.5">
                                  {event.shortDesc}
                                </p>

                                <div className="pt-2 flex items-center text-[11px] font-bold text-[#FC5115] group-hover:translate-x-1 transition-transform">
                                  <span>Xem chi tiết</span>
                                  <span className="ml-1">→</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className="px-3.5 py-1.5 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ← Trang trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setCurrentPage(p);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all ${
                              currentPage === p
                                ? 'bg-orange-600 text-white shadow-sm'
                                : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className="px-3.5 py-1.5 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Trang sau →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })() : (
                <div className="bg-white border border-slate-200 py-16 px-6 text-center shadow-sm">
                  <Filter className="text-slate-400 mx-auto mb-3" size={32} />
                  <h3 className="text-base font-black uppercase text-slate-950">Không tìm thấy sự kiện nào</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                    Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục bộ lọc khác.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-4 border border-slate-200 hover:border-orange-600 text-xs font-black uppercase px-6 py-2 transition-all text-slate-700 hover:text-orange-600"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}

              {/* =========================================================
                  TẦNG 4: FOOTER EMAIL NOTIFICATION CALLOUT
                 ========================================================= */}
              <section className="bg-white text-slate-900 p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-950">
                      Bạn chưa thấy sự kiện phù hợp?
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
                      Đăng ký email để nhận thông báo trực tiếp khi CIC tổ chức các hội thảo, khóa đào tạo và ra mắt giải pháp công nghệ mới.
                    </p>
                  </div>

                  {!subscriptionSuccess ? (
                    <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                      <input
                        type="email"
                        required
                        placeholder="Nhập địa chỉ email của bạn..."
                        value={subscriberEmail}
                        onChange={(e) => setSubscriberEmail(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-xs px-4 py-3 placeholder-slate-400 focus:outline-none focus:border-orange-600 focus:bg-white"
                      />

                      <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-sm"
                      >
                        Đăng ký nhận tin
                      </button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-orange-50 border border-orange-200 p-4 text-orange-950 text-xs font-bold text-center max-w-lg mx-auto"
                    >
                      Cảm ơn bạn! Đã ghi nhận email đăng ký nhận thông báo sự kiện CIC.
                    </motion.div>
                  )}
                </div>
              </section>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
