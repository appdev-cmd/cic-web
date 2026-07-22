/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Play, 
  Phone, 
  Mail, 
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Download,
  ShieldCheck,
  Cpu,
  Layers,
  Users,
  Bell,
  Search,
  X,
  Calendar,
  MapPin,
  Globe,
  Award,
  Menu,
  User,
  Building,
  Briefcase,
  Send,
  CheckCircle,
  Check
} from 'lucide-react';

import { Counter } from './shared/Counter';
import { BIMIcon } from './shared/Icons';

// Import mock data
import { 
  heroSlides, 
  projects, 
  newsItems, 
  partners, 
  marqueeTexts 
} from '../data/mockData';

import {
  upcomingHomeEvents,
  pastHomeEvents,
  homeStats,
  homeAwards,
  homeSolutionsList
} from '../data/homeData';

import { Project } from '../types';

interface HomeViewProps {
  setCurrentView: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search') => void;
  setActiveLink: (link: string) => void;
  setActiveServiceId: (id: string | null) => void;
  setActiveProjectId: (id: string | null) => void;
  setPreSelectedNewsCategory: (category: string | null) => void;
  setAboutSubTab: (tab: 'overview' | 'structure' | 'experience') => void;
}

export const HomeView = ({
  setCurrentView,
  setActiveLink,
  setActiveServiceId,
  setActiveProjectId,
  setPreSelectedNewsCategory,
  setAboutSubTab
}: HomeViewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeEventTab, setActiveEventTab] = useState('upcoming');
  const [activeProjectTab, setActiveProjectTab] = useState('all');
  const [activeNewsCategory, setActiveNewsCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  
  // Contact form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interestService, setInterestService] = useState('Phần mềm kỹ thuật');
  const [message, setMessage] = useState('');

  // Event registration modal states
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerEvent, setRegisterEvent] = useState<{ id: string; title: string; date: string; location: string } | null>(null);
  const [eventFormData, setEventFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    attendeesCount: 1,
    note: '',
    consent: false
  });
  const [eventFormErrors, setEventFormErrors] = useState<Record<string, string>>({});
  const [isEventSubmitting, setIsEventSubmitting] = useState(false);
  const [eventRegistrationResult, setEventRegistrationResult] = useState<{
    eventId: string;
    eventTitle: string;
    fullName: string;
    company: string;
    position: string;
    email: string;
    phone: string;
    attendeesCount: number;
    registeredAt: string;
  } | null>(null);

  const validateEventForm = () => {
    const errors: Record<string, string> = {};
    if (!eventFormData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!eventFormData.company.trim()) errors.company = 'Vui lòng nhập tên đơn vị/công ty';
    if (!eventFormData.position.trim()) errors.position = 'Vui lòng nhập chức vụ của bạn';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!eventFormData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(eventFormData.email)) {
      errors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
    if (!eventFormData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(eventFormData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (10 số)';
    }

    if (eventFormData.attendeesCount < 1) errors.attendeesCount = 'Số lượng tối thiểu là 1';
    if (!eventFormData.consent) errors.consent = 'Bạn cần đồng ý với chính sách của chúng tôi';

    setEventFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEventRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateEventForm() || !registerEvent) return;

    setIsEventSubmitting(true);

    setTimeout(() => {
      setEventRegistrationResult({
        eventId: registerEvent.id,
        eventTitle: registerEvent.title,
        fullName: eventFormData.fullName,
        company: eventFormData.company,
        position: eventFormData.position,
        email: eventFormData.email,
        phone: eventFormData.phone,
        attendeesCount: eventFormData.attendeesCount,
        registeredAt: new Date().toISOString()
      });
      setIsEventSubmitting(false);
      setEventFormData({
        fullName: '',
        phone: '',
        email: '',
        company: '',
        position: '',
        attendeesCount: 1,
        note: '',
        consent: false
      });
      setEventFormErrors({});
    }, 1200);
  };

  useEffect(() => {
    // Preload hero slide images for instant loading
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const SectionHeader = ({ title, sub, dark }: { title: string; sub: string; dark?: boolean }) => (
    <div className="text-center mb-6">
      <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </h2>
      <div className="w-16 h-1 bg-orange-600 mx-auto mt-2 mb-4"></div>
      <p className={`font-bold uppercase tracking-widest text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        {sub}
      </p>
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

  const filteredNews = newsItems.filter(n => activeNewsCategory === 'all' || n.category === activeNewsCategory);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && phoneNumber.trim()) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFullName('');
        setPhoneNumber('');
        setMessage('');
      }, 5000);
    }
  };

  const solutionIcons = [
    <Cpu size={24} className="transition-all duration-300" />,
    <Layers size={24} className="transition-all duration-300" />,
    <Users size={24} className="transition-all duration-300" />
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] xl:h-[660px] flex items-center overflow-hidden bg-slate-950 z-10">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              src={heroSlides[currentSlide].img} 
              alt="Slide" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover animate-none"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 via-60% to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10 w-full mb-4">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-none mb-5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-none bg-orange-600 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Leading Innovation since 1990
              </span>
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-7xl font-black text-white leading-[1.1] mb-4 tracking-tighter"
              dangerouslySetInnerHTML={{ __html: heroSlides[currentSlide].title }}
            />
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed font-medium">
              {heroSlides[currentSlide].sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => {
                  setCurrentView('products');
                  setActiveLink('Sản phẩm');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2 bg-orange-600 text-white rounded-none font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_20px_50px_rgba(234,88,12,0.3)] border-2 border-orange-600 btn-modern-interaction flex items-center justify-center gap-3"
              >
                Khám phá giải pháp <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => window.open('https://www.youtube.com/watch?v=Eeh4Y-PLptY&t=8s', '_blank')}
                className="px-5 py-2 bg-white/5 text-white rounded-none font-black text-sm uppercase tracking-widest transition-all hover:bg-white/10 border-2 border-white/10 flex items-center justify-center gap-3 btn-modern-interaction"
              >
                <Play size={20} fill="currentColor" /> Về chúng tôi
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-40">
          {heroSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-none transition-all duration-300 ${i === currentSlide ? 'w-10 bg-orange-600' : 'w-4 bg-white/20 hover:bg-white/40'}`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Headline Ticker */}
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
                {marqueeTexts.join(" • ")}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section (Hơn 35 năm đồng hành) */}
      <section id="about" className="py-20 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
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
                <button 
                  onClick={() => {
                    setCurrentView('about');
                    setActiveLink('Giới thiệu');
                    setAboutSubTab('overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2 bg-orange-600 text-white rounded-none font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg border-2 border-orange-600 btn-modern-interaction flex items-center gap-2"
                >
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
            {homeStats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="text-center group"
              >
                <div className="text-5xl md:text-6xl font-black text-slate-800 mb-4 tracking-tighter flex items-center justify-center h-16 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500">
                  {stat.isIcon ? (
                    <ShieldCheck size={44} className="mx-auto text-orange-600" />
                  ) : (
                    <Counter value={stat.val!} suffix={stat.suffix!} />
                  )}
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Thành tựu & Giải thưởng" 
            sub="Minh chứng cho nỗ lực không ngừng nghỉ" 
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
            {homeAwards.map((award, i) => (
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

      {/* Ecosystem Section */}
      <section id="solutions" className="py-12 bg-slate-50/40 text-slate-950 relative overflow-hidden z-10">
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
              onClick={() => {
                setCurrentView('products');
                setActiveLink('Sản phẩm');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
              onClick={() => {
                setCurrentView('services');
                setActiveLink('Dịch vụ');
                if (setActiveServiceId) setActiveServiceId('tu-van-bim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="lg:col-span-4 group p-6 md:p-8 rounded-lg bg-slate-50 shadow-sm border border-slate-100 transition-all relative overflow-hidden hover:shadow-xl cursor-pointer"
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
              { title: 'Phần mềm kỹ thuật', desc: 'Hệ sinh thái CAD, BIM, kết cấu, hạ tầng, năng lượng do CIC phát triển & phân phối.', cols: 'lg:col-span-3', view: 'products', link: 'Sản phẩm' },
              { title: 'Thiết bị Khoa học', desc: 'Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR, GPR phục vụ ngành kỹ thuật.', cols: 'lg:col-span-3', view: 'products', link: 'Sản phẩm' },
              { title: 'Net Zero & Bền vững', desc: 'Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và lộ trình Net Zero.', cols: 'lg:col-span-3', view: 'services', link: 'Dịch vụ', serviceId: 'tu-van-chuyen-doi-so' },
              { title: 'Tư vấn & Đào tạo', desc: 'Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.', cols: 'lg:col-span-3', view: 'services', link: 'Dịch vụ', serviceId: 'dao-tao-chuyen-giao' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                whileHover={{ y: -8 }}
                onClick={() => {
                  if (item.view === 'products') {
                    setCurrentView('products');
                    setActiveLink('Sản phẩm');
                  } else if (item.view === 'services') {
                    setCurrentView('services');
                    setActiveLink('Dịch vụ');
                    if (item.serviceId && setActiveServiceId) setActiveServiceId(item.serviceId);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`${item.cols} p-6 rounded-lg bg-slate-50 border border-slate-100 shadow-sm transition-all group hover:shadow-xl hover:border-slate-200 cursor-pointer`}
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
              onClick={() => {
                setCurrentView('products');
                setActiveLink('Sản phẩm');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
      <section id="projects" className="py-12 bg-white/40 relative overflow-hidden border-t border-slate-100 z-10">
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
                          opacity: 1,
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
            <button 
              onClick={() => {
                setCurrentView('projects');
                setActiveLink('Dự án');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2 bg-slate-950 text-white rounded-none font-black uppercase tracking-widest text-sm transition-all group btn-modern-interaction"
            >
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
              className="fixed inset-0 z-[200] bg-white p-6 md:p-20 overflow-y-auto custom-scrollbar"
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
      {/* Events Section */}
      <section id="events" className="py-12 bg-slate-950/90 text-white relative overflow-hidden border-t border-white/5 z-10">
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
                  <img src="https://lh3.googleusercontent.com/d/1jNJvhVJuYdvse4GRtrrEAF8ZwB_WBEXE" alt="CIC Logo" referrerPolicy="no-referrer" className="w-full h-auto brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity" />
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
                <button 
                  onClick={() => {
                    setRegisterEvent({
                      id: 'bentley-day-2026',
                      title: '[Sự kiện tháng 4] Bentley Innovation Day 2026 tại TP. Hồ Chí Minh',
                      date: 'Tháng 04/2026',
                      location: 'TP. Hồ Chí Minh'
                    });
                    setShowRegisterForm(true);
                    setEventRegistrationResult(null);
                  }}
                  className="px-5 py-2 bg-orange-600 text-white rounded-none font-black uppercase tracking-wide hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all shadow-xl active:scale-95 btn-modern-interaction"
                >
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
                  onClick={() => {
                    setCurrentView('events');
                    setActiveLink('Sự kiện');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex gap-6 p-4 rounded-none border border-transparent hover:border-white/10 transition-all cursor-pointer group relative shadow-orange-600/10 hover:shadow-xl text-left"
                >
                  <div className="w-28 h-28 rounded-none overflow-hidden shadow-inner flex-shrink-0 relative">
                    <img src={ev.img} alt="Event" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    {/* Watermark */}
                    <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-40 transition-all w-8">
                       <img src="https://lh3.googleusercontent.com/d/1jNJvhVJuYdvse4GRtrrEAF8ZwB_WBEXE" alt="" referrerPolicy="no-referrer" className="w-full invert" />
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
                <button 
                  onClick={() => {
                    setCurrentView('events');
                    setActiveLink('Sự kiện');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 border-2 border-orange-600/20 text-orange-600 rounded-none font-bold text-sm hover:bg-orange-600 hover:text-white transition-all uppercase tracking-widest shadow-sm btn-modern-interaction"
                >
                  Xem tất cả sự kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Perspectives Section */}
      <section id="news" className="py-12 bg-slate-50/40 border-t border-slate-100 z-10 relative">
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
                onClick={() => {
                  setCurrentView('news');
                  setActiveLink('Tin tức');
                  setPreSelectedNewsCategory(news.category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-slate-50 rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Watermark */}
                  <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-all w-10">
                    <img src="https://lh3.googleusercontent.com/d/1jNJvhVJuYdvse4GRtrrEAF8ZwB_WBEXE" alt="" referrerPolicy="no-referrer" className="w-full invert" />
                  </div>

                  <div className="absolute top-4 left-4 px-3 py-1 bg-orange-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {news.category === 'company' ? 'Tin Công ty' : news.category === 'promo' ? 'Khuyến mại' : news.category === 'career' ? 'Tuyển dụng' : news.category === 'investor' ? 'Cổ đông' : 'Tech News'}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">{news.date}</div>
                  <h3 className="text-xl font-black text-slate-950 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">{news.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{news.desc}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest group/link">
                      Đọc tiếp <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </span>
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
      <section className="py-10 bg-white/40 border-t border-slate-100 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-6 relative z-10">
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
            className="flex gap-6 whitespace-nowrap"
          >
            {[...partners, ...partners].map((partner, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 flex items-center justify-center p-4 md:p-6 rounded-lg bg-white border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer h-20 md:h-24 w-44 md:w-48 group"
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
      <section id="contact" className="py-12 bg-slate-50/50 overflow-hidden relative z-10">
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
              className="bg-slate-50 rounded-none p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative"
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
                      className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold" 
                      placeholder="Nguyễn Văn A" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Số điện thoại</label>
                    <input 
                      type="tel" 
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold" 
                      placeholder="0xxx xxx xxx" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dịch vụ quan tâm</label>
                  <select 
                    value={interestService}
                    onChange={(e) => setInterestService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold appearance-none"
                  >
                    <option>Phần mềm kỹ thuật</option>
                    <option>Thiết bị & IoT</option>
                    <option>Tư vấn BIM/Digital Twins</option>
                    <option>Chuyển đổi số & Net Zero</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nội dung</label>
                  <textarea 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold resize-none" 
                    placeholder="Tôi muốn tìm hiểu về..."
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-orange-600 text-white rounded-none font-black uppercase tracking-widest text-xs btn-modern-interaction shadow-xl shadow-orange-600/20">
                  Gửi thông tin ngay
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Event Registration Modal */}
      <AnimatePresence>
        {showRegisterForm && registerEvent && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div 
              onClick={() => {
                setShowRegisterForm(false);
                setEventRegistrationResult(null);
              }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[-1]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-950 shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col my-4 md:my-8"
            >
              
              {/* Modal header */}
              <div className="bg-slate-950 text-white px-6 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">Đăng ký tham dự sự kiện</h3>
                </div>
                <button
                  onClick={() => {
                    setShowRegisterForm(false);
                    setEventRegistrationResult(null);
                  }}
                  className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 text-white transition-all font-bold"
                >
                  X
                </button>
              </div>

              {/* Modal content body */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[88vh] space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-orange-600/40 [&::-webkit-scrollbar-track]:bg-slate-100">
                
                {/* Event summary banner inside form */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex gap-4 items-center">
                  <Calendar className="text-orange-600 shrink-0" size={22} />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-sans">Sự kiện lựa chọn:</h4>
                    <span className="font-black text-slate-950 text-xs sm:text-sm block leading-snug">{registerEvent.title}</span>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium font-sans">{registerEvent.date} — {registerEvent.location}</span>
                  </div>
                </div>

                {!eventRegistrationResult ? (
                  
                  // --- THE REGISTER FORM INPUTS ---
                  <form onSubmit={handleEventRegisterSubmit} className="space-y-4 sm:space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <User size={14} className="text-orange-600" /> Họ và tên <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Nguyễn Văn A"
                          value={eventFormData.fullName}
                          onChange={(e) => setEventFormData({ ...eventFormData, fullName: e.target.value })}
                          className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            eventFormErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {eventFormErrors.fullName && <p className="text-[10px] font-bold text-red-500 font-sans">{eventFormErrors.fullName}</p>}
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Phone size={14} className="text-orange-600" /> Số điện thoại <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Ví dụ: 0912345678"
                          value={eventFormData.phone}
                          onChange={(e) => setEventFormData({ ...eventFormData, phone: e.target.value })}
                          className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            eventFormErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {eventFormErrors.phone && <p className="text-[10px] font-bold text-red-500 font-sans">{eventFormErrors.phone}</p>}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Mail size={14} className="text-orange-600" /> Địa chỉ Email <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Ví dụ: email@domain.com"
                          value={eventFormData.email}
                          onChange={(e) => setEventFormData({ ...eventFormData, email: e.target.value })}
                          className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            eventFormErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {eventFormErrors.email && <p className="text-[10px] font-bold text-red-500 font-sans">{eventFormErrors.email}</p>}
                      </div>

                      {/* Company input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Building size={14} className="text-orange-600" /> Đơn vị công tác <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Công ty TNHH Xây Dựng ABC"
                          value={eventFormData.company}
                          onChange={(e) => setEventFormData({ ...eventFormData, company: e.target.value })}
                          className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            eventFormErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {eventFormErrors.company && <p className="text-[10px] font-bold text-red-500 font-sans">{eventFormErrors.company}</p>}
                      </div>

                      {/* Position input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-orange-600" /> Chức vụ <span className="text-orange-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Kỹ sư kết cấu, Trưởng phòng Kỹ thuật"
                          value={eventFormData.position}
                          onChange={(e) => setEventFormData({ ...eventFormData, position: e.target.value })}
                          className={`w-full p-2.5 bg-slate-50 border text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 ${
                            eventFormErrors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-600 focus:border-orange-600'
                          }`}
                        />
                        {eventFormErrors.position && <p className="text-[10px] font-bold text-red-500 font-sans">{eventFormErrors.position}</p>}
                      </div>

                      {/* Number of attendees */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Users size={14} className="text-orange-600" /> Số người tham dự <span className="text-orange-600">*</span>
                        </label>
                        <select
                          value={eventFormData.attendeesCount}
                          onChange={(e) => setEventFormData({ ...eventFormData, attendeesCount: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
                        >
                          {[1, 2, 3, 4, 5, 10].map((num) => (
                            <option key={num} value={num}>{num} người</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Note text field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        Ghi chú thêm (Câu hỏi cho diễn giả, yêu cầu đặc biệt)
                      </label>
                      <textarea
                        placeholder="Nhập ghi chú hoặc câu hỏi của bạn tại đây..."
                        rows={3}
                        value={eventFormData.note}
                        onChange={(e) => setEventFormData({ ...eventFormData, note: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
                      />
                    </div>

                    {/* Consent checkbox */}
                    <div className="space-y-2 pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={eventFormData.consent}
                          onChange={(e) => setEventFormData({ ...eventFormData, consent: e.target.checked })}
                          className="mt-0.5 border-slate-300 text-orange-600 focus:ring-orange-500 focus:ring-0 w-4 h-4"
                        />
                        <span className="text-xs font-medium text-slate-500 leading-normal">
                          Tôi đồng ý cung cấp thông tin phục vụ công tác tổ chức sự kiện và nhận các tài liệu công nghệ, giải pháp hữu ích từ CIC Tech qua các kênh Email/SMS. <span className="text-orange-600">*</span>
                        </span>
                      </label>
                      {eventFormErrors.consent && <p className="text-[10px] font-bold text-red-500 font-sans pl-6">{eventFormErrors.consent}</p>}
                    </div>

                    {/* CTA Submit Button */}
                    <button
                      type="submit"
                      disabled={isEventSubmitting}
                      className="w-full bg-slate-950 hover:bg-orange-600 text-white hover:text-white py-3.5 text-xs font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
                    >
                      {isEventSubmitting ? (
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

                  </form>
                ) : (
                  
                  // --- REGISTRATION SUCCESS SCREEN ---
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-6"
                  >
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-none mx-auto">
                      <CheckCircle className="text-emerald-500" size={32} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-black uppercase text-slate-950">Đăng ký tham dự thành công!</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Cảm ơn quý khách <strong className="text-slate-800">{eventRegistrationResult.fullName}</strong>. Mã vé điện tử của bạn đã được khởi tạo và ghi nhận trong hệ thống.
                      </p>
                    </div>

                    {/* MOCK SMTP EMAIL NOTIFICATION BOX */}
                    <div className="bg-emerald-50 border border-emerald-200/60 p-4 max-w-md mx-auto text-left space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs font-sans uppercase">
                        <Check size={16} className="bg-emerald-600 text-white rounded-full p-0.5" />
                        <span>Mô phỏng Email xác nhận đã gửi</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        Hệ thống tự động đã gửi email hướng dẫn tham dự cùng mã QR check-in tới địa chỉ: <strong className="text-slate-900">{eventRegistrationResult.email}</strong>. Vui lòng kiểm tra hòm thư chính hoặc mục quảng cáo/spam của bạn.
                      </p>
                    </div>

                    {/* REGISTRATION ID DETAILS */}
                    <div className="bg-slate-50 border border-slate-200 p-6 max-w-md mx-auto text-left font-sans space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thông tin vé điện tử</h4>
                      <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                        <span className="text-slate-400">Mã đăng ký:</span>
                        <strong className="text-slate-900 text-right">CIC-{eventRegistrationResult.eventId.toUpperCase().slice(0, 5)}-{Math.floor(1000 + Math.random() * 9000)}</strong>
                        
                        <span className="text-slate-400">Họ tên:</span>
                        <span className="text-slate-800 text-right">{eventRegistrationResult.fullName}</span>
                        
                        <span className="text-slate-400">Đơn vị:</span>
                        <span className="text-slate-800 text-right truncate max-w-[180px]">{eventRegistrationResult.company}</span>

                        <span className="text-slate-400">Số lượng:</span>
                        <span className="text-slate-800 text-right">{eventRegistrationResult.attendeesCount} người</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowRegisterForm(false);
                        setEventRegistrationResult(null);
                      }}
                      className="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3 text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Đóng cửa sổ
                    </button>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
