/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';

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
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white relative">
      {/* Interactive Background Engine */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-100">
        {currentView === 'about' ? (
          <TechAboutBackground />
        ) : (
          <Constellation 
            density={9000} 
            lineDistance={200} 
            particleColor="rgba(234, 88, 12, 0.5)" 
            lineColor="rgba(234, 88, 12, " 
          />
        )}
      </div>

      {/* Floating Contact Bar */}
      <div className="fixed right-6 bottom-10 z-[100] flex flex-col gap-4">
        {[
          { icon: <ZaloIcon size={24} />, label: 'Zalo', color: 'bg-blue-600', link: 'https://zalo.me/02439761381' },
          { icon: <MessageCircle size={24} />, label: 'Messenger', color: 'bg-sky-500', link: '#' },
          { icon: <Phone size={24} />, label: 'Hotline', color: 'bg-orange-600', link: 'tel:02439761381' }
        ].map((item, i) => (
          <motion.a 
            key={i}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            whileHover={{ scale: 1.1, x: -5 }}
            className={`${item.color} text-white w-14 h-14 rounded-none flex items-center justify-center shadow-2xl relative group`}
          >
            {item.icon}
            <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-none opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Reusable Clean Header Component */}
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        setAboutSubTab={setAboutSubTab}
        onSelectService={setActiveServiceId}
        onSelectProject={setActiveProjectId}
        onSelectNewsCategory={setPreSelectedNewsCategory}
        onSearch={(query) => setGlobalSearchQuery(query)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <main className="relative z-10">
        {currentView === 'home' ? (
          <HomeView
            setCurrentView={setCurrentView}
            setActiveLink={setActiveLink}
            setActiveServiceId={setActiveServiceId}
            setActiveProjectId={setActiveProjectId}
            setPreSelectedNewsCategory={setPreSelectedNewsCategory}
            setAboutSubTab={setAboutSubTab}
          />
        ) : currentView === 'about' ? (
          <AboutView activeTab={aboutSubTab} setActiveTab={setAboutSubTab} />
        ) : currentView === 'services' ? (
          <ServicesView 
            initialServiceId={activeServiceId} 
            onNavigateHome={() => { 
              setCurrentView('home'); 
              setActiveLink(''); 
            }} 
          />
        ) : currentView === 'projects' ? (
          <ProjectsView 
            initialProjectId={activeProjectId} 
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
          />
        ) : currentView === 'news' ? (
          <NewsView 
            initialCategory={preSelectedNewsCategory}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'events' ? (
          <EventsView 
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProduct={() => {
              setCurrentView('products');
              setActiveLink('Sản phẩm');
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
            }}
            onNavigateToProject={(projectId) => {
              setCurrentView('projects');
              setActiveLink('Dự án');
              setActiveProjectId(projectId);
            }}
            onNavigateToService={(serviceId) => {
              setCurrentView('services');
              setActiveLink('Dịch vụ');
              setActiveServiceId(serviceId);
            }}
            onNavigateToNews={(category) => {
              setCurrentView('news');
              setActiveLink('Tin tức');
              setPreSelectedNewsCategory(category);
            }}
            onNavigateToEvent={() => {
              setCurrentView('events');
              setActiveLink('Sự kiện');
            }}
            onNavigateHome={() => {
              setCurrentView('home');
              setActiveLink('');
            }}
          />
        ) : (
          <ProductsView />
        )}
      </main>

      {/* Reusable Clean Footer Component */}
      <Footer 
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
      />

      {/* Modern consultation form modal */}
      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </div>
  );
}
