/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, Mail, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { AboutView } from '../../../../web/components/AboutView';
import { ContactView } from '../../../../web/components/ContactView';
import { HomeView } from '../../../../web/components/HomeView';
import { 
  getLegacyAboutCapacityContent, 
  getLegacyAboutPageContent, 
  getLegacyContactPageContent, 
  getLegacyHomePageContent 
} from '../../../../shared/page-content/legacyPageContent';
import { resolvePageContent } from '../../../../shared/page-content/resolvePageContent';
import type { ElementBindingRegistry } from '../../../../shared/visual-editing/elementBindingRegistry';
import { findPageBuilderImage } from '../PageMediaPickerModal';
import type { PageBuilderConfigValue, PageBuilderPage, PageBuilderSection } from '../pageBuilderTypes';
import { RichTextEditor } from '../RichTextEditor';
import { sanitizeHtmlContent } from '../../../../shared/lib/sanitize';

const noop = () => undefined;

export function InlineLegalRichText({ 
  section, 
  minHeight, 
  onCommit 
}: {
  section: PageBuilderSection;
  minHeight: string;
  onCommit?: (sectionId: string, value: string) => void;
}) {
  const externalValue = String(section.config.richTextHtml ?? '');
  const [value, setValue] = useState(externalValue);
  const latestValueRef = useRef(externalValue);
  const committedValueRef = useRef(externalValue);
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (dirtyRef.current) return;
    if (externalValue === committedValueRef.current || externalValue === latestValueRef.current) return;
    latestValueRef.current = externalValue;
    committedValueRef.current = externalValue;
    setValue(externalValue);
  }, [externalValue]);

  const commit = () => {
    const nextValue = latestValueRef.current;
    if (!dirtyRef.current || nextValue === committedValueRef.current) return;
    dirtyRef.current = false;
    committedValueRef.current = nextValue;
    onCommit?.(section.id, nextValue);
  };

  return (
    <div data-page-builder-native-editor="richtext" onClick={(event) => event.stopPropagation()}>
      <RichTextEditor
        value={value}
        onChange={(nextValue) => {
          latestValueRef.current = nextValue;
          dirtyRef.current = true;
          setValue(nextValue);
        }}
        onBlur={(nextValue) => {
          latestValueRef.current = nextValue;
          commit();
        }}
        minHeight={minHeight}
        allowedEmbeds={['cta', 'form']}
      />
    </div>
  );
}

export function LegalPage({ 
  sections, 
  pageName,
  pageCode,
  versionNumber = 1,
  publishedAt,
  seoDescription,
  editMode, 
  selectedId, 
  onConfigValueChange 
}: {
  sections: PageBuilderSection[];
  pageName?: string;
  pageCode?: string;
  versionNumber?: number;
  publishedAt?: string | null;
  seoDescription?: string;
  editMode: boolean;
  selectedId: string;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
}) {
  const [header, ...content] = sections;
  const commit = (sectionId: string, value: string) => onConfigValueChange?.(sectionId, ['richTextHtml'], value);

  const headerHtml = String(header?.config?.richTextHtml ?? '');
  const leadMatch = headerHtml.match(/<p[^>]*>(.*?)<\/p>/i);
  const subtitle = leadMatch ? leadMatch[1].replace(/<[^>]+>/g, '').trim() : (seoDescription || 'Các điều khoản, chính sách và quy định chính thức từ Ban quản trị CIC Technology.');

  const titleMatch = headerHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : (pageName || 'Văn bản pháp lý');

  const categoryTag = pageCode === 'privacy_policy' 
    ? 'BẢO VỆ DỮ LIỆU CÁ NHÂN' 
    : pageCode === 'terms_of_use' 
    ? 'QUY ĐỊNH & PHÁP LÝ' 
    : 'THÔNG TIN CHUẨN';

  const lastUpdated = publishedAt 
    ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(publishedAt))
    : 'Chưa cập nhật';

  const firstContent = content[0];
  const richTextHtml = typeof firstContent?.config?.richTextHtml === 'string' ? firstContent.config.richTextHtml : '';
  const cleanText = richTextHtml.replace(/<[^>]+>/g, ' ');
  const wordsCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = `${Math.max(1, Math.ceil(wordsCount / 200))} phút`;

  return (
    <div className="pt-8 pb-20 relative z-10 min-h-screen bg-slate-50/60 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <span className="font-medium text-slate-500">Trang chủ</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{title}</span>
        </nav>

        {/* ARTICLE HEADER CARD */}
        <header
          data-page-builder-section-id={header?.id}
          data-page-builder-section-key={header?.sectionKey}
          className={`bg-white border rounded-[12px] p-6 sm:p-10 shadow-xs mb-6 transition-all ${
            selectedId === header?.id ? 'border-orange-400 ring-2 ring-orange-500/20' : 'border-slate-200/90'
          }`}
        >
          {editMode && selectedId === header?.id ? (
            <InlineLegalRichText section={header} minHeight="160px" onCommit={commit} />
          ) : (
            <>
              <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider rounded-md mb-3">
                {categoryTag}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 uppercase tracking-tight leading-snug mb-3">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6 max-w-4xl">
                  {subtitle}
                </p>
              )}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
                <div className="flex flex-wrap items-center gap-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-orange-600" /> Cập nhật: {lastUpdated}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-orange-600" /> Thời gian đọc: {readingTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" /> Phiên bản: v{versionNumber}
                  </span>
                </div>
                <span className="text-slate-400 hidden sm:inline">Công ty CP Công nghệ và Tư vấn CIC</span>
              </div>
            </>
          )}
        </header>

        {/* MAIN ARTICLE BODY */}
        <article className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-10 lg:p-12 shadow-xs leading-relaxed text-slate-700 legal-article-content">
          {content.map((section) => (
            <div
              key={section.id}
              data-page-builder-section-id={section.id}
              data-page-builder-section-key={section.sectionKey}
              className={`rounded-xl transition-all ${
                selectedId === section.id ? 'border border-orange-400 ring-2 ring-orange-500/20 p-4 -m-4' : ''
              }`}
            >
              {typeof section.config.richTextHtml === 'string' ? (
                editMode && selectedId === section.id ? (
                  <InlineLegalRichText section={section} minHeight="420px" onCommit={commit} />
                ) : (
                  <div
                    className="legal-article-content text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(section.config.richTextHtml) }}
                  />
                )
              ) : (
                <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {Array.isArray(section.config.blocks) ? section.config.blocks.map((block, index) => {
                    if (!block || typeof block !== 'object' || Array.isArray(block)) return null;
                    const item = block as Record<string, unknown>;
                    if (Array.isArray(item.items)) return <ul key={index} className="list-disc space-y-1 pl-5">{item.items.map((value) => <li key={String(value)}>{String(value)}</li>)}</ul>;
                    return <p key={index}>{String(item.text ?? '')}</p>;
                  }) : <p>{String(section.config.description ?? '')}</p>}
                </div>
              )}
            </div>
          ))}
        </article>

        {/* FOOTER BACK BUTTON */}
        <div className="mt-8 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <span>© 2026 CIC Technology & Consultancy.</span>
          <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-[8px] font-bold flex items-center gap-2 shadow-2xs text-slate-600">
            <ArrowLeft size={16} /> Quay lại trang chủ
          </div>
        </div>

      </div>
    </div>
  );
}

export interface WebsitePageProps {
  page: PageBuilderPage;
  activeHeroSlide?: number;
  editMode: boolean;
  bindingRegistry: ElementBindingRegistry;
  selectedId: string;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
}

export function WebsitePage({ 
  page, 
  activeHeroSlide, 
  editMode, 
  bindingRegistry, 
  selectedId, 
  onConfigValueChange 
}: WebsitePageProps) {
  if (page.pageType === 'home') {
    const resolved = resolvePageContent({
      pageType: 'home',
      version: page.draft,
      legacyFallback: getLegacyHomePageContent(),
    });
    return (
      <HomeView 
        content={resolved.content} 
        renderPolicy={{ motionEnabled: !editMode }} 
        bindingRegistry={bindingRegistry} 
        setCurrentView={noop} 
        setActiveLink={noop} 
        setActiveServiceId={noop} 
        setActiveProjectId={noop} 
        setPreSelectedNewsCategory={noop} 
        setAboutSubTab={noop} 
        setActiveEventId={noop} 
        setIsRegisteringEvent={noop} 
        previewSlideIndex={activeHeroSlide} 
        editMode={editMode} 
      />
    );
  }
  if (page.pageType === 'about') {
    const resolved = resolvePageContent({ pageType: 'about', version: page.draft, legacyFallback: getLegacyAboutPageContent() });
    const selectedSection = page.draft.sections.find((s) => s.id === selectedId);
    const inferredTab: 'overview' | 'structure' | 'experience' = (selectedSection?.sectionKey === 'about.organization')
      ? 'structure'
      : (['about.capacity', 'about.experience', 'about.software_partners', 'about.hardware_partners', 'about.contact_cta'].includes(selectedSection?.sectionKey ?? ''))
        ? 'experience'
        : 'overview';

    return (
      <AboutView 
        activeTab={inferredTab} 
        setActiveTab={noop} 
        onNavigateToContact={noop} 
        aboutContent={resolved.content} 
        renderPolicy={{ motionEnabled: !editMode }} 
        bindingRegistry={bindingRegistry} 
        pageSections={page.draft.sections} 
        resolveMediaUrl={(id) => findPageBuilderImage(id)?.url ?? id} 
        editMode={editMode}
        onConfigValueChange={onConfigValueChange}
      />
    );
  }
  if (page.pageType === 'organization') {
    return (
      <AboutView 
        activeTab="structure" 
        setActiveTab={noop} 
        onNavigateToContact={noop} 
        renderPolicy={{ motionEnabled: !editMode }} 
        bindingRegistry={bindingRegistry} 
        pageSections={page.draft.sections} 
        resolveMediaUrl={(id) => findPageBuilderImage(id)?.url ?? id} 
        editMode={editMode}
        onConfigValueChange={onConfigValueChange}
      />
    );
  }
  if (page.pageType === 'capacity_experience') {
    const resolved = resolvePageContent({
      pageType: 'capacity_experience',
      version: page.draft,
      legacyFallback: { capacity: getLegacyAboutCapacityContent() },
    });
    return (
      <AboutView 
        activeTab="experience" 
        setActiveTab={noop} 
        onNavigateToContact={noop} 
        capacityContent={resolved.content.capacity} 
        renderPolicy={{ motionEnabled: !editMode }} 
        bindingRegistry={bindingRegistry} 
        pageSections={page.draft.sections} 
        resolveMediaUrl={(id) => findPageBuilderImage(id)?.url ?? id} 
        editMode={editMode}
        onConfigValueChange={onConfigValueChange}
      />
    );
  }
  if (page.pageType === 'contact') {
    const resolved = resolvePageContent({ pageType: 'contact', version: page.draft, legacyFallback: getLegacyContactPageContent() });
    return <ContactView content={resolved.content} renderPolicy={{ motionEnabled: !editMode }} bindingRegistry={bindingRegistry} />;
  }
  if (page.pageType === 'legal') {
    return (
      <LegalPage 
        sections={page.draft.sections} 
        pageName={page.name}
        pageCode={page.code}
        versionNumber={page.draft.version}
        publishedAt={page.draft.publishedAt}
        seoDescription={page.draft.seo.description}
        editMode={editMode} 
        selectedId={selectedId} 
        onConfigValueChange={onConfigValueChange} 
      />
    );
  }
  return (
    <LegalPage 
      sections={page.draft.sections} 
      pageName={page.name}
      pageCode={page.code}
      versionNumber={page.draft.version}
      publishedAt={page.draft.publishedAt}
      seoDescription={page.draft.seo.description}
      editMode={editMode} 
      selectedId={selectedId} 
      onConfigValueChange={onConfigValueChange} 
    />
  );
}
