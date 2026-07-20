/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, X } from 'lucide-react';

import { Constellation } from './components/Constellation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
  const [activeLink, setActiveLink] = useState('Giới thiệu');
  const [aboutSubTab, setAboutSubTab] = useState<'overview' | 'structure' | 'experience'>('overview');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const chatbotUrl = import.meta.env.VITE_CHATBOT_URL || 'http://localhost/chat';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white relative">
      {/* Interactive Constellation Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-100">
        <Constellation 
          density={9000} 
          lineDistance={200} 
          particleColor="rgba(234, 88, 12, 0.5)" 
          lineColor="rgba(234, 88, 12, " 
        />
      </div>

      {/* CIC chatbot launcher */}
      <div className="fixed bottom-6 right-4 z-[100] sm:bottom-8 sm:right-6">
        {isChatbotOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-20 right-0 h-[min(680px,calc(100vh-120px))] w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:w-[430px]"
            aria-label="Chatbot tư vấn CIC"
          >
            <header className="flex h-14 items-center justify-between bg-slate-950 px-4 text-white">
              <div className="flex items-center gap-2"><Bot size={20} className="text-orange-400"/><div><p className="text-sm font-black">CIC Smart Advisor</p><p className="text-[10px] text-slate-300">Tư vấn sản phẩm và pháp lý</p></div></div>
              <button type="button" onClick={() => setIsChatbotOpen(false)} aria-label="Đóng chatbot" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"><X size={19}/></button>
            </header>
            <iframe src={chatbotUrl} title="CIC Smart Advisor" className="h-[calc(100%-56px)] w-full border-0" allow="clipboard-write" />
          </motion.section>
        )}
        <motion.button
          type="button"
          onClick={() => setIsChatbotOpen((open) => !open)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isChatbotOpen ? 'Đóng chatbot CIC' : 'Mở chatbot CIC'}
          aria-expanded={isChatbotOpen}
          className="group relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_14px_35px_rgba(234,88,12,0.4)] ring-4 ring-white transition-shadow hover:shadow-[0_18px_42px_rgba(234,88,12,0.55)]"
        >
          {isChatbotOpen ? <X size={28}/> : <Bot size={30}/>}<span className="absolute right-full mr-3 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Chat với CIC</span>
        </motion.button>
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
            setActiveLink('Giới thiệu'); 
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
            setActiveLink('Giới thiệu');
          }}
        />
      ) : currentView === 'news' ? (
        <NewsView 
          initialCategory={preSelectedNewsCategory}
          onNavigateHome={() => {
            setCurrentView('home');
            setActiveLink('Giới thiệu');
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
            setActiveLink('Giới thiệu');
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
            setActiveLink('Giới thiệu');
          }}
        />
      ) : currentView === 'privacy' ? (
        <PrivacyPolicyView 
          onNavigateHome={() => {
            setCurrentView('home');
            setActiveLink('Giới thiệu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'terms' ? (
        <TermsOfUseView 
          onNavigateHome={() => {
            setCurrentView('home');
            setActiveLink('Giới thiệu');
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
            setActiveLink('Giới thiệu');
          }}
        />
      ) : (
        <ProductsView />
      )}

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
