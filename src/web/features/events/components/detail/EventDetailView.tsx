import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Download, ArrowRight } from 'lucide-react';
import type { EventItem, Product } from '@shared/types';
import { cleanEventHtml, getStatusColor, getStatusLabel } from '../eventUtils';
import { EventCountdownTimer } from '../shared/EventCountdownTimer';

interface EventDetailViewProps {
  event: EventItem;
  eventsData: EventItem[];
  productsData: Product[];
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  onBack: () => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenRegistration: (event: EventItem) => void;
  onNavigateToProduct?: (productId: string) => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  eventsData,
  productsData,
  timeLeft,
  onBack,
  onSelectEvent,
  onOpenRegistration,
  onNavigateToProduct,
}) => {
  return (
    <motion.div
      key="detail-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại danh sách sự kiện
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* MAIN CONTENT COLUMN - SINGLE UNIFIED CONTAINER */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-[12px] overflow-hidden space-y-2">
            {/* HERO BANNER & MAIN METADATA */}
            <div>
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusLabel(event.status)}
                  </span>
                  {event.isOpenRegistration && (
                    <span className="bg-orange-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
                      Mở Đăng Ký
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight uppercase tracking-tight">
                  {event.title}
                </h1>

                {/* Meta quick badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-100 py-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 rounded-md">
                      <Calendar className="text-orange-600" size={18} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Thời gian
                      </span>
                      <span className="font-bold text-slate-800 text-sm leading-snug block">
                        {event.date}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Bắt đầu: {event.startDate ? event.startDate.split('T')[1]?.slice(0, 5) : '08:30'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 rounded-md">
                      <MapPin className="text-orange-600" size={18} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Địa điểm tổ chức
                      </span>
                      <span className="font-bold text-slate-800 text-sm leading-snug block">
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Countdown widget if upcoming */}
                {(event.status === 'upcoming' || event.status === 'ongoing') && (
                  <EventCountdownTimer
                    days={timeLeft.days}
                    hours={timeLeft.hours}
                    minutes={timeLeft.minutes}
                    seconds={timeLeft.seconds}
                    variant="detail"
                  />
                )}
              </div>
            </div>

            {/* LONG FORM DESCRIPTION / RICH ARTICLE CONTENT */}
            <div className="p-6 sm:p-8 space-y-4 select-text">
              {/<[a-z][\s\S]*>/i.test(event.longDesc) ? (
                <div
                  className="event-rich-content text-slate-800 leading-relaxed font-normal select-text"
                  dangerouslySetInnerHTML={{ __html: cleanEventHtml(event.longDesc) }}
                />
              ) : (
                <>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 select-text">
                    Giới thiệu chương trình
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed font-medium space-y-4 whitespace-pre-line select-text">
                    {event.longDesc}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FLOATING ACTION SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          {/* QUICK CTA BOX */}
          <div className="bg-white border border-slate-950 p-6 shadow-sm space-y-6 sticky top-24 rounded-[10px]">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Đăng ký tham dự
              </span>
              <h3 className="text-base font-bold text-slate-950 uppercase">Giữ chỗ sự kiện</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-[8px]">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Trạng thái
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 ${
                      event.isOpenRegistration ? 'bg-emerald-500' : 'bg-slate-400 animate-none'
                    } rounded-full animate-pulse`}
                  ></span>
                  <span className="text-xs font-bold uppercase text-slate-700">
                    {event.isOpenRegistration
                      ? 'Đang mở đăng ký trực tuyến'
                      : 'Đã dừng đăng ký trực tuyến'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between">
                  <span>Chi phí:</span>
                  <span className="text-orange-600 font-extrabold">MIỄN PHÍ</span>
                </div>
                <div className="flex justify-between">
                  <span>Hình thức:</span>
                  <span className="text-slate-800">Trực tiếp / Hybrid</span>
                </div>
              </div>

              {event.isOpenRegistration ? (
                <button
                  onClick={() => onOpenRegistration(event)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-sm rounded-[8px]"
                >
                  Đăng ký ngay tại đây <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-200 text-slate-400 py-3.5 text-xs font-bold uppercase tracking-wider text-center cursor-not-allowed rounded-[8px]"
                >
                  Đã đóng đăng ký
                </button>
              )}
            </div>

            {/* DOCUMENT DOWNLOADS */}
            {event.documents && event.documents.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Tài liệu đính kèm
                </span>
                <div className="space-y-2">
                  {event.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Đã bắt đầu tải file: ${doc.name}`);
                      }}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 hover:border-orange-600 text-xs font-bold text-slate-700 hover:text-orange-600 transition-all rounded-[8px]"
                    >
                      <span className="truncate max-w-[200px]">{doc.name}</span>
                      <span className="text-[9px] text-slate-400 shrink-0 flex items-center gap-1">
                        {doc.size} <Download size={12} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* NAVIGATE BUTTON */}
            <button
              onClick={onBack}
              className="w-full text-center border border-slate-200 hover:border-slate-950 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-950 py-2.5 transition-all rounded-[8px]"
            >
              Quay về danh sách
            </button>
          </div>
        </div>

        {/* RELATED EVENTS & PRODUCTS CONTAINER */}
        <div className="lg:col-span-12 mt-8 pt-8 sm:mt-12 sm:pt-10 border-t border-slate-200 space-y-10 sm:space-y-12">
          {/* SỰ KIỆN LIÊN QUAN */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              Sự kiện liên quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {eventsData
                .filter((e) => e.id !== event.id)
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectEvent(item)}
                    className="bg-white hover:bg-white rounded-xl border border-slate-200/80 p-3 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="aspect-[16/9] bg-slate-100 overflow-hidden rounded-lg">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>
                    <div className="px-1.5 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] font-semibold">
                        <span className="text-orange-600 font-bold">{item.date}</span>
                        <span className="truncate max-w-[110px] text-slate-400">
                          {item.location.split(',')[0]}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-[#333] group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                      <div className="pt-1 flex items-center text-[10px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                        <span>Xem chi tiết</span>
                        <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* SẢN PHẨM LIÊN QUAN */}
          {productsData.length > 0 && (
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Sản phẩm liên quan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {productsData.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      if (onNavigateToProduct) onNavigateToProduct(String(prod.id));
                    }}
                    className="bg-white border border-slate-200/90 hover:border-orange-500 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-[10px] group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 shrink-0 bg-transparent p-0 flex items-center justify-center overflow-hidden rounded-none">
                          <img
                            src={prod.img || prod.icon}
                            alt={prod.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-none"
                          />
                        </div>
                        <h4 className="text-xs font-semibold text-[#333] leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                          {prod.name}
                        </h4>
                      </div>

                      {prod.price && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Giá:
                          </span>
                          <span className="text-xs font-bold text-orange-600">{prod.price}</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2 border-t border-slate-100 pt-2">
                        {prod.desc || (prod as any).description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
