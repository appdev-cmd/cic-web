import React from 'react';
import { Header } from '../../web/components/Header';
import { Footer } from '../../web/components/Footer';

type PublicView = 'products' | 'services' | 'projects' | 'news' | 'events';

interface PreviewChromeProps {
  view?: PublicView;
}

const noop = () => undefined;

export const PublicSitePreviewHeader: React.FC<PreviewChromeProps> = ({ view = 'news' }) => (
  <div className="relative h-18 w-full bg-white">
    <Header
      embedded
      currentView={view}
      setCurrentView={noop}
      activeLink=""
      setActiveLink={noop}
      setAboutSubTab={noop}
    />
  </div>
);

export const PublicSitePreviewFooter: React.FC = () => (
  <div className="w-full">
    <Footer setCurrentView={noop} setActiveLink={noop} />
  </div>
);
