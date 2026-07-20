/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  Menu, 
  X, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Globe 
} from 'lucide-react';
import { ZaloIcon } from './shared/Icons';
import { navLinks } from '../data/mockData';

interface HeaderProps {
  currentView: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms';
  setCurrentView: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms') => void;
  activeLink: string;
  setActiveLink: (link: string) => void;
  setAboutSubTab: (tab: 'overview' | 'structure' | 'experience') => void;
  onSelectService?: (id: string | null) => void;
  onSelectProject?: (id: string | null) => void;
  onSelectNewsCategory?: (category: string | null) => void;
}

export const Header = ({ currentView, setCurrentView, activeLink, setActiveLink, setAboutSubTab, onSelectService, onSelectProject, onSelectNewsCategory }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isSolidView = currentView === 'products' || currentView === 'about' || currentView === 'services' || currentView === 'projects' || currentView === 'news' || currentView === 'events' || currentView === 'contact';
  // Header should be styled as white/dark-text if we are in solid page views OR if we scrolled down on homepage
  const isHeaderWhite = isScrolled || isSolidView;

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isHeaderWhite 
            ? 'bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2 border-b border-slate-100' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('home');
                setActiveLink('Giới thiệu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group"
            >
              <img 
                src="logo.png" 
                alt="CIC Logo" 
                className={`h-10 md:h-12 w-auto transition-all duration-500 ${
                  isHeaderWhite ? 'brightness-100' : 'brightness-0 invert'
                } group-hover:scale-105`}
              />
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const hasDropdown = !!link.dropdown;
              const isActive = (currentView === 'products' && link.name === 'Sản phẩm') || 
                               (currentView === 'about' && link.name === 'Giới thiệu') || 
                               (currentView === 'services' && link.name === 'Dịch vụ') || 
                               (currentView === 'projects' && link.name === 'Dự án') || 
                               (currentView === 'news' && link.name === 'Tin tức') || 
                               (currentView === 'events' && link.name === 'Sự kiện') ||
                               (currentView === 'contact' && link.name === 'Liên hệ') ||
                               (currentView === 'home' && activeLink === link.name);
              return (
                <div key={link.name} className="relative group py-2">
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      if (link.name === 'Sản phẩm') {
                        e.preventDefault();
                        setCurrentView('products');
                        setActiveLink('Sản phẩm');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (link.name === 'Giới thiệu') {
                        e.preventDefault();
                        setCurrentView('about');
                        setAboutSubTab('overview');
                        setActiveLink('Giới thiệu');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (link.name === 'Dịch vụ') {
                        e.preventDefault();
                        setCurrentView('services');
                        setActiveLink('Dịch vụ');
                        if (onSelectService) onSelectService(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (link.name === 'Dự án') {
                        e.preventDefault();
                        setCurrentView('projects');
                        setActiveLink('Dự án');
                        if (onSelectProject) onSelectProject(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (link.name === 'Tin tức') {
                        e.preventDefault();
                        setCurrentView('news');
                        setActiveLink('Tin tức');
                        if (onSelectNewsCategory) onSelectNewsCategory('all');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (link.name === 'Sự kiện') {
                        e.preventDefault();
                        setCurrentView('events');
                        setActiveLink('Sự kiện');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (link.name === 'Liên hệ') {
                        e.preventDefault();
                        setCurrentView('contact');
                        setActiveLink('Liên hệ');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setCurrentView('home');
                        setActiveLink(link.name);
                      }
                    }}
                    className={`text-sm font-bold transition-all flex items-center gap-1 uppercase tracking-wide ${
                      isActive 
                        ? 'text-orange-600' 
                        : isHeaderWhite ? 'text-slate-600 hover:text-orange-600' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {hasDropdown && (
                      <ChevronDown 
                        size={14} 
                        className="transition-transform duration-300 group-hover:rotate-180 opacity-75" 
                      />
                    )}
                  </a>
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`}></div>
                  
                  {hasDropdown && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 min-w-[240px]">
                      <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-md py-2.5 text-slate-800 font-medium">
                        {link.dropdown?.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => {
                              if (link.name === 'Giới thiệu') {
                                e.preventDefault();
                                setCurrentView('about');
                                setActiveLink('Giới thiệu');
                                if (subItem.name === 'Cơ cấu tổ chức') {
                                  setAboutSubTab('structure');
                                } else if (subItem.name === 'Năng lực và Kinh nghiệm') {
                                  setAboutSubTab('experience');
                                } else {
                                  setAboutSubTab('overview');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else if (link.name === 'Dịch vụ') {
                                e.preventDefault();
                                setCurrentView('services');
                                setActiveLink('Dịch vụ');
                                if (onSelectService) onSelectService(subItem.href);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else if (link.name === 'Tin tức') {
                                e.preventDefault();
                                setCurrentView('news');
                                setActiveLink('Tin tức');
                                if (onSelectNewsCategory) {
                                  if (subItem.name === 'Tin công ty') onSelectNewsCategory('company');
                                  else if (subItem.name === 'Tin chuyên ngành') onSelectNewsCategory('specialty');
                                  else if (subItem.name === 'Tin tuyển dụng') onSelectNewsCategory('recruitment');
                                  else if (subItem.name === 'Tin khuyến mại') onSelectNewsCategory('promotion');
                                  else if (subItem.name === 'Quan hệ cổ đông') onSelectNewsCategory('shareholder');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                setCurrentView('home');
                                setActiveLink(link.name);
                              }
                            }}
                            className="block px-5 py-2.5 text-xs font-black text-slate-700 hover:text-orange-600 hover:bg-slate-50 transition-all text-left whitespace-nowrap uppercase tracking-wider"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className={`hidden md:flex items-center gap-1 p-1 rounded-none border backdrop-blur-md transition-all duration-500 ${
              isHeaderWhite ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'
            }`}>
              <button 
                className={`px-3 py-1 text-[10px] font-black rounded-none transition-all ${
                  isHeaderWhite 
                    ? 'bg-orange-600 text-white shadow-sm' 
                    : 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                }`}
              >
                VN
              </button>
              <button 
                className={`px-3 py-1 text-[10px] font-black rounded-none transition-all ${
                  isHeaderWhite ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button className={`p-2 transition-colors ${isHeaderWhite ? 'text-slate-600 hover:text-orange-600' : 'text-white hover:text-orange-400'}`}>
              <Search size={20} />
            </button>
            <button className="hidden sm:block px-5 py-2 bg-orange-600 text-white rounded-none text-sm font-black transition-all active:scale-95 border-2 border-orange-600 btn-modern-interaction">
              Tư vấn ngay
            </button>
            <button 
              className="lg:hidden p-2 text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-slate-900" />
              ) : (
                <Menu size={24} className={isHeaderWhite ? 'text-slate-950' : 'text-white'} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-slate-950 p-6 flex flex-col gap-8"
          >
            <div className="flex justify-between items-center">
              <div className="text-2xl font-black text-white">CIC</div>
              <button 
                className="p-2 text-white" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2">
              {navLinks.map((link) => {
                const hasDropdown = !!link.dropdown;
                const isExpanded = expandedMobileMenu === link.name;
                const isActive = (currentView === 'products' && link.name === 'Sản phẩm') || 
                                 (currentView === 'about' && link.name === 'Giới thiệu') || 
                                 (currentView === 'services' && link.name === 'Dịch vụ') || 
                                 (currentView === 'projects' && link.name === 'Dự án') || 
                                 (currentView === 'news' && link.name === 'Tin tức') || 
                                 (currentView === 'events' && link.name === 'Sự kiện') || 
                                 (currentView === 'contact' && link.name === 'Liên hệ') ||
                                 (currentView === 'home' && activeLink === link.name);
                return (
                  <div key={link.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <a 
                        href={link.href}
                        className={`text-2xl font-black transition-colors ${
                          isActive ? 'text-orange-600' : 'text-white hover:text-orange-600'
                        }`}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                           if (link.name === 'Sản phẩm') {
                             e.preventDefault();
                             setCurrentView('products');
                             setActiveLink('Sản phẩm');
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           } else if (link.name === 'Giới thiệu') {
                             e.preventDefault();
                             setCurrentView('about');
                             setAboutSubTab('overview');
                             setActiveLink('Giới thiệu');
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           } else if (link.name === 'Dịch vụ') {
                             e.preventDefault();
                             setCurrentView('services');
                             setActiveLink('Dịch vụ');
                             if (onSelectService) onSelectService(null);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           } else if (link.name === 'Dự án') {
                             e.preventDefault();
                             setCurrentView('projects');
                             setActiveLink('Dự án');
                             if (onSelectProject) onSelectProject(null);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           } else if (link.name === 'Sự kiện') {
                             e.preventDefault();
                             setCurrentView('events');
                             setActiveLink('Sự kiện');
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           } else if (link.name === 'Liên hệ') {
                             e.preventDefault();
                             setCurrentView('contact');
                             setActiveLink('Liên hệ');
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           } else {
                             setCurrentView('home');
                             setActiveLink(link.name);
                           }
                         }}
                      >
                        {link.name}
                      </a>
                      {hasDropdown && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedMobileMenu(isExpanded ? null : link.name);
                          }}
                          className="p-2 text-white hover:text-orange-600 focus:outline-none"
                        >
                          <ChevronDown 
                            size={24} 
                            className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </button>
                      )}
                    </div>
                    {hasDropdown && isExpanded && (
                      <div className="flex flex-col gap-2 pl-4 border-l border-white/20 mt-1">
                        {link.dropdown?.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="text-lg font-bold text-slate-300 hover:text-orange-500 transition-colors py-1"
                             onClick={(e) => {
                              setMobileMenuOpen(false);
                              if (link.name === 'Giới thiệu') {
                                e.preventDefault();
                                setCurrentView('about');
                                setActiveLink('Giới thiệu');
                                if (subItem.name === 'Cơ cấu tổ chức') {
                                  setAboutSubTab('structure');
                                } else if (subItem.name === 'Năng lực và Kinh nghiệm') {
                                  setAboutSubTab('experience');
                                } else {
                                  setAboutSubTab('overview');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else if (link.name === 'Dịch vụ') {
                                e.preventDefault();
                                setCurrentView('services');
                                setActiveLink('Dịch vụ');
                                if (onSelectService) onSelectService(subItem.href);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else if (link.name === 'Tin tức') {
                                e.preventDefault();
                                setCurrentView('news');
                                setActiveLink('Tin tức');
                                if (onSelectNewsCategory) {
                                  if (subItem.name === 'Tin công ty') onSelectNewsCategory('company');
                                  else if (subItem.name === 'Tin chuyên ngành') onSelectNewsCategory('specialty');
                                  else if (subItem.name === 'Tin tuyển dụng') onSelectNewsCategory('recruitment');
                                  else if (subItem.name === 'Tin khuyến mại') onSelectNewsCategory('promotion');
                                  else if (subItem.name === 'Quan hệ cổ đông') onSelectNewsCategory('shareholder');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                setCurrentView('home');
                                setActiveLink(link.name);
                              }
                            }}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
