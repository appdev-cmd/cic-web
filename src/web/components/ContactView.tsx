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
import type { ContactPageModel, PageRenderPolicy } from '@shared/page-content/models';
import { productionRenderPolicy } from '@shared/page-content/models';
import { getLegacyContactPageContent } from '@shared/page-content/legacyPageContent';
import { bindElement as bindElementRuntime, type BoundElementProps } from '@shared/visual-editing/bindElement';
import { elementBindingRegistry, type ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import { createCollectionItemPath, createElementBinding } from '@shared/visual-editing/elementBindingTypes';

function bindElement<T extends Element>(registry: ElementBindingRegistry, binding: ReturnType<typeof createElementBinding>): BoundElementProps<T> {
  return bindElementRuntime<T>(binding, registry);
}

interface ContactLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  note: string;
  submittedAt: string;
}

interface ContactViewProps {
  onNavigateHome?: () => void;
  content?: ContactPageModel;
  renderPolicy?: PageRenderPolicy;
  bindingRegistry?: ElementBindingRegistry;
}

export const ContactView = ({ onNavigateHome, content = getLegacyContactPageContent(), renderPolicy = productionRenderPolicy, bindingRegistry = elementBindingRegistry }: ContactViewProps) => {
  // Navigation & Page State
  const [activeBranch, setActiveBranch] = useState(content.branches.branches[0]?.id ?? '');
  useEffect(() => {
    const timer = window.setTimeout(() => window.dispatchEvent(new CustomEvent('page-builder-dom-updated')), 0);
    return () => window.clearTimeout(timer);
  }, [activeBranch]);

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

  const branches = content.branches.branches;
  const activeBranchModel = branches.find((branch) => branch.id === activeBranch) ?? branches[0];
  const activeBranchPath = activeBranchModel ? createCollectionItemPath('branches', activeBranchModel.id) : 'branches.unresolved';



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
        <div data-page-builder-section-key="contact.header" className="border-b border-slate-200 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN 1: OFFICE LISTS, DEPARTMENTS & INTERACTIVE MAP (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* OFFICE BRANCH SELECTOR & INFORMATION */}
            <div {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: 'branches', semantic: 'collection', ownership: 'embedded', editable: false, collectionPath: 'branches' }))} data-page-builder-section-key="contact.branches" className="bg-white border border-slate-200 p-8 shadow-sm space-y-8 rounded-[10px]">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-orange-600"></span> <span {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: 'title', semantic: 'text', ownership: 'section-config', editable: true }))}>{content.branches.title}</span>
                </h2>

                {/* Tabs branches */}
                <div className="flex bg-slate-100 p-1 rounded-[8px]">
                  {branches.map((tab) => (
                    <button
                      key={tab.id}
                      data-page-builder-preview-control="true"
                      onClick={() => setActiveBranch(tab.id)}
                      className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-[8px] cursor-pointer ${
                        activeBranch === tab.id
                          ? 'bg-white text-slate-950 shadow-xs border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Branch Detailed Information */}
              {activeBranchModel && <AnimatePresence mode="wait">
                <motion.div
                  {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: activeBranchPath, semantic: 'embedded-item', ownership: 'embedded', editable: false, itemId: activeBranchModel.id, collectionPath: 'branches' }))}
                  key={activeBranch}
                  initial={renderPolicy.motionEnabled ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={renderPolicy.motionEnabled ? { opacity: 0, y: -10 } : undefined}
                  transition={{ duration: renderPolicy.motionEnabled ? 0.2 : 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-3.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                      <Building className="text-orange-600 shrink-0" size={19} />
                      <span {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: `${activeBranchPath}.name`, semantic: 'text', ownership: 'embedded', editable: true, itemId: activeBranchModel.id, collectionPath: 'branches' }))}>{activeBranchModel.name}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      
                      <div className="space-y-1 bg-slate-50 border border-slate-100 p-4 rounded-[8px]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Địa chỉ văn phòng</span>
                        <p {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: `${activeBranchPath}.address`, semantic: 'text', ownership: 'embedded', editable: true, itemId: activeBranchModel.id, collectionPath: 'branches' }))} className="text-slate-800 leading-relaxed text-xs sm:text-[13px] font-medium">{activeBranchModel.address}</p>
                      </div>

                      <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-[8px]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Liên hệ nhanh</span>
                        <div className="space-y-1 text-slate-800 text-xs sm:text-[13px] font-medium">
                          <p className="flex items-center gap-2">
                            <Phone className="text-orange-600 shrink-0" size={14} /> 
                            <span>SĐT: <strong {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: `${activeBranchPath}.phone`, semantic: 'text', ownership: 'embedded', editable: true, itemId: activeBranchModel.id, collectionPath: 'branches' }))} className="font-semibold text-slate-900">{activeBranchModel.phone}</strong></span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="text-orange-600 shrink-0" size={14} /> 
                            <span>Email: <strong {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: `${activeBranchPath}.email`, semantic: 'text', ownership: 'embedded', editable: true, itemId: activeBranchModel.id, collectionPath: 'branches' }))} className="font-semibold text-slate-900">{activeBranchModel.email}</strong></span>
                          </p>
                          {activeBranchModel.fax && (
                            <p className="text-slate-600 font-medium pl-5.5 text-[11px] sm:text-xs">Fax: {activeBranchModel.fax}</p>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-1 bg-slate-50 border border-slate-100 p-4 rounded-[8px]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Thời gian làm việc</span>
                        <p className="text-slate-800 text-xs sm:text-[13px] font-medium flex items-center gap-2">
                          <Clock className="text-orange-600 shrink-0" size={14} /> <span {...bindElement(bindingRegistry, createElementBinding({ sectionKey: 'contact.branches', elementPath: `${activeBranchPath}.workingHours`, semantic: 'text', ownership: 'embedded', editable: true, itemId: activeBranchModel.id, collectionPath: 'branches' }))}>{activeBranchModel.workingHours}</span>
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* MAP CONTAINER */}
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bản đồ Google Maps</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBranchModel.searchQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all"
                      >
                        Mở bằng ứng dụng Google Maps <ExternalLink size={13} />
                      </a>
                    </div>
                    
                    {/* Google Maps Embed iframe */}
                    <div className="h-80 bg-slate-200 shadow-inner relative overflow-hidden rounded-[10px] border border-slate-200">
                      <iframe
                        title={activeBranchModel.name}
                        src={activeBranchModel.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full rounded-[10px]"
                      ></iframe>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>}

            </div>



          </div>

          {/* COLUMN 2: CONTACT FORM & LEAD PROCESSING SYSTEM (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* MAIN CONTACT FORM CARD */}
            <div data-page-builder-section-key="contact.form" className="bg-white border border-slate-200 p-8 shadow-lg space-y-6 relative rounded-[10px]">
              
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
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Họ tên <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:bg-white rounded-[8px] transition-all ${
                        formErrors.fullName ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-orange-600/20 focus:border-orange-600'
                      }`}
                    />
                    {formErrors.fullName && (
                      <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                        <AlertCircle size={13} /> {formErrors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Địa chỉ email & Số điện thoại */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Địa chỉ email <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Nhập email liên hệ"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:bg-white rounded-[8px] transition-all ${
                          formErrors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-orange-600/20 focus:border-orange-600'
                        }`}
                      />
                      {formErrors.email && (
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <AlertCircle size={13} /> {formErrors.email}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Số điện thoại <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:bg-white rounded-[8px] transition-all ${
                          formErrors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-orange-600/20 focus:border-orange-600'
                        }`}
                      />
                      {formErrors.phone && (
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <AlertCircle size={13} /> {formErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tiêu đề */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Tiêu đề <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề yêu cầu tư vấn..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:bg-white rounded-[8px] transition-all ${
                        formErrors.subject ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-orange-600/20 focus:border-orange-600'
                      }`}
                    />
                    {formErrors.subject && (
                      <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                        <AlertCircle size={13} /> {formErrors.subject}
                      </span>
                    )}
                  </div>

                  {/* Nội dung */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Nội dung
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả nhu cầu của bạn..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 focus:bg-white resize-none rounded-[8px] transition-all"
                    ></textarea>
                  </div>

                  {/* Nhập mã bảo mật */}
                  <div className="bg-slate-50 border border-slate-200 p-4 space-y-2.5 rounded-[8px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Nhập mã bảo mật <span className="text-orange-600">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white font-sans font-black text-sm px-4 py-2 border border-white/10 select-none tracking-widest shrink-0 rounded-[8px]">
                        {captcha.num1} + {captcha.num2} = ?
                      </div>
                      <input
                        type="number"
                        placeholder="Nhập kết quả..."
                        value={formData.captchaAnswer}
                        onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                        className={`w-full px-3.5 py-2.5 bg-white border text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 rounded-[8px] transition-all ${
                          formErrors.captchaAnswer ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-orange-600/20 focus:border-orange-600'
                        }`}
                      />
                    </div>
                    {formErrors.captchaAnswer && (
                      <span className="text-xs text-red-500 font-semibold flex items-center gap-1 block">
                        <AlertCircle size={13} /> {formErrors.captchaAnswer}
                      </span>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-600/15 disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed rounded-[8px] cursor-pointer"
                  >
                    {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu ngay'} 
                    <Send size={15} className="shrink-0" />
                  </button>

                </form>
              )}

            </div>

            {/* SECURITY/CONFIDENCE CARD */}
            <div data-page-builder-section-key="contact.security" className="bg-slate-900 text-slate-300 p-6 border border-white/10 space-y-3 rounded-[10px]">
              <div className="flex items-center gap-2.5 text-white">
                <ShieldCheck className="text-orange-500 shrink-0" size={22} />
                <h4 className="text-sm font-bold uppercase tracking-wider">Chính sách bảo mật & Tiêu chuẩn ISO</h4>
              </div>
              <p className="text-xs sm:text-[13px] font-normal leading-relaxed text-slate-300">
                CIC cam kết bảo mật 100% dữ liệu của khách hàng theo tiêu chuẩn ISO/IEC 27001 và Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Mọi luồng thông tin gửi qua cổng liên hệ đều được mã hóa SSL/TLS 256-bit an toàn tuyệt đối.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
