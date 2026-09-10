'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Check, Clock, Globe, Shield, Sparkles, X } from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface NewsNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakingNews: PublicNewsItem[];
  onSelectNews: (id: string) => void;
}

export function NewsNotificationModal({
  isOpen,
  onClose,
  breakingNews,
  onSelectNews,
}: NewsNotificationModalProps) {
  const [bellSubscribed, setBellSubscribed] = useState(true);
  const [bellEmail, setBellEmail] = useState('');
  const [bellToast, setBellToast] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bellEmail) return;
    setBellSubscribed(true);
    setBellToast(`Đã đăng ký nhận tin thành công cho email: ${bellEmail}`);
    setBellEmail('');
    setTimeout(() => setBellToast(null), 3500);
  };

  const handleToggle = () => {
    const nextState = !bellSubscribed;
    setBellSubscribed(nextState);
    setBellToast(nextState ? 'Đã bật thông báo tin tức nổi bật!' : 'Đã tắt thông báo tin tức');
    setTimeout(() => setBellToast(null), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-[#FC5115] shrink-0">
                  <Bell size={20} className="fill-[#FC5115] animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                    <span>Bảng Tin Nổi Bật & Thông Báo</span>
                    <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-full">CIC Tech</span>
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Cập nhật thời gian thực các tin tức công nghệ và sự kiện độc quyền
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {bellToast && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>{bellToast}</span>
                </div>
              )}

              {/* Notification Toggle Banner */}
              <div className="bg-orange-50/60 border border-orange-200/80 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#FC5115]" />
                    <span className="text-xs font-bold text-slate-900">Thông báo từ trình duyệt</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Nhận cảnh báo sớm khi có nghị quyết ĐHĐCĐ hoặc thông báo khẩn cấp
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    bellSubscribed ? 'bg-[#FC5115]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      bellSubscribed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Latest Breaking News Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={13} className="text-[#FC5115]" />
                    <span>Dòng tin đang phát</span>
                  </h4>
                  <span className="text-[10px] text-orange-600 font-bold">{breakingNews.length} tin mới</span>
                </div>

                <div className="space-y-2">
                  {breakingNews.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        onSelectNews(item.id);
                      }}
                      className="group cursor-pointer p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {item.date}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Subscription Sub-form */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Shield size={13} className="text-slate-400" />
                  <span>Đăng ký nhận bản tin qua Email (Miễn phí)</span>
                </div>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={bellEmail}
                    onChange={(e) => setBellEmail(e.target.value)}
                    placeholder="Nhập email của bạn..."
                    required
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Đăng ký
                  </button>
                </form>
                <p className="text-[10px] text-slate-400">
                  Cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào qua liên kết ở cuối email.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
