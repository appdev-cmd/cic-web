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
  FileCheck
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

  // Get related projects
  const relatedProjects = activeProject 
    ? projectsData.filter(p => p.id !== activeProject.id && p.sector === activeProject.sector).slice(0, 3)
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
                      className={`shrink-0 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-100/60 p-4">
                {/* Search Bar */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên dự án, chủ đầu tư, địa điểm..."
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-none"
                  />
                </div>

                {/* Solution Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedSolution}
                    onChange={(e) => setSelectedSolution(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
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
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
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
                      className="px-3 py-2 bg-slate-200 hover:bg-[#FC5115] hover:text-white text-slate-700 text-[10px] font-bold uppercase transition-colors whitespace-nowrap"
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
              <div className="text-center py-20 border border-dashed border-slate-300 space-y-4">
                <p className="text-slate-500 font-medium text-sm">Không tìm thấy dự án nào phù hợp với bộ lọc hiện tại.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSector('Tất cả');
                    setSelectedSolution('Tất cả');
                    setSelectedCustomer('Tất cả');
                  }}
                  className="px-6 py-2.5 bg-[#FC5115] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-700 transition-all rounded-none shadow-sm"
                >
                  Đặt lại tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 group/grid">
                {paginatedProjects.map((project, idx) => {
                  // Asymmetric Portfolio Grid Layout Rhythm
                  const mod = idx % 6;
                  let spanClass = 'col-span-12 md:col-span-6 h-[380px] lg:h-[440px]';
                  if (mod === 0) {
                    spanClass = 'col-span-12 h-[450px] lg:h-[520px]'; // Hero full width
                  } else if (mod === 1) {
                    spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]'; // 7 cols
                  } else if (mod === 2) {
                    spanClass = 'col-span-12 md:col-span-5 h-[380px] lg:h-[440px]'; // 5 cols
                  } else if (mod === 3) {
                    spanClass = 'col-span-12 h-[420px] lg:h-[480px]'; // Full width showcase
                  } else if (mod === 4) {
                    spanClass = 'col-span-12 md:col-span-6 h-[380px] lg:h-[440px]';
                  } else if (mod === 5) {
                    spanClass = 'col-span-12 md:col-span-6 h-[380px] lg:h-[440px]';
                  }

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.6 }}
                      onClick={() => handleSelectProject(project.id)}
                      className={`relative overflow-hidden cursor-pointer group rounded-none bg-slate-900 transition-all duration-500 group-hover/grid:opacity-50 hover:!opacity-100 ${spanClass}`}
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
                          <span className="px-2.5 py-0.5 bg-[#FC5115] text-white text-[9px] font-bold uppercase tracking-wider">
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

                      {/* 3. Full Hover Overlay - Smooth slide-up with dark backdrop blur & orange accents */}
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 lg:p-8 flex flex-col justify-end">
                        <div className="transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out space-y-3">
                          
                          {/* Accent orange horizontal line */}
                          <div className="w-8 h-0.5 bg-[#FC5115]" />

                          {/* Project Title - Refined font size and line clamping for long titles */}
                          <h3 className="text-base lg:text-xl font-bold text-white leading-snug line-clamp-2">
                            {project.name}
                          </h3>

                          {/* 1-Line Description */}
                          <p className="text-xs lg:text-sm text-slate-200 line-clamp-2 font-medium leading-relaxed max-w-3xl">
                            {project.shortDesc}
                          </p>

                          {/* Tag pills (White 15% opacity + backdrop blur) */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                              {project.sector}
                            </span>
                            <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                              {project.solution}
                            </span>
                            <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider">
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
          
          /* VIEW 2: PROJECT DETAIL VIEW */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Back Button and Path navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <button
                onClick={() => setActiveProjectId(null)}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft size={16} /> Quay lại danh sách dự án
              </button>
              <div className="text-[10px] font-bold text-slate-400 font-sans">
                DỰ ÁN / {activeProject.sector.toUpperCase()} / {activeProject.id.toUpperCase()}
              </div>
            </div>

            {/* Project Hero Title & Tagline Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest">
                  {activeProject.sector}
                </span>
                <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-slate-950 leading-tight">
                  {activeProject.name}
                </h1>
                <p className="text-sm font-bold text-orange-600 border-l-2 border-orange-500 pl-4 py-1">
                  "{activeProject.tagline}"
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activeProject.shortDesc}
                </p>
              </div>

              {/* Sidebar Project Facts Box */}
              <div className="lg:col-span-4 bg-slate-900 text-white p-6 border-l-4 border-orange-600 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2">Thông tin dự án</h3>
                
                <div className="space-y-3 text-xs font-medium">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 flex items-center gap-1.5"><User size={14} className="text-orange-500" /> Khách hàng:</span>
                    <span className="text-right font-bold text-white max-w-[200px]">{activeProject.customer}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 flex items-center gap-1.5"><MapPin size={14} className="text-orange-500" /> Địa điểm:</span>
                    <span className="text-right font-bold text-white max-w-[200px]">{activeProject.location}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={14} className="text-orange-500" /> Thời gian:</span>
                    <span className="text-right font-bold text-white">{activeProject.time}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 flex items-center gap-1.5"><Layers size={14} className="text-orange-500" /> Giải pháp:</span>
                    <span className="text-right font-bold text-orange-400">{activeProject.solution}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Scope of Work & Results achieved */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              
              {/* Left Column: Scope of Work */}
              <div className="bg-white border border-slate-200/80 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="text-orange-600" size={18} />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Phạm vi công việc thực hiện</h3>
                </div>
                <ul className="space-y-3">
                  {activeProject.scope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Results & Benefits */}
              <div className="bg-orange-50/50 border border-orange-200 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-orange-200 pb-3">
                  <FileCheck className="text-orange-600" size={18} />
                  <h3 className="text-xs font-black uppercase tracking-wider text-orange-900">Kết quả đạt được thực tế</h3>
                </div>
                <ul className="space-y-3">
                  {activeProject.results.map((result, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-bold">
                      <div className="h-5 w-5 bg-orange-600 text-white rounded-none flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                        {i + 1}
                      </div>
                      <span className="leading-tight">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Media: Gallery, Video, PDF Documents */}
            <div className="space-y-8 pt-4 border-t border-slate-200">
              
              <div className="border-l-4 border-slate-900 pl-4">
                <h3 className="text-base font-black uppercase tracking-tight text-slate-950">
                  Thư Viện Ảnh & Tài Liệu Kỹ Thuật
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* GALLERY BLOCK (9-cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hình ảnh dự án thực tế</h4>
                  
                  {/* Main Display Image */}
                  <div className="h-96 w-full border border-slate-200 bg-slate-100 overflow-hidden relative">
                    <img
                      src={activeProject.gallery[activeGalleryIndex]}
                      alt="Project detail view"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/75 text-white text-[9px] font-sans px-2 py-1 uppercase tracking-wider">
                      Hình {activeGalleryIndex + 1} / {activeProject.gallery.length}
                    </div>
                  </div>

                  {/* Thumbnail Selection Bar */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {activeProject.gallery.map((imgUrl, idx) => {
                      const isSelected = idx === activeGalleryIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`w-24 h-16 border-2 shrink-0 overflow-hidden transition-all ${
                            isSelected ? 'border-orange-600 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* VIDEO & PDF SIDE BLOCK (4-cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Video Block */}
                  {activeProject.video ? (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Video size={14} className="text-orange-600" /> Video Mô phỏng giải pháp
                      </h4>
                      <div className="bg-slate-900 border border-slate-800 relative overflow-hidden h-44 flex flex-col justify-center items-center">
                        {!isVideoPlaying ? (
                          <>
                            <img 
                              src={activeProject.video.thumbnail} 
                              alt="Video thumbnail" 
                              className="absolute inset-0 w-full h-full object-cover opacity-40"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-950/40"></div>
                            <button
                              onClick={() => setIsVideoPlaying(true)}
                              className="w-12 h-12 bg-orange-600 hover:bg-orange-700 hover:scale-105 text-white flex items-center justify-center rounded-full z-10 shadow-lg transition-all"
                            >
                              <Play size={20} className="ml-1" />
                            </button>
                            <span className="absolute bottom-3 left-3 text-[9px] font-bold text-white z-10 uppercase tracking-widest bg-slate-900/85 px-2 py-0.5">
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
                  ) : null}

                  {/* PDF Download Document Block */}
                  {activeProject.pdf ? (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tài liệu kỹ thuật / Bản vẽ PDF</h4>
                      <div className="bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
                        <div className="flex gap-3 items-start">
                          <div className="h-10 w-10 bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-slate-950 line-clamp-2">
                              {activeProject.pdf.title}
                            </h5>
                            <span className="text-[9px] font-sans text-slate-400">{activeProject.pdf.size}</span>
                          </div>
                        </div>

                        {/* Progress Bar of Download simulation */}
                        {downloadProgress > 0 && downloadProgress < 100 && (
                          <div className="w-full bg-slate-100 h-1.5 rounded-none overflow-hidden">
                            <div className="bg-orange-600 h-full transition-all" style={{ width: `${downloadProgress}%` }}></div>
                          </div>
                        )}

                        <button
                          onClick={() => handleDownloadPDF(activeProject.pdf!.title)}
                          disabled={pdfDownloaded}
                          className={`w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider transition-all border rounded-none ${
                            pdfDownloaded
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 cursor-default'
                              : 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-sm'
                          }`}
                        >
                          {pdfDownloaded ? (
                            <>Tải về thành công (Sẵn sàng)</>
                          ) : (
                            <>
                              <Download size={14} /> Tải tài liệu kỹ thuật
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : null}

                </div>

              </div>

            </div>

            {/* Technological Solutions Applied (badges with deep-link triggers) */}
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-2">
                Công nghệ & Giải pháp phần mềm áp dụng
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.appliedSolutions.map((sol, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 tracking-wide hover:border-orange-500 hover:text-orange-600 transition-colors cursor-default"
                  >
                    {sol}
                  </span>
                ))}
              </div>
            </div>

            {/* Connected Products & Services deep-link links */}
            {activeProject.relatedLinks && activeProject.relatedLinks.length > 0 && (
              <div className="bg-orange-50/30 border border-orange-500/20 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} className="text-orange-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    Liên kết sản phẩm / Dịch vụ liên quan của CIC
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProject.relatedLinks.map((link, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border border-slate-200 p-4 flex justify-between items-center group/link hover:border-orange-500 transition-all shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-sans font-black uppercase text-slate-400 tracking-wider">
                          {link.view === 'products' ? 'Sản Phẩm Phần Mềm' : 'Dịch Vụ Tư Vấn'}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 group-hover/link:text-orange-600 transition-colors">
                          {link.label}
                        </h5>
                      </div>
                      <button
                        onClick={() => {
                          if (link.view === 'products') {
                            onNavigateToProduct(Number(link.id));
                          } else {
                            onNavigateToService(String(link.id));
                          }
                        }}
                        className="p-2 border border-slate-100 group-hover/link:bg-orange-600 group-hover/link:text-white group-hover/link:border-orange-500 text-slate-500 transition-all rounded-none"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED PROJECTS */}
            {relatedProjects.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-950">
                    Các dự án liên quan cùng lĩnh vực
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj.id)}
                      className="bg-white border border-slate-200/80 hover:border-orange-500 group cursor-pointer flex flex-col hover:shadow-md transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={proj.img} alt={proj.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900/90 text-white font-sans text-[8px] font-black uppercase tracking-wider">
                          {proj.location}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[8px] font-sans font-black uppercase tracking-widest text-orange-600 block">{proj.solution}</span>
                          <h4 className="text-xs font-black uppercase text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                            {proj.name}
                          </h4>
                        </div>
                        <span className="text-[9px] text-slate-400 font-sans flex items-center gap-1 mt-2">
                          Xem chi tiết <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}

      </div>
    </div>
  );
}
