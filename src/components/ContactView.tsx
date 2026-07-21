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
  company: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  departmentEmail: string;
  note: string;
  consent: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  pageSource: string;
  submittedAt: string;
}

export const ContactView = ({ onNavigateHome }: { onNavigateHome?: () => void }) => {
  // Navigation & Page State
  const [activeBranch, setActiveBranch] = useState<'hn' | 'hcm'>('hn');
  
  // UTM and Referral parameters
  const [utmParams, setUtmParams] = useState({
    source: 'direct',
    medium: 'organic',
    campaign: 'contact_page_2026'
  });
  const [pageSource, setPageSource] = useState('https://cic.com.vn/lien-he');

  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    department: 'sales', // sales, technical, hardware, hr, general
    note: '',
    consent: false,
    captchaAnswer: ''
  });

  // Simple Captcha (Anti-Spam)
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLead, setSuccessLead] = useState<ContactLead | null>(null);
  
  // Load UTM and Referrer
  useEffect(() => {
    // UTM Parsing
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      source: params.get('utm_source') || 'cic_website',
      medium: params.get('utm_medium') || 'header_navigation',
      campaign: params.get('utm_campaign') || 'contact_campaign_2026'
    });

    // Page source detection
    if (document.referrer) {
      setPageSource(document.referrer);
    } else {
      setPageSource(window.location.href);
    }

    // Generate Captcha
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

  // Department contact routing mapping
  const departments = [
    { id: 'sales', name: 'Phòng Kinh doanh & Bản quyền', email: 'sales@cic.com.vn', icon: <Briefcase size={16} /> },
    { id: 'technical', name: 'Trung tâm Giải pháp Kỹ thuật & BIM', email: 'bim@cic.com.vn', icon: <Layers size={16} /> },
    { id: 'hardware', name: 'Phòng Thiết bị đo đạc & IoT', email: 'hardware@cic.com.vn', icon: <Cpu size={16} /> },
    { id: 'hr', name: 'Ban Hành chính & Tuyển dụng', email: 'hr@cic.com.vn', icon: <Users size={16} /> },
    { id: 'general', name: 'Yêu cầu Hợp tác chung / Khác', email: 'info@cic.com.vn', icon: <HelpCircle size={16} /> }
  ];

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Họ tên không được để trống';
    if (!formData.company.trim()) errors.company = 'Tên cơ quan/đơn vị không được để trống';
    if (!formData.position.trim()) errors.position = 'Vưi lòng nhập chức vụ của bạn';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không đúng định dạng (10 số)';
    }

    if (!formData.consent) {
      errors.consent = 'Bạn phải đồng ý với Điều khoản bảo mật và chính sách dữ liệu';
    }

    // Captcha validation
    if (parseInt(formData.captchaAnswer) !== captcha.answer) {
      errors.captchaAnswer = 'Kết quả phép tính bảo mật chưa chính xác';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Find routed department email
    const selectedDept = departments.find(d => d.id === formData.department) || departments[4];

    setTimeout(() => {
      const newLead: ContactLead = {
        id: 'lead_' + Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        company: formData.company,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        department: selectedDept.name,
        departmentEmail: selectedDept.email,
        note: formData.note,
        consent: formData.consent,
        utmSource: utmParams.source,
        utmMedium: utmParams.medium,
        utmCampaign: utmParams.campaign,
        pageSource: pageSource,
        submittedAt: new Date().toISOString()
      };

      setSuccessLead(newLead);
      setIsSubmitting(false);

      // Reset Form fields (except consent & department for consistency)
      setFormData({
        fullName: '',
        company: '',
        position: '',
        email: '',
        phone: '',
        department: 'sales',
        note: '',
        consent: false,
        captchaAnswer: ''
      });
      generateNewCaptcha();
    }, 1500);
  };



  return (
    <div className="pt-24 pb-20 relative z-10 min-h-screen bg-slate-50/70">
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

            {/* DEPARTMENTS & CONTACT POINT INFO */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 border-b border-slate-100 pb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-600"></span> Phòng ban & Đầu mối liên hệ trực tiếp
              </h2>

              <p className="text-xs text-slate-500 font-medium">
                Quý đối tác và khách hàng có nhu cầu tư vấn giải pháp kỹ thuật, hỗ trợ kỹ thuật hoặc liên hệ trực tiếp có thể kết nối với các đầu mối chuyên trách của CIC:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="border border-slate-200 p-4 bg-slate-50/50 flex items-start gap-3.5 hover:border-orange-600/30 transition-all">
                    <div className="w-9 h-9 bg-orange-100/70 border border-orange-200/50 text-orange-600 flex items-center justify-center shrink-0">
                      {dept.icon}
                    </div>
                    <div className="space-y-1 max-w-[220px]">
                      <h4 className="text-xs font-black text-slate-900 leading-snug">{dept.name}</h4>
                      <a 
                        href={`mailto:${dept.email}`} 
                        className="text-[11px] font-sans font-bold text-orange-600 hover:underline flex items-center gap-1"
                      >
                        {dept.email} <ChevronRight size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 2: CONTACT FORM & LEAD PROCESSING SYSTEM (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* MAIN CONTACT FORM CARD */}
            <div className="bg-white border border-slate-950 p-8 shadow-lg space-y-6 relative">
              
              {/* Form header */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 font-sans flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse text-orange-500" /> Hệ thống liên hệ thông minh
                </span>
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight mt-1">Gửi phiếu yêu cầu tư vấn</h3>
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
                      <p>Yêu cầu của anh/chị đã được chuyển thành công tới:</p>
                      
                      <div className="bg-white border border-emerald-100 p-3 flex gap-2 items-center">
                        <ShieldCheck className="text-emerald-500" size={16} />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">{successLead.department}</span>
                          <span className="block text-[10px] font-sans text-orange-600 font-bold underline">{successLead.departmentEmail}</span>
                        </div>
                      </div>

                      <p className="text-[11px] font-medium leading-relaxed text-slate-500 pt-1">
                        Hệ thống đã tự động định tuyến (Routing Email) yêu cầu tư vấn của anh/chị. Đội ngũ chuyên gia phụ trách sẽ phản hồi qua email hoặc số điện thoại <span className="font-bold text-slate-800">{successLead.phone}</span> trong vòng tối đa 2 giờ làm việc.
                      </p>
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
                <form onSubmit={handleSubmit} className="space-y-4.5">
                  
                  {/* Select reason / department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Nhu cầu liên hệ / Phòng ban chuyên trách <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 appearance-none"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.email})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 border-l border-slate-200">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>
                    <p className="text-[10px] font-sans text-slate-400 font-medium">
                      * Hệ thống tự động định tuyến thư liên hệ đến chính xác hòm thư điện tử của phòng ban được chọn.
                    </p>
                  </div>

                  {/* Full name input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Họ và tên <span className="text-orange-600">*</span>
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

                  {/* Grid Company & Position */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        Cơ quan / Đơn vị <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Tên doanh nghiệp / Viện nghiên cứu"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                          formErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                        }`}
                      />
                      {formErrors.company && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.company}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        Chức vụ của bạn <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Kỹ sư kết cấu, Giám đốc..."
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                          formErrors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                        }`}
                      />
                      {formErrors.position && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.position}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Detail grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        Email liên hệ <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="ten@congty.com"
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
                        placeholder="Số di động hoặc máy bàn"
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

                  {/* Message/Note input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Nội dung tin nhắn / Yêu cầu báo giá kỹ thuật
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ghi rõ thông tin phần mềm hoặc thiết bị quan tâm để nhận báo giá chi tiết..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 resize-none"
                    ></textarea>
                  </div>

                  {/* CONSENT CHECKBOX */}
                  <div className="space-y-1.5">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-1 cursor-pointer accent-orange-600"
                      />
                      <span className="text-[10px] font-bold text-slate-500 leading-normal">
                        Tôi hoàn toàn đồng ý để CIC lưu trữ dữ liệu cá nhân này để tư vấn trực tiếp và gửi các thông tin chuyên ngành phục vụ kỹ thuật xây dựng và hạ tầng. <span className="text-orange-600">*</span>
                      </span>
                    </label>
                    {formErrors.consent && (
                      <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 block">
                        <AlertCircle size={12} /> {formErrors.consent}
                      </span>
                    )}
                  </div>

                  {/* ANTI-SPAM CAPTCHA */}
                  <div className="bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-sans">Xác thực chống Spam tự động (Anti-Spam)</span>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white font-sans font-black text-sm px-4 py-2 border border-white/10 select-none tracking-widest">
                        {captcha.num1} + {captcha.num2} = ?
                      </div>
                      <input
                        type="number"
                        placeholder="Kết quả"
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
