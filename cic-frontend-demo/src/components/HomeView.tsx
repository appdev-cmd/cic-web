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
  X
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
  const [activeProjectTab, setActiveProjectTab] = useState('software');
  const [activeNewsCategory, setActiveNewsCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  
  // Form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interestService, setInterestService] = useState('Phần mềm kỹ thuật');
  const [message, setMessage] = useState('');

  useEffect(() => {
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
            
            <p className="text-xl text-slate-300 mb-12 max-w-xl leading-relaxed font-medium">
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

        <div className="absolute bottom-16 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
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
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Hệ sinh thái Công nghệ CIC" 
            sub="Phần mềm, thiết bị, AI, BIM, Digital Twins & Tư vấn đào tạo" 
          />

          <div className="flex justify-center -mt-2 mb-8">
            <div className="w-full max-w-[280px] relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm giải pháp..." 
                onClick={() => {
                  setCurrentView('search');
                  setActiveLink('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-2.5 pl-10 focus:outline-none focus:border-orange-600 cursor-pointer shadow-sm transition-all rounded-md text-sm font-medium" 
              />
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
                setCurrentView('services');
                setActiveLink('Dịch vụ');
                setActiveServiceId('chuyen-doi-so');
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
                <p className="text-base text-slate-500 max-w-2xl leading-relaxed mb-10 font-medium">
                  Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình, kiểm soát rủi ro tức thời và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.
                </p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-xs font-black uppercase text-orange-600 tracking-wider">
                    Xem chi tiết <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* BIM Consultancy */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.01 }}
              onClick={() => {
                setCurrentView('services');
                setActiveLink('Dịch vụ');
                setActiveServiceId('tu-van-bim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="lg:col-span-4 group relative p-6 md:p-8 rounded-lg bg-slate-50 shadow-sm border border-slate-100 transition-all overflow-hidden cursor-pointer hover:shadow-xl"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <BIMIcon />
                </div>
                <h3 className="text-xl font-black mb-3 group-hover:text-orange-600 transition-colors">Tư vấn BIM & Digital Twins</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                  Chuyển giao giải pháp CDE, thiết lập mô hình quản lý thông tin công trình, hỗ trợ lập quy trình vận hành và ứng dụng công nghệ bản sao số vào đại dự án.
                </p>
                <div className="mt-auto">
                  <button className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    Tìm hiểu thêm <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Home Solutions List */}
            {homeSolutionsList.map((sol, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
                onClick={() => {
                  if (i === 0) {
                    setCurrentView('products');
                    setActiveLink('Sản phẩm');
                  } else if (i === 1) {
                    setCurrentView('products');
                    setActiveLink('Sản phẩm');
                  } else {
                    setCurrentView('services');
                    setActiveLink('Dịch vụ');
                    setActiveServiceId('dao-tao-chuyen-giao');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="lg:col-span-4 group relative p-6 md:p-8 rounded-lg bg-white shadow-sm border border-slate-100 transition-all overflow-hidden cursor-pointer hover:shadow-xl hover:border-orange-100"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  {solutionIcons[i]}
                </div>
                <h3 className="text-xl font-black mb-3 group-hover:text-orange-600 transition-colors">{sol.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                  {sol.desc}
                </p>
                <button className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                  Xem danh mục <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Bento Grid */}
      <section id="projects" className="py-20 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Dự án tiêu biểu" 
            sub="Đồng hành kiến tạo những công trình tầm cỡ" 
          />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'software', label: 'Mô phỏng & Thiết kế' },
                { id: 'equipment', label: 'Cảm biến & Thiết bị' },
                { id: 'services', label: 'Tư vấn & Chuyển giao' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveProjectTab(tab.id);
                  }}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-300 ${
                    activeProjectTab === tab.id 
                      ? 'border-orange-600 text-orange-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="w-full md:max-w-xs relative">
              <input 
                type="text" 
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                placeholder="Tìm kiếm dự án..." 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-2.5 pl-10 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 shadow-sm transition-all rounded-md text-sm font-medium" 
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {filteredProjects.map((proj, idx) => {
              const sizeClass = proj.size === 'wide' 
                ? 'lg:col-span-8' 
                : proj.size === 'tall' 
                  ? 'lg:col-span-4' 
                  : 'lg:col-span-4';
              return (
                <motion.div
                  key={proj.id}
                  layoutId={`project-card-${proj.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => setSelectedProject(proj)}
                  className={`${sizeClass} group relative aspect-[1.4] lg:aspect-auto lg:h-[350px] overflow-hidden shadow-sm border border-slate-200 cursor-pointer`}
                >
                  <img 
                    src={proj.img} 
                    alt={proj.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase mb-2">{proj.location}</span>
                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-orange-500 transition-colors leading-tight">{proj.name}</h3>
                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {proj.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 bg-white/15 text-white text-[9px] font-black uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-orange-600 text-white flex items-center justify-center rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight size={18} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              layoutId={`project-card-${selectedProject.id}`}
              className="bg-white text-slate-900 w-full max-w-2xl relative z-10 border border-slate-200 shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-900 text-white flex items-center justify-center hover:bg-orange-600 transition-colors z-20"
              >
                <X size={20} />
              </button>
              <div className="h-64 sm:h-80 overflow-hidden relative">
                <img src={selectedProject.img} alt={selectedProject.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest">{selectedProject.location}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{selectedProject.type}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-950 mb-4">{selectedProject.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  Dự án tiêu biểu do CIC cung cấp giải pháp chuyển đổi số toàn diện, tối ưu năng lực vận hành kỹ thuật và tiết kiệm tối đa tài nguyên đầu tư cho đối tác.
                </p>
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => {
                      setSelectedProject(null);
                      setCurrentView('projects');
                      setActiveLink('Dự án');
                      setActiveProjectId(selectedProject.id.toString());
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    Xem chi tiết dự án <ArrowRight size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Events Section */}
      <section id="events" className="py-20 bg-slate-50/40 relative overflow-hidden z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Sự kiện & Hội thảo" 
            sub="Kết nối tri thức - Đồng hành phát triển" 
          />

          <div className="flex justify-center mb-12">
            <div className="flex p-1 bg-slate-100 rounded-none border border-slate-200/50">
              <button 
                onClick={() => setActiveEventTab('upcoming')}
                className={`px-6 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  activeEventTab === 'upcoming' 
                    ? 'bg-orange-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Sự kiện Sắp diễn ra
              </button>
              <button 
                onClick={() => setActiveEventTab('past')}
                className={`px-6 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  activeEventTab === 'past' 
                    ? 'bg-orange-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Sự kiện Đã tổ chức
              </button>
            </div>
          </div>

          {activeEventTab === 'upcoming' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingHomeEvents.map((evt, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setCurrentView('events');
                    setActiveLink('Sự kiện');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-slate-200 p-8 flex flex-col md:flex-row gap-6 relative group hover:border-orange-600 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="w-16 h-16 bg-orange-600/10 text-orange-600 flex flex-col items-center justify-center font-black uppercase tracking-wider shrink-0 rounded-none">
                    <span className="text-2xl leading-none">{evt.date.substring(0, 2)}</span>
                    <span className="text-[10px]">Th{parseInt(evt.date.substring(3, 5))}</span>
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-lg font-black text-slate-950 group-hover:text-orange-600 transition-colors leading-snug">{evt.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Thời gian</span>
                        <span>{evt.time}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Địa điểm</span>
                        <span className="line-clamp-2">{evt.loc}</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1">
                      Đăng ký tham dự <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pastHomeEvents.map((evt, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => {
                    setCurrentView('events');
                    setActiveLink('Sự kiện');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-orange-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{evt.date}</span>
                    <h3 className="text-base font-black text-slate-950 group-hover:text-orange-600 transition-colors leading-tight">{evt.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{evt.attendees}</p>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1 mt-6">
                    Xem hình ảnh sự kiện <ChevronRight size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Tin tức và Góc nhìn" 
            sub="Cập nhật xu hướng công nghệ kỹ thuật số" 
          />

          <div className="flex justify-center gap-2 mb-12 border-b border-slate-200 pb-6 flex-wrap">
            {[
              { id: 'all', label: 'Tất cả tin tức' },
              { id: 'company', label: 'Tin tức Công ty' },
              { id: 'specialty', label: 'Tin Chuyên ngành' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveNewsCategory(cat.id)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  activeNewsCategory === cat.id 
                    ? 'border-orange-600 text-orange-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((news, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  setCurrentView('news');
                  setActiveLink('Tin tức');
                  setPreSelectedNewsCategory(news.category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-slate-200 group flex flex-col hover:border-orange-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest">
                    {news.category === 'company' ? 'Tin Công ty' : 'Chuyên ngành'}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400">{news.date}</span>
                    <h3 className="text-base font-black text-slate-950 leading-tight group-hover:text-orange-600 transition-colors min-h-[48px] flex items-start">
                      {news.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {news.desc}
                  </p>
                  <div className="flex-1"></div>
                  <button className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5 mt-2 self-start">
                    Đọc tiếp bài viết <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partners Carousel */}
      <section className="py-20 bg-slate-50/40 relative overflow-hidden border-t border-slate-200 z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Đối tác chiến lược" 
            sub="Đồng hành cùng các tập đoàn công nghệ hàng đầu thế giới" 
          />
          
          <div className="relative mt-12 w-full overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex w-max gap-12 animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="h-16 w-32 flex items-center justify-center shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & CTA Form Section */}
      <section id="contact" className="py-24 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px]">Liên hệ</p>
                <h2 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">
                  Sẵn sàng kiến tạo<br />
                  <span className="text-orange-600">Tương lai số</span> cùng CIC?
                </h2>
                <p className="text-base text-slate-500 leading-relaxed font-medium">
                  Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để nhận tài liệu chuyên sâu, brochure kỹ thuật, phiên bản dùng thử và báo giá tối ưu nhất cho doanh nghiệp của bạn.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/10 text-orange-600 flex items-center justify-center shrink-0 rounded-none">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Hotline tư vấn</div>
                    <div className="text-xl text-slate-950 font-black">024 3976 1381</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/10 text-orange-600 flex items-center justify-center shrink-0 rounded-none">
                    <Mail size={20} />
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
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">Họ tên</label>
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
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">Số điện thoại</label>
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
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">Dịch vụ quan tâm</label>
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
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">Nội dung</label>
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
    </>
  );
};
