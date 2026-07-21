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
import { ZaloIcon } from './shared/Icons';

interface FooterProps {
  setCurrentView: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms') => void;
  setActiveLink: (link: string) => void;
}

export const Footer = ({ setCurrentView, setActiveLink }: FooterProps) => {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img 
                src="logo.png" 
                alt="CIC Logo Small" 
                className="h-20 w-auto mb-4"
                style={{ filter: 'hue-rotate(25deg) saturate(1.5) brightness(1.2)' }}
              />
            </div>
            <p className="text-white font-black text-lg mb-4 leading-tight">
              Công ty cổ phần Công nghệ và Tư vấn CIC
            </p>
            <div className="mb-8">
              <h4 className="text-white/60 text-xs font-bold mb-4 tracking-tight">Đăng ký để nhận bản tin công nghệ mới nhất từ CIC</h4>
              <form className="relative flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-orange-600 rounded-none transition-all"
                />
                <button className="px-4 py-2 bg-orange-600 text-white text-xs font-black uppercase rounded-none hover:bg-orange-700 transition-all btn-modern-interaction">Đăng ký</button>
              </form>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.facebook.com/cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all shadow-lg group">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] text-white transition-all shadow-lg group">
                <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] text-white transition-all shadow-lg group">
                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://zalo.me/02439761381" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 text-white transition-all shadow-lg group">
                <ZaloIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-slate-800 hover:border-slate-800 text-white transition-all shadow-lg group">
                <Globe size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8">Điều hướng</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#home" onClick={() => { setCurrentView('home'); setActiveLink('Giới thiệu'); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Trang chủ</a></li>
              <li><a href="#solutions" onClick={(e) => { e.preventDefault(); setCurrentView('products'); setActiveLink('Sản phẩm'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Sản phẩm</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); setCurrentView('services'); setActiveLink('Dịch vụ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Dịch vụ</a></li>
              <li><a href="#projects" onClick={(e) => { e.preventDefault(); setCurrentView('projects'); setActiveLink('Dự án'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Dự án</a></li>
              <li><a href="#events" onClick={(e) => { e.preventDefault(); setCurrentView('events'); setActiveLink('Sự kiện'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Sự kiện</a></li>
              <li><a href="#news" onClick={(e) => { e.preventDefault(); setCurrentView('news'); setActiveLink('Tin tức'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Tin tức</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setCurrentView('contact'); setActiveLink('Liên hệ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Liên hệ</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8">Sản phẩm & Dịch vụ</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className="text-white/60 text-xs font-black uppercase mb-4 tracking-tighter">Sản phẩm</h4>
                <ul className="space-y-3 text-xs font-bold">
                  <li><a href="#solutions" onClick={(e) => { e.preventDefault(); setCurrentView('products'); setActiveLink('Sản phẩm'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Phần mềm CAD & BIM</a></li>
                  <li><a href="#solutions" onClick={(e) => { e.preventDefault(); setCurrentView('products'); setActiveLink('Sản phẩm'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Mô phỏng & Dự báo</a></li>
                  <li><a href="#solutions" onClick={(e) => { e.preventDefault(); setCurrentView('products'); setActiveLink('Sản phẩm'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Thiết bị quan trắc</a></li>
                  <li><a href="#solutions" onClick={(e) => { e.preventDefault(); setCurrentView('products'); setActiveLink('Sản phẩm'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Kiểm định chất lượng</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/60 text-xs font-black uppercase mb-4 tracking-tighter">Dịch vụ</h4>
                <ul className="space-y-3 text-xs font-bold">
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); setCurrentView('services'); setActiveLink('Dịch vụ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Tư vấn chuyển đổi số</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); setCurrentView('services'); setActiveLink('Dịch vụ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Đào tạo & Chuyển giao</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); setCurrentView('services'); setActiveLink('Dịch vụ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Tư vấn phát triển bền vững</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); setCurrentView('services'); setActiveLink('Dịch vụ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-orange-600 transition-all">Phát triển phần mềm</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-orange-600" /> Trụ sở chính
              </h3>
              <div className="space-y-4 text-sm">
                <p className="leading-relaxed text-slate-400">Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Thành phố Hà Nội, Việt Nam</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:02439761381" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold text-slate-300">
                    <Phone size={14} className="text-orange-600" /> 024 3976 1381 - 024 3976 1381
                  </a>
                  <a href="mailto:info@cic.com.vn" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold text-slate-300">
                    <Mail size={14} className="text-orange-600" /> info@cic.com.vn
                  </a>
                  <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold text-slate-300">
                    <ExternalLink size={14} className="text-orange-600" /> www.cic.com.vn
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-orange-600" /> Chi nhánh Tp HCM
              </h3>
              <div className="space-y-4 text-sm">
                <p className="leading-relaxed text-slate-400">Số 36 Nguyễn Huy Lượng, P. Bình Thạnh, TP. Hồ Chí Minh</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:0886452020" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold text-slate-300">
                    <Phone size={14} className="text-orange-600" /> 088 645 2020 - 028 628 99022 - 028 628 99033
                  </a>
                  <a href="mailto:cichcm@cic.com.vn" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold text-slate-300">
                    <Mail size={14} className="text-orange-600" /> cichcm@cic.com.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest font-black text-slate-500">
          <p>© {new Date().getFullYear()} CIC TECHNOLOGY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10">
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
            <a href="#" className="hover:text-white transition-all">SƠ ĐỒ TRANG WEB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
