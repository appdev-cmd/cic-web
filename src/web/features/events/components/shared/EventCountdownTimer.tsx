import React from 'react';
import { Timer } from 'lucide-react';
import { useI18n } from '@/shared/i18n';

interface EventCountdownTimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  variant?: 'hero' | 'detail';
}

export const EventCountdownTimer: React.FC<EventCountdownTimerProps> = ({
  days,
  hours,
  minutes,
  seconds,
  variant = 'hero',
}) => {
  const { locale } = useI18n();

  if (variant === 'detail') {
    return (
      <div className="bg-slate-950 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[10px]">
        <div className="flex items-center gap-3">
          <Timer className="text-orange-500 shrink-0" size={32} />
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              {locale === 'en' ? 'Event Countdown' : 'Đếm ngược sự kiện'}
            </span>
            <span className="text-sm font-bold text-slate-200">
              {locale === 'en' ? 'Event is starting soon' : 'Sắp sửa diễn ra chương trình'}
            </span>
          </div>
        </div>

        {/* Flip clock numbers */}
        <div className="flex gap-2 text-center">
          {[
            { value: days, label: locale === 'en' ? 'DAYS' : 'NGÀY' },
            { value: hours, label: locale === 'en' ? 'HOURS' : 'GIỜ' },
            { value: minutes, label: locale === 'en' ? 'MINS' : 'PHÚT' },
            { value: seconds, label: locale === 'en' ? 'SECS' : 'GIÂY' },
          ].map((unit, i) => (
            <div key={i} className="bg-slate-900 border border-white/10 p-2.5 min-w-[65px] rounded-[8px]">
              <span className="block text-2xl font-extrabold text-orange-500 leading-none">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 block">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-slate-200/70">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
        <Timer size={13} className="text-orange-600" />{' '}
        {locale === 'en' ? 'Time Remaining' : 'Thời gian còn lại'}
      </span>
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[
          { val: days, unit: locale === 'en' ? 'Days' : 'Ngày' },
          { val: hours, unit: locale === 'en' ? 'Hours' : 'Giờ' },
          { val: minutes, unit: locale === 'en' ? 'Mins' : 'Phút' },
          { val: seconds, unit: locale === 'en' ? 'Secs' : 'Giây' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 py-1.5 px-1 rounded-[6px] shadow-2xs">
            <span className="text-base font-black text-slate-900 block leading-tight">
              {String(item.val).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400 block">
              {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
