'use client';

import React, { useState } from 'react';
import { Bell, Flame } from 'lucide-react';
import type { PublicNewsItem } from '../../types';
import { NewsNotificationModal } from '../shared/NewsNotificationModal';

interface NewsTickerProps {
  breakingNews: PublicNewsItem[];
  onSelectNews: (id: string) => void;
}

export function NewsTicker({ breakingNews, onSelectNews }: NewsTickerProps) {
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [showBellModal, setShowBellModal] = useState(false);

  if (breakingNews.length === 0) return null;

  return (
    <>
      <div className="relative my-3">
        {/* Ticker Bar Container - Blends with main background */}
        <div 
          className="bg-transparent text-slate-900 py-2.5 flex items-center justify-between gap-3 overflow-hidden"
          onMouseEnter={() => setIsTickerPaused(true)}
          onMouseLeave={() => setIsTickerPaused(false)}
        >
          {/* Label Badge */}
          <div className="flex items-center gap-2 shrink-0 z-10 pl-1">
            <button
              onClick={() => setShowBellModal(true)}
              className="relative group flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm rounded-[6px] cursor-pointer"
              title="Nhấn để xem bảng tin nổi bật & cài đặt thông báo"
            >
              <span className="relative flex items-center justify-center">
                <Bell size={13} className="text-white fill-white animate-[bounce_1.2s_infinite]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
              </span>
              <span>HOT NEWS</span>
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />
          </div>

          {/* Marquee Content */}
          <div className="overflow-hidden whitespace-nowrap relative flex-1 min-w-0">
            <div 
              className="animate-marquee flex items-center"
              style={{
                animationPlayState: isTickerPaused ? 'paused' : 'running',
              }}
            >
              {[...breakingNews, ...breakingNews].map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  onClick={() => onSelectNews(item.id)}
                  className="inline-flex items-center gap-2 mr-8 text-xs text-slate-700 hover:text-[#FC5115] transition-colors cursor-pointer shrink-0 group font-medium"
                >
                  <Flame size={12} className="text-orange-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-semibold text-slate-800 group-hover:text-[#FC5115]">{item.title}</span>
                  <span className="text-slate-300 mx-1">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewsNotificationModal
        isOpen={showBellModal}
        onClose={() => setShowBellModal(false)}
        breakingNews={breakingNews}
        onSelectNews={onSelectNews}
      />
    </>
  );
}
