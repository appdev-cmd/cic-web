'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { ProjectListItemViewModel } from '@/features/projects/types';

interface ProjectsRuntimeViewProps {
  projects: ProjectListItemViewModel[];
  onSelectProject?: (id: string) => void;
}

export function ProjectsRuntimeView({ projects, onSelectProject }: ProjectsRuntimeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('Tất cả');
  const [selectedSolution, setSelectedSolution] = useState('Tất cả');
  const [selectedCustomer, setSelectedCustomer] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSector, selectedSolution, selectedCustomer]);

  // Extract unique filter items
  const sectors = useMemo(
    () => ['Tất cả', ...(Array.from(new Set(projects.map((p) => p.sector).filter(Boolean))) as string[])],
    [projects]
  );
  const solutions = useMemo(
    () => ['Tất cả', ...(Array.from(new Set(projects.map((p) => p.solution).filter(Boolean))) as string[])],
    [projects]
  );
  const customers = useMemo(
    () => ['Tất cả', ...(Array.from(new Set(projects.map((p) => p.customerName).filter(Boolean))) as string[])],
    [projects]
  );

  // Filter projects logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSector = selectedSector === 'Tất cả' || project.sector === selectedSector;
      const matchesSolution = selectedSolution === 'Tất cả' || project.solution === selectedSolution;
      const matchesCustomer = selectedCustomer === 'Tất cả' || project.customerName === selectedCustomer;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        (project.tagline && project.tagline.toLowerCase().includes(query)) ||
        (project.summary && project.summary.toLowerCase().includes(query)) ||
        (project.location && project.location.toLowerCase().includes(query));

      return matchesSector && matchesSolution && matchesCustomer && matchesSearch;
    });
  }, [projects, selectedSector, selectedSolution, selectedCustomer, searchQuery]);

  // Pagination calculation
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('Tất cả');
    setSelectedSolution('Tất cả');
    setSelectedCustomer('Tất cả');
  };

  return (
    <div className="pt-28 pb-20 relative z-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
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
              <div className="md:col-span-5 relative flex items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Search className="text-slate-400" size={15} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên dự án, chủ đầu tư, địa điểm..."
                  className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-[8px]"
                />
              </div>

              {/* Solution Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedSolution}
                  onChange={(e) => setSelectedSolution(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 px-3 py-2 text-xs font-normal text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                >
                  <option value="Tất cả" className="font-normal">
                    Giải pháp: Tất cả
                  </option>
                  {solutions
                    .filter((s) => s !== 'Tất cả')
                    .map((sol) => (
                      <option key={sol} value={sol} className="font-normal">
                        {sol}
                      </option>
                    ))}
                </select>
              </div>

              {/* Customer Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 px-3 py-2 text-xs font-normal text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                >
                  <option value="Tất cả" className="font-normal">
                    Chủ đầu tư: Tất cả
                  </option>
                  {customers
                    .filter((c) => c !== 'Tất cả')
                    .map((cust) => (
                      <option key={cust} value={cust} className="font-normal">
                        {cust}
                      </option>
                    ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div className="md:col-span-1 flex justify-end">
                {(searchQuery || selectedSector !== 'Tất cả' || selectedSolution !== 'Tất cả' || selectedCustomer !== 'Tất cả') && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-slate-200 hover:bg-[#FC5115] hover:text-white text-slate-700 text-[10px] font-bold uppercase transition-colors whitespace-nowrap rounded-[8px] cursor-pointer"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
            </div>

            {/* Found count indicator */}
            <div className="flex justify-between items-center text-xs font-medium text-slate-500">
              <span>
                Hiển thị <strong className="text-slate-900 font-bold">{totalItems}</strong> dự án thực tế
              </span>
            </div>
          </div>

          {/* FULL IMAGE SHOWCASE GRID */}
          {paginatedProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-300 space-y-4 rounded-[10px]">
              <p className="text-slate-500 font-medium text-sm">
                Không tìm thấy dự án nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#FC5115] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-700 transition-all rounded-[8px] shadow-sm cursor-pointer"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 group/grid">
              {paginatedProjects.map((project, idx) => {
                const mod = idx % 4;
                let spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]';
                if (mod === 0) {
                  spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]';
                } else if (mod === 1) {
                  spanClass = 'col-span-12 md:col-span-5 h-[380px] lg:h-[440px]';
                } else if (mod === 2) {
                  spanClass = 'col-span-12 md:col-span-5 h-[380px] lg:h-[440px]';
                } else if (mod === 3) {
                  spanClass = 'col-span-12 md:col-span-7 h-[380px] lg:h-[440px]';
                }

                const cardContent = (
                  <>
                    {/* 1. Full Image background */}
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800" />
                    )}

                    {/* 2. Default subtle bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

                    {/* Default state title badge at bottom */}
                    <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        {project.sector && (
                          <span className="px-2.5 py-0.5 bg-[#FC5115] text-white text-[9px] font-bold uppercase tracking-wider rounded-[8px]">
                            {project.sector}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                          {project.timeDisplay}
                        </span>
                      </div>
                      <h3 className="text-base lg:text-lg font-bold text-white leading-snug line-clamp-1">
                        {project.title}
                      </h3>
                    </div>

                    {/* 3. Full Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 lg:p-8 flex flex-col justify-end">
                      <div className="transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out space-y-3">
                        <div className="w-8 h-0.5 bg-[#FC5115] rounded-[8px]" />

                        <h3 className="text-base lg:text-xl font-bold text-white leading-snug line-clamp-2">
                          {project.title}
                        </h3>

                        {project.summary && (
                          <p className="text-sm text-slate-200 line-clamp-2 font-medium leading-relaxed max-w-3xl">
                            {project.summary}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.sector && (
                            <span className="px-3 py-1 bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                              {project.sector}
                            </span>
                          )}
                          {project.solution && (
                            <span className="px-3 py-1 bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                              {project.solution}
                            </span>
                          )}
                          {project.customerName && (
                            <span className="px-3 py-1 bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider rounded-[8px]">
                              {project.customerName}
                            </span>
                          )}
                        </div>

                        <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FC5115]">
                          <span>Xem chi tiết dự án</span>
                          <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </>
                );

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.6 }}
                    className={`relative overflow-hidden cursor-pointer group rounded-[10px] bg-slate-900 transition-all duration-500 group-hover/grid:opacity-50 hover:!opacity-100 ${spanClass}`}
                  >
                    {onSelectProject ? (
                      <div
                        onClick={() => onSelectProject(project.id)}
                        className="block w-full h-full"
                      >
                        {cardContent}
                      </div>
                    ) : (
                      <Link href={`/projects/${project.slug}`} className="block w-full h-full">
                        {cardContent}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
