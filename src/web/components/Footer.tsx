/* eslint-disable @next/next/no-img-element, @next/next/no-location-assign-relative-destination -- legacy fallback only; WebsiteShell injects router.push */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Globe 
} from 'lucide-react';
import { ZaloIcon } from '@shared/components/Icons';
import { typeH4, typeButton, typeCaption, typeLabel, typeMeta } from '@shared/components/Typography';
import { getNavigationData, type FooterNavigationItem, type NavigationDataResult, type PublicNavigationView } from '../features/navigation/navigationData';
import type { PublicSystemSettings } from '@/features/system-settings/domain/model';
import { useI18n } from '@/shared/i18n';

interface FooterProps {
  settings?: PublicSystemSettings;
  navigation?: NavigationDataResult;
  onNavigate?: (href: string) => void;
  setCurrentView?: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'cms') => void;
  setActiveLink?: (link: string) => void;
  onResetProducts?: () => void;
  onResetServices?: () => void;
  onResetProjects?: () => void;
  onResetNews?: () => void;
  onResetEvents?: () => void;
}

export const Footer = ({ 
  settings,
  navigation,
  onNavigate,
  setCurrentView: setLegacyCurrentView,
  setActiveLink: setLegacyActiveLink,
  onResetProducts,
  onResetServices,
  onResetProjects,
  onResetNews,
  onResetEvents
}: FooterProps) => {
  const { t, locale } = useI18n();
  const { footerPrimaryLinks, footerSolutionLinks, footerServiceLinks } = navigation || getNavigationData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const values = settings?.values ?? {};
  const publicBranches = settings?.branches ?? [];
  const headOffice = publicBranches.find((branch) => branch.isHeadOffice) ?? publicBranches[0];
  const otherBranches = publicBranches.filter((branch) => branch.id !== headOffice?.id);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };
  const resetByView: Partial<Record<PublicNavigationView, (() => void) | undefined>> = {
    products: onResetProducts,
    services: onResetServices,
    projects: onResetProjects,
    news: onResetNews,
    events: onResetEvents,
  };

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, item: FooterNavigationItem) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setLegacyCurrentView?.(item.view);
    setLegacyActiveLink?.(item.activeLabel);
    if (item.reset) resetByView[item.view]?.();
    if (item.scrollToTop !== false) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigate) onNavigate(item.href);
    else window.location.assign(item.href);
  };

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <img 
                src={values.logo_white || values.logo || '/LOGO - 1990-08.png'}
                alt="CIC Logo Small" 
                className="h-26 sm:h-30 w-auto mb-4 rounded-[10px]"
              />
            </div>
            <p className={`${typeH4} text-white mb-4 leading-tight`}>
              {values.legal_name || 'Công ty cổ phần Công nghệ và Tư vấn CIC'}
            </p>
            {values.tax_id && (
              <p className="text-xs text-slate-400 mb-3">
                {t.footer.taxCodeLabel} <span className="text-white font-mono">{values.tax_id}</span>
              </p>
            )}
            <div className="mb-8">
              <h4 className={`${typeCaption} text-white/60 mb-4`}>{t.footer.newsletterTitle}</h4>
              {newsletterSubscribed ? (
                <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 px-4 py-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2">
                  <span>✓</span> {t.footer.newsletterSuccess}
                </div>
              ) : (
                <form className="relative flex flex-col sm:flex-row gap-2" onSubmit={handleNewsletterSubmit}>
                  <input 
                    type="email" 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t.footer.newsletterPlaceholder} 
                    className="min-w-0 flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-[8px] transition-all"
                  />
                  <button type="submit" className={`px-5 py-2.5 bg-orange-600 text-white ${typeButton} rounded-lg hover:bg-orange-700 transition-all btn-modern-interaction cursor-pointer`}>{t.footer.newsletterButton}</button>
                </form>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href={values.facebook || 'https://www.facebook.com/CICTechnologyandConsultancyVN/'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all shadow-lg group">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              {values.linkedin_url ? (
                <a href={values.linkedin_url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2] text-white transition-all shadow-lg group">
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ) : (
                <span aria-label="LinkedIn" aria-disabled="true" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center text-white/50 shadow-lg group cursor-not-allowed">
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                </span>
              )}
              <a href={values.youtube || 'https://www.youtube.com/channel/UCVrD2Lw1V96ggdwQNs87qEQ'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] text-white transition-all shadow-lg group">
                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href={values.zalo_url || 'https://zalo.me/02439761381'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 text-white transition-all shadow-lg group">
                <ZaloIcon size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href={values.domain || 'https://www.cic.com.vn'} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-[8px] border border-white/10 flex items-center justify-center hover:bg-slate-800 hover:border-slate-800 text-white transition-all shadow-lg group">
                <Globe size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="lg:col-span-2">
            <h3 className={`${typeLabel} text-white mb-8`}>{t.footer.navigationTitle}</h3>
            <ul className="space-y-4 text-sm font-semibold">
              {footerPrimaryLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={(event) => handleNavigation(event, item)} className="hover:text-orange-600 transition-all flex items-center gap-2 underline-offset-4 hover:underline">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={`${typeLabel} text-white mb-8`}>{t.footer.solutionsAndServicesTitle}</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className={`${typeMeta} text-white/60 mb-4`}>{t.footer.solutionsTitle}</h4>
                <ul className="space-y-3 text-xs font-bold">
                  {footerSolutionLinks.map((item) => <li key={item.label}><a href={item.href} onClick={(event) => handleNavigation(event, item)} className="hover:text-orange-600 transition-all">{item.label}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className={`${typeMeta} text-white/60 mb-4`}>{t.footer.servicesTitle}</h4>
                <ul className="space-y-3 text-xs font-bold">
                  {footerServiceLinks.map((item) => <li key={item.label}><a href={item.href} onClick={(event) => handleNavigation(event, item)} className="hover:text-orange-600 transition-all">{item.label}</a></li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h3 className={`${typeLabel} text-white mb-6 flex items-center gap-2`}>
                <MapPin size={18} className="text-orange-600" /> {t.footer.headOfficeTitle}
              </h3>
              <div className={`${typeCaption} space-y-4 text-slate-400`}>
                <p className="leading-relaxed">{headOffice?.address || (locale === 'en' ? '4th Floor, VG Building, 235 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam' : 'Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Thành phố Hà Nội, Việt Nam')}</p>
                <div className="flex flex-col gap-2">
                  <a href={`tel:${(headOffice?.phone || values.tel || '02439761381').replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Phone size={14} className="text-orange-600" /> {headOffice?.phone || values.tel || '024 3976 1381'}
                  </a>
                  <a href={`mailto:${headOffice?.email || values.public_email || values.admin_email || 'info@cic.com.vn'}`} className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Mail size={14} className="text-orange-600" /> {headOffice?.email || values.public_email || values.admin_email || 'info@cic.com.vn'}
                  </a>
                  <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <ExternalLink size={14} className="text-orange-600" /> www.cic.com.vn
                  </a>
                </div>
              </div>
            </div>

            {otherBranches.map((branch) => <div key={branch.id}>
              <h3 className={`${typeLabel} text-white mb-6 flex items-center gap-2`}>
                <MapPin size={18} className="text-orange-600" /> {branch.name}
              </h3>
              <div className={`${typeCaption} space-y-4 text-slate-400`}>
                <p className="leading-relaxed">{branch.address}</p>
                <div className="flex flex-col gap-2">
                  <a href={`tel:${branch.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Phone size={14} className="text-orange-600" /> {branch.phone}
                  </a>
                  <a href={`mailto:${branch.email}`} className="flex items-center gap-2 hover:text-orange-600 transition-all font-bold">
                    <Mail size={14} className="text-orange-600" /> {branch.email}
                  </a>
                </div>
              </div>
            </div>)}
          </div>
        </div>

        <div className={`pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 ${typeMeta}`}>
          <div className="flex items-center gap-4 flex-wrap">
            {values.footer_bottom ? (
              <div
                className="[&_a]:text-orange-400 [&_a]:hover:underline inline [&_p]:inline [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: values.footer_bottom }}
              />
            ) : (
              <p>{t.footer.copyright}</p>
            )}
            {values.bct_badge_url && (
              <a href={values.bct_badge_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-orange-400 hover:underline">
                <span>{locale === 'en' ? 'Ministry of Industry & Trade Certified' : 'Chứng nhận Bộ Công Thương'}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10">
            <a 
              href={locale === 'en' ? '/en/privacy' : '/privacy'}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setLegacyCurrentView?.('privacy');
                setLegacyActiveLink?.('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const target = locale === 'en' ? '/en/privacy' : '/privacy';
                if (onNavigate) onNavigate(target);
                else window.location.assign(target);
              }} 
              className="hover:text-white transition-all cursor-pointer uppercase"
            >
              {t.footer.privacyPolicy}
            </a>
            <a 
              href={locale === 'en' ? '/en/terms' : '/terms'}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setLegacyCurrentView?.('terms');
                setLegacyActiveLink?.('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const target = locale === 'en' ? '/en/terms' : '/terms';
                if (onNavigate) onNavigate(target);
                else window.location.assign(target);
              }}
              className="hover:text-white transition-all cursor-pointer uppercase"
            >
              {t.footer.termsOfUse}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
