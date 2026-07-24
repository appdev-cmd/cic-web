/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Layers, 
  FileText, 
  Download, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Video,
  FileCheck,
  Quote,
  Building2,
  Sparkles,
  Cpu
} from 'lucide-react';
import { projectsData, DetailedProject } from '../data/projectsData';

interface ProjectsViewProps {
  key?: string | number;
  initialProjectId: string | null;
  onNavigateToService: (serviceId: string) => void;
  onNavigateToProduct: (productId: number) => void;
  onNavigateHome: () => void;
}

export function ProjectsView({ 
  initialProjectId, 
  onNavigateToService, 
  onNavigateToProduct, 
  onNavigateHome 
}: ProjectsViewProps) {
  
  const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProjectId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('Tất cả');
  const [selectedSolution, setSelectedSolution] = useState('Tất cả');
  const [selectedCustomer, setSelectedCustomer] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 items per page creates a rich portfolio rhythm (Hero + 2 cols + Full + 2 cols)

  // Featured projects
  const featuredProjects = projectsData.filter(p => p.featured);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  // Gallery main image state
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Video play state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Sync with initial project ID from parent
  useEffect(() => {
    setActiveProjectId(initialProjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialProjectId]);

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSector, selectedSolution, selectedCustomer]);

  // Handle featured project rotation
  useEffect(() => {
    if (activeProjectId) return; // don't rotate if viewing details
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredProjects.length, activeProjectId]);

  // Extract unique filter items
  const sectors = ['Tất cả', ...Array.from(new Set(projectsData.map(p => p.sector)))];
  const solutions = ['Tất cả', ...Array.from(new Set(projectsData.map(p => p.solution)))];
  const customers = ['Tất cả', ...Array.from(new Set(projectsData.map(p => p.customer)))];

  // Filter projects logic
  const filteredProjects = projectsData.filter((project) => {
    const matchesSector = selectedSector === 'Tất cả' || project.sector === selectedSector;
    const matchesSolution = selectedSolution === 'Tất cả' || project.solution === selectedSolution;
    const matchesCustomer = selectedCustomer === 'Tất cả' || project.customer === selectedCustomer;
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSector && matchesSolution && matchesCustomer && matchesSearch;
  });

  // Pagination calculation
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const activeProject = projectsData.find(p => p.id === activeProjectId);

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setActiveGalleryIndex(0);
    setIsVideoPlaying(false);
    setPdfDownloaded(false);
    setDownloadProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = (title: string) => {
    if (pdfDownloaded) return;
    setPdfDownloaded(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setPdfDownloaded(true);
      }
    }, 150);
  };

  // Get related projects (always 3 recommended projects)
  const relatedProjects = activeProject 
    ? [
        ...projectsData.filter(p => p.id !== activeProject.id && p.sector === activeProject.sector),
        ...projectsData.filter(p => p.id !== activeProject.id && p.sector !== activeProject.sector)
      ].slice(0, 3)
    : [];

  return (
    <div className="pt-28 pb-20 relative z-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* VIEW 1: PROJECTS LIST VIEW */}
        {!activeProject ? (
          <div className="space-y-12">
            
            {/* Header section */}
            <div className="border-l-4 border-orange-600 pl-6 space-y-2">
              <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tight">
                Dự Án Thực Tế
              </h1>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Minh chứng năng lực triển khai thực tế của CIC qua hàng loạt công trình trọng điểm quốc gia
              </p>
            </div>

            {/* SLEEK FILTER & CATEGORY TABS */}
            <div className="space-y-6 pt-2 border-t border-slate-200/80">
              {/* Sector Category Pill Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {sectors.map((sec) => {
                  const isActive = selectedSector === sec;
                  return (
                    <button
                      key={sec}
                      onClick={() => setSelectedSector(sec)}
                      className={`shrink-0 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-[8px] ${
                        isActive
                          ? 'bg-[#FC5115] text-white shadow-md'
                          : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-950'
                      }`}
                    >
                      {sec}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Filter Controls Bar (Search + Solution + Customer) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-100/60 p-4 rounded-[10px]">
                {/* Search Bar */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên dự án, chủ đầu tư, địa điểm..."
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-[8px]"
                  />
                </div>

                {/* Solution Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedSolution}
                    onChange={(e) => setSelectedSolution(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                  >
                    <option value="Tất cả">Giải pháp: Tất cả</option>
                    {solutions.filter(s => s !== 'Tất cả').map(sol => (
                      <option key={sol} value={sol}>{sol}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                  >
                    <option value="Tất cả">Chủ đầu tư: Tất cả</option>
                    {customers.filter(c => c !== 'Tất cả').map(cust => (
                      <option key={cust} value={cust}>{cust}</option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <div className="md:col-span-1 flex justify-end">
                  {(searchQuery || selectedSector !== 'Tất cả' || selectedSolution !== 'Tất cả' || selectedCustomer !== 'Tất cả') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSector('Tất cả');
                        setSelectedSolution('Tất cả');
                        setSelectedCustomer('Tất cả');
                      }}
                      className="px-3 py-2 bg-slate-200 hover:bg-[#FC5115] hover:text-white text-slate-700 text-[10px] font-bold uppercase transition-colors whitespace-nowrap rounded-[8px]"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>
              </div>

              {/* Found count indicator */}
              <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                <span>Hiển thị <strong className="text-slate-900 font-bold">{totalItems}</strong> dự án thực tế</span>
              </div>
            </div>

            {/* FULL IMAGE SHOWCASE GRID (STUDIO PORTFOLIO - ASYMMETRIC RHYTHM & HOVER OVERLAY) */}
            {paginatedProjects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-300 space-y-4 rounded-[10px]">
                <p className="text-slate-500 font-medium text-sm">Không tìm thấy dự án nào phù hợp với bộ lọc hiện tại.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSector('Tất cả');
                    setSelectedSolution('Tất cả');
                    setSelectedCustomer('Tất cả');
                  }}
                  className="px-6 py-2.5 bg-[#FC5115] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-700 transition-all rounded-[8px] shadow-sm"
                >
                  Đặt lại tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 group/grid">
                {paginatedProjects.map((project, idx) => {
                  // Asymmetric Alternating Grid Layout: 2 items per row
                  // Row 1: Big (7 cols) - Small (5 cols)
                  // Row 2: Small (5 cols) - Big (7 cols)
                  const mod = idx % 4;
                  let spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]';
                  if (mod === 0) {
                    spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]'; // Row 1: Big
                  } else if (mod === 1) {
                    spanClass = 'col-span-12 md:col-span-5 h-[380px] lg:h-[440px]'; // Row 1: Small
                  } else if (mod === 2) {
                    spanClass = 'col-span-12 md:col-span-5 h-[380px] lg:h-[440px]'; // Row 2: Small
                  } else if (mod === 3) {
                    spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]'; // Row 2: Big
                  }

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.6 }}
                      onClick={() => handleSelectProject(project.id)}
                      className={`relative overflow-hidden cursor-pointer group rounded-[10px] bg-slate-900 transition-all duration-500 group-hover/grid:opacity-50 hover:!opacity-100 ${spanClass}`}
                    >
                      {/* 1. Full Image background */}
                      <img
                        src={project.img}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                        referrerPolicy="no-referrer"
                      />

                      {/* 2. Default subtle bottom gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

                      {/* Default state title badge at bottom */}
                      <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 bg-[#FC5115] text-white text-[9px] font-bold uppercase tracking-wider rounded-[8px]">
                            {project.sector}
                          </span>
                          <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                            {project.time}
                          </span>
                        </div>
                        <h3 className="text-base lg:text-lg font-bold text-white leading-snug line-clamp-1">
                          {project.name}
                        </h3>
                      </div>

                      {/* 3. Full Hover Overlay - Smooth slide-up with dark backdrop & orange accents */}
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 lg:p-8 flex flex-col justify-end">
                        <div className="transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out space-y-3">
                          
                          {/* Accent orange horizontal line */}
                          <div className="w-8 h-0.5 bg-[#FC5115] rounded-[8px]" />

                          {/* Project Title - Refined font size and line clamping for long titles */}
                          <h3 className="text-base lg:text-xl font-bold text-white leading-snug line-clamp-2">
                            {project.name}
                          </h3>

                          {/* 1-Line Description */}
                          <p className="text-xs lg:text-sm text-slate-200 line-clamp-2 font-medium leading-relaxed max-w-3xl">
                            {project.shortDesc}
                          </p>

                          {/* Tag pills */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="px-3 py-1 bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                              {project.sector}
                            </span>
                            <span className="px-3 py-1 bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                              {project.solution}
                            </span>
                            <span className="px-3 py-1 bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                              {project.customer}
                            </span>
                          </div>

                          {/* Orange Accent CTA with arrow */}
                          <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FC5115]">
                            <span>Xem chi tiết dự án</span>
                            <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-1 px-3 py-2 bg-white border text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                    currentPage === 1
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 hover:text-[#FC5115] hover:border-[#FC5115]'
                  }`}
                >
                  <ChevronLeft size={14} /> Trước
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-bold transition-all border rounded-none ${
                          isCurrent
                            ? 'bg-[#FC5115] border-[#FC5115] text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:text-[#FC5115] hover:border-[#FC5115]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-2 bg-white border text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                    currentPage === totalPages
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 hover:text-[#FC5115] hover:border-[#FC5115]'
                  }`}
                >
                  Sau <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>
        ) : (
          
          /* VIEW 2: PROJECT DETAIL VIEW - CINEMATIC & TECH HYPER-REFINED DESIGN */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Top Back Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <button
                onClick={() => {
                  setActiveProjectId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-orange-600 transition-colors py-1 group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Quay lại danh sách dự án
              </button>
              <div className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
                <span className="text-orange-600">CIC DỰ ÁN</span> / <span>{activeProject.sector.toUpperCase()}</span> / <span className="text-slate-800">{activeProject.name.toUpperCase()}</span>
              </div>
            </div>

            {/* Hero Banner Section */}
            <section className="relative h-[60vh] min-h-[400px] max-h-[560px] rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 z-0">
                <img 
                  src={activeProject.img} 
                  alt={activeProject.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"></div>
              </div>

              <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-10 sm:pb-14 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-[6px] shadow-md">
                    {activeProject.sector}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded-[6px]">
                    {activeProject.solution}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
                  {activeProject.name}
                </h1>

                {activeProject.tagline && (
                  <p className="text-orange-300 font-normal text-sm sm:text-base max-w-3xl border-l-2 border-orange-500 pl-3 italic">
                    "{activeProject.tagline}"
                  </p>
                )}
              </div>
            </section>

            {/* Main Content Grid: Left 8 Cols (Overview, Scope, Results, Media), Right 4 Cols (Sidebar Facts) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* LEFT COLUMN */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* 1. Project Challenges & Overview */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                    Thách thức & Tổng quan Dự án
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal bg-slate-50 p-6 sm:p-8 rounded-[16px] border border-slate-200/80">
                    {activeProject.shortDesc}
                  </p>
                </div>

                {/* 2. Project Gallery & Media View */}
                <div className="space-y-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight flex items-center justify-between">
                    <span>Thư viện Ảnh & Mô hình Kỹ thuật</span>
                    <span className="text-xs text-slate-400 font-normal">Hình {activeGalleryIndex + 1} / {activeProject.gallery.length}</span>
                  </h3>

                  {/* Main Display Image */}
                  <div className="h-[360px] sm:h-[440px] w-full bg-slate-900 overflow-hidden relative rounded-[16px] border border-slate-200 shadow-md">
                    <img
                      src={activeProject.gallery[activeGalleryIndex]}
                      alt="Project gallery view"
                      className="w-full h-full object-cover transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider rounded-[8px]">
                      {activeGalleryIndex + 1} / {activeProject.gallery.length}
                    </div>
                  </div>

                  {/* Thumbnail Selector */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {activeProject.gallery.map((imgUrl, idx) => {
                      const isSelected = idx === activeGalleryIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`w-28 h-18 border-2 shrink-0 overflow-hidden transition-all rounded-[10px] relative ${
                            isSelected ? 'border-orange-600 scale-95 shadow-md ring-2 ring-orange-600/30' : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Video Showcase (If Available) */}
                {activeProject.video && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                      <Video size={20} className="text-orange-600" /> Video Mô phỏng & Trực quan hóa
                    </h3>
                    <div className="bg-slate-950 relative overflow-hidden h-64 sm:h-80 flex flex-col justify-center items-center rounded-[18px] border border-slate-800 shadow-lg">
                      {!isVideoPlaying ? (
                        <>
                          <img 
                            src={activeProject.video.thumbnail} 
                            alt="Video thumbnail" 
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-950/40"></div>
                          <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="w-16 h-16 bg-orange-600 hover:bg-orange-700 hover:scale-110 text-white flex items-center justify-center rounded-full z-10 shadow-2xl transition-all"
                          >
                            <Play size={28} className="ml-1" />
                          </button>
                          <span className="absolute bottom-4 left-4 text-xs font-bold text-white z-10 uppercase tracking-wider bg-slate-950/90 px-3 py-1 rounded-[6px]">
                            {activeProject.video.title}
                          </span>
                        </>
                      ) : (
                        <iframe
                          title="Project Video Player"
                          src={activeProject.video.embedUrl + "?autoplay=1"}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Technical Solutions & Scope of Work */}
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                    Giải pháp Kỹ thuật & Phạm vi Công việc
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeProject.scope.map((item, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-[14px] border border-slate-200/80 hover:border-orange-500/40 transition-all flex items-start gap-3.5 shadow-2xs">
                        <div className="p-2 bg-orange-600/10 text-orange-600 rounded-[8px] shrink-0 mt-0.5">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Hạng mục {i + 1}</span>
                          <p className="text-xs sm:text-sm font-normal text-slate-700 leading-snug">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Results & Impact Section (Clean White Theme) */}
                <div className="bg-white border border-slate-200/90 text-slate-950 p-8 sm:p-10 rounded-[24px] space-y-8 shadow-2xs relative overflow-hidden">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-orange-600 font-bold text-xs uppercase tracking-wider block mb-1">Hiệu quả triển khai</span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">Tác động & Kết quả đạt được</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {activeProject.results.map((result, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200/80 p-5 rounded-[16px] space-y-2 shadow-2xs hover:border-orange-500 transition-all">
                        <div className="text-3xl font-extrabold text-orange-600">0{i + 1}</div>
                        <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Technical PDF Documents Block */}
                {activeProject.pdf && (
                  <div className="bg-white border border-slate-200 p-6 rounded-[16px] space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <FileText className="text-red-600" size={20} />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Tài liệu kỹ thuật / Hồ sơ bản vẽ PDF
                      </h4>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-[12px] border border-slate-200/80">
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-900">{activeProject.pdf.title}</h5>
                        <span className="text-xs font-normal text-slate-400">Định dạng PDF &bull; Dung lượng: {activeProject.pdf.size}</span>
                      </div>

                      <button
                        onClick={() => handleDownloadPDF(activeProject.pdf!.title)}
                        disabled={pdfDownloaded}
                        className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 rounded-[8px] shrink-0 ${
                          pdfDownloaded
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                        }`}
                      >
                        {pdfDownloaded ? (
                          <>Đã tải xuống thành công</>
                        ) : (
                          <>
                            <Download size={14} /> Tải hồ sơ kỹ thuật
                          </>
                        )}
                      </button>
                    </div>

                    {downloadProgress > 0 && downloadProgress < 100 && (
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-600 h-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* RIGHT SIDEBAR: Project Facts */}
              <aside className="lg:col-span-4 space-y-8">
                <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-[24px] space-y-8 shadow-sm">
                  
                  {/* Client */}
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Khách hàng / Chủ đầu tư</span>
                    <p className="text-base font-bold text-slate-900">{activeProject.customer}</p>
                  </div>

                  {/* Location */}
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Địa điểm thực hiện</span>
                    <p className="text-sm sm:text-base font-normal text-slate-800 flex items-center gap-1.5">
                      <MapPin size={16} className="text-orange-600 shrink-0" />
                      {activeProject.location}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Thời gian triển khai</span>
                    <p className="text-sm sm:text-base font-normal text-slate-800 flex items-center gap-1.5">
                      <Calendar size={16} className="text-orange-600 shrink-0" />
                      {activeProject.time}
                    </p>
                  </div>

                  {/* Sector & Solution */}
                  <div className="border-b border-slate-100 pb-4 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Lĩnh vực & Dịch vụ</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-600/10 text-orange-600 rounded-full text-xs font-bold">
                        {activeProject.sector}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">
                        {activeProject.solution}
                      </span>
                    </div>
                  </div>

                  {/* Applied Technologies */}
                  <div className="space-y-3 border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Công nghệ & Công cụ áp dụng</span>
                    <ul className="space-y-2.5">
                      {activeProject.appliedSolutions.map((tech, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs font-normal text-slate-700">
                          <CheckCircle2 size={16} className="text-orange-600 shrink-0" />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Connected Services / Products Links */}
                  {activeProject.relatedLinks && activeProject.relatedLinks.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">GIẢI PHÁP & SẢN PHẨM LIÊN QUAN</span>
                      <div className="space-y-2">
                        {activeProject.relatedLinks.map((link, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (link.view === 'products') {
                                onNavigateToProduct(Number(link.id));
                              } else {
                                onNavigateToService(String(link.id));
                              }
                            }}
                            className="p-3 bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-[10px] flex items-center justify-between group cursor-pointer transition-all"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold uppercase text-orange-600 block">{link.view === 'products' ? 'Sản Phẩm Phần Mềm' : 'Dịch Vụ Tư Vấn'}</span>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{link.label}</p>
                            </div>
                            <ArrowRight size={14} className="text-slate-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </aside>

            </section>

            {/* Testimonial Quote Section */}
            <section className="py-12 bg-orange-50/60 border border-orange-200/80 rounded-[24px] text-center space-y-6 max-w-5xl mx-auto px-6 sm:px-12 my-12">
              <Quote className="mx-auto text-orange-600 opacity-40" size={48} />
              <blockquote className="text-lg sm:text-xl font-normal text-slate-800 italic leading-snug">
                "Sự đồng hành của CIC Technology đã mang lại hiệu quả vượt trội trong việc tối ưu hóa quy trình kỹ thuật, số hóa và quản lý chất lượng cho dự án."
              </blockquote>
              <div className="text-center space-y-0.5">
                <p className="font-bold text-xs uppercase text-slate-900 tracking-wider">Ban Quản lý Dự án</p>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{activeProject.customer}</p>
              </div>
            </section>

            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
              <section className="space-y-8 pt-8 border-t border-slate-200">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">Dự án khác</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-1">Dự án tiêu biểu</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj.id)}
                      className="bg-white border border-slate-200 hover:border-orange-500 group cursor-pointer flex flex-col hover:shadow-lg transition-all duration-300 rounded-[14px] overflow-hidden"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img src={proj.img} alt={proj.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-[6px]">
                          {proj.location}
                        </span>
                      </div>
                      <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">{proj.solution}</span>
                          <h4 className="text-sm font-bold uppercase text-slate-950 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                            {proj.name}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pt-2">
                          Xem chi tiết <ArrowRight size={12} className="transition-transform group-hover:translate-x-1 text-orange-600" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="py-16 px-8 sm:px-12 rounded-[28px] bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white text-center relative overflow-hidden shadow-xl space-y-6">
              <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Sẵn sàng khởi đầu hành trình số hóa dự án của bạn?
                </h2>
                <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed">
                  Hãy để đội ngũ chuyên gia CIC Technology hỗ trợ bạn tối ưu hóa thiết kế, ứng dụng mô hình BIM và chuyển đổi số quy trình quản lý hạ tầng ngay hôm nay.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <button
                    onClick={() => onNavigateToService('1')}
                    className="bg-white text-orange-600 hover:bg-slate-100 px-8 py-3.5 rounded-[12px] font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105"
                  >
                    Yêu cầu tư vấn ngay
                  </button>
                  <button
                    onClick={() => setActiveProjectId(null)}
                    className="border-2 border-white/60 hover:border-white text-white px-8 py-3.5 rounded-[12px] font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    Khám phá tất cả dự án
                  </button>
                </div>
              </div>
            </section>

          </motion.div>
        )}

      </div>
    </div>
  );
}
