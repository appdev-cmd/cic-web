import React, { useEffect, useRef } from 'react';
import { AboutView } from '../../../web/components/AboutView';
import { ContactView } from '../../../web/components/ContactView';
import { HomeView } from '../../../web/components/HomeView';
import { PrivacyPolicyView } from '../../../web/components/PrivacyPolicyView';
import type { PageBuilderPage, PageBuilderSection } from './pageBuilderTypes';

interface PageBuilderVisualCanvasProps {
  pageCode: PageBuilderPage['code'];
  sections: PageBuilderSection[];
  selectedId: string;
  issueIds: Set<string>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onSelect: (id: string) => void;
}

const noop = () => undefined;

function WebsitePage({ pageCode }: { pageCode: PageBuilderPage['code'] }) {
  if (pageCode === 'home') {
    return <HomeView setCurrentView={noop} setActiveLink={noop} setActiveServiceId={noop} setActiveProjectId={noop} setPreSelectedNewsCategory={noop} setAboutSubTab={noop} setActiveEventId={noop} setIsRegisteringEvent={noop} />;
  }
  if (pageCode === 'about') return <AboutView activeTab="overview" setActiveTab={noop} onNavigateToContact={noop} />;
  if (pageCode === 'contact') return <ContactView onNavigateHome={noop} />;
  return <PrivacyPolicyView onNavigateHome={noop} />;
}

function editableNodes(root: HTMLElement, pageCode: PageBuilderPage['code']): HTMLElement[] {
  if (pageCode === 'home' || pageCode === 'about') return Array.from(root.querySelectorAll<HTMLElement>('section'));
  if (pageCode === 'privacy_policy') {
    const header = root.querySelector<HTMLElement>('.max-w-6xl > .bg-white');
    const articleSections = Array.from(root.querySelectorAll<HTMLElement>('article section'));
    const assistance = root.querySelector<HTMLElement>('article > div.mt-10');
    return [header, ...articleSections, assistance].filter((node): node is HTMLElement => Boolean(node));
  }
  const pageRoot = root.querySelector<HTMLElement>('.max-w-7xl');
  if (!pageRoot) return [];
  const header = pageRoot.firstElementChild as HTMLElement | null;
  const columns = pageRoot.children[1] as HTMLElement | undefined;
  const columnChildren = columns ? Array.from(columns.querySelectorAll<HTMLElement>(':scope > div > div')) : [];
  return [header, ...columnChildren].filter((node): node is HTMLElement => Boolean(node));
}

export const PageBuilderVisualCanvas: React.FC<PageBuilderVisualCanvasProps> = ({ pageCode, sections, selectedId, issueIds, viewport, onSelect }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = editableNodes(root, pageCode);
    nodes.forEach((node, index) => {
      const section = sections[index];
      if (!section) return;
      node.dataset.pageBuilderSectionId = section.id;
      node.classList.add('relative', 'cursor-pointer', 'transition-[outline,box-shadow]');
      node.style.outline = section.id === selectedId ? '3px solid rgb(234 88 12)' : issueIds.has(section.id) ? '2px solid rgb(239 68 68)' : '';
      node.style.outlineOffset = '-3px';
      node.style.boxShadow = section.id === selectedId ? 'inset 0 0 0 5px rgb(234 88 12 / 0.15)' : '';
    });
    return () => nodes.forEach((node) => {
      delete node.dataset.pageBuilderSectionId;
      node.style.outline = '';
      node.style.outlineOffset = '';
      node.style.boxShadow = '';
    });
  }, [issueIds, pageCode, sections, selectedId]);

  const widthClass = viewport === 'mobile' ? 'w-[390px]' : viewport === 'tablet' ? 'w-[768px]' : 'w-[1440px]';
  const scale = viewport === 'desktop' ? 0.62 : viewport === 'tablet' ? 0.72 : 0.92;

  return <div className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-2xl" style={{ width: `calc(${viewport === 'desktop' ? 1440 : viewport === 'tablet' ? 768 : 390}px * ${scale})` }}>
    <div className={`${widthClass} origin-top-left bg-white`} style={{ transform: `scale(${scale})` }}>
      <div ref={rootRef} onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
        if (!sectionNode) return;
        event.preventDefault();
        event.stopPropagation();
        onSelect(sectionNode.dataset.pageBuilderSectionId ?? '');
      }}>
        <WebsitePage pageCode={pageCode} />
      </div>
    </div>
  </div>;
};
