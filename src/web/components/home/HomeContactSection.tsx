/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, ShieldCheck } from 'lucide-react';
import { submitCustomerInteraction } from '../../services/customerInteractionSubmission';
import { SYSTEM_FORM_IDS } from '../../../shared/customerInteractionContract';

interface HomeContactSectionProps {
  contactCta?: {
    title?: string;
    description?: string;
    phone?: string;
    email?: string;
    submitLabel?: string;
  };
}

export const HomeContactSection: React.FC<HomeContactSectionProps> = ({ contactCta }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interestService, setInterestService] = useState('Phần mềm kỹ thuật bản quyền');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await submitCustomerInteraction({
        formId: SYSTEM_FORM_IDS.homeConsultation,
        formName: 'Tư vấn trang chủ',
        values: {
          fullName,
          phoneNumber,
          interestService,
          message,
        },
        source: {
          pageType: 'home',
          pageId: 'home',
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: typeof document !== 'undefined' ? document.title : 'Trang chủ',
          placementKey: 'home.contact_cta',
        },
      });
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFullName('');
        setPhoneNumber('');
        setMessage('');
      }, 4000);
    } catch (err) {
      console.error('Error submitting consultation:', err);
    }
  };

  return (
    <section data-page-builder-section-key="home.contact_cta" id="contact" className="py-12 bg-slate-50/50 overflow-hidden relative z-10">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600 opacity-5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-8 leading-[1.1] tracking-tighter">
              {contactCta?.title ? (
                /<[a-z][\s\S]*>/i.test(contactCta.title) ? (
                  <span dangerouslySetInnerHTML={{ __html: contactCta.title }} />
                ) : contactCta.title.includes('Tương lai số') ? (
                  <>
                    {contactCta.title.split('Tương lai số')[0]}
                    <br /> <span className="text-orange-600">Tương lai số</span>
                  </>
                ) : contactCta.title.includes('the Digital Future') ? (
                  <>
                    {contactCta.title.split('the Digital Future')[0]}
                    <br /> <span className="text-orange-600">the Digital Future</span>
                  </>
                ) : contactCta.title.includes('Digital Future') ? (
                  <>
                    {contactCta.title.split('Digital Future')[0]}
                    <br /> <span className="text-orange-600">Digital Future</span>
                  </>
                ) : (
                  contactCta.title
                )
              ) : (
                <>Sẵn sàng kiến tạo <br /> <span className="text-orange-600">Tương lai số</span></>
              )}
            </h2>
            <p className="text-slate-600 text-base mb-10 max-w-xl font-medium leading-relaxed">
              {contactCta?.description || 'Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và cung cấp những giải pháp công nghệ tối ưu nhất cho doanh nghiệp của bạn.'}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-slate-100 flex items-center justify-center text-slate-950 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Hotline tư vấn</div>
                  <div className="text-xl text-slate-950 font-black">{contactCta?.phone || '024 3976 1381'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-slate-100 flex items-center justify-center text-slate-950 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Email liên hệ</div>
                  <div className="text-xl text-slate-950 font-black">{contactCta?.email || 'info@cic.com.vn'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-slate-50 rounded-[10px] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative"
          >
            <h3 className="text-2xl font-black text-slate-950 mb-8">Gửi yêu cầu tư vấn</h3>
            
            <AnimatePresence>
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 text-center z-10"
                >
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2 uppercase">Gửi thông tin thành công!</h4>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                    Cảm ơn bạn đã gửi yêu cầu. Đội ngũ chuyên gia của CIC sẽ liên hệ lại với bạn trong vòng 24 giờ làm việc.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Họ tên</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold" 
                    placeholder="Nhập họ và tên" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Số điện thoại</label>
                  <input 
                    type="tel" 
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold" 
                    placeholder="Nhập số điện thoại" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dịch vụ quan tâm</label>
                <select 
                  value={interestService}
                  onChange={(e) => setInterestService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold cursor-pointer"
                >
                  <option>Phần mềm kỹ thuật bản quyền</option>
                  <option>Thiết bị & IoT</option>
                  <option>BIM/Digital Twins</option>
                  <option>Chuyển đổi số & Net Zero</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nội dung</label>
                <textarea 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold resize-none" 
                  placeholder="Mô tả nhu cầu của bạn..."
                />
              </div>
              <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-[8px] font-black uppercase tracking-widest text-xs btn-modern-interaction shadow-xl shadow-orange-600/20">
                {contactCta?.submitLabel || 'Gửi thông tin ngay'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
