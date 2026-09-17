/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  editMode, 
  selectedId, 
  onConfigValueChange 
}: {
  sections: PageBuilderSection[];
  editMode: boolean;
  selectedId: string;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
}) {
  const [header, ...content] = sections;
  const commit = (sectionId: string, value: string) => onConfigValueChange?.(sectionId, ['richTextHtml'], value);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header
          data-page-builder-section-id={header?.id}
          data-page-builder-section-key={header?.sectionKey}
          className={`rounded-2xl border bg-white p-6 sm:p-10 ${selectedId === header?.id ? 'border-orange-400 ring-2 ring-orange-500/20' : 'border-slate-200'}`}
        >
          {editMode && selectedId === header?.id
            ? <InlineLegalRichText section={header} minHeight="220px" onCommit={commit} />
            : <div className="ck-content legal-header-content" dangerouslySetInnerHTML={{ __html: String(header?.config.richTextHtml ?? '') }} />}
        </header>
        <article className="space-y-8">
          {content.map((section) => (
            <section
              key={section.id}
              data-page-builder-section-id={section.id}
              data-page-builder-section-key={section.sectionKey}
              className={`rounded-2xl border bg-white p-6 sm:p-10 ${selectedId === section.id ? 'border-orange-400 ring-2 ring-orange-500/20' : 'border-slate-200'}`}
            >
              {typeof section.config.richTextHtml === 'string' ? (
                editMode && selectedId === section.id ? (
                  <InlineLegalRichText section={section} minHeight="420px" onCommit={commit} />
                ) : <div className="ck-content mt-3 text-sm leading-7 text-slate-600" dangerouslySetInnerHTML={{ __html: section.config.richTextHtml }} />
              ) : <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                {Array.isArray(section.config.blocks) ? section.config.blocks.map((block, index) => {
                  if (!block || typeof block !== 'object' || Array.isArray(block)) return null;
                  const item = block as Record<string, unknown>;
                  if (Array.isArray(item.items)) return <ul key={index} className="list-disc space-y-1 pl-5">{item.items.map((value) => <li key={String(value)}>{String(value)}</li>)}</ul>;
                  return <p key={index}>{String(item.text ?? '')}</p>;
                }) : <p>{String(section.config.description ?? '')}</p>}
              </div>}
            </section>
          ))}
        </article>
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
      />
    );
  }
  if (page.pageType === 'contact') {
    const resolved = resolvePageContent({ pageType: 'contact', version: page.draft, legacyFallback: getLegacyContactPageContent() });
    return <ContactView content={resolved.content} renderPolicy={{ motionEnabled: !editMode }} bindingRegistry={bindingRegistry} />;
  }
  if (page.pageType === 'legal') {
    return <LegalPage sections={page.draft.sections} editMode={editMode} selectedId={selectedId} onConfigValueChange={onConfigValueChange} />;
  }
  return <LegalPage sections={page.draft.sections} editMode={editMode} selectedId={selectedId} onConfigValueChange={onConfigValueChange} />;
}
