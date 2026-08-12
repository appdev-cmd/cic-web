import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AboutView } from '../../../web/components/AboutView';
import { HomeView } from '../../../web/components/HomeView';
import type { PageBuilderPage, PageBuilderSection } from './pageBuilderTypes';

interface PageBuilderVisualCanvasProps {
  page: PageBuilderPage;
  sections: PageBuilderSection[];
  selectedId: string;
  issueIds: Set<string>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onSelect: (id: string) => void;
}

const noop = () => undefined;

function LegalPage({ sections }: { sections: PageBuilderSection[] }) {
  const [header, ...content] = sections;
  return <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
      <header className="border-b border-slate-200 pb-7">
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600">{String(header?.config.categoryTag ?? 'Thông tin pháp lý')}</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{String(header?.config.title ?? '')}</h1>
        <p className="mt-3 max-w-3xl text-slate-600">{String(header?.config.subtitle ?? '')}</p>
        <p className="mt-4 text-xs text-slate-500">Cập nhật: {String(header?.config.lastUpdated ?? '')} · {String(header?.config.readingTime ?? '')}</p>
      </header>
      <article className="mt-8 space-y-8">
        {content.map((section) => <section key={section.id}>
          <h2 className="text-xl font-black text-slate-900">{String(section.config.title ?? '')}</h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
            {Array.isArray(section.config.blocks) ? section.config.blocks.map((block, index) => {
              if (!block || typeof block !== 'object' || Array.isArray(block)) return null;
              const item = block as Record<string, unknown>;
              if (Array.isArray(item.items)) return <ul key={index} className="list-disc space-y-1 pl-5">{item.items.map((value) => <li key={String(value)}>{String(value)}</li>)}</ul>;
              return <p key={index}>{String(item.text ?? '')}</p>;
            }) : <p>{String(section.config.description ?? '')}</p>}
          </div>
        </section>)}
      </article>
    </div>
  </div>;
}

function WebsitePage({ page }: { page: PageBuilderPage }) {
  if (page.pageType === 'home') {
    return <HomeView setCurrentView={noop} setActiveLink={noop} setActiveServiceId={noop} setActiveProjectId={noop} setPreSelectedNewsCategory={noop} setAboutSubTab={noop} setActiveEventId={noop} setIsRegisteringEvent={noop} />;
  }
  if (page.pageType === 'about') return <AboutView activeTab="overview" setActiveTab={noop} onNavigateToContact={noop} />;
  if (page.pageType === 'organization') return <AboutView activeTab="structure" setActiveTab={noop} onNavigateToContact={noop} />;
  if (page.pageType === 'capacity_experience') return <AboutView activeTab="experience" setActiveTab={noop} onNavigateToContact={noop} />;
  if (page.pageType === 'legal') return <LegalPage sections={page.draft.sections} />;
  return <LegalPage sections={page.draft.sections} />;
}

function editableNodes(root: HTMLElement, page: PageBuilderPage): HTMLElement[] {
  if (page.pageType === 'home' || page.pageType === 'about' || page.pageType === 'organization' || page.pageType === 'capacity_experience') return Array.from(root.querySelectorAll<HTMLElement>('section'));
  if (page.pageType === 'legal') {
    const header = root.querySelector<HTMLElement>('header');
    const articleSections = Array.from(root.querySelectorAll<HTMLElement>('article section'));
    return [header, ...articleSections].filter((node): node is HTMLElement => Boolean(node));
  }
  const pageRoot = root.querySelector<HTMLElement>('.max-w-7xl');
  if (!pageRoot) return [];
  const header = pageRoot.firstElementChild as HTMLElement | null;
  const columns = pageRoot.children[1] as HTMLElement | undefined;
  const columnChildren = columns ? Array.from(columns.querySelectorAll<HTMLElement>(':scope > div > div')) : [];
  return [header, ...columnChildren].filter((node): node is HTMLElement => Boolean(node));
}

export const PageBuilderVisualCanvas: React.FC<PageBuilderVisualCanvasProps> = ({ page, sections, selectedId, issueIds, viewport, onSelect }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameBody, setFrameBody] = useState<HTMLElement | null>(null);
  const [contentHeight, setContentHeight] = useState(900);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = editableNodes(root, page);
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
  }, [frameBody, issueIds, page, sections, selectedId]);

  useEffect(() => {
    if (!frameBody || !rootRef.current) return;
    let animationFrame = 0;
    const updateHeight = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const nextHeight = Math.max(600, rootRef.current?.scrollHeight ?? 0);
        setContentHeight((current) => Math.abs(current - nextHeight) >= 8 ? nextHeight : current);
      });
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rootRef.current);
    updateHeight();
    return () => { cancelAnimationFrame(animationFrame); observer.disconnect(); };
  }, [frameBody, page]);

  const viewportWidth = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : 1440;
  const scale = viewport === 'desktop' ? 0.62 : viewport === 'tablet' ? 0.72 : 0.92;

  const handleFrameLoad = () => {
    const frameDocument = frameRef.current?.contentDocument;
    if (!frameDocument) return;
    frameDocument.documentElement.lang = document.documentElement.lang || 'vi';
    frameDocument.body.className = document.body.className;
    frameDocument.body.style.margin = '0';
    frameDocument.head.innerHTML = '';
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => frameDocument.head.appendChild(node.cloneNode(true)));
    setFrameBody(frameDocument.body);
  };

  return <div className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-2xl transition-[width] duration-200" style={{ width: viewportWidth * scale, height: contentHeight * scale }}>
    <iframe ref={frameRef} title={`Giao diện ${viewport}`} onLoad={handleFrameLoad} className="absolute left-0 top-0 border-0 bg-white" style={{ width: viewportWidth, height: contentHeight, transform: `scale(${scale})`, transformOrigin: 'top left' }} />
    {frameBody && createPortal(<div ref={rootRef} onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
        if (!sectionNode) return;
        event.preventDefault();
        event.stopPropagation();
        onSelect(sectionNode.dataset.pageBuilderSectionId ?? '');
      }}>
        <WebsitePage page={{ ...page, draft: { ...page.draft, sections } }} />
      </div>, frameBody)}
  </div>;
};
