'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Facebook, Linkedin, Bot, X, Headphones } from 'lucide-react';
import { ZaloIcon } from '@/shared/components/Icons';
import { ConsultationModal } from '@/web/components/ConsultationModal';
import { ChatbotWidget } from '@/web/components/ChatbotWidget';
import { Constellation } from '@/web/components/Constellation';
import { Footer } from '@/web/components/Footer';
import { Header } from '@/web/components/Header';

export function WebsiteShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false);

  const navigate = (href: string) => router.push(href);
  const headerVariant = pathname === '/' ? 'overlay' : 'solid';

  return (
    <div className="public-shell min-h-screen bg-white text-slate-900 relative selection:bg-orange-500 selection:text-white">
      {/* Interactive Background Engine (Chỉ hiển thị tại Trang Chủ) */}
      {pathname === '/' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-100">
          <Constellation 
            density={16000} 
            lineDistance={160} 
            particleColor="rgba(234, 88, 12, 0.4)" 
            lineColor="rgba(234, 88, 12, " 
          />
        </div>
      )}

      {/* Floating Contact Bar with 5 items & Speed-Dial Toggle */}
      <div className="fixed right-4 sm:right-6 bottom-6 z-[100] flex flex-col items-end gap-3">
        <AnimatePresence>
          {isFloatingExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5 items-end mb-1"
            >
              {[
                { 
                  id: 'chatbot',
                  icon: <Bot size={24} className="text-white" />, 
                  label: 'Trợ lý AI CIC Technology', 
                  color: 'bg-slate-900 hover:bg-slate-800 border-2 border-orange-500 shadow-orange-500/30', 
                  onClick: () => setIsChatbotOpen(prev => !prev)
                },
                { 
                  id: 'hotline',
                  icon: <Phone size={22} className="animate-pulse text-white" />, 
                  label: 'Hotline: 024 3976 1381', 
                  color: 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20', 
                  link: 'tel:02439761381' 
                },
                { 
                  id: 'zalo',
                  icon: <ZaloIcon size={24} />, 
                  label: 'Zalo: 024 3976 1381 / OA CIC', 
                  color: 'bg-[#0068FF] hover:bg-[#0052cc] shadow-blue-500/20', 
                  link: 'https://zalo.me/1727624419140352798' 
                },
                { 
                  id: 'fb',
                  icon: <Facebook size={22} className="text-white" />, 
                  label: 'Fanpage Facebook CIC', 
                  color: 'bg-[#1877F2] hover:bg-[#1566d2] shadow-blue-600/20', 
                  link: 'https://www.facebook.com/CICTechnologyandConsultancyVN' 
                },
                { 
                  id: 'linkedin',
                  icon: <Linkedin size={22} className="text-white" />, 
                  label: 'LinkedIn CIC', 
                  color: 'bg-[#0A66C2] hover:bg-[#084e96] shadow-blue-700/20', 
                  link: 'https://www.linkedin.com/in/c%C3%B4ng-ty-cp-c%C3%B4ng-ngh%E1%BB%87-v%C3%A0-t%C6%B0-v%E1%BA%A5n-cic/' 
                }
              ].map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.08, x: -2 }}
                  className="relative group flex items-center"
                >
                  {item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className={`${item.color} text-white w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative`}
                    >
                      {item.icon}
                      {item.id === 'chatbot' && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-slate-900 animate-ping" />
                      )}
                    </button>
                  ) : (
                    <a 
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`${item.color} text-white w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-lg transition-all`}
                    >
                      {item.icon}
                    </a>
                  )}
                  
                  {/* Floating Label / Tooltip */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-slate-200/80">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master FAB Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsFloatingExpanded(!isFloatingExpanded)}
          className="relative group cursor-pointer focus:outline-none"
        >
          {isFloatingExpanded ? (
            /* Collapsing Action Trigger */
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-transparent hover:bg-orange-500/10 text-orange-600 border-2 border-orange-500 shadow-lg shadow-orange-500/20 backdrop-blur-md flex items-center justify-center transition-all">
              <motion.div
                initial={{ rotate: -90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-orange-600 transition-colors" />
              </motion.div>
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-slate-700/50">
                Thu gọn tiện ích
              </span>
            </div>
          ) : (
            /* Expanding Action Trigger (When Collapsed / Closed) - Original Gradient */
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center relative transition-all">
              <motion.div
                initial={{ rotate: 90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center text-white"
              >
                <Headphones className="w-6 h-6" />
              </motion.div>

              {/* Tooltip */}
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3.5 py-2 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-slate-200">
                Mở tiện ích & AI Chatbot
              </span>
            </div>
          )}
        </motion.button>
      </div>

      <Header variant={headerVariant} pathname={pathname} onNavigate={navigate} onOpenConsultation={() => setIsConsultationOpen(true)} />
      <main className="public-shell-content" data-header-variant={headerVariant}>{children}</main>
      <Footer onNavigate={navigate} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />

      {/* Interactive AI Chatbot Widget */}
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onNavigateView={(view) => {
          navigate(`/${view}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
