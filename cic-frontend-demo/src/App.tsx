/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { Constellation } from './components/Constellation';
import { Linkedin, Youtube, Search, 
  ArrowRight, 
  Play, 
  MapPin, 
  Calendar, 
  Facebook, 
  Globe, 
  Mail, 
  Phone, 
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Menu,
  X,
  MessageCircle,
  ExternalLink,
  Download,
  Award,
  History,
  Users,
  Trophy,
  Medal,
  ShieldCheck,
  Box,
  Layers,
  Cpu,
  Bell,
  Star,
  TrendingUp,
  Briefcase,
  Network,
  Package
} from 'lucide-react';
import { useState, useEffect } from 'react';


// Common Icons workaround for specialized ones
const BIMIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const ZaloIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" />
  </svg>
);

const Counter = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(value);
      return;
    }

    const duration = 2000;
    const range = end - start;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * range + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return <span>{count.toLocaleString('vi-VN')}{suffix}</span>;
};

export default function App() {
  const heroSlides = [
    {
      img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
      title: 'Đối tác công nghệ <span class="text-orange-600 whitespace-nowrap">chiến lược</span>',
      sub: "Hơn 35 năm tiên phong thúc đẩy số hóa toàn diện."
    },
    {
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
      title: 'Hệ sinh thái <span class="text-orange-600 whitespace-nowrap">giải pháp số</span>',
      sub: "Ứng dụng AI, BIM và Digital Twins vào quy trình vận hành, giúp tối ưu hóa hiệu suất và tiết kiệm tài nguyên cho doanh nghiệp."
    },
    {
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80",
      title: 'Dẫn đầu <span class="text-orange-600 whitespace-nowrap">chuyển đổi số</span>',
      sub: "Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới mang lại những giải pháp đột phá cho tương lai hạ tầng Việt Nam."
    },
    {
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
      title: 'Phần mềm bản quyền <span class="text-orange-600 whitespace-nowrap">chính hãng</span>',
      sub: "Cung cấp hệ thống phần mềm bản quyền chính hãng, hỗ trợ kỹ thuật tận tâm, đảm bảo an toàn thông tin và tuân thủ pháp lý."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState('upcoming');
  const [activeProjectTab, setActiveProjectTab] = useState('software');
  const [activeNewsCategory, setActiveNewsCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Về chúng tôi', href: '#home', active: true },
    { name: 'Giải pháp', href: '#solutions' },
    { name: 'Dịch vụ', href: '#services' },
    { name: 'Dự án', href: '#projects' },
    { name: 'Sự kiện', href: '#events' },
    { name: 'Tin tức', href: '#news' },
    { name: 'Liên hệ', href: '#contact' },
  ];

  const partners = [
    { name: 'Autodesk', logo: 'https://www.cic.com.vn/images/banners/original/autodesk_1692843119.jpg' },
    { name: 'Bentley', logo: 'https://www.cic.com.vn/images/banners/original/bentley_1584073443.jpg' },
    { name: 'Graitec', logo: 'https://www.cic.com.vn/images/banners/original/graitec_1584074977.jpg' },
    { name: 'Instantel', logo: 'https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg' },
    { name: 'Lander', logo: 'https://www.cic.com.vn/images/banners/original/lander_1584075179.jpg' },
    { name: 'PTV Group', logo: 'https://www.cic.com.vn/images/banners/original/ptv-group_1584081558.jpg' },
    { name: 'RPS', logo: 'https://www.cic.com.vn/images/banners/original/rps_1584081695.jpg' },
    { name: 'Tecotec', logo: 'https://www.cic.com.vn/images/banners/original/tecotec_1584082139.jpg' },
    { name: 'Breeze', logo: 'https://www.cic.com.vn/images/banners/original/breeze_1584073488.jpg' },
    { name: 'Steel Builder', logo: 'https://www.cic.com.vn/images/banners/original/steel-builder_1584081972.jpg' },
    { name: 'VC Group', logo: 'https://www.cic.com.vn/images/banners/original/vc-group_1584082426.jpg' },
    { name: 'NDT System', logo: 'https://www.cic.com.vn/images/banners/original/ndt-system_1584081087.jpg' },
    { name: 'Enjicad', logo: 'https://www.cic.com.vn/images/banners/original/enjicad_1584074316.jpg' },
    { name: 'PEB Steel', logo: 'https://www.cic.com.vn/images/banners/original/peb-steel_1584081269.jpg' },
    { name: 'Shimz', logo: 'https://www.cic.com.vn/images/banners/original/shimz_1584081817.jpg' },
    { name: 'Atlas', logo: 'https://www.cic.com.vn/images/banners/original/atlas-_1584073344.jpg' },
  ];

  const projects = [
    { id: 1, type: 'software', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80', location: 'Hồ Chí Minh', name: 'Landmark 81 - BIM Management', tags: ['BIM', 'Digital Twins', 'CDE'], size: 'wide' },
    { id: 2, type: 'equipment', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80', location: 'Toàn quốc', name: 'Trạm Quan Trắc Tự Động', tags: ['IoT', 'Monitoring'], size: 'tall' },
    { id: 3, type: 'services', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80', location: 'Đồng Nai', name: 'Tư vấn Chuyển đổi số Kỹ thuật', tags: ['Consulting', 'AI'], size: 'small' },
    { id: 4, type: 'software', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80', location: 'Hà Nội', name: 'Hệ thống Quản lý Năng lượng Net Zero', tags: ['AI', 'Net Zero'], size: 'small' },
  ];

  const SectionHeader = ({ title, sub, dark }: { title: string, sub: string, dark?: boolean }) => (
    <div className="text-center mb-6">
      <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      <div className="w-16 h-1 bg-orange-600 mx-auto mt-2 mb-4"></div>
      <p className={`font-bold uppercase tracking-widest text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</p>
    </div>
  );

  const filteredProjects = projects.filter(p => {
    const matchesTab = activeProjectTab === 'all' || p.type === activeProjectTab;
    const searchLower = projectSearchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) ||
      p.location.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower));
    return matchesTab && matchesSearch;
  });

  const newsItems = [
    {
      category: 'company',
      title: 'CIC Technology & Bentley Systems: Thúc đẩy hạ tầng số 2024',
      date: '10/05/2024',
      desc: 'Hợp tác chiến lược mang đến các giải pháp iTwin và Digital Twins tiên tiến cho các dự án trọng điểm tại Việt Nam.',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
    },
    {
      category: 'specialty',
      title: 'Ra mắt giải pháp AI trong quản lý năng lượng và Net Zero',
      date: '05/05/2024',
      desc: 'Giúp doanh nghiệp kiểm kê phát thải tự động và tối ưu hóa lộ trình giảm Carbon theo tiêu chuẩn quốc tế.',
      img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      category: 'company',
      title: 'Sự kiện Bentley Innovation Day quy quy tụ hơn 500 chuyên gia',
      date: '28/04/2024',
      desc: 'Chia sẻ kinh nghiệm triển khai BIM và Digital Twins từ các tập đoàn lớn toàn cầu.',
      img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
    }
  ];

  const filteredNews = newsItems.filter(n => activeNewsCategory === 'all' || n.category === activeNewsCategory);

  const marqueeTexts = [
    "CIC Technology đồng hành cùng Bentley Systems thúc đẩy hạ tầng số tại Việt Nam",
    "Khai trương trung tâm đào tạo BIM & Digital Twins tại Hà Nội và TP.HCM",
    "Ra mắt giải pháp AI-Powered Construction Monitoring cho giám sát công trình",
    "Hợp tác chiến lược Net Zero với các đối tác Châu Âu về tín chỉ Carbon",
    "Sự kiện Bentley Innovation Day 2024 quy tụ hơn 500 chuyên gia hạ tầng"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-100"><Constellation density={9000} lineDistance={200} particleColor="rgba(234, 88, 12, 0.5)" lineColor="rgba(234, 88, 12, " /></div>
      {/* Floating Contact Bar */}
      <div className="fixed right-6 bottom-10 z-[100] flex flex-col gap-4">
        {[
          { icon: <ZaloIcon size={24} />, label: 'Zalo', color: 'bg-blue-600', link: 'https://zalo.me/02439761381' },
          { icon: <MessageCircle size={24} />, label: 'Messenger', color: 'bg-sky-500', link: '#' },
          { icon: <Phone size={24} />, label: 'Hotline', color: 'bg-orange-600', link: 'tel:02439761381' }
        ].map((item, i) => (
          <motion.a 
            key={i}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            whileHover={{ scale: 1.1, x: -5 }}
            className={`${item.color} text-white w-14 h-14 rounded-none flex items-center justify-center shadow-2xl relative group`}
          >
            {item.icon}
            <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-none opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </motion.a>
        ))}
      </div>

      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="flex items-center group">
              <img 
                src="logo.png" 
                alt="CIC Logo" 
                className={`h-10 md:h-12 w-auto transition-all duration-500 ${isScrolled ? 'brightness-100' : 'brightness-0 invert'} group-hover:scale-105`}
              />
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold transition-all relative group py-2 uppercase tracking-wide ${
                  link.active 
                    ? 'text-orange-600' 
                    : isScrolled ? 'text-slate-600 hover:text-orange-600' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
                <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full ${link.active ? 'w-full' : ''}`}></div>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className={`hidden md:flex items-center gap-1 p-1 rounded-none border backdrop-blur-md transition-all duration-500 ${
              isScrolled ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'
            }`}>
              <button 
                className={`px-3 py-1 text-[10px] font-black rounded-none transition-all ${
                  isScrolled 
                    ? 'bg-orange-600 text-white shadow-sm' 
                    : 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                }`}
              >
                VN
              </button>
              <button 
                className={`px-3 py-1 text-[10px] font-black rounded-none transition-all ${
                  isScrolled ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button className={`p-2 transition-colors ${isScrolled ? 'text-slate-600 hover:text-orange-600' : 'text-white hover:text-orange-400'}`}>
              <Search size={20} />
            </button>
            <button className="hidden sm:block px-5 py-2 bg-orange-600 text-white rounded-none text-sm font-black transition-all active:scale-95 border-2 border-orange-600 btn-modern-interaction">
              Tư vấn ngay
            </button>
            <button 
              className="lg:hidden p-2 text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} className={isScrolled ? 'text-slate-950' : 'text-white'} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-slate-950 p-6 flex flex-col gap-8"
          >
            <div className="flex justify-between items-center">
              <div className="text-2xl font-black text-white">CIC</div>
              <button 
                className="p-2 text-white" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-3xl font-black text-white hover:text-orange-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-32 overflow-hidden bg-slate-950/90 z-10">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              src={heroSlides[currentSlide].img} 
              alt="Slide" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent mix-blend-multiply"></div>
          
          
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10 w-full mb-12">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-none mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-none bg-orange-600 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Leading Innovation since 1990
              </span>
            </div>
            
            <h1 
              className="text-5xl lg:text-[4.5rem] xl:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tighter"
              dangerouslySetInnerHTML={{ __html: heroSlides[currentSlide].title }}
            />
            
            <p className="text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              {heroSlides[currentSlide].sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-5 py-2 bg-orange-600 text-white rounded-none font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_20px_50px_rgba(234,88,12,0.3)] border-2 border-orange-600 btn-modern-interaction flex items-center justify-center gap-3">
                Khám phá giải pháp <ArrowRight size={20} />
              </button>
              <button className="px-5 py-2 bg-white/5 text-white rounded-none font-black text-sm uppercase tracking-widest transition-all hover:bg-white/10 border-2 border-white/10  flex items-center justify-center gap-3 btn-modern-interaction">
                <Play size={20} fill="currentColor" /> Về chúng tôi
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-16 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {heroSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-none transition-all duration-300 ${i === currentSlide ? 'w-10 bg-orange-600' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 border-t border-white/10 backdrop-blur-md z-30 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-4 relative overflow-hidden">
            <div className="flex bg-orange-600 text-white px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-widest shrink-0 gap-2 items-center z-10">
              <Bell size={12} /> Tin nổi bật
            </div>
            <div className="flex-1 overflow-hidden relative h-full flex items-center group">
              <motion.div 
                animate={{ x: ["100vw", "-100%"] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="whitespace-nowrap text-sm text-slate-300 font-medium"
              >
                CIC ra mắt nền tảng chuyển đổi số toàn diện cho doanh nghiệp ngành xây dựng và kiến trúc năm 2026. <span className="mx-6 text-orange-600">•</span> CIC đạt giải thưởng uy tín Top 10 Doanh nghiệp Công nghệ số xuất sắc nhất năm
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section (Hơn 35 năm đồng hành) */}
      <section className="py-20 bg-white/40  relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Về chúng tôi</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] xl:text-[3.2rem] font-black text-[#0b1b36] mb-8 leading-[1.2] tracking-tighter w-full max-w-none break-words">
                Hơn 35 năm <span className="text-orange-600">đồng hành</span><br className="hidden md:block" /> cùng kỹ thuật Việt Nam
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base mb-10 font-medium text-justify">
                <p>
                  CIC (tiền thân là Trung tâm Tin học - Bộ Xây dựng, thành lập năm 1990) là đơn vị hàng đầu cung cấp phần mềm, thiết bị và giải pháp số cho ngành xây dựng.
                </p>
                <p>
                  Suốt hơn 35 năm, chúng tôi luôn đi đầu ứng dụng ICT, mang đến dịch vụ tư vấn chuyên sâu cho hàng nghìn doanh nghiệp, đối tác trong nước và quốc tế.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2 bg-orange-600 text-white rounded-none font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg border-2 border-orange-600 btn-modern-interaction flex items-center gap-2">
                  Khám phá hành trình CIC <ArrowRight size={16} />
                </button>
                <button className="px-5 py-2 bg-white text-slate-900 rounded-none font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-sm border border-slate-200 hover:bg-slate-100 btn-modern-interaction flex items-center gap-2">
                  Tải Hồ sơ năng lực <Download size={16} />
                </button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative rounded-none overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] aspect-video cursor-pointer"
              onClick={() => window.open('https://www.youtube.com/watch?v=Eeh4Y-PLptY&t=8s', '_blank')}
            >
              <img 
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80" 
                alt="Office" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-all flex items-center justify-center">
                <div className="relative">
                  <div className="relative w-24 h-24 bg-orange-600 text-white rounded-none flex items-center justify-center shadow-2xl group-hover:scale-125 transition-all duration-500">
                    <Play size={36} fill="white" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 bg-orange-600 rounded-none animate-ping opacity-20"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50/30 relative overflow-hidden border-y border-slate-200 z-10">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 md:divide-x divide-slate-200">
            {[
              { val: 35, suffix: '+', label: 'Năm kinh nghiệm' },
              { val: 300, suffix: '+', label: 'Giải pháp công nghệ' },
              { val: 5000, suffix: '+', label: 'Dự án thành công' },
              { val: 100, suffix: '+', label: 'Đối tác toàn cầu' },
              { isIcon: true, icon: <ShieldCheck size={44} className="mx-auto" />, label: 'Phần mềm bản quyền' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="text-center group"
              >
                <div className="text-5xl md:text-6xl font-black text-slate-800 mb-4 tracking-tighter flex items-center justify-center h-16 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]">
                  {stat.isIcon ? stat.icon : <Counter value={stat.val!} suffix={stat.suffix!} />}
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-white/40  relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Thành tựu & Giải thưởng" 
            sub="Minh chứng cho nỗ lực không ngừng nghỉ" 
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
            {[
              { name: 'Giải thưởng Sao Khuê 2014', img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2014_1582012560.jpg' },
              { name: 'Giải thưởng Sao Khuê 2015', img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg' },
              { name: 'Cúp CNTT năm 2004', img: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378.jpg' },
              { name: 'Giải thưởng VIFOTEC', img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-vifotec_1582012769.jpg' },
              { name: 'Huân chương Lao động hạng 3', img: 'https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg' },
            ].map((award, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-2xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300"
              >
                <div className="h-28 flex items-center justify-center overflow-hidden mb-6 w-full">
                  <img src={award.img} alt={award.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-[11px] font-black text-slate-800 text-center uppercase tracking-wider group-hover:text-orange-600 transition-colors">
                  {award.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="py-12 bg-slate-50/40  text-slate-950 relative overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50/50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Hệ sinh thái Công nghệ CIC" 
            sub="Phần mềm, thiết bị, AI, BIM, Digital Twins & Tư vấn đào tạo" 
          />

          <div className="flex justify-center -mt-2 mb-8">
            <div className="w-full max-w-[280px] relative">
              <input type="text" placeholder="Tìm kiếm giải pháp..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-2.5 pl-10 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 shadow-sm transition-all rounded-md text-sm font-medium" />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* AI & Smart Tech - Large Feature */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="lg:col-span-8 group relative p-6 md:p-8 rounded-lg bg-slate-50 shadow-sm border border-slate-100 transition-all overflow-hidden cursor-pointer hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-500 transform group-hover:rotate-12 text-slate-900">
                <BIMIcon />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600 rounded-md text-[10px] font-black text-white uppercase tracking-widest mb-8">
                  <div className="w-2 h-2 bg-slate-50 rounded-full animate-pulse"></div>
                  Advanced Technology
                </div>
                <h3 className="text-3xl font-black mb-4 group-hover:text-orange-600 transition-colors">AI & Công nghệ thông minh</h3>
                <p className="text-base text-slate-500 max-w-2xl leading-relaxed mb-10">
                  Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình, kiểm soát rủi ro tức thời và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.
                </p>
                <button className="flex items-center gap-4 text-orange-600 font-black uppercase tracking-widest group/btn">
                  Trải nghiệm giải pháp <div className="w-10 h-10 bg-orange-600 text-white rounded-md flex items-center justify-center group-hover/btn:px-6 group-hover/btn:w-auto transition-all duration-300"><ArrowRight size={20} /></div>
                </button>
              </div>
            </motion.div>

            {/* BIM & Digital Twins */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="lg:col-span-4 group p-6 md:p-8 rounded-lg bg-slate-50 shadow-sm border border-slate-100 transition-all relative overflow-hidden hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 text-slate-400 transition-all">
                <BIMIcon />
              </div>
              <h3 className="text-xl font-black mb-4 group-hover:text-orange-600 transition-colors">BIM, Digital Twins & CDE</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Tư vấn, đào tạo, tạo lập và thẩm tra mô hình BIM, số hóa công trình từ thiết kế đến vận hành.
              </p>
              <div className="mt-8 h-1 w-12 bg-slate-200 group-hover:w-full group-hover:bg-orange-600 transition-all duration-500 rounded-full"></div>
            </motion.div>

            {/* Row 2 */}
            {[
              { title: 'Phần mềm kỹ thuật', desc: 'Hệ sinh thái CAD, BIM, kết cấu, hạ tầng, năng lượng do CIC phát triển & phân phối.', cols: 'lg:col-span-3' },
              { title: 'Thiết bị Khoa học', desc: 'Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR, GPR phục vụ ngành kỹ thuật.', cols: 'lg:col-span-3' },
              { title: 'Net Zero & Bền vững', desc: 'Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và lộ trình Net Zero.', cols: 'lg:col-span-3' },
              { title: 'Tư vấn & Đào tạo', desc: 'Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.', cols: 'lg:col-span-3' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                whileHover={{ y: -8 }}
                className={`${item.cols} p-6 rounded-lg bg-slate-50 border border-slate-100 shadow-sm transition-all group hover:shadow-xl hover:border-slate-200`}
              >
                <div className="h-1 w-12 bg-slate-200 mb-6 group-hover:w-full group-hover:bg-orange-600 transition-all duration-500 rounded-full"></div>
                <h3 className="text-xl font-black mb-3 group-hover:text-orange-600 transition-colors text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                <div className="h-0.5 w-8 bg-slate-200 group-hover:w-full group-hover:bg-orange-600 transition-all duration-500 rounded-full"></div>
              </motion.div>
            ))}

            {/* Solution by Industry - Full Row accent */}
            <motion.div 
              whileHover={{ scale: 0.99 }}
              className="lg:col-span-12 p-8 rounded-lg bg-orange-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50/20 rounded-lg flex items-center justify-center">
                  <Globe size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-1">Giải pháp theo ngành</h3>
                  <p className="text-white/80 font-bold">Xây dựng, Giao thông, Khai thác, Môi trường, Công nghiệp, Cơ khí...</p>
                </div>
              </div>
              <button className="px-5 py-2 bg-[#0b1b36] rounded-md font-black uppercase tracking-widest text-sm hover:px-12 transition-all btn-modern-interaction">Khám phá chi tiết</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects - Bento Grid */}
      <section id="projects" className="py-12 bg-white/40  relative overflow-hidden border-t border-slate-100 z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
             title="Dự án tiêu biểu" 
             sub="Kiến tạo hệ sinh thái giải pháp công nghệ kỹ thuật số toàn diện" 
          />
          
          {/* Project Tabs and Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'software', label: 'Phần mềm' },
                { id: 'equipment', label: 'Thiết bị' },
                { id: 'services', label: 'Dịch vụ' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProjectTab(tab.id)}
                  className={`px-8 py-2.5 rounded-none font-black text-xs uppercase tracking-widest transition-all ${
                    activeProjectTab === tab.id ? 'bg-orange-600 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-none font-medium text-sm text-slate-900 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 min-h-[600px]">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((proj, i) => (
                <motion.div 
                  key={proj.id}
                  layoutId={`project-${proj.id}`}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => setSelectedProject(proj)}
                  className={`group relative overflow-hidden rounded-none cursor-pointer shadow-2xl border border-white/10
                    ${proj.size === 'wide' ? 'md:col-span-2 lg:col-span-8' : ''}
                    ${proj.size === 'tall' ? 'md:col-span-2 lg:col-span-4 lg:row-span-2' : ''}
                    ${proj.size === 'small' ? 'md:col-span-2 lg:col-span-4' : ''}
                  `}
                >
                  {/* Static Image (Dimmed) */}
                  <img 
                    src={proj.img} 
                    alt={proj.name} 
                    className="w-full h-full object-cover transition-all duration-1000 grayscale-[40%] brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110" 
                  />
                  
                  {/* Static Overlay (Dim) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                  
                  {/* Static Title (Bottom Left) */}
                  <div className="absolute bottom-10 left-10 transition-all duration-500 group-hover:translate-x-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em]">{proj.location}</div>
                      <div className="w-1 h-1 bg-white/30 rounded-none"></div>
                      <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                        {proj.type === 'software' ? 'Phần mềm' : proj.type === 'equipment' ? 'Thiết bị' : 'Tư vấn'}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight max-w-xs">{proj.name}</h3>
                  </div>

                  {/* Hover UI (Tags) */}
                  <div className="absolute top-10 left-10 flex flex-wrap gap-2 pr-20">
                    {proj.tags.map((tag, idx) => (
                      <motion.span 
                        key={tag}
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ scale: 1.1 }}
                        animate={{ 
                          opacity: 1, // Visible on container hover via CSS? No, let's use motion more purely
                          x: 0 
                        }}
                        className="px-4 py-2.5 bg-orange-600 text-white text-[10px] font-black rounded-none uppercase tracking-widest shadow-[0_10px_20px_rgba(234,88,12,0.3)] opacity-0 transform -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                        style={{ transitionDelay: `${idx * 100}ms` }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Hover Icon (Top Right) */}
                  <div className="absolute top-10 right-10 w-12 h-12 bg-white text-orange-600 rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-500 shadow-2xl">
                    <ArrowUpRight size={24} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-4 lg:col-span-12 flex flex-col items-center justify-center py-12 text-slate-500 font-medium">
                Không tìm thấy dự án nào phù hợp với từ khóa tìm kiếm.
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <button className="px-5 py-2 bg-slate-950 text-white rounded-none font-black uppercase tracking-widest text-sm transition-all group btn-modern-interaction">
              Xem tất cả dự án <ChevronRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Project Detail Backdrop (Page Transition Simulation) */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-white p-6 md:p-20 overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="mb-12 flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
                >
                  <ChevronLeft size={24} /> Quay lại danh sách
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <motion.div layoutId={`project-${selectedProject.id}`}>
                     <img src={selectedProject.img} className="w-full rounded-none shadow-2xl" alt="" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-orange-600 text-sm font-black uppercase tracking-widest mb-4">{selectedProject.location}</div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-950 mb-8 leading-tight">{selectedProject.name}</h2>
                    <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
                       <p>Mô tả chi tiết dự án: Dự án triển khai hạ tầng số với quy mô lớn, ứng dụng các giải pháp tiên tiến nhất từ đối tác Bentley Systems và giải pháp AI do CIC phát triển.</p>
                       <div className="flex gap-4">
                         {selectedProject.tags.map((tag: string) => (
                           <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-950 font-black rounded-none uppercase text-xs tracking-widest">{tag}</span>
                         ))}
                       </div>
                    </div>
                    <button className="mt-12 px-5 py-2 bg-orange-600 text-white rounded-none font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all active:scale-95 btn-modern-interaction">
                      Tải Portfolio Dự án
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Event Section */}
      <section id="events" className="py-12 bg-slate-950/90  text-white relative overflow-hidden border-t border-white/5 z-10">
        <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Sự kiện & Hội thảo" 
            sub="Kết nối chuyên gia - Chia sẻ tri thức công nghệ" 
            dark
          />
          
          {/* Event Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[
                { id: 'upcoming', label: 'Sắp diễn ra' },
                { id: 'ongoing', label: 'Đang diễn ra' },
                { id: 'featured', label: 'Sự kiện nổi bật' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEventTab(tab.id)}
                  className={`px-6 py-2 rounded-none font-bold text-sm transition-all ${
                    activeEventTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-slate-900/40 rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5 group"
            >
              <div className="h-[400px] overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop" alt="Special Event" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-orange-600 text-white rounded-none text-xs font-black uppercase tracking-widest shadow-xl">Hot Event</div>
                {/* Logo Overlay */}
                <div className="absolute bottom-6 right-6 w-32 md:w-40 opacity-80 group-hover:opacity-100 transition-all pointer-events-none drop-shadow-2xl">
                  <img src="logo.png" alt="CIC Logo" className="w-full h-auto brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-black text-white mb-4 group-hover:text-orange-600 transition-colors">[Sự kiện tháng 4] Bentley Innovation Day 2026 tại TP. Hồ Chí Minh</h3>
                <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                  Định hình tương lai số cho hạ tầng Việt Nam. Khám phá các công nghệ quản lý tài sản, BIM và Digital Twins tiên tiến nhất từ Bentley Systems.
                </p>
                <div className="flex flex-wrap gap-8 text-slate-300 mb-8">
                  <div className="flex items-center gap-3 font-bold"><Calendar size={20} className="text-orange-600" /> Tháng 04/2026</div>
                  <div className="flex items-center gap-3 font-bold"><MapPin size={20} className="text-orange-600" /> TP. Hồ Chí Minh</div>
                </div>
                <button className="px-5 py-2 bg-orange-600 text-white rounded-none font-black uppercase tracking-wide hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all shadow-xl active:scale-95 btn-modern-interaction">
                  Đăng ký tham dự ngay
                </button>
              </div>
            </motion.div>

            <div className="lg:col-span-5 space-y-6">
              {[
                { title: 'Tư vấn Chuyển đổi số & BIM cho Doanh nghiệp', date: '20/05', loc: 'TP. Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop' },
                { title: 'Hội thảo Lộ trình Net Zero và Tín chỉ Carbon', date: '08/06', loc: 'Hà Nội', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop' },
                { title: 'Workshop: Ứng dụng AI trong Giám sát Công trình', date: '15/06', loc: 'Online (Zoom)', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' },
              ].map((ev, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                  className="flex gap-6 p-4 rounded-none border border-transparent hover:border-white/10 transition-all cursor-pointer group relative shadow-orange-600/10 hover:shadow-xl"
                >
                  <div className="w-28 h-28 rounded-none overflow-hidden shadow-inner flex-shrink-0 relative">
                    <img src={ev.img} alt="Event" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    {/* Watermark */}
                    <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-40 transition-all w-8">
                       <img src="logo.png" alt="" className="w-full invert" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-black text-white mb-2 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">{ev.title}</h4>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{ev.date} • {ev.loc}</div>
                    <div className="flex items-center gap-1 text-orange-600 text-[10px] font-black uppercase tracking-tighter">Chi tiết <ChevronRight size={12} /></div>
                  </div>
                </motion.div>
              ))}
              
              <div className="pt-12">
                <button className="w-full py-2.5 border-2 border-orange-600/20 text-orange-600 rounded-none font-bold text-sm hover:bg-orange-600 hover:text-white transition-all uppercase tracking-widest shadow-sm btn-modern-interaction">
                  Xem tất cả sự kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Perspectives Section */}
      <section id="news" className="py-12 bg-slate-50/40  border-t border-slate-100 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title="Tin tức và Góc nhìn" 
            sub="Cập nhật xu hướng công nghệ & chuyển đổi số mới nhất" 
          />

          {/* News Categories */}
          <div className="flex flex-wrap gap-3 mb-6 scrollbar-hide overflow-x-auto pb-12">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'company', label: 'Tin Công ty' },
              { id: 'specialty', label: 'Tin Chuyên ngành' },
              { id: 'promo', label: 'Tin Khuyến mại' },
              { id: 'career', label: 'Tuyển dụng' },
              { id: 'investor', label: 'Quan hệ Cổ đông' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveNewsCategory(cat.id)}
                className={`flex-shrink-0 px-6 py-2 rounded-none font-bold text-xs uppercase tracking-tighter shadow-sm border transition-all ${
                  activeNewsCategory === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-orange-600 hover:text-orange-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.length > 0 ? filteredNews.map((news, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-slate-50 rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Watermark */}
                  <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-all w-10">
                    <img src="logo.png" alt="" className="w-full invert" />
                  </div>

                  <div className="absolute top-4 left-4 px-3 py-1 bg-orange-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-lg">Tech News</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">{news.date}</div>
                  <h3 className="text-xl font-black text-slate-950 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">{news.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{news.desc}</p>
                  <div className="mt-auto">
                    <a href="#" className="inline-flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest group/link">
                      Đọc tiếp <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase tracking-widest">
                Đang cập nhật bài viết...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners & Strategic Clients Section (Relocated & Optimized to Marquee) */}
      <section className="py-20 bg-white border-t border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-8 relative z-10">
          <SectionHeader 
            title="Đối tác chiến lược" 
            sub="Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới" 
          />
        </div>
        
        <div className="relative group z-10">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap"
          >
            {[...partners, ...partners].map((partner, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 flex items-center justify-center p-6 rounded-lg bg-white border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer h-24 md:h-32 w-56 group"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-12 md:max-h-14 w-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA & Contact Section */}
      <section id="contact" className="py-12 bg-slate-50/50  overflow-hidden relative z-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600 opacity-5 blur-[150px] rounded-none translate-x-1/2 -translate-y-1/2"></div>
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
                Sẵn sàng kiến tạo <br /> <span className="text-orange-600">Tương lai số</span>
              </h2>
              <p className="text-slate-600 text-base mb-10 max-w-xl font-medium leading-relaxed">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và cung cấp những giải pháp công nghệ tối ưu nhất cho doanh nghiệp của bạn.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none bg-slate-100 flex items-center justify-center text-slate-950 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Hotline tư vấn</div>
                    <div className="text-xl text-slate-950 font-black">024 3976 1381</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none bg-slate-100 flex items-center justify-center text-slate-950 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Email liên hệ</div>
                    <div className="text-xl text-slate-950 font-black">info@cic.com.vn</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-50 rounded-none p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
            >
              <h3 className="text-2xl font-black text-slate-950 mb-8">Gửi yêu cầu tư vấn</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Họ tên</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Số điện thoại</label>
                    <input type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold" placeholder="0xxx xxx xxx" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dịch vụ quan tâm</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold appearance-none">
                    <option>Phần mềm kỹ thuật</option>
                    <option>Thiết bị & IoT</option>
                    <option>Tư vấn BIM/Digital Twins</option>
                    <option>Chuyển đổi số & Net Zero</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nội dung</label>
                  <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold resize-none" placeholder="Tôi muốn tìm hiểu về..."></textarea>
                </div>
                <button type="submit" className="w-full py-2.5 bg-orange-600 text-white rounded-none font-black uppercase tracking-widest text-xs btn-modern-interaction shadow-xl shadow-orange-600/20">
                  Gửi thông tin ngay
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-4">
              <div className="mb-8">
                <img 
                  src="logo.png" 
                  alt="CIC Logo Small" 
                  className="h-20 w-auto mb-4"
                />
              </div>
              <p className="text-white font-black text-lg mb-4 leading-tight whitespace-nowrap">
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
              <div className="flex flex-wrap gap-4 mb-8">
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
                <li><a href="#home" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Trang chủ</a></li>
                <li><a href="#solutions" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Giải pháp</a></li>
                <li><a href="#services" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Dịch vụ</a></li>
                <li><a href="#projects" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Dự án</a></li>
                <li><a href="#events" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Sự kiện</a></li>
                <li><a href="#news" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Tin tức</a></li>
                <li><a href="#contact" className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">Liên hệ</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8">Giải pháp & Dịch vụ</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="text-white/60 text-xs font-black uppercase mb-4 tracking-tighter">Giải pháp</h4>
                  <ul className="space-y-3 text-xs font-bold">
                    <li><a href="#solutions" className="hover:text-orange-600 transition-all">AI & Công nghệ thông minh</a></li>
                    <li><a href="#solutions" className="hover:text-orange-600 transition-all">BIM, Digital Twins & CDE</a></li>
                    <li><a href="#solutions" className="hover:text-orange-600 transition-all">Phần mềm kỹ thuật</a></li>
                    <li><a href="#solutions" className="hover:text-orange-600 transition-all">Thiết bị khoa học</a></li>
                    <li><a href="#solutions" className="hover:text-orange-600 transition-all">Net Zero & Bền vững</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white/60 text-xs font-black uppercase mb-4 tracking-tighter">Dịch vụ</h4>
                  <ul className="space-y-3 text-xs font-bold">
                    <li><a href="#services" className="hover:text-orange-600 transition-all">Tư vấn chuyển đổi số</a></li>
                    <li><a href="#services" className="hover:text-orange-600 transition-all">Đào tạo & Chuyển giao</a></li>
                    <li><a href="#services" className="hover:text-orange-600 transition-all">Tư vấn phát triển bền vững</a></li>
                    <li><a href="#services" className="hover:text-orange-600 transition-all">Phát triển phần mềm</a></li>
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
                  <p className="leading-relaxed">Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Thành phố Hà Nội, Việt Nam</p>
                  <div className="flex flex-col gap-2">
                    <a href="tel:02439761381" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                      <Phone size={14} className="text-orange-600" /> 024 3976 1381 - 024 3976 1381
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
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-600" /> Chi nhánh Tp HCM
                </h3>
                <div className="space-y-4 text-sm">
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

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest font-black">
            <p>© {new Date().getFullYear()} CIC TECHNOLOGY. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-all">CHÍNH SÁCH BẢO MẬT</a>
              <a href="#" className="hover:text-white transition-all">ĐIỀU KHOẢN SỬ DỤNG</a>
              <a href="#" className="hover:text-white transition-all">SƠ ĐỒ TRANG WEB</a>
            </div>
          </div>
        </div>
      </footer>    </div>
  );
}

