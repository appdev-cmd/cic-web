'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { SectionHeader } from '@shared/components/Typography';
import type { HomeProjectModel } from '@shared/page-content/models';
import type { Project } from '@shared/types';

export interface HomeProjectsSectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  projects: HomeProjectModel[];
  setCurrentView: (view: any) => void;
  setActiveLink: (link: any) => void;
  setActiveProjectId: (id: any) => void;
}

export const HomeProjectsSection: React.FC<HomeProjectsSectionProps> = ({
  title,
  subtitle,
  ctaLabel,
  ctaUrl,
  projects,
  setCurrentView,
  setActiveLink,
  setActiveProjectId,
}) => {
  const [activeProjectTab, setActiveProjectTab] = useState('all');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeProjectTab === 'all' || p.type === activeProjectTab;
    const searchLower = projectSearchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) ||
      p.location.toLowerCase().includes(searchLower) ||
      p.tags.some((tag) => tag.toLowerCase().includes(searchLower));
    return matchesTab && matchesSearch;
  });

  return (
    <section data-page-builder-section-key="home.projects" id="projects" className="py-16 bg-white relative overflow-hidden border-t border-slate-100 z-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          title={title || "Dự án tiêu biểu"} 
          sub={subtitle || "Kiến tạo hệ sinh thái giải pháp công nghệ kỹ thuật số toàn diện"} 
          titleProps={{ 'data-page-builder-config-path': JSON.stringify(['title']) } as any}
          subProps={{ 'data-page-builder-config-path': JSON.stringify(['subtitle']) } as any}
        />
        
        {/* Project Tabs and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'software', label: 'Phần mềm' },
              { id: 'equipment', label: 'Thiết bị' },
              { id: 'services', label: 'Dịch vụ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveProjectTab(tab.id);
                }}
                className={`px-8 py-2.5 rounded-[8px] font-black text-xs uppercase tracking-widest transition-all ${
                  activeProjectTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex items-center w-full md:w-auto min-w-[280px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="text-slate-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={projectSearchQuery}
              onChange={(e) => {
                setProjectSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* 3 Cards 16:9 Static Grid Container */}
        <div 
          data-page-collection="project"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {filteredProjects.length > 0 ? (
            (() => {
              const displayProjects = filteredProjects.slice(0, 3);

              return displayProjects.map((proj, i) => {
                const targetId =
                  proj.id === 1 ? 'landmark-81-bim' :
                  proj.id === 2 ? 'cao-toc-bac-nam-twin' :
                  proj.id === 3 ? 'dien-gio-mui-dinh' :
                  proj.id === 4 ? 'ham-duong-bo-deo-ca-pro' :
                  String(proj.id);

                const handleProjectClick = () => {
                  setActiveProjectId(targetId);
                  setCurrentView('projects');
                  setActiveLink('Dự án');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                };

                return (
                  <div
                    key={proj.entityId ?? proj.id}
                    onClick={handleProjectClick}
                    tabIndex={0}
                    role="button"
                    aria-label={`${i + 1}. ${proj.name}`}
                    className="group relative flex flex-col cursor-pointer w-full"
                  >
                    {/* 16:9 Aspect Ratio Image Box */}
                    <div className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 group-hover:border-orange-500/60 shadow-sm group-hover:shadow-md transition-all duration-300 bg-slate-950">
                      <img 
                        src={proj.img} 
                        alt={proj.name} 
                        className="w-full h-full object-cover transition-transform duration-300 rounded-lg group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Top Right Number Badge */}
                      <div className="absolute top-3.5 right-3.5 z-20">
                        <span className="inline-flex items-center justify-center min-w-[36px] h-8 px-2.5 rounded-lg font-black text-xs tracking-wider shadow-sm transition-all duration-300 bg-slate-950/60 text-white/90 backdrop-blur-md border border-white/20 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-400/50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Text Content BELOW Card */}
                    <div className="mt-3 px-1">
                      <div className="text-orange-600 text-[11px] font-extrabold uppercase tracking-wider mb-1 truncate">
                        {proj.category || (proj.type === 'software' ? 'Phần mềm' : proj.type === 'equipment' ? 'Thiết bị' : 'Tư vấn')}
                      </div>
                      <h3 className="text-slate-900 font-black text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {proj.short || proj.name}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium line-clamp-1 mt-1">
                        {proj.client || proj.location}
                      </p>
                    </div>
                  </div>
                );
              });
            })()
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-16 text-slate-500 font-medium bg-slate-50 rounded-[10px] border border-slate-200">
              Không tìm thấy dự án nào phù hợp với từ khóa tìm kiếm.
            </div>
          )}
        </div>

        <div className="text-center mt-5 md:mt-6">
          <button 
            data-page-builder-config-path={JSON.stringify(['ctaLabel'])}
            data-page-builder-cta-key={JSON.stringify(['ctaUrl'])}
            onClick={() => {
              if (ctaUrl && (ctaUrl.startsWith('http') || ctaUrl.startsWith('/'))) {
                window.location.href = ctaUrl;
                return;
              }
              setCurrentView('projects');
              setActiveLink('Dự án');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-black uppercase tracking-widest text-xs transition-all group btn-modern-interaction shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{ctaLabel || 'Xem tất cả dự án'}</span> <ChevronRight className="inline-block group-hover:translate-x-1.5 transition-transform" />
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedProject(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSelectedProject(null);
              }
            }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
          >
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className="mb-12 flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg px-2 py-1"
                id="project-detail-close"
              >
                <ChevronLeft size={24} /> Quay lại danh sách
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <motion.div layoutId={`project-${selectedProject.id}`}>
                   <img src={selectedProject.img} className="w-full rounded-[10px] shadow-2xl" alt="" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-orange-600 text-sm font-black uppercase tracking-widest mb-4">{selectedProject.location}</div>
                  <h2 id="project-detail-title" className="text-5xl md:text-6xl font-black text-slate-950 mb-8 leading-tight">{selectedProject.name}</h2>
                  <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
                     <p>Mô tả chi tiết dự án: Dự án triển khai hạ tầng số với quy mô lớn, ứng dụng các giải pháp tiên tiến nhất từ đối tác Bentley Systems và giải pháp AI do CIC phát triển.</p>
                     <div className="flex gap-4">
                       {selectedProject.tags.map((tag: string) => (
                         <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-950 font-black rounded-[8px] uppercase text-xs tracking-widest">{tag}</span>
                       ))}
                     </div>
                  </div>
                  <button className="mt-12 px-5 py-2 bg-orange-600 text-white rounded-[8px] font-black uppercase tracking-widest shadow-xl hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all active:scale-95 btn-modern-interaction">
                    Tải Portfolio Dự án
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
