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
  Map as MapIcon, 
  ChevronLeft, 
  CheckCircle, 
  FileText, 
  Phone, 
  Building, 
  Briefcase, 
  Mail, 
  Users,
  Timer,
  Info,
  ExternalLink,
  ChevronDown,
  Filter,
  Check,
  Send,
  ArrowLeft
} from 'lucide-react';
import { eventsData } from '../data/eventsData';
import { EventItem, EventRegistration } from '../types';

interface EventsViewProps {
  key?: string | number;
  onNavigateHome?: () => void;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProduct?: (productId: string) => void;
}

export const EventsView = ({ 
  onNavigateHome, 
  onNavigateToService, 
  onNavigateToProduct 
}: EventsViewProps) => {
  // Navigation & details state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Filters & Searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Keep at 2 so pagination is testable with 3 mock events

  // Registration page state
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  
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

  // Countdown timer for detail view
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // UTM Parameters detection (Simulated or actual URL queries)
  const [utmParams, setUtmParams] = useState({
    source: 'direct',
    medium: 'organic',
    campaign: 'events_page_2026'
  });

  useEffect(() => {
    // Attempt to parse actual UTM params if available, otherwise simulate
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || 'cic_website';
    const medium = params.get('utm_medium') || 'navigation_menu';
    const campaign = params.get('utm_campaign') || 'cic_events_portal';
    setUtmParams({ source, medium, campaign });
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!selectedEvent) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(selectedEvent.startDate) - +new Date();
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
  }, [selectedEvent]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // Handle filtering & sorting
  const filteredEvents = eventsData
    .filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Paginated item list
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Validate form
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

    // Simulate sending network request and saving registration
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
        utmSource: utmParams.source,
        utmMedium: utmParams.medium,
        utmCampaign: utmParams.campaign,
        registeredAt: new Date().toISOString()
      };

      setRegistrationResult(mockResult);
      setIsSubmitting(false);
      // Reset form
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
    }, 1500);
  };

  // Status translate utilities
  const getStatusLabel = (status: 'upcoming' | 'ongoing' | 'past') => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'past': return 'Đã diễn ra';
    }
  };

  const getStatusColor = (status: 'upcoming' | 'ongoing' | 'past') => {
    switch (status) {
      case 'upcoming': return 'bg-sky-500 text-white';
      case 'ongoing': return 'bg-emerald-500 text-white animate-pulse';
      case 'past': return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="pt-24 pb-20 relative min-h-screen bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-6">

        <AnimatePresence mode="wait">
          {registerEvent ? (
            
            // --- VIEW 3: EVENT REGISTRATION PAGE ---
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

                <div className="text-right sm:text-right text-left">
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-sans block">Sự kiện đã chọn:</span>
                    <h2 className="font-black text-slate-950 text-base leading-snug">{registerEvent.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium font-sans">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-orange-600" /> {registerEvent.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-orange-600" /> {registerEvent.location.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider shrink-0 ${getStatusColor(registerEvent.status)}`}>
                  {getStatusLabel(registerEvent.status)}
                </span>
              </div>

              {/* Main Form Body or Success State */}
              <div className="bg-white border border-slate-200 p-8 shadow-sm">
                {!registrationResult ? (
                  
                  // --- THE REGISTER FORM INPUTS ---
                  <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <User size={16} className="text-orange-600" /> Thông tin cá nhân & Đơn vị công tác
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Vui lòng điền đầy đủ các thông tin có dấu <span className="text-orange-600">*</span> để Ban tổ chức cấp vé điện tử.</p>
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
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.fullName && <p className="text-[10px] font-bold text-red-500 font-sans">{formErrors.fullName}</p>}
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
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.phone && <p className="text-[10px] font-bold text-red-500 font-sans">{formErrors.phone}</p>}
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
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.email && <p className="text-[10px] font-bold text-red-500 font-sans">{formErrors.email}</p>}
                      </div>

                      {/* Company input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Building size={14} className="text-orange-600" /> Đơn vị công tác <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Công ty TNHH Xây Dựng ABC"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            formErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.company && <p className="text-[10px] font-bold text-red-500 font-sans">{formErrors.company}</p>}
                      </div>

                      {/* Position input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-orange-600" /> Chức vụ <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Kỹ sư kết cấu, Trưởng phòng Kỹ thuật"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className={`w-full p-3 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            formErrors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {formErrors.position && <p className="text-[10px] font-bold text-red-500 font-sans">{formErrors.position}</p>}
                      </div>

                      {/* Number of attendees */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Users size={14} className="text-orange-600" /> Số người tham dự <span className="text-orange-600">*</span>
                        </label>
                        <select
                          value={formData.attendeesCount}
                          onChange={(e) => setFormData({ ...formData, attendeesCount: Number(e.target.value) })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
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
                        Ghi chú thêm (Câu hỏi cho diễn giả, yêu cầu đặc biệt)
                      </label>
                      <textarea
                        placeholder="Nhập ghi chú hoặc câu hỏi của bạn tại đây..."
                        rows={4}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
                      />
                    </div>

                    {/* Consent checkbox */}
                    <div className="space-y-2 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-0.5 border-slate-300 text-orange-600 focus:ring-orange-500 focus:ring-0 w-4 h-4"
                        />
                        <span className="text-xs font-medium text-slate-600 leading-normal">
                          Tôi đồng ý cung cấp thông tin phục vụ công tác tổ chức sự kiện và nhận các tài liệu công nghệ, giải pháp hữu ích từ CIC Tech qua các kênh Email/SMS. <span className="text-orange-600">*</span>
                        </span>
                      </label>
                      {formErrors.consent && <p className="text-[10px] font-bold text-red-500 font-sans pl-7">{formErrors.consent}</p>}
                    </div>

                    {/* CTA Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterEvent(null);
                          setRegistrationResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 hover:border-slate-900 text-slate-700 text-xs font-black uppercase tracking-widest transition-all text-center"
                      >
                        Hủy đăng ký
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-slate-950 hover:bg-orange-600 text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý hồ sơ...
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
                  
                  // --- VIEW 3 SUCCESS SCREEN WITH MOCK EMAIL SENT ---
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 text-center py-6 max-w-2xl mx-auto"
                  >
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-none mx-auto">
                      <CheckCircle className="text-emerald-500" size={40} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase text-slate-950">Đăng ký tham dự thành công!</h3>
                      <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                        Cảm ơn quý khách <strong className="text-slate-900">{registrationResult.fullName}</strong>. Mã vé điện tử của bạn đã được khởi tạo thành công trên hệ thống CIC Tech.
                      </p>
                    </div>

                    {/* MOCK SMTP EMAIL NOTIFICATION BOX */}
                    <div className="bg-emerald-50 border border-emerald-200/60 p-5 text-left space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs font-sans uppercase">
                        <Check size={16} className="bg-emerald-600 text-white rounded-full p-0.5" />
                        <span>Mô phỏng Email xác nhận đã gửi</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        Hệ thống tự động đã gửi email hướng dẫn tham dự cùng mã QR check-in tới địa chỉ: <strong className="text-slate-900">{registrationResult.email}</strong>. Vui lòng kiểm tra hòm thư chính hoặc mục quảng cáo/spam của bạn.
                      </p>
                    </div>

                    {/* REGISTRATION ID / QR DETAILS */}
                    <div className="bg-slate-50 border border-slate-200 p-6 text-left font-sans space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thông tin vé điện tử</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-slate-400">Mã đăng ký:</span>
                        <strong className="text-slate-900 text-right font-mono">CIC-{registrationResult.eventId.toUpperCase().slice(0, 5)}-{Math.floor(1000 + Math.random() * 9000)}</strong>
                        
                        <span className="text-slate-400">Họ tên:</span>
                        <span className="text-slate-800 text-right font-bold">{registrationResult.fullName}</span>
                        
                        <span className="text-slate-400">Đơn vị:</span>
                        <span className="text-slate-800 text-right truncate font-medium">{registrationResult.company}</span>

                        <span className="text-slate-400">Số lượng:</span>
                        <span className="text-slate-800 text-right font-bold">{registrationResult.attendeesCount} người</span>

                        <span className="text-slate-400">Thời gian:</span>
                        <span className="text-slate-800 text-right font-medium">{registerEvent.date}</span>
                      </div>

                      {/* Simulated QR Code using plain vectors */}
                      <div className="pt-4 border-t border-slate-200 flex justify-center flex-col items-center gap-2">
                        <div className="w-32 h-32 bg-white border border-slate-200 p-2 flex flex-wrap items-center justify-center">
                          <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100">
                            <path d="M5 5h30v30H5zm5 5h20v20H10zm65-5h30v30H65zm5 5h20v20H70zm-65 65h30v30H5zm5 5h20v20H10zm40-35h10v10H50zm15 15h10v10H65zm15-15h10v10H80zm-15 15h15v10H65zm15 15h10v15H80zm-15-40h10v10H65zm-30 0h10v10H35zm0 15h10v10H35zm15 0h10v10H50z" fill="currentColor" />
                          </svg>
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Check-in QR Code</span>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setRegisterEvent(null);
                          setRegistrationResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-slate-950 hover:bg-orange-600 text-white px-8 py-3 text-xs font-black uppercase tracking-widest transition-all"
                      >
                        {selectedEvent ? 'Quay lại chi tiết sự kiện' : 'Quay về danh sách sự kiện'}
                      </button>
                    </div>

                  </motion.div>
                )}

              </div>
            </motion.div>
          ) : !selectedEvent ? (
            
            // --- VIEW 1: EVENT LIST ---
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* HEADER AREA */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-6">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950">
                    Cổng Sự kiện CIC
                  </h1>
                  <p className="text-slate-500 mt-2 max-w-xl font-medium">
                    Nơi kết nối các chuyên gia kỹ thuật hàng đầu, chia sẻ xu hướng công nghệ BIM, hạ tầng số và giải pháp thiết kế tiên phong.
                  </p>
                </div>

                {/* Counter Stats */}
                <div className="flex gap-4 self-start md:self-end">
                  <div className="bg-white border border-slate-200 px-4 py-3 min-w-[100px] text-center shadow-sm">
                    <span className="block text-2xl font-black text-slate-950 font-sans">
                      {eventsData.filter(e => e.status === 'upcoming').length}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sắp diễn ra</span>
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 min-w-[100px] text-center shadow-sm">
                    <span className="block text-2xl font-black text-orange-600 font-sans">
                      {eventsData.filter(e => e.isOpenRegistration).length}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mở Đăng ký</span>
                  </div>
                </div>
              </div>

              {/* FILTER & SEARCH PANEL */}
              <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Search field */}
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sự kiện, địa điểm, chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
                  />
                </div>

                {/* Status & Sorting filters */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                  
                  {/* Status Dropdowns */}
                  <div className="flex bg-slate-100 p-1">
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'upcoming', label: 'Sắp diễn ra' },
                      { key: 'ongoing', label: 'Đang diễn ra' },
                      { key: 'past', label: 'Đã diễn ra' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key as any)}
                        className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                          statusFilter === tab.key
                            ? 'bg-white text-slate-950 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Date Sorter */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">
                    <span className="font-medium text-slate-400">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-700"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* EVENT GRID */}
              {paginatedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {paginatedEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-orange-600/50 transition-all hover:shadow-md"
                    >
                      <div>
                        {/* Image banner */}
                        <div className="relative aspect-video overflow-hidden bg-slate-950">
                          <img 
                            src={event.img} 
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest font-sans shadow-sm ${getStatusColor(event.status)}`}>
                              {getStatusLabel(event.status)}
                            </span>
                            {event.isOpenRegistration && (
                              <span className="bg-orange-600 text-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest font-sans shadow-sm">
                                Mở Đăng Ký
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event details block */}
                        <div className="p-6 space-y-4">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 font-sans">
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Calendar size={14} className="text-orange-600" /> {event.date}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Clock size={14} className="text-orange-600" /> {event.startDate.split('T')[1].slice(0, 5)}
                            </span>
                          </div>

                          <h3 
                            onClick={() => {
                              setSelectedEvent(event);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-lg font-black text-slate-950 leading-snug hover:text-orange-600 cursor-pointer transition-colors"
                          >
                            {event.title}
                          </h3>

                          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
                            {event.shortDesc}
                          </p>

                          <div className="flex gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-3 items-start border-l-2 border-orange-600">
                            <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA & details button */}
                      <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center justify-between gap-4">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-xs font-black uppercase tracking-wider text-slate-950 hover:text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                          Chi tiết sự kiện <ChevronRight size={14} />
                        </button>

                        {event.isOpenRegistration ? (
                          <button
                            onClick={() => {
                              setRegisterEvent(event);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-black uppercase tracking-widest transition-all"
                          >
                            Đăng ký ngay
                          </button>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
                            Đã đóng đăng ký
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 py-16 px-6 text-center shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-none flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Filter className="text-slate-400" size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 uppercase">Không tìm thấy sự kiện</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    Vui lòng điều chỉnh bộ lọc hoặc thử từ khóa tìm kiếm khác để hiển thị các chương trình khác.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-6 border border-slate-200 hover:border-orange-600 text-xs font-black uppercase tracking-widest px-6 py-2.5 transition-all text-slate-700 hover:text-orange-600"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}

              {/* PAGINATION CONTROL */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 border-t border-slate-200 pt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 hover:border-orange-600 text-slate-600 hover:text-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-9 h-9 text-xs font-black transition-all border ${
                        currentPage === idx + 1
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 hover:border-orange-600 text-slate-600 hover:text-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

            </motion.div>
          ) : (
            
            // --- VIEW 2: EVENT DETAILS ---
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              
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
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider font-sans shadow-md ${getStatusColor(selectedEvent.status)}`}>
                        {getStatusLabel(selectedEvent.status)}
                      </span>
                      {selectedEvent.isOpenRegistration && (
                        <span className="bg-orange-600 text-white px-3 py-1 text-xs font-black uppercase tracking-wider font-sans shadow-md">
                          Mở Đăng Ký
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-950 leading-tight uppercase tracking-tight">
                      {selectedEvent.title}
                    </h1>

                    {/* Meta quick badges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-100 py-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                          <Calendar className="text-orange-600" size={18} />
                        </div>
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Thời gian</span>
                          <span className="font-bold text-slate-800 text-sm leading-snug block">{selectedEvent.date}</span>
                          <span className="text-xs text-slate-500 font-medium font-sans">Bắt đầu: {selectedEvent.startDate.split('T')[1].slice(0, 5)}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                          <MapPin className="text-orange-600" size={18} />
                        </div>
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Địa điểm tổ chức</span>
                          <span className="font-bold text-slate-800 text-sm leading-snug block">{selectedEvent.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Countdown widget if upcoming */}
                    {(selectedEvent.status === 'upcoming' || selectedEvent.status === 'ongoing') && (
                      <div className="bg-slate-950 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                          <Timer className="text-orange-500 animate-spin-slow shrink-0" size={32} />
                          <div>
                            <span className="block text-xs font-black uppercase tracking-widest text-slate-400">Đếm ngược sự kiện</span>
                            <span className="text-sm font-bold text-slate-200">Sắp sửa diễn ra chương trình</span>
                          </div>
                        </div>

                        {/* Flip clock numbers */}
                        <div className="flex gap-2 text-center font-sans">
                          {[
                            { value: timeLeft.days, label: 'NGÀY' },
                            { value: timeLeft.hours, label: 'GIỜ' },
                            { value: timeLeft.minutes, label: 'PHÚT' },
                            { value: timeLeft.seconds, label: 'GIÂY' }
                          ].map((unit, i) => (
                            <div key={i} className="bg-slate-900 border border-white/10 p-2.5 min-w-[65px]">
                              <span className="block text-2xl font-black text-orange-500 leading-none">
                                {String(unit.value).padStart(2, '0')}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-1 block">
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
                <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-orange-600"></span> Giới thiệu chương trình
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed font-medium space-y-4 whitespace-pre-line">
                    {selectedEvent.longDesc}
                  </div>
                </div>

                {/* AUDIENCE / TARGET GROUP */}
                <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-orange-600"></span> Đối tượng tham dự phù hợp
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {selectedEvent.targetAudience.map((aud, i) => (
                      <div key={i} className="flex gap-3 items-start bg-slate-50 border border-slate-100 p-4">
                        <CheckCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-slate-700 leading-relaxed">{aud}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AGENDA TIMELINE */}
                <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-orange-600"></span> Agenda chi tiết chương trình
                  </h2>
                  
                  <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-8 py-2">
                    {selectedEvent.agenda.map((item, i) => (
                      <div key={i} className="relative group">
                        
                        {/* Timeline point */}
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-white border-2 border-orange-600 rounded-none group-hover:bg-orange-600 transition-all"></div>
                        
                        <div className="space-y-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <span className="px-2.5 py-1 bg-slate-950 text-white font-sans text-[10px] font-black uppercase tracking-wider shrink-0 w-fit">
                              {item.time}
                            </span>
                            {item.speaker && (
                              <span className="text-xs font-bold text-orange-600 font-sans">
                                • Diễn giả: {item.speaker}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-slate-950">{item.title}</h4>
                          {item.description && (
                            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-2xl">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SPEAKERS / PRESENTERS */}
                <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-orange-600"></span> Ban diễn giả & Chuyên gia
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedEvent.speakers.map((speaker, i) => (
                      <div key={i} className="border border-slate-200 bg-slate-50 p-6 flex flex-col md:flex-row gap-4 items-start">
                        <img 
                          src={speaker.avatar} 
                          alt={speaker.name}
                          className="w-16 h-16 object-cover border border-slate-300 shrink-0"
                        />
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-black text-slate-950">{speaker.name}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">{speaker.role}</p>
                            <p className="text-xs font-bold text-slate-400 font-sans">{speaker.company}</p>
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

                {/* LOCATION VISUAL MAP & GOOGLE MAPS SIMULATION */}
                {selectedEvent.address && (
                  <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-orange-600"></span> Bản đồ địa điểm sự kiện
                    </h2>
                    
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 leading-relaxed font-bold flex items-start gap-1.5 bg-slate-50 p-3.5 border-l-2 border-orange-600">
                        <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                        <span>{selectedEvent.address}</span>
                      </p>

                      {/* Map graphic mock */}
                      <div className="h-64 bg-slate-900 relative border border-slate-200 overflow-hidden flex items-center justify-center">
                        {/* Beautiful visual layout instead of empty maps */}
                        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        
                        <div className="text-center z-10 px-6 space-y-3">
                          <MapIcon className="text-orange-500 mx-auto animate-bounce" size={40} />
                          <div>
                            <span className="block text-sm font-black text-white">{selectedEvent.location.split(',')[0]}</span>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Mô phỏng bản đồ tương tác GIS</span>
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all"
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
                <div className="bg-white border border-slate-950 p-6 shadow-sm space-y-6 sticky top-24">
                  <div className="text-center pb-4 border-b border-slate-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Đăng ký tham dự</span>
                    <h3 className="text-base font-black text-slate-950 uppercase">Giữ chỗ sự kiện</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 border border-slate-200">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-sans">Trạng thái</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${selectedEvent.isOpenRegistration ? 'bg-emerald-500' : 'bg-slate-400 animate-none'} rounded-full animate-pulse`}></span>
                        <span className="text-xs font-black uppercase text-slate-700">
                          {selectedEvent.isOpenRegistration ? 'Đang mở đăng ký trực tuyến' : 'Đã dừng đăng ký trực tuyến'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-bold text-slate-600">
                      <div className="flex justify-between">
                        <span>Chi phí:</span>
                        <span className="text-orange-600 font-black">MIỄN PHÍ</span>
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
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 text-xs font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        Đăng ký ngay tại đây <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-slate-200 text-slate-400 py-3.5 text-xs font-black uppercase tracking-widest text-center cursor-not-allowed"
                      >
                        Đã đóng đăng ký
                      </button>
                    )}
                  </div>

                  {/* DOCUMENT DOWNLOADS */}
                  {selectedEvent.documents.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 space-y-3.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block font-sans">Tài liệu đính kèm</span>
                      <div className="space-y-2">
                        {selectedEvent.documents.map((doc, idx) => (
                          <a
                            key={idx}
                            href={doc.url}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Đã bắt đầu tải file: ${doc.name}`);
                            }}
                            className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 hover:border-orange-600 text-xs font-bold text-slate-700 hover:text-orange-600 transition-all"
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
                    className="w-full text-center border border-slate-200 hover:border-slate-950 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-950 py-2.5 transition-all"
                  >
                    Quay về danh sách
                  </button>
                </div>

              </div>

              {/* RELATED EVENTS CONTAINER */}
              <div className="lg:col-span-12 mt-10 pt-10 border-t border-slate-200 space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-950">Sự kiện liên quan khác</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {eventsData
                    .filter(e => e.id !== selectedEvent.id)
                    .map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white border border-slate-200 p-5 shadow-sm space-y-3 hover:border-orange-600 transition-colors"
                      >
                        <div className="aspect-video bg-slate-100 overflow-hidden mb-1">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] font-sans font-black uppercase tracking-wider text-orange-600 block">{item.date}</span>
                        <h4 
                          onClick={() => {
                            setSelectedEvent(item);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-sm font-black text-slate-950 leading-snug hover:text-orange-600 cursor-pointer line-clamp-2"
                        >
                          {item.title}
                        </h4>
                        <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">{item.shortDesc}</p>
                      </div>
                    ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

