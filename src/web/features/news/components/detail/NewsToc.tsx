'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronUp, ListOrdered } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface NewsTocProps {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export function NewsToc({ items, activeId, onItemClick }: NewsTocProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) return null;

  const handleScroll = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-[12px] p-5 my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <ListOrdered size={16} className="text-[#FC5115]" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-[#FC5115] transition-colors">
            Mục lục bài viết
          </span>
          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-bold">
            {items.length} mục
          </span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-slate-200/60 space-y-1 overflow-hidden"
          >
            {items.map((heading, idx) => (
              <button
                key={`${heading.id}-${idx}`}
                onClick={() => handleScroll(heading.id)}
                className={`block w-full text-left py-1.5 px-2 rounded-md text-xs transition-colors cursor-pointer ${
                  heading.level === 3 ? 'pl-5 text-slate-500' : 'font-semibold text-slate-700'
                } ${
                  activeId === heading.id
                    ? 'bg-orange-100/60 text-[#FC5115] font-bold'
                    : 'hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <span className="inline-block mr-1 text-[#FC5115] font-bold">
                  {idx + 1}.
                </span>
                {heading.text}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
