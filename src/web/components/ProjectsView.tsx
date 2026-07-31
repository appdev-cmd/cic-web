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
  Cpu,
  MessageSquare
} from 'lucide-react';
import { projectsData, DetailedProject } from '../data/projectsData';

interface ProjectsViewProps {
  key?: string | number;
  initialProjectId: string | null;
  onNavigateToService: (serviceId: string) => void;
  onNavigateToProduct: (productId: number) => void;
  onNavigateHome: () => void;
  onOpenConsultation?: () => void;
}

export function ProjectsView({ 
  initialProjectId, 
  onNavigateToService, 
  onNavigateToProduct, 
  onNavigateHome,
  onOpenConsultation
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

  const activeProject = projectsData.find(p => 
    p.id === activeProjectId ||
    (activeProjectId === '1' && p.id === 'landmark-81-bim') ||
    (activeProjectId === '2' && p.id === 'cao-toc-bac-nam-twin') ||
    (activeProjectId === '3' && p.id === 'dien-gio-mui-dinh') ||
    (activeProjectId === '4' && (p.id === 'ham-duong-bo-deo-ca-pro' || p.id === 'nha-may-thep-hoa-phat-bim'))
  );

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
              <h1 className="text-3xl md:text-4xl font-bold text-[#444] uppercase tracking-tight">
                Dự Án Thực Tế
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
                      className={`shrink-0 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-[8px] cursor-pointer ${
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
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-normal text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                  >
                    <option value="Tất cả" className="font-normal">Giải pháp: Tất cả</option>
                    {solutions.filter(s => s !== 'Tất cả').map(sol => (
                      <option key={sol} value={sol} className="font-normal">{sol}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-normal text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                  >
                    <option value="Tất cả" className="font-normal">Chủ đầu tư: Tất cả</option>
                    {customers.filter(c => c !== 'Tất cả').map(cust => (
                      <option key={cust} value={cust} className="font-normal">{cust}</option>
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
                      className="px-3 py-2 bg-slate-200 hover:bg-[#FC5115] hover:text-white text-slate-700 text-[10px] font-bold uppercase transition-colors whitespace-nowrap rounded-[8px] cursor-pointer"
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
                  className="px-6 py-2.5 bg-[#FC5115] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-700 transition-all rounded-[8px] shadow-sm cursor-pointer"
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
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isCurrent = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-all rounded-[8px] cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        ) : (
          
          /* VIEW 2: PROJECT DETAIL VIEW - CLEAN ARTICLE LAYOUT (LIKE SERVICES VIEW) */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Top Back Navigation / Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <button
                onClick={() => {
                  setActiveProjectId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-orange-600 transition-colors py-1 group cursor-pointer"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Quay lại danh sách dự án
              </button>
              
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="hover:text-orange-600 cursor-pointer" onClick={() => onNavigateHome?.()}>Trang chủ</span>
                <ChevronRight size={12} />
                <span className="hover:text-orange-600 cursor-pointer" onClick={() => setActiveProjectId(null)}>Dự án</span>
                <ChevronRight size={12} />
                <span className="text-slate-700 truncate max-w-[200px] font-semibold">{activeProject.name}</span>
              </div>
            </div>

            {/* Main Grid Layout: Left Article (8 cols) + Right Factsheet Sidebar (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Main Article Body */}
              <div className="lg:col-span-8 space-y-5 bg-white border border-slate-200/80 p-6 sm:p-10 rounded-[12px] shadow-xs">
                
                {/* Title & Tagline Header */}
                <div className="space-y-3 border-b border-slate-100 pb-4">
                  <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider rounded-md">
                    {activeProject.sector}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 uppercase tracking-tight leading-snug">
                    {activeProject.name}
                  </h1>
                  {activeProject.tagline && (
                    <p className="text-xs sm:text-sm text-slate-600 font-medium italic leading-relaxed border-l-2 border-orange-500 pl-3">
                      "{activeProject.tagline}"
                    </p>
                  )}
                </div>

                {/* Main Article Body */}
                {activeProject.htmlContent ? (
                  <div 
                    className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-950 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-img:rounded-[10px] prose-img:border prose-img:border-slate-200"
                    dangerouslySetInnerHTML={{ __html: activeProject.htmlContent }}
                  />
                ) : (
                  <>
                    {/* Main Feature Image */}
                    {activeProject.img && (
                      <div className="rounded-[10px] overflow-hidden border border-slate-200/80 bg-slate-900 aspect-video relative shadow-2xs mb-6">
                        <img 
                          src={activeProject.img} 
                          alt={activeProject.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Article Section 1: Overview & Challenges */}
                    <div className="space-y-3">
                      <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-tight pb-2 border-b border-slate-100">
                        Tổng quan & Thách thức Dự án
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {activeProject.shortDesc}
                      </p>
                    </div>

                    {/* Article Section 2: Scope & Technical Solutions */}
                    {activeProject.scope && activeProject.scope.length > 0 && (
                      <div className="space-y-3">
                        <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-tight pb-2 border-b border-slate-100">
                          Phạm vi triển khai & Giải pháp kỹ thuật
                        </h2>
                        <ul className="space-y-2.5 pt-1">
                          {activeProject.scope.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                              <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Article Section 3: Results & Achievements */}
                    {activeProject.results && activeProject.results.length > 0 && (
                      <div className="space-y-3">
                        <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-tight pb-2 border-b border-slate-100">
                          Hiệu quả & Kết quả đạt được
                        </h2>
                        <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-[10px] space-y-2.5">
                          {activeProject.results.map((result, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                              <span className="font-bold text-orange-600 shrink-0">0{idx + 1}.</span>
                              <span>{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Article Section 4: Image Gallery (If multiple images exist) */}
                    {activeProject.gallery && activeProject.gallery.length > 1 && (
                      <div className="space-y-4">
                        <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-tight pb-2 border-b border-slate-100">
                          Hình ảnh thực tế dự án
                        </h2>
                        <div className="space-y-3">
                          <div className="aspect-video w-full bg-slate-900 overflow-hidden relative rounded-[10px] border border-slate-200">
                            <img
                              src={activeProject.gallery[activeGalleryIndex]}
                              alt="Project gallery view"
                              className="w-full h-full object-cover transition-all duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                            {activeProject.gallery.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveGalleryIndex(idx)}
                                className={`w-24 h-16 border-2 shrink-0 overflow-hidden rounded-[8px] transition-all relative ${
                                  idx === activeGalleryIndex ? 'border-orange-600 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Article Section 5: Video (If available) */}
                    {activeProject.video && (
                      <div className="space-y-3">
                        <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-tight pb-2 border-b border-slate-100 flex items-center gap-2">
                          <Video size={18} className="text-orange-600" /> Video mô phỏng
                        </h2>
                        <div className="bg-slate-950 relative overflow-hidden h-60 sm:h-72 flex flex-col justify-center items-center rounded-[10px] border border-slate-800">
                          {!isVideoPlaying ? (
                            <>
                              <img 
                                src={activeProject.video.thumbnail} 
                                alt="Video thumbnail" 
                                className="absolute inset-0 w-full h-full object-cover opacity-50"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                onClick={() => setIsVideoPlaying(true)}
                                className="w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center rounded-full z-10 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                              >
                                <Play size={24} className="ml-0.5" />
                              </button>
                              <span className="absolute bottom-3 left-3 text-xs font-bold text-white z-10 uppercase bg-slate-950/80 px-2.5 py-1 rounded-md">
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

                    {/* Article Section 6: Technical PDF Download (If available) */}
                    {activeProject.pdf && (
                      <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-[10px] space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5">
                          <FileText className="text-red-600" size={18} />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Hồ sơ tài liệu kỹ thuật
                          </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900">{activeProject.pdf.title}</h4>
                            <span className="text-[11px] font-normal text-slate-500">Định dạng PDF &bull; Dung lượng: {activeProject.pdf.size}</span>
                          </div>

                          <button
                            onClick={() => handleDownloadPDF(activeProject.pdf!.title)}
                            disabled={pdfDownloaded}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 rounded-[8px] shrink-0 cursor-pointer ${
                              pdfDownloaded
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                            }`}
                          >
                            {pdfDownloaded ? (
                              <>Đã tải xuống</>
                            ) : (
                              <>
                                <Download size={13} /> Tải tài liệu
                              </>
                            )}
                          </button>
                        </div>

                        {downloadProgress > 0 && downloadProgress < 100 && (
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-orange-600 h-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

              </div>

              {/* RIGHT COLUMN: Factsheet & Sidebar */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-white border border-slate-200/80 rounded-[12px] space-y-6 shadow-xs">
                  
                  {/* Client */}
                  <div className="border-b border-slate-100 pb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Chủ đầu tư / Khách hàng</span>
                    <p className="text-sm font-bold text-slate-900">{activeProject.customer}</p>
                  </div>

                  {/* Location */}
                  <div className="border-b border-slate-100 pb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Địa điểm thực hiện</span>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 flex items-center gap-1.5">
                      <MapPin size={15} className="text-orange-600 shrink-0" />
                      {activeProject.location}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="border-b border-slate-100 pb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Thời gian triển khai</span>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 flex items-center gap-1.5">
                      <Calendar size={15} className="text-orange-600 shrink-0" />
                      {activeProject.time}
                    </p>
                  </div>

                  {/* Sector & Solution */}
                  <div className="border-b border-slate-100 pb-3.5 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Lĩnh vực & Dịch vụ</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-md text-[11px] font-bold">
                        {activeProject.sector}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        {activeProject.solution}
                      </span>
                    </div>
                  </div>

                  {/* Applied Technologies */}
                  {activeProject.appliedSolutions && activeProject.appliedSolutions.length > 0 && (
                    <div className="space-y-2 border-b border-slate-100 pb-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Công nghệ áp dụng</span>
                      <ul className="space-y-1.5">
                        {activeProject.appliedSolutions.map((tech, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <CheckCircle2 size={14} className="text-orange-600 shrink-0" />
                            <span>{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Related Links */}
                  {activeProject.relatedLinks && activeProject.relatedLinks.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Giải pháp / Sản phẩm liên quan</span>
                      <div className="space-y-1.5">
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
                            className="p-2.5 bg-slate-50 border border-slate-200/80 hover:border-orange-500 rounded-[8px] flex items-center justify-between group cursor-pointer transition-all"
                          >
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold uppercase text-orange-600 block">{link.view === 'products' ? 'Sản Phẩm' : 'Dịch Vụ'}</span>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{link.label}</p>
                            </div>
                            <ArrowRight size={13} className="text-slate-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consultation Button */}
                  <button
                    onClick={() => onOpenConsultation?.()}
                    className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-[8px] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={15} /> Yêu cầu tư vấn ngay
                  </button>

                </div>
              </aside>

            </div>

            {/* Testimonial Quote Section */}
            <section className="py-8 px-6 sm:px-10 bg-orange-50/60 border border-orange-200/80 rounded-[12px] text-center space-y-4 my-8">
              <Quote className="mx-auto text-orange-600 opacity-30" size={36} />
              <blockquote className="text-sm sm:text-base font-normal text-slate-800 italic leading-snug max-w-3xl mx-auto">
                "Sự đồng hành của CIC Technology đã mang lại hiệu quả vượt trội trong việc tối ưu hóa quy trình kỹ thuật, số hóa và quản lý chất lượng cho dự án."
              </blockquote>
              <div className="text-center space-y-0.5">
                <p className="font-bold text-xs uppercase text-slate-900 tracking-wider">Ban Quản lý Dự án</p>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{activeProject.customer}</p>
              </div>
            </section>

            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-slate-200/80">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">Dự án khác</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mt-1">Dự án tiêu biểu</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj.id)}
                      className="bg-white border border-slate-200 hover:border-orange-500 group cursor-pointer flex flex-col hover:shadow-md transition-all duration-300 rounded-[10px] overflow-hidden"
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <img src={proj.img} alt={proj.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {proj.location}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">{proj.solution}</span>
                          <h4 className="text-xs font-bold uppercase text-slate-950 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                            {proj.name}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 pt-2">
                          Xem chi tiết <ArrowRight size={12} className="transition-transform group-hover:translate-x-1 text-orange-600" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="py-12 px-6 sm:px-10 rounded-[12px] bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white text-center relative overflow-hidden shadow-md space-y-5">
              <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                  Sẵn sàng khởi đầu hành trình số hóa dự án của bạn?
                </h2>
                <p className="text-white/90 text-xs sm:text-sm font-normal leading-relaxed">
                  Hãy để đội ngũ chuyên gia CIC Technology hỗ trợ bạn tối ưu hóa thiết kế, ứng dụng mô hình BIM và chuyển đổi số quy trình quản lý hạ tầng ngay hôm nay.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenConsultation?.()}
                    className="bg-white text-orange-600 hover:bg-slate-100 px-6 py-3 rounded-[8px] font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    Yêu cầu tư vấn ngay
                  </button>
                  <button
                    onClick={() => setActiveProjectId(null)}
                    className="border border-white/60 hover:border-white text-white px-6 py-3 rounded-[8px] font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
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
