'use client';
import { useState, type ReactNode } from 'react';
import { Header } from '@/web/components/Header';
import { Footer } from '@/web/components/Footer';
type View = 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search' | 'not-found';
export function WebsiteShell({ children }: Readonly<{ children: ReactNode }>) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeLink, setActiveLink] = useState('');
  const noop = () => undefined;
  const setFooterView = (view: View | 'cms') => { if (view !== 'cms') setCurrentView(view); };
  return <div className="min-h-screen bg-white text-slate-900"><Header currentView={currentView} setCurrentView={setCurrentView} activeLink={activeLink} setActiveLink={setActiveLink} setAboutSubTab={noop} onSelectService={noop} onSelectProject={noop} onSelectNewsCategory={noop} onResetProducts={noop} onResetServices={noop} onResetProjects={noop} onResetNews={noop} onResetEvents={noop} onSearch={noop} onOpenConsultation={noop} /><main>{children}</main><Footer setCurrentView={setFooterView} setActiveLink={setActiveLink} onResetProducts={noop} onResetServices={noop} onResetProjects={noop} onResetNews={noop} onResetEvents={noop} /></div>;
}
