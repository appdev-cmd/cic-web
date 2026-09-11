import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventItem } from '@shared/types';
import { EventCard } from './EventCard';
import { EventHeroBanner } from './EventHeroBanner';
import { EventConsultationCta } from '../shared/EventConsultationCta';

interface EventListViewProps {
  eventsData: EventItem[];
  heroEvent: EventItem | null;
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  onSelectEvent: (event: EventItem) => void;
  onOpenRegistration: (event: EventItem) => void;
  onOpenConsultation?: () => void;
}

export const EventListView: React.FC<EventListViewProps> = ({
  eventsData,
  heroEvent,
  timeLeft,
  onSelectEvent,
  onOpenRegistration,
  onOpenConsultation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, sortBy]);

  const filteredEvents = useMemo(() => {
    return eventsData
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.eventType && event.eventType.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (statusFilter === 'all') {
          const statusPriority: Record<string, number> = {
            ongoing: 1,
            upcoming: 2,
            past: 3,
          };
          const priorityA = statusPriority[a.status] ?? 99;
          const priorityB = statusPriority[b.status] ?? 99;
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
        }

        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [eventsData, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      key="overview-list"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* PAGE TITLE BANNER */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 block">
            Sự kiện & Hội thảo CIC
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#444] mt-1">
            Cổng Sự Kiện Công Nghệ
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium">
            Tham dự các buổi Webinar, Workshop chuyên sâu và Lễ ra mắt công nghệ BIM, AI, CAD và Hạ tầng số do CIC cùng các đối tác quốc tế tổ chức.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-white border border-slate-200 px-4 py-2 text-center shadow-sm">
            <span className="text-xl font-black text-slate-950 block">
              {eventsData.filter((e) => e.status === 'upcoming').length}
            </span>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
              Sắp diễn ra
            </span>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 text-center shadow-sm">
            <span className="text-xl font-black text-orange-600 block">
              {eventsData.filter((e) => e.isOpenRegistration).length}
            </span>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
              Mở Đăng ký
            </span>
          </div>
        </div>
      </div>

      {/* TẦNG 1: HERO EVENT CARD (SỰ KIỆN SẮP DIỄN RA / TIÊU BIỂU) */}
      {heroEvent && statusFilter === 'all' && !searchTerm && (
        <EventHeroBanner
          heroEvent={heroEvent}
          timeLeft={timeLeft}
          onSelectEvent={onSelectEvent}
          onOpenRegistration={onOpenRegistration}
        />
      )}

      {/* FILTER & SEARCH CONTROLS BAR */}
      <div className="pt-2">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-100/70 p-3 sm:p-4 rounded-[10px] border border-slate-200/80">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="text-slate-400" size={15} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện, địa điểm, chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#FC5115] pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-[8px]"
            />
          </div>

          {/* Filter controls right */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 focus:border-[#FC5115] px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer min-w-[150px] w-full sm:w-auto"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="past">Đã kết thúc</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 focus:border-[#FC5115] px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer min-w-[150px] w-full sm:w-auto"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="oldest">Sắp xếp: Cũ nhất</option>
            </select>

            {/* Reset Filters */}
            {(searchTerm || statusFilter !== 'all' || sortBy !== 'newest') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSortBy('newest');
                }}
                className="px-3.5 py-2.5 bg-slate-200 hover:bg-[#FC5115] hover:text-white text-slate-700 text-xs font-bold uppercase transition-colors whitespace-nowrap rounded-[8px] cursor-pointer shrink-0"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* UNIFIED MIXED EVENTS LIST (3-4 COLS) WITH PAGINATION */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-8">
          {/* Mixed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.map((event) => (
              <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-all rounded-[8px] cursor-pointer ${
                    currentPage === p
                      ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 py-16 px-6 text-center shadow-sm">
          <Filter className="text-slate-400 mx-auto mb-3" size={32} />
          <h3 className="text-base font-black uppercase text-slate-950">
            Không tìm thấy sự kiện nào
          </h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục bộ lọc khác.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-4 border border-slate-200 hover:border-orange-600 text-xs font-black uppercase px-6 py-2 transition-all text-slate-700 hover:text-orange-600"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* TẦNG 4: FOOTER CONSULTATION CALLOUT */}
      <EventConsultationCta onOpenConsultation={onOpenConsultation} />
    </motion.div>
  );
};
