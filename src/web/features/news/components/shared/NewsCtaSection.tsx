'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface NewsCtaSectionProps {
  onOpenConsultation?: () => void;
}

export function NewsCtaSection({ onOpenConsultation }: NewsCtaSectionProps) {
  return (
    <section className="mt-12 sm:mt-16 bg-white text-slate-900 p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden rounded-2xl">
      <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-950">
            Cần tư vấn giải pháp?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Đội ngũ chuyên gia CIC luôn sẵn sàng đồng hành, tư vấn và cung cấp các giải pháp phần mềm, chuyển đổi số phù hợp nhất cho bạn.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button 
            type="button"
            onClick={onOpenConsultation}
            className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 rounded-[8px] cursor-pointer"
          >
            <span>Liên hệ tư vấn</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
