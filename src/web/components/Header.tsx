/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- dual-runtime legacy visual component; Next navigation is injected by WebsiteShell */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  Menu, 
  X
} from 'lucide-react';
import { typeNav } from '@shared/components/Typography';
import { getNavigationData, type NavigationDataResult } from '../features/navigation/navigationData';
import type { PublicSystemSettings } from '@/features/system-settings/domain/model';
import { useI18n } from '@/shared/i18n';

interface HeaderProps {
  embedded?: boolean;
  variant?: 'overlay' | 'solid';
  pathname?: string;
  onNavigate?: (href: string) => void;
  settings?: PublicSystemSettings;
  navigation?: NavigationDataResult;
  currentView?: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search' | 'not-found';
  setCurrentView?: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search') => void;
  activeLink?: string;
  setActiveLink?: (link: string) => void;
  setAboutSubTab?: (tab: 'overview' | 'structure' | 'experience') => void;
  onSelectService?: (id: string | null) => void;
  onSelectProject?: (id: string | null) => void;
  onSelectNewsCategory?: (category: string | null) => void;
  onResetProducts?: () => void;
  onResetServices?: () => void;
  onResetProjects?: () => void;
  onResetNews?: () => void;
  onResetEvents?: () => void;
  onSearch?: (query: string) => void;
  onOpenConsultation?: () => void;
}

export const Header = ({ 
  embedded = false,
  variant,
  pathname,
  onNavigate,
  settings,
  navigation,
  currentView: legacyCurrentView,
  setCurrentView: setLegacyCurrentView,
  activeLink = '',
  setActiveLink: setLegacyActiveLink,
  setAboutSubTab: setLegacyAboutSubTab,
  onSelectService, 
  onSelectProject, 
  onSelectNewsCategory, 
  onResetProducts,
  onResetServices,
  onResetProjects,
  onResetNews,
  onResetEvents,
  onSearch, 
  onOpenConsultation 
}: HeaderProps) => {
  const { t, locale } = useI18n();
  const { headerLinks: navLinks } = navigation || getNavigationData();
  const resolvePublicHref = (href: string) => href.startsWith('/') ? href : `/services/${href.replace(/^\/+/, '')}`;
  const routeSegment = pathname?.split('/').filter(Boolean).find((s) => s !== 'en');
  const viewFromSegment = (segment?: string): Exclude<NonNullable<HeaderProps['currentView']>, 'not-found'> => {
    if (!segment) return 'home';
    if (segment === 'about' || segment === 'gioi-thieu') return 'about';
    if (segment === 'products' || segment === 'san-pham') return 'products';
    if (segment === 'services' || segment === 'dich-vu') return 'services';
    if (segment === 'projects' || segment === 'du-an') return 'projects';
    if (segment === 'news' || segment === 'tin-tuc') return 'news';
    if (segment === 'events' || segment === 'su-kien') return 'events';
    if (segment === 'contact' || segment === 'lien-he') return 'contact';
    if (segment === 'privacy' || segment === 'chinh-sach-bao-mat') return 'privacy';
    if (segment === 'terms' || segment === 'dieu-khoan-su-dung') return 'terms';
    if (segment === 'search' || segment === 'tim-kiem') return 'search';
    return 'home';
  };
  const currentView = legacyCurrentView ?? viewFromSegment(routeSegment);
  const navigateTo = (href: string) => {
    if (onNavigate) onNavigate(href);
    else window.location.assign(href);
  };
  const setCurrentView = (view: Parameters<NonNullable<HeaderProps['setCurrentView']>>[0]) => setLegacyCurrentView?.(view);
  const setActiveLink = (link: string) => setLegacyActiveLink?.(link);
  const setAboutSubTab = (tab: Parameters<NonNullable<HeaderProps['setAboutSubTab']>>[0]) => setLegacyAboutSubTab?.(tab);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleGlobalSearch = () => {
    if (localSearchQuery.trim()) {
      onSearch?.(localSearchQuery);
      setCurrentView?.('search');
      setActiveLink?.('');
      setIsSearchOpen(false);
      navigateTo(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen, isSearchOpen]);

  const isSolidView = variant === 'solid' || (variant === undefined && (currentView === 'products' || currentView === 'about' || currentView === 'services' || currentView === 'projects' || currentView === 'news' || currentView === 'events' || currentView === 'contact' || currentView === 'privacy' || currentView === 'terms' || currentView === 'search'));
  // Header should be styled as white/dark-text if we are in solid page views OR if we scrolled down on homepage
  const isHeaderWhite = isScrolled || isSolidView;

  const switchLanguage = (targetLang: 'vi' | 'en') => {
    if (targetLang === locale) return;
    const current = pathname || '/';
    if (targetLang === 'en') {
      if (current === '/') navigateTo('/en');
      else if (!current.startsWith('/en')) navigateTo(`/en${current}`);
    } else {
      if (current === '/en') navigateTo('/');
      else if (current.startsWith('/en/')) navigateTo(current.replace(/^\/en/, ''));
      else navigateTo(current);
    }
  };

  return (
    <>
      <header 
        className={`${embedded ? 'absolute' : 'fixed'} top-0 w-full z-50 h-[var(--public-header-height)] transition-all duration-300 flex items-center ${
          isHeaderWhite 
            ? 'bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] border-b border-slate-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between h-full gap-3">
          <div className="flex items-center gap-2 h-full">
            <a 
              href={locale === 'en' ? '/en' : '/'}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setCurrentView('home');
                setActiveLink('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigateTo(locale === 'en' ? '/en' : '/');
              }}
              className="flex items-center group h-full"
            >
              <img 
                src={
                  (!isHeaderWhite && settings?.values?.logo_white)
                    ? settings.values.logo_white
                    : (settings?.values?.logo || settings?.values?.logo_white || '/LOGO - 1990-08.png')
                } 
                alt={settings?.values?.site_name || 'CIC Logo'} 
                className="h-16 md:h-18 max-h-18 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-6 min-w-0">
            {navLinks.map((link) => {
              const hasDropdown = !!link.dropdown;
              const linkView = viewFromSegment(link.href.replace(/^\/en/, '').split('/').filter(Boolean)[0]);
              const isActive = (currentView === linkView && linkView !== 'home') || 
                               (currentView === 'home' && (activeLink === link.name || link.href === '/' || link.href === '/en'));
              return (
                <div 
                  key={link.name} 
                  className="relative group py-2"
                >
                  <a
                    href={resolvePublicHref(link.href)}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      navigateTo(resolvePublicHref(link.href));
                      if (linkView === 'products') {
                        e.preventDefault();
                        setCurrentView('products');
                        setActiveLink(link.name);
                        if (onResetProducts) onResetProducts();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (linkView === 'about') {
                        e.preventDefault();
                        setCurrentView('about');
                        setAboutSubTab('overview');
                        setActiveLink(link.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (linkView === 'services') {
                        e.preventDefault();
                        setCurrentView('services');
                        setActiveLink(link.name);
                        if (onSelectService) onSelectService(null);
                        if (onResetServices) onResetServices();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (linkView === 'projects') {
                        e.preventDefault();
                        setCurrentView('projects');
                        setActiveLink(link.name);
                        if (onSelectProject) onSelectProject(null);
                        if (onResetProjects) onResetProjects();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (linkView === 'news') {
                        e.preventDefault();
                        setCurrentView('news');
                        setActiveLink(link.name);
                        if (onSelectNewsCategory) onSelectNewsCategory('all');
                        if (onResetNews) onResetNews();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (linkView === 'events') {
                        e.preventDefault();
                        setCurrentView('events');
                        setActiveLink(link.name);
                        if (onResetEvents) onResetEvents();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (linkView === 'contact') {
                        e.preventDefault();
                        setCurrentView('contact');
                        setActiveLink(link.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setCurrentView('home');
                        setActiveLink(link.name);
                      }
                    }}
                    className={`flex items-center gap-1.5 ${typeNav} transition-all duration-200 cursor-pointer py-1 ${
                      isActive 
                        ? 'text-orange-600 font-bold border-b-2 border-orange-600 pb-0.5' 
                        : isHeaderWhite 
                          ? 'text-slate-800 hover:text-orange-600 font-medium' 
                          : 'text-white/90 hover:text-white font-medium'
                    }`}
                  >
                    <span>{link.name}</span>
                    {hasDropdown && (
                      <ChevronDown 
                        size={14} 
                        className="transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" 
                      />
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  {hasDropdown && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="bg-white rounded-[8px] shadow-2xl border border-slate-100 py-3 px-2 min-w-[240px] flex flex-col gap-1">
                        {link.dropdown?.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={resolvePublicHref(subItem.href)}
                            onClick={(e) => {
                              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                              navigateTo(resolvePublicHref(subItem.href));
                              if (linkView === 'about') {
                                e.preventDefault();
                                setCurrentView('about');
                                setActiveLink(link.name);
                                if (subItem.name.includes('cấu') || subItem.name.includes('Structure')) {
                                  setAboutSubTab('structure');
                                } else if (subItem.name.includes('lực') || subItem.name.includes('Experience')) {
                                  setAboutSubTab('experience');
                                } else {
                                  setAboutSubTab('overview');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else if (linkView === 'services') {
                                e.preventDefault();
                                setCurrentView('services');
                                setActiveLink(link.name);
                                onSelectService?.(subItem.name);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="block px-4 py-2 text-[15px] font-normal text-slate-800 hover:text-orange-600 hover:bg-slate-50 transition-all text-left whitespace-nowrap rounded-[8px]"
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

          <div className="flex items-center gap-2 xl:gap-4 shrink-0">
            {/* Language Selector */}
            <div className={`hidden md:flex items-center gap-1 p-1 rounded-[8px] border backdrop-blur-md transition-all duration-500 ${
              isHeaderWhite ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'
            }`}>
              <button 
                type="button"
                onClick={() => switchLanguage('vi')}
                className={`px-3 py-1 text-[10px] font-black rounded-[8px] transition-all cursor-pointer ${
                  locale === 'vi' 
                    ? 'bg-orange-600 text-white shadow-sm' 
                    : (isHeaderWhite ? 'text-slate-400 hover:text-slate-600' : 'text-white/50 hover:text-white')
                }`}
                title={t.header.viLanguage}
              >
                VN
              </button>
              <button 
                type="button"
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 text-[10px] font-black rounded-[8px] transition-all cursor-pointer ${
                  locale === 'en'
                    ? 'bg-orange-600 text-white shadow-sm' 
                    : (isHeaderWhite ? 'text-slate-400 hover:text-slate-600' : 'text-white/50 hover:text-white')
                }`}
                title={t.header.enLanguage}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-[8px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${isHeaderWhite ? 'text-slate-600 hover:text-orange-600' : 'text-white hover:text-orange-400'}`}
              title={t.common.search}
            >
              <Search size={20} />
            </button>
            <button 
              onClick={onOpenConsultation}
              className="hidden xl:inline-flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-bold tracking-wide transition-all active:scale-95 shadow-sm shadow-orange-600/20 btn-modern-interaction cursor-pointer"
            >
              {t.header.consultationCta}
            </button>
            <button 
              className="lg:hidden min-h-11 min-w-11 inline-flex items-center justify-center p-2 text-white rounded-[8px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.common.close : t.header.menuAria}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-slate-900" />
              ) : (
                <Menu size={24} className={isHeaderWhite ? 'text-slate-950' : 'text-white'} />
              )}
            </button>
          </div>
        </div>

        {/* Floating Search Bar Overlay underneath header without affecting header layout or height */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full left-0 right-0 w-full border-b shadow-2xl py-4 px-4 sm:px-8 z-50 transition-colors ${
                !isHeaderWhite 
                  ? 'bg-slate-950/95 backdrop-blur-md border-slate-800 text-white shadow-black/50' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
                <Search className="text-orange-600 shrink-0" size={20} />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGlobalSearch();
                    }
                  }}
                  placeholder={t.header.searchPlaceholder}
                  aria-label={t.common.search}
                  className={`w-full border px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-[8px] font-bold transition-colors ${
                    !isHeaderWhite
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  autoFocus
                />
                <button
                  onClick={handleGlobalSearch}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs tracking-wider transition-colors shrink-0 rounded-[8px]"
                >
                  {t.common.search}
                </button>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className={`p-2 transition-colors shrink-0 rounded-[8px] ${
                    !isHeaderWhite
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title={t.common.close}
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-[85vw] max-w-[320px] sm:max-w-[360px] h-full bg-slate-900 border-l border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-2xl z-10 overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={settings?.values?.logo_white || settings?.values?.logo || '/logo.png'} 
                    alt={settings?.values?.site_name || 'CIC Logo'} 
                    className="h-8 w-auto object-contain filter brightness-110" 
                  />
                  <span className="text-sm font-black tracking-wider text-white uppercase">{settings?.values?.site_name || 'CIC Technology'}</span>
                </div>
                <button 
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Đóng menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="flex flex-col gap-1 overflow-y-auto my-4 pr-1 py-1 custom-scrollbar flex-1">
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
                    <div key={link.name} className="flex flex-col">
                      <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                        isActive ? 'bg-orange-500/10 text-orange-500 font-bold' : 'hover:bg-slate-800/60 text-slate-200 hover:text-white'
                      }`}>
                        <a
                          href={resolvePublicHref(link.href)}
                          className="text-base font-semibold transition-colors flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                            navigateTo(resolvePublicHref(link.href));
                            setMobileMenuOpen(false);
                            if (link.name === 'Sản phẩm') {
                              e.preventDefault();
                              setCurrentView('products');
                              setActiveLink('Sản phẩm');
                              if (onResetProducts) onResetProducts();
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
                              if (onResetServices) onResetServices();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else if (link.name === 'Dự án') {
                              e.preventDefault();
                              setCurrentView('projects');
                              setActiveLink('Dự án');
                              if (onSelectProject) onSelectProject(null);
                              if (onResetProjects) onResetProjects();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else if (link.name === 'Tin tức') {
                              e.preventDefault();
                              setCurrentView('news');
                              setActiveLink('Tin tức');
                              if (onSelectNewsCategory) onSelectNewsCategory('all');
                              if (onResetNews) onResetNews();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else if (link.name === 'Sự kiện') {
                              e.preventDefault();
                              setCurrentView('events');
                              setActiveLink('Sự kiện');
                              if (onResetEvents) onResetEvents();
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
                            className="p-1 text-slate-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                            aria-label={`Mở danh mục ${link.name}`}
                          >
                            <ChevronDown 
                              size={18} 
                              className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-orange-500' : ''}`} 
                            />
                          </button>
                        )}
                      </div>
                      {hasDropdown && isExpanded && (
                        <div className="flex flex-col gap-0.5 pl-3 my-1 border-l-2 border-orange-500/40 ml-3 bg-slate-950/30 rounded-r-lg py-1">
                          {link.dropdown?.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={resolvePublicHref(subItem.href)}
                              className="text-sm font-normal text-slate-300 hover:text-orange-400 transition-colors py-1.5 px-2 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onClick={(e) => {
                                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                                navigateTo(resolvePublicHref(subItem.href));
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
                                    else if (subItem.name === 'Hợp tác quốc tế' || subItem.name === 'Hợp tác Quốc tế' || subItem.name === 'Tin hợp tác quốc tế' || subItem.name === 'Tin hợp tác Quốc tế') onSelectNewsCategory('international');
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

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 shrink-0 flex flex-col gap-3">
                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      switchLanguage('vi');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      locale === 'vi' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiếng Việt (VN)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchLanguage('en');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      locale === 'en' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation?.();
                  }}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-center uppercase tracking-wider text-xs transition-all active:scale-[0.98] rounded-[8px] shadow-lg shadow-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {t.header.consultationCta}
                </button>
                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
                  <span>{t.common.hotline}: <strong className="text-slate-200">{settings?.values?.tel || '024 3976 1381'}</strong></span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
