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
  const itemsPerPage = 4; // 4 projects per page showcases pagination nicely with our 8 items

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
          <div className="space-y-16">
            
            {/* Header section */}
            <div className="border-l-4 border-orange-600 pl-6 space-y-2">
              <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tight">
                Dự Án Thực Tế
              </h1>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Minh chứng năng lực triển khai thực tế của CIC qua hàng loạt công trình trọng điểm quốc gia
              </p>
            </div>

            {/* FEATURED PROJECTS CAROUSEL (Dự án nổi bật) */}
            {featuredProjects.length > 0 && (
              <div className="bg-slate-900 text-white border-2 border-slate-800 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 left-0 bg-orange-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest z-10">
                  Dự Án Nổi Bật
                </div>

                <div className="relative h-[480px] lg:h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeaturedIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 h-full"
                    >
                      {/* Image side */}
                      <div className="lg:col-span-7 h-64 lg:h-full relative overflow-hidden">
                        <img 
                          src={featuredProjects[currentFeaturedIndex].img} 
                          alt={featuredProjects[currentFeaturedIndex].name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent"></div>
                      </div>

                      {/* Content side */}
                      <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center space-y-6 bg-slate-950">
                        <div className="space-y-3">
                          <span className="inline-block px-2.5 py-0.5 bg-orange-600/20 border border-orange-600/40 text-orange-400 text-[9px] font-sans font-black uppercase tracking-widest">
                            {featuredProjects[currentFeaturedIndex].sector}
                          </span>
                          <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                            {featuredProjects[currentFeaturedIndex].name}
                          </h2>
                          <p className="text-xs text-orange-400 font-bold italic">
                            "{featuredProjects[currentFeaturedIndex].tagline}"
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-medium">
                            {featuredProjects[currentFeaturedIndex].shortDesc}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-[10px] text-slate-400 font-sans">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-orange-500" /> {featuredProjects[currentFeaturedIndex].location}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} className="text-orange-500" /> {featuredProjects[currentFeaturedIndex].time}</span>
                          <span className="flex items-center gap-1"><User size={12} className="text-orange-500" /> {featuredProjects[currentFeaturedIndex].customer}</span>
                        </div>

                        <div>
                          <button
                            onClick={() => handleSelectProject(featuredProjects[currentFeaturedIndex].id)}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-none"
                          >
                            Khám phá chi tiết <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Manual Arrow Controls */}
                  <div className="absolute right-6 bottom-6 flex gap-1 z-20">
                    <button
                      onClick={() => setCurrentFeaturedIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)}
                      className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-orange-600 hover:bg-orange-600 flex items-center justify-center text-white transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentFeaturedIndex((prev) => (prev + 1) % featuredProjects.length)}
                      className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-orange-600 hover:bg-orange-600 flex items-center justify-center text-white transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FILTER ENGINE & SEARCH (Phần Lọc lĩnh vực; giải pháp; khách hàng) */}
            <div className="bg-white border border-slate-200 p-6 lg:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
                <Filter size={18} className="text-orange-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Bộ lọc tìm kiếm thông minh</h3>
              </div>

              {/* Grid of inputs and filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Search Bar */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nhập tên dự án, địa điểm..."
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold rounded-none"
                    />
                  </div>
                </div>

                {/* Sector (Lĩnh vực) Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lĩnh vực</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                  >
                    {sectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                  </select>
                </div>

                {/* Solution (Giải pháp) Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Giải pháp công nghệ</label>
                  <select
                    value={selectedSolution}
                    onChange={(e) => setSelectedSolution(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                  >
                    {solutions.map(sol => <option key={sol} value={sol}>{sol}</option>)}
                  </select>
                </div>

                {/* Customer (Khách hàng) Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Chủ đầu tư / Khách hàng</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                  >
                    {customers.map(cust => <option key={cust} value={cust}>{cust}</option>)}
                  </select>
                </div>

              </div>

              {/* Filter Reset & Results Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-4">
                <span className="text-xs font-bold text-slate-500 font-sans">
                  Tìm thấy <span className="text-orange-600 font-black">{totalItems}</span> kết quả phù hợp.
                </span>
                {(searchQuery || selectedSector !== 'Tất cả' || selectedSolution !== 'Tất cả' || selectedCustomer !== 'Tất cả') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSector('Tất cả');
                      setSelectedSolution('Tất cả');
                      setSelectedCustomer('Tất cả');
                    }}
                    className="px-4 py-2 border border-slate-200 hover:border-orange-600 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-[10px] font-black uppercase tracking-wider transition-all rounded-none"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            </div>

            {/* PROJECTS GRID / CARDS WITH SHORT SUMMARY */}
            {paginatedProjects.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200/80 space-y-4">
                <p className="text-slate-400 font-bold text-sm">Không có dữ liệu dự án nào phù hợp với bộ lọc hiện tại.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSector('Tất cả');
                    setSelectedSolution('Tất cả');
                    setSelectedCustomer('Tất cả');
                  }}
                  className="px-6 py-2.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all rounded-none shadow-sm"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.6 }}
                    className="bg-white border border-slate-200/80 hover:border-orange-500 group flex flex-col md:flex-row hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 rounded-none overflow-hidden"
                  >
                    {/* Left side: Image */}
                    <div className="h-48 md:h-full md:w-2/5 overflow-hidden relative min-h-[220px]">
                      <img 
                        src={project.img} 
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent"></div>
                      <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-orange-600 text-white font-sans text-[8px] font-black uppercase tracking-wider shadow-sm">
                        {project.sector}
                      </span>
                    </div>

                    {/* Right side: Content */}
                    <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-sans font-black uppercase tracking-wider text-orange-600 block">
                          {project.solution}
                        </span>
                        <h3 
                          onClick={() => handleSelectProject(project.id)}
                          className="text-sm font-black text-slate-950 leading-tight group-hover:text-orange-600 transition-colors uppercase line-clamp-2 cursor-pointer"
                        >
                          {project.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-bold italic line-clamp-1">
                          "{project.tagline}"
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-3 font-medium leading-relaxed">
                          {project.shortDesc}
                        </p>
                      </div>

                      {/* Horizontal Meta Specs */}
                      <div className="border-t border-slate-100 pt-4 flex flex-col gap-1 text-[9px] text-slate-400 font-sans">
                        <span className="flex items-center gap-1"><User size={10} className="text-orange-500" /> KH: {project.customer}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} className="text-orange-500" /> ĐĐ: {project.location}</span>
                      </div>

                      <button
                        onClick={() => handleSelectProject(project.id)}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Chi tiết dự án <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
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
                      : 'border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500'
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
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500'
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
                      : 'border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500'
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
