'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Quote,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import type { ProjectDetailViewModel } from '@/features/projects/types';
import { ConsultationModal } from '@/web/components/ConsultationModal';

interface ProjectDetailRuntimeViewProps {
  project: ProjectDetailViewModel;
}

export function ProjectDetailRuntimeView({ project }: ProjectDetailRuntimeViewProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <div className="pt-28 pb-20 relative z-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          {/* Top Back Navigation / Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-orange-600 transition-colors py-1 group cursor-pointer"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Quay lại danh sách dự án
            </Link>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link href="/" className="hover:text-orange-600 cursor-pointer">
                Trang chủ
              </Link>
              <ChevronRight size={12} />
              <Link href="/projects" className="hover:text-orange-600 cursor-pointer">
                Dự án
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-700 truncate max-w-[200px] font-semibold">
                {project.title}
              </span>
            </div>
          </div>

          {/* Main Grid Layout: Left Article (8 cols) + Right Factsheet Sidebar (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Main Article Body */}
            <div className="lg:col-span-8 space-y-5 bg-white border border-slate-200/80 p-6 sm:p-10 rounded-[12px] shadow-xs">
              {/* Title & Tagline Header */}
              <div className="space-y-3 border-b border-slate-100 pb-4">
                {project.sector && (
                  <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider rounded-md">
                    {project.sector}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 uppercase tracking-tight leading-snug">
                  {project.title}
                </h1>
                {project.tagline && (
                  <p className="text-xs sm:text-sm text-slate-600 font-medium italic leading-relaxed border-l-2 border-orange-500 pl-3">
                    "{project.tagline}"
                  </p>
                )}
              </div>

              {/* Main Feature Image */}
              {project.image && (
                <div className="rounded-[10px] overflow-hidden border border-slate-200/80 bg-slate-900 aspect-video relative shadow-2xs mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Main Article Content */}
              {project.content ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-950 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-img:rounded-[10px] prose-img:border prose-img:border-slate-200"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                project.summary && (
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-tight pb-2 border-b border-slate-100">
                      Tổng quan Dự án
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {project.summary}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* RIGHT COLUMN: Factsheet & Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-white border border-slate-200/80 rounded-[12px] space-y-6 shadow-xs">
                {/* Client */}
                {project.customerName && (
                  <div className="border-b border-slate-100 pb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                      Chủ đầu tư / Khách hàng
                    </span>
                    <p className="text-sm font-bold text-slate-900">{project.customerName}</p>
                  </div>
                )}

                {/* Location */}
                {project.location && (
                  <div className="border-b border-slate-100 pb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                      Địa điểm thực hiện
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 flex items-center gap-1.5">
                      <MapPin size={15} className="text-orange-600 shrink-0" />
                      {project.location}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                <div className="border-b border-slate-100 pb-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                    Thời gian triển khai
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 flex items-center gap-1.5">
                    <Calendar size={15} className="text-orange-600 shrink-0" />
                    {project.timeDisplay}
                  </p>
                </div>

                {/* Sector & Solution */}
                {(project.sector || project.solution) && (
                  <div className="border-b border-slate-100 pb-3.5 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Lĩnh vực & Dịch vụ
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.sector && (
                        <span className="px-2.5 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-md text-[11px] font-bold">
                          {project.sector}
                        </span>
                      )}
                      {project.solution && (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                          {project.solution}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Applied Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="space-y-2 border-b border-slate-100 pb-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Công nghệ áp dụng
                    </span>
                    <ul className="space-y-1.5">
                      {project.technologies.map((tech, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 size={14} className="text-orange-600 shrink-0" />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Links */}
                {project.relatedLinks && project.relatedLinks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Giải pháp / Sản phẩm liên quan
                    </span>
                    <div className="space-y-1.5">
                      {project.relatedLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.view === 'products' ? `/products/${link.id}` : `/services/${link.id}`}
                          className="p-2.5 bg-slate-50 border border-slate-200/80 hover:border-orange-500 rounded-[8px] flex items-center justify-between group cursor-pointer transition-all"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase text-orange-600 block">
                              {link.view === 'products' ? 'Sản Phẩm' : 'Dịch Vụ'}
                            </span>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {link.label}
                            </p>
                          </div>
                          <ArrowRight
                            size={13}
                            className="text-slate-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consultation Button */}
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
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
              <p className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Ban Quản lý Dự án
              </p>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                {project.customerName || 'Chủ đầu tư'}
              </p>
            </div>
          </section>

          {/* Related Projects Section */}
          {project.relatedProjects && project.relatedProjects.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-slate-200/80">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">
                    Dự án khác
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mt-1">
                    Dự án tiêu biểu
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {project.relatedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    className="bg-white border border-slate-200 hover:border-orange-500 group cursor-pointer flex flex-col hover:shadow-md transition-all duration-300 rounded-[10px] overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      {proj.image ? (
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800" />
                      )}
                      {proj.location && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {proj.location}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        {proj.solution && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                            {proj.solution}
                          </span>
                        )}
                        <h4 className="text-xs font-bold uppercase text-slate-950 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 pt-2">
                        Xem chi tiết{' '}
                        <ArrowRight
                          size={12}
                          className="transition-transform group-hover:translate-x-1 text-orange-600"
                        />
                      </span>
                    </div>
                  </Link>
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
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="bg-white text-orange-600 hover:bg-slate-100 px-6 py-3 rounded-[8px] font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  Yêu cầu tư vấn ngay
                </button>
                <Link
                  href="/projects"
                  className="border border-white/60 hover:border-white text-white px-6 py-3 rounded-[8px] font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer inline-flex items-center justify-center"
                >
                  Khám phá tất cả dự án
                </Link>
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}
