import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EventConsultationCtaProps {
  onOpenConsultation?: () => void;
}

export const EventConsultationCta: React.FC<EventConsultationCtaProps> = ({
  onOpenConsultation,
}) => {
  return (
    <section className="bg-white text-slate-900 px-6 py-6 sm:px-8 sm:py-7 border border-slate-200/90 shadow-sm relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/[0.03] via-transparent to-transparent">
      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        <div className="space-y-2 sm:space-y-2.5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
            <span className="text-slate-950">KẾT NỐI TRI THỨC, </span>
            <span className="text-orange-600">CẬP NHẬT CÔNG NGHỆ CÙNG CIC</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal max-w-2xl mx-auto leading-relaxed text-balance">
            Đăng ký nhận thông tin hội thảo, webinar và chương trình chuyên môn của CIC theo lĩnh vực bạn quan tâm. Cập nhật giải pháp mới và trao đổi trực tiếp cùng chuyên gia.
          </p>
        </div>

        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => {
              if (onOpenConsultation) {
                onOpenConsultation();
              } else if (typeof window !== 'undefined') {
                window.location.href = '/contact';
              }
            }}
            className="group bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 rounded-[8px] cursor-pointer"
          >
            <span>ĐĂNG KÝ NHẬN THÔNG TIN SỰ KIỆN</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
