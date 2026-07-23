/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Facebook, Linkedin } from 'lucide-react';

import { Constellation } from './components/Constellation';
import { TechAboutBackground } from './components/TechAboutBackground';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ZaloIcon } from './components/shared/Icons';
import { ConsultationModal } from './components/ConsultationModal';

// View components
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { AboutView } from './components/AboutView';
import { ServicesView } from './components/ServicesView';
import { ProjectsView } from './components/ProjectsView';
import { NewsView } from './components/NewsView';
import { EventsView } from './components/EventsView';
import { ContactView } from './components/ContactView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsOfUseView } from './components/TermsOfUseView';
import { SearchView } from './components/SearchView';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search'>('home');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [preSelectedNewsCategory, setPreSelectedNewsCategory] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState('');
  const [aboutSubTab, setAboutSubTab] = useState<'overview' | 'structure' | 'experience'>('overview');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [isRegisteringEvent, setIsRegisteringEvent] = useState<boolean>(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // View reset keys to ensure clicking header/footer menu returns from detail pages back to list pages
  const [productsResetKey, setProductsResetKey] = useState(0);
  const [servicesResetKey, setServicesResetKey] = useState(0);
  const [projectsResetKey, setProjectsResetKey] = useState(0);
  const [newsResetKey, setNewsResetKey] = useState(0);
  const [eventsResetKey, setEventsResetKey] = useState(0);

  const handleResetProducts = () => {
    setProductsResetKey(prev => prev + 1);
  };

  const handleResetServices = () => {
    setActiveServiceId(null);
    setServicesResetKey(prev => prev + 1);
  };

  const handleResetProjects = () => {
    setActiveProjectId(null);
    setProjectsResetKey(prev => prev + 1);
  };

  const handleResetNews = () => {
    setPreSelectedNewsCategory('all');
    setNewsResetKey(prev => prev + 1);
  };

  const handleResetEvents = () => {
    setActiveEventId(null);
    setIsRegisteringEvent(false);
    setEventsResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white relative">
      {/* Interactive Background Engine (Chỉ hiển thị tại Trang Chủ) */}
      {currentView === 'home' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-100">
          <Constellation 
            density={16000} 
            lineDistance={160} 
            particleColor="rgba(234, 88, 12, 0.4)" 
            lineColor="rgba(234, 88, 12, " 
          />
        </div>
      )}

      {/* Floating Contact Bar */}
      <div className="fixed right-4 sm:right-6 bottom-6 z-[100] flex flex-col gap-3.5">
        {[
          { 
            id: 'hotline',
            icon: <Phone size={24} className="animate-pulse text-white" />, 
            label: 'Hotline: 024 3976 1381', 
            color: 'bg-orange-600 hover:bg-orange-500', 
            link: 'tel:02439761381' 
          },
          { 
            id: 'zalo',
            icon: <ZaloIcon size={28} />, 
            label: 'Zalo: 024 3976 1381 / OA CIC', 
            color: 'bg-[#0068FF] hover:bg-[#0052cc]', 
            link: 'https://zalo.me/1727624419140352798' 
          },
          { 
            id: 'fb',
            icon: <Facebook size={24} className="text-white" />, 
            label: 'Fanpage Facebook CIC', 
            color: 'bg-[#1877F2] hover:bg-[#1566d2]', 
            link: 'https://www.facebook.com/CICTechnologyandConsultancyVN' 
          },
          { 
            id: 'linkedin',
            icon: <Linkedin size={24} className="text-white" />, 
            label: 'LinkedIn CIC', 
            color: 'bg-[#0A66C2] hover:bg-[#084e96]', 
            link: 'https://www.linkedin.com/in/c%C3%B4ng-ty-cp-c%C3%B4ng-ngh%E1%BB%87-v%C3%A0-t%C6%B0-v%E1%BA%A5n-cic/' 
          }
        ].map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            whileHover={{ scale: 1.1, x: -4 }}
            className="relative group"
          >
            <a 
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className={`${item.color} text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all`}
            >
              {item.icon}
            </a>
            
            {/* Tooltip */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Reusable Clean Header Component */}
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        setAboutSubTab={setAboutSubTab}
        onSelectService={(id) => {
          setActiveServiceId(id);
          setServicesResetKey(prev => prev + 1);
        }}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setProjectsResetKey(prev => prev + 1);
        }}
        onSelectNewsCategory={(cat) => {
          setPreSelectedNewsCategory(cat);
          setNewsResetKey(prev => prev + 1);
        }}
        onResetProducts={handleResetProducts}
        onResetServices={handleResetServices}
        onResetProjects={handleResetProjects}
        onResetNews={handleResetNews}
        onResetEvents={handleResetEvents}
        onSearch={(query) => setGlobalSearchQuery(query)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <main className="relative">
        {currentView === 'home' ? (
          <HomeView
            setCurrentView={setCurrentView}
            setActiveLink={setActiveLink}
            setActiveServiceId={setActiveServiceId}
            setActiveProjectId={setActiveProjectId}
            setPreSelectedNewsCategory={setPreSelectedNewsCategory}
            setAboutSubTab={setAboutSubTab}
            setActiveEventId={setActiveEventId}
            setIsRegisteringEvent={setIsRegisteringEvent}
          />
        ) : currentView === 'about' ? (
          <AboutView 
            activeTab={aboutSubTab} 
            setActiveTab={setAboutSubTab} 
            onNavigateToContact={() => {
              setCurrentView('contact');
              setActiveLink('Liên hệ');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'services' ? (
          <ServicesView 
            key={`services-${servicesResetKey}`}
            initialServiceId={activeServiceId} 
            onNavigateHome={() => { 
              setCurrentView('home'); 
              setActiveLink(''); 
            }} 
          />
        ) : currentView === 'projects' ? (
          <ProjectsView 
            key={`projects-${projectsResetKey}`}
            initialProjectId={activeProjectId} 
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              setServicesResetKey(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
              setProductsResetKey(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
          />
        ) : currentView === 'news' ? (
          <NewsView 
            key={`news-${newsResetKey}`}
            initialCategory={preSelectedNewsCategory}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              setServicesResetKey(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
              setProductsResetKey(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'events' ? (
          <EventsView 
            key={`events-${eventsResetKey}`}
            initialEventId={activeEventId}
            initialIsRegistering={isRegisteringEvent}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              setServicesResetKey(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
              setProductsResetKey(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'contact' ? (
          <ContactView 
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
          />
        ) : currentView === 'privacy' ? (
          <PrivacyPolicyView 
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'terms' ? (
          <TermsOfUseView 
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'search' ? (
          <SearchView
            initialQuery={globalSearchQuery}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
              setProductsResetKey(prev => prev + 1);
            }}
            onNavigateToProject={(projectId) => {
              setCurrentView('projects');
              setActiveLink('Dự án');
              setActiveProjectId(projectId);
              setProjectsResetKey(prev => prev + 1);
            }}
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              setServicesResetKey(prev => prev + 1);
            }}
            onNavigateToNews={(category) => {
              setCurrentView('news');
              setActiveLink('Tin tức');
              setPreSelectedNewsCategory(category);
              setNewsResetKey(prev => prev + 1);
            }}
            onNavigateToEvent={() => {
              setCurrentView('events');
              setActiveLink('Sự kiện');
              setEventsResetKey(prev => prev + 1);
            }}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
          />
        ) : (
          <ProductsView key={`products-${productsResetKey}`} />
        )}
      </main>

      {/* Reusable Clean Footer Component */}
      <Footer 
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
        onResetProducts={handleResetProducts}
        onResetServices={handleResetServices}
        onResetProjects={handleResetProjects}
        onResetNews={handleResetNews}
        onResetEvents={handleResetEvents}
      />

      {/* Modern consultation form modal */}
      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </div>
  );
}
