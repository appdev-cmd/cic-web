import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  ExternalLink, 
  Users, 
  Cpu, 
  HelpCircle,
  Building,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  Database
} from 'lucide-react';

interface ContactLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  note: string;
  submittedAt: string;
}

export const ContactView = ({ onNavigateHome }: { onNavigateHome?: () => void }) => {
  // Navigation & Page State
  const [activeBranch, setActiveBranch] = useState<'hn' | 'hcm'>('hn');

  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    note: '',
    captchaAnswer: ''
  });

  // Simple Captcha (Anti-Spam)
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLead, setSuccessLead] = useState<ContactLead | null>(null);
  
  // Load initial captcha
  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const generateNewCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({
      num1,
      num2,
      answer: num1 + num2
    });
  };

  // Branch data
  const branches = {
    hn: {
      name: 'Trụ sở chính Hà Nội',
      address: 'Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Quận Thanh Xuân, Thành phố Hà Nội, Việt Nam',
      tel: '024 3976 1381',
      fax: '',
      email: 'info@cic.com.vn',
      workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:30 | Thứ Bảy: 08:00 - 12:00',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9658249645934!2d105.8058773!3d21.0016278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9804b49cf5%3A0x6bcfd35c59f0f975!2sVG%20Building!5e0!3m2!1svi!2s!4v1721445021235!5m2!1svi!2s',
      searchQuery: 'VG Building, 235 Nguyễn Trãi, Thanh Xuân, Hà Nội, Việt Nam'
    },
    hcm: {
      name: 'Chi nhánh TP. Hồ Chí Minh',
      address: 'Số 36 Nguyễn Huy Lượng, Phường 14, Quận Bình Thạnh, TP. Hồ Chí Minh',
      tel: '088 645 2020 - 028 628 99022 - 028 628 99033',
      fax: '',
      email: 'cichcm@cic.com.vn',
      workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:30 | Thứ Bảy: Nghỉ',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.231264223456!2d106.695247!3d10.793619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b76df47c17%3A0xa6607e4c63f11467!2zMzYgTmd1eeG7hW4gSHV5IEzGsOG7b25nLCBQaMaw4budbmcgMTQsIELDjG5oIFRo4bqhbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1721445124012!5m2!1svi!2s',
      searchQuery: '36 Nguyễn Huy Lượng, Bình Thạnh, TP. Hồ Chí Minh, Việt Nam'
    }
  };



  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Họ tên không được để trống';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Địa chỉ email không được để trống';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không đúng định dạng';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Vui lòng nhập tiêu đề';
    }

    // Captcha validation
    if (!formData.captchaAnswer || parseInt(formData.captchaAnswer) !== captcha.answer) {
      errors.captchaAnswer = 'Mã bảo mật chưa chính xác';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newLead: ContactLead = {
        id: 'lead_' + Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        note: formData.note,
        submittedAt: new Date().toISOString()
      };

      setSuccessLead(newLead);
      setIsSubmitting(false);

      // Reset Form fields
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        note: '',
        captchaAnswer: ''
      });
      generateNewCaptcha();
    }, 1200);
  };



  return (
    <div className="pt-24 pb-20 relative min-h-screen bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-6">

        {/* HERO TITLE AREA */}
        <div className="border-b border-slate-200 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950">
              Kết nối chuyên gia CIC
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl font-medium">
              Văn phòng hỗ trợ khách hàng của CIC phủ sóng toàn quốc, sẵn sàng phục vụ 24/7 và giải quyết mọi khúc mắc về giải pháp phần mềm, chuyển đổi số.
            </p>
          </div>
        </div>

        {/* TWO COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUMN 1: OFFICE LISTS, DEPARTMENTS & INTERACTIVE MAP (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* OFFICE BRANCH SELECTOR & INFORMATION */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-orange-600"></span> Bản đồ & Chi nhánh
                </h2>

                {/* Tabs branches */}
                <div className="flex bg-slate-100 p-1">
                  {[
                    { key: 'hn', label: 'Hà Nội' },
                    { key: 'hcm', label: 'TP. HCM' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveBranch(tab.key as any)}
                      className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                        activeBranch === tab.key
                          ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Branch Detailed Information */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBranch}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-950 flex items-center gap-2.5">
                      <Building className="text-orange-600 shrink-0" size={20} />
                      {branches[activeBranch].name}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                      
                      <div className="space-y-1 bg-slate-50 border border-slate-100 p-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-sans">Địa chỉ văn phòng</span>
                        <p className="text-slate-800 leading-relaxed font-bold">{branches[activeBranch].address}</p>
                      </div>

                      <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-sans">Liên hệ nhanh</span>
                        <div className="space-y-1 text-slate-800">
                          <p className="flex items-center gap-2">
                            <Phone className="text-orange-600 shrink-0" size={14} /> 
                            <span>SĐT: {branches[activeBranch].tel}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="text-orange-600 shrink-0" size={14} /> 
                            <span>Email: {branches[activeBranch].email}</span>
                          </p>
                          {branches[activeBranch].fax && (
                            <p className="text-slate-500 font-medium">Fax: {branches[activeBranch].fax}</p>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-1 bg-slate-50 border border-slate-100 p-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-sans">Thời gian làm việc</span>
                        <p className="text-slate-800 flex items-center gap-2">
                          <Clock className="text-orange-600" size={14} /> {branches[activeBranch].workingHours}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* MAP CONTAINER */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="uppercase tracking-wider text-slate-400 font-sans">Bản đồ vệ tinh Google Maps</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branches[activeBranch].searchQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 hover:underline transition-all"
                      >
                        Mở bằng ứng dụng Google Maps <ExternalLink size={12} />
                      </a>
                    </div>
                    
                    {/* Google Maps Embed iframe */}
                    <div className="h-80 bg-slate-200 border border-slate-200 shadow-inner relative overflow-hidden">
                      <iframe
                        title={branches[activeBranch].name}
                        src={branches[activeBranch].mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                      ></iframe>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>



          </div>

          {/* COLUMN 2: CONTACT FORM & LEAD PROCESSING SYSTEM (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* MAIN CONTACT FORM CARD */}
            <div className="bg-white border border-slate-950 p-8 shadow-lg space-y-6 relative">
              
              {/* Form header */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">Gửi phiếu yêu cầu tư vấn</h3>
              </div>

              {/* Success Result Screen */}
              <AnimatePresence>
                {successLead && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-50 border border-emerald-500/30 p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2.5 text-emerald-800">
                      <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-tight">Gửi Yêu Cầu Thành Công!</h4>
                        <p className="text-[10px] font-sans font-bold text-slate-500 mt-0.5">ID Lead: {successLead.id}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-emerald-500/10 pt-4 text-xs font-bold text-slate-700">
                      <p>Kính gửi anh/chị <span className="text-slate-950 font-black">{successLead.fullName}</span>,</p>
                      <p>Yêu cầu tư vấn của anh/chị đã được ghi nhận thành công.</p>
                      
                      <div className="bg-white border border-emerald-100 p-3">
                        <span className="block font-black text-slate-900 text-[11px]">Tiêu đề: {successLead.subject}</span>
                        <span className="block text-[10px] font-sans text-slate-500 mt-1">
                          Đội ngũ chuyên gia CIC sẽ chủ động phản hồi qua email <span className="font-bold text-slate-800">{successLead.email}</span> hoặc SĐT <span className="font-bold text-slate-800">{successLead.phone}</span>.
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSuccessLead(null)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest py-2.5 text-center transition-all"
                    >
                      Gửi thêm yêu cầu mới
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Input fields */}
              {!successLead && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Họ tên */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Họ tên <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                        formErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                      }`}
                    />
                    {formErrors.fullName && (
                      <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Địa chỉ email & Số điện thoại */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        Địa chỉ email <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@congty.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                          formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                        }`}
                      />
                      {formErrors.email && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.email}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        Số điện thoại <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ví dụ: 0912 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                          formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                        }`}
                      />
                      {formErrors.phone && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tiêu đề */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Tiêu đề <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề yêu cầu tư vấn..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                        formErrors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                      }`}
                    />
                    {formErrors.subject && (
                      <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.subject}
                      </span>
                    )}
                  </div>

                  {/* Nội dung */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Nội dung
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả cụ thể nội dung yêu cầu của bạn..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 resize-none"
                    ></textarea>
                  </div>

                  {/* Nhập mã bảo mật */}
                  <div className="bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                      Nhập mã bảo mật <span className="text-orange-600">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white font-sans font-black text-sm px-4 py-2 border border-white/10 select-none tracking-widest shrink-0">
                        {captcha.num1} + {captcha.num2} = ?
                      </div>
                      <input
                        type="number"
                        placeholder="Nhập kết quả..."
                        value={formData.captchaAnswer}
                        onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                        className={`w-full p-2.5 bg-white border text-xs font-black text-slate-800 focus:outline-none focus:ring-1 ${
                          formErrors.captchaAnswer ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                        }`}
                      />
                    </div>
                    {formErrors.captchaAnswer && (
                      <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 block">
                        <AlertCircle size={12} /> {formErrors.captchaAnswer}
                      </span>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 text-xs font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-600/15 disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu ngay'} 
                    <Send size={14} className="shrink-0" />
                  </button>

                </form>
              )}

            </div>

            {/* SECURITY/CONFIDENCE CARD */}
            <div className="bg-slate-900 text-slate-300 p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="text-orange-500" size={20} />
                <h4 className="text-xs font-black uppercase tracking-wider">Chính sách bảo mật & Tiêu chuẩn ISO</h4>
              </div>
              <p className="text-[10px] font-medium leading-relaxed text-slate-400">
                CIC cam kết bảo mật 100% dữ liệu của khách hàng theo tiêu chuẩn ISO/IEC 27001 và Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Mọi luồng thông tin gửi qua cổng liên hệ đều được mã hóa SSL/TLS 256-bit an toàn tuyệt đối.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
