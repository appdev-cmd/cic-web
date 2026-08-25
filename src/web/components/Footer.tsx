/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Globe 
} from 'lucide-react';
import { ZaloIcon } from '@shared/components/Icons';
import { typeH4, typeButton, typeCaption, typeLabel, typeMeta } from '@shared/components/Typography';
import { getNavigationData, type FooterNavigationItem, type PublicNavigationView } from '../features/navigation/navigationData';

interface FooterProps {
  setCurrentView: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'cms') => void;
  setActiveLink: (link: string) => void;
  onResetProducts?: () => void;
  onResetServices?: () => void;
  onResetProjects?: () => void;
  onResetNews?: () => void;
  onResetEvents?: () => void;
}

export const Footer = ({ 
  setCurrentView, 
  setActiveLink,
  onResetProducts,
  onResetServices,
  onResetProjects,
  onResetNews,
  onResetEvents
}: FooterProps) => {
  const { footerPrimaryLinks, footerSolutionLinks, footerServiceLinks } = getNavigationData();
  const resetByView: Partial<Record<PublicNavigationView, (() => void) | undefined>> = {
    products: onResetProducts,
    services: onResetServices,
    projects: onResetProjects,
    news: onResetNews,
    events: onResetEvents,
  };

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, item: FooterNavigationItem) => {
    if (item.preventDefault !== false) event.preventDefault();
    setCurrentView(item.view);
    setActiveLink(item.activeLabel);
    if (item.reset) resetByView[item.view]?.();
    if (item.scrollToTop !== false) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <img 
                src="/LOGO - 1990-08.png" 
                alt="CIC Logo Small" 
                className="h-26 sm:h-30 w-auto mb-4 rounded-[10px]"
              />
            </div>
            <p className={`${typeH4} text-white mb-4 leading-tight whitespace-nowrap`}>
              Công ty cổ phần Công nghệ và Tư vấn CIC
            </p>
            <div className="mb-8">
              <h4 className={`${typeCaption} text-white/60 mb-4`}>Đăng ký để nhận bản tin công nghệ mới nhất từ CIC</h4>
              <form className="relative flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Nhập email liên hệ" 
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-[8px] transition-all"
                />
                <button className={`px-5 py-2.5 bg-orange-600 text-white ${typeButton} rounded-lg hover:bg-orange-700 transition-all btn-modern-interaction`}>Đăng ký</button>
              </form>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="https://www.facebook.com/cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all shadow-lg group">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] text-white transition-all shadow-lg group">
                <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] text-white transition-all shadow-lg group">
                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://zalo.me/02439761381" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 text-white transition-all shadow-lg group">
                <ZaloIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-slate-800 hover:border-slate-800 text-white transition-all shadow-lg group">
                <Globe size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="lg:col-span-2">
            <h3 className={`${typeLabel} text-white mb-8`}>Điều hướng</h3>
            <ul className="space-y-4 text-sm font-semibold">
              {footerPrimaryLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={(event) => handleNavigation(event, item)} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={`${typeLabel} text-white mb-8`}>Giải pháp & Dịch vụ</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className={`${typeMeta} text-white/60 mb-4`}>Giải pháp</h4>
                <ul className="space-y-3 text-xs font-bold">
                  {footerSolutionLinks.map((item) => <li key={item.label}><a href={item.href} onClick={(event) => handleNavigation(event, item)} className="hover:text-orange-600 transition-all">{item.label}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className={`${typeMeta} text-white/60 mb-4`}>Dịch vụ</h4>
                <ul className="space-y-3 text-xs font-bold">
                  {footerServiceLinks.map((item) => <li key={item.label}><a href={item.href} onClick={(event) => handleNavigation(event, item)} className="hover:text-orange-600 transition-all">{item.label}</a></li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h3 className={`${typeLabel} text-white mb-6 flex items-center gap-2`}>
                <MapPin size={18} className="text-orange-600" /> Trụ sở chính
              </h3>
              <div className={`${typeCaption} space-y-4 text-slate-400`}>
                <p className="leading-relaxed">Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Thành phố Hà Nội, Việt Nam</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:02439761381" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Phone size={14} className="text-orange-600" /> 024 3976 1381
                  </a>
                  <a href="mailto:info@cic.com.vn" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Mail size={14} className="text-orange-600" /> info@cic.com.vn
                  </a>
                  <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <ExternalLink size={14} className="text-orange-600" /> www.cic.com.vn
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`${typeLabel} text-white mb-6 flex items-center gap-2`}>
                <MapPin size={18} className="text-orange-600" /> Chi nhánh Tp HCM
              </h3>
              <div className={`${typeCaption} space-y-4 text-slate-400`}>
                <p className="leading-relaxed">Số 36 Nguyễn Huy Lượng, P. Bình Thạnh, TP. Hồ Chí Minh</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:0886452020" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Phone size={14} className="text-orange-600" /> 088 645 2020 - 028 628 99022 - 028 628 99033
                  </a>
                  <a href="mailto:cichcm@cic.com.vn" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Mail size={14} className="text-orange-600" /> cichcm@cic.com.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 ${typeMeta}`}>
          <p>© {new Date().getFullYear()} CIC TECHNOLOGY. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6 sm:gap-10">
            <a 
              href="#privacy" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('privacy');
                setActiveLink('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:text-white transition-all cursor-pointer"
            >
              CHÍNH SÁCH BẢO MẬT
            </a>
            <a 
              href="#terms" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('terms');
                setActiveLink('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-all cursor-pointer"
            >
              ĐIỀU KHOẢN SỬ DỤNG
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
