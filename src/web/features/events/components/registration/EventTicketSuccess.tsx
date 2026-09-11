import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Check } from 'lucide-react';
import type { EventItem, EventRegistration } from '@shared/types';

interface EventTicketSuccessProps {
  event: EventItem;
  registrationResult: EventRegistration;
  onBack: () => void;
}

export const EventTicketSuccess: React.FC<EventTicketSuccessProps> = ({
  event,
  registrationResult,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 text-center py-4 max-w-2xl mx-auto"
    >
      <div className="w-16 h-16 bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto">
        <CheckCircle className="text-orange-600" size={36} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold uppercase text-slate-950">Đăng ký tham dự thành công!</h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
          Cảm ơn quý khách <strong className="text-slate-900">{registrationResult.fullName}</strong>. Mã xác nhận vé điện tử của bạn đã được khởi tạo thành công trên hệ thống CIC Tech.
        </p>
      </div>

      <div className="bg-orange-50/50 border border-orange-200 p-4 text-left space-y-2">
        <div className="flex items-center gap-2 text-orange-900 font-bold text-xs uppercase">
          <Check size={16} className="bg-orange-600 text-white rounded-full p-0.5" />
          <span>Email xác nhận đã được gửi thành công</span>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed">
          Ban tổ chức đã gửi vé điện tử cùng link tham dự/QR code check-in tới email:{' '}
          <strong className="text-slate-900">{registrationResult.email}</strong>.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 text-left space-y-4 font-sans">
        <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Thông tin vé điện tử</h4>
        <div className="grid grid-cols-2 gap-y-2 text-xs">
          <span className="text-slate-500">Mã vé:</span>
          <strong className="text-slate-900 text-right font-semibold">
            CIC-EVT-{Math.floor(10000 + Math.random() * 90000)}
          </strong>

          <span className="text-slate-500">Họ tên:</span>
          <span className="text-slate-800 text-right font-bold">{registrationResult.fullName}</span>

          <span className="text-slate-500">Đơn vị:</span>
          <span className="text-slate-800 text-right font-medium truncate">{registrationResult.company}</span>

          <span className="text-slate-500">Số lượng:</span>
          <span className="text-slate-800 text-right font-bold">{registrationResult.attendeesCount} vé</span>

          <span className="text-slate-500">Thời gian:</span>
          <span className="text-slate-800 text-right font-medium">{event.date}</span>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
          <div className="w-28 h-28 bg-white border border-slate-200 p-2 flex items-center justify-center">
            <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100">
              <path
                d="M5 5h30v30H5zm5 5h20v20H10zm65-5h30v30H65zm5 5h20v20H70zm-65 65h30v30H5zm5 5h20v20H10zm40-35h10v10H50zm15 15h10v10H65zm15-15h10v10H80zm-15 15h15v10H65zm15 15h10v15H80zm-15-40h10v10H65zm-30 0h10v10H35zm0 15h10v10H35zm15 0h10v10H50z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">
            Check-in QR Code
          </span>
        </div>
      </div>

      <div className="pt-2 flex justify-center">
        <button
          onClick={onBack}
          className="bg-slate-950 hover:bg-orange-600 text-white px-8 py-3 text-xs font-black uppercase tracking-widest transition-all"
        >
          Quay lại trang sự kiện
        </button>
      </div>
    </motion.div>
  );
};
