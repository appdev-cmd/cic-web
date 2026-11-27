/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { registerEntityOptions } from '../../../shared/page-content/resolveReferenceEntity';
import { ElementBindingRegistry } from '../../../shared/visual-editing/elementBindingRegistry';
import type { DataDrawerTab } from './builder/PageBuilderDataDrawer';
import type {
  PageBuilderConfigValue,
  PageBuilderEntityOption,
  PageBuilderPage,
  PageBuilderSection,
} from './pageBuilderTypes';

import { useCanvasIframe } from './visual-canvas/useCanvasIframe';
import { WebsitePage, LegalPage } from './visual-canvas/WebsitePageRenderer';
import { setupCanvasDomEnhancements, normalizeText } from './visual-canvas/canvasDomInjector';

export interface PageBuilderVisualCanvasProps {
  mode?: 'edit' | 'preview';
  workspaceLocale?: 'vi' | 'en';
  page: PageBuilderPage;
  sections: PageBuilderSection[];
  selectedId: string;
  issueIds: Set<string>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onSelect: (id: string) => void;
  onTextChange?: (sectionId: string, path: Array<string | number>, value: string) => void;
  onConfigValueChange?: (
    sectionId: string,
    path: Array<string | number>,
    value: PageBuilderConfigValue
  ) => void;
  entityOptions?: PageBuilderEntityOption[];
  onEditMedia?: (sectionId: string, path: Array<string | number>, currentId: string) => void;
  onEditVideo?: (
    sectionId: string,
    path: Array<string | number>,
    currentUrl: string,
    anchor: { left: number; top: number }
  ) => void;
  onEditCta?: (
    sectionId: string,
    path: Array<string | number>,
    currentLabel: string,
    anchor: { left: number; top: number }
  ) => void;
  activeHeroSlide?: number;
  onSectionAction?: (sectionId: string, action: 'toggle' | 'up' | 'down') => void;
  onReferenceSourceChange?: (
    sectionId: string,
    entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'],
    source: NonNullable<NonNullable<PageBuilderSection['references']>[number]['source']>
  ) => void;
  onPickReference?: (
    sectionId: string,
    entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'],
    replaceIndex?: number
  ) => void;
  onReferenceItemsChange?: (
    sectionId: string,
    entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'],
    ids: string[]
  ) => void;
  onCollectionAction?: (
    sectionId: string,
    path: string,
    action: 'add' | 'duplicate' | 'remove' | 'previous' | 'next',
    index: number
  ) => void;
  onHeroAction?: (
    sectionId: string,
    action:
      | 'select'
      | 'add'
      | 'duplicate'
      | 'delete'
      | 'previous'
      | 'next'
      | 'movePrevious'
      | 'moveNext',
    index?: number
  ) => void;
  onFrameDocumentReady?: (doc: Document | null) => void;
  onOpenDataDrawer?: (tab: DataDrawerTab, sectionId?: string) => void;
}

export const PageBuilderVisualCanvas: React.FC<PageBuilderVisualCanvasProps> = ({
  mode = 'preview',
  workspaceLocale = 'vi',
  page,
  sections,
  selectedId,
  issueIds,
  viewport,
  onSelect,
  onTextChange,
  onConfigValueChange,
  entityOptions = [],
  onEditMedia,
  onEditVideo,
  onEditCta,
  activeHeroSlide,
  onSectionAction,
  onReferenceSourceChange,
  onPickReference,
  onReferenceItemsChange,
  onCollectionAction,
  onHeroAction,
  onFrameDocumentReady,
  onOpenDataDrawer,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostWrapperRef = useRef<HTMLDivElement>(null);
  const [hostElement, setHostElement] = useState<HTMLElement | null>(null);
  const bindingRegistry = useMemo(() => new ElementBindingRegistry(), []);

  // Keep all parent callbacks in a ref so toolbar/format/selection state updates NEVER tear down contentEditable focus!
  const callbacksRef = useRef({
    onSelect,
    onTextChange,
    onConfigValueChange,
    onSectionAction,
    onReferenceSourceChange,
    onPickReference,
    onReferenceItemsChange,
    onCollectionAction,
    onHeroAction,
    onEditMedia,
    onEditVideo,
    onEditCta,
    onOpenDataDrawer,
  });
  callbacksRef.current = {
    onSelect,
    onTextChange,
    onConfigValueChange,
    onSectionAction,
    onReferenceSourceChange,
    onPickReference,
    onReferenceItemsChange,
    onCollectionAction,
    onHeroAction,
    onEditMedia,
    onEditVideo,
    onEditCta,
    onOpenDataDrawer,
  };

  const issueIdsKey = useMemo(() => Array.from(issueIds).sort().join('|'), [issueIds]);
  const stableIssueIds = useMemo(
    () => new Set(issueIdsKey ? issueIdsKey.split('|') : []),
    [issueIdsKey]
  );

  if (entityOptions && entityOptions.length > 0) {
    registerEntityOptions(entityOptions);
  }

  const [domVersion, setDomVersion] = useState(0);

  const attachRoot = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (node) setDomVersion((v) => v + 1);
  }, []);

  const attachHostWrapper = useCallback((node: HTMLDivElement | null) => {
    hostWrapperRef.current = node;
    setHostElement(node?.parentElement ?? node);
  }, []);

  const {
    frameRef,
    frameBody,
    frameDocument,
    contentHeight,
    viewportWidth,
    scale,
    handleFrameLoad,
  } = useCanvasIframe({
    page,
    mode,
    viewport,
    rootElement: rootRef.current,
    containerElement: hostElement,
  });

  useEffect(() => {
    onFrameDocumentReady?.(page.pageType === 'legal' ? null : frameDocument);
    return () => {
      onFrameDocumentReady?.(null);
    };
  }, [frameDocument, onFrameDocumentReady, page.pageType]);

  useEffect(() => {
    const refresh = () => setDomVersion((version) => version + 1);
    window.addEventListener('page-builder-dom-updated', refresh);
    return () => window.removeEventListener('page-builder-dom-updated', refresh);
  }, []);

  useEffect(() => {
    const isEdit = mode === 'edit';
    return setupCanvasDomEnhancements({
      root: rootRef.current,
      frame: frameRef.current,
      scale,
      page,
      sections,
      issueIds: stableIssueIds,
      viewport,
      mode,
      activeHeroSlide,
      entityOptions,
      onSelect: (id) => callbacksRef.current.onSelect(id),
      onTextChange: isEdit
        ? (sId, p, v) => callbacksRef.current.onTextChange?.(sId, p, v)
        : undefined,
      onConfigValueChange: isEdit
        ? (sId, p, v) => callbacksRef.current.onConfigValueChange?.(sId, p, v)
        : undefined,
      onSectionAction: isEdit
        ? (sId, act) => callbacksRef.current.onSectionAction?.(sId, act)
        : undefined,
      onReferenceSourceChange: isEdit
        ? (sId, t, src) => callbacksRef.current.onReferenceSourceChange?.(sId, t, src)
        : undefined,
      onPickReference: isEdit
        ? (sId, t, idx) => callbacksRef.current.onPickReference?.(sId, t, idx)
        : undefined,
      onReferenceItemsChange: isEdit
        ? (sId, t, ids) => callbacksRef.current.onReferenceItemsChange?.(sId, t, ids)
        : undefined,
      onCollectionAction: isEdit
        ? (sId, p, act, idx) => callbacksRef.current.onCollectionAction?.(sId, p, act, idx)
        : undefined,
      onHeroAction: isEdit
        ? (sId, act, idx) => callbacksRef.current.onHeroAction?.(sId, act, idx)
        : undefined,
      onEditMedia: isEdit
        ? (sId, p, id) => callbacksRef.current.onEditMedia?.(sId, p, id)
        : undefined,
      onEditVideo: isEdit
        ? (sId, p, url, anc) => callbacksRef.current.onEditVideo?.(sId, p, url, anc)
        : undefined,
      onEditCta: isEdit
        ? (sId, p, lbl, anc) => callbacksRef.current.onEditCta?.(sId, p, lbl, anc)
        : undefined,
      onOpenDataDrawer: isEdit
        ? (tab, sId) => callbacksRef.current.onOpenDataDrawer?.(tab, sId)
        : undefined,
    });
  }, [
    activeHeroSlide,
    domVersion,
    entityOptions,
    frameBody,
    frameRef,
    mode,
    page.id,
    page.pageType,
    scale,
    sections,
    stableIssueIds,
    viewport,
  ]);

  if (page.pageType === 'legal') {
    return (
      <div
        ref={attachHostWrapper}
        className="relative mx-auto min-h-[600px] overflow-hidden rounded-xl bg-white shadow-2xl"
        style={{ width: viewportWidth, maxWidth: '100%' }}
      >
        <div
          ref={attachRoot}
          onPointerDownCapture={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('[data-page-builder-native-editor]')) return;
            const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
            const sectionId = sectionNode?.dataset.pageBuilderSectionId ?? '';
            if (sectionId && sectionId !== selectedId) callbacksRef.current.onSelect(sectionId);
          }}
          onClickCapture={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('[data-page-builder-native-editor]')) return;
            const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
            if (!sectionNode) {
              callbacksRef.current.onSelect('');
              return;
            }
            const sectionId = sectionNode.dataset.pageBuilderSectionId ?? '';
            if (sectionId && sectionId !== selectedId) callbacksRef.current.onSelect(sectionId);
          }}
        >
          <LegalPage
            sections={sections}
            pageName={page.name}
            pageCode={page.code}
            versionNumber={page.draft.version}
            publishedAt={page.draft.publishedAt}
            seoDescription={page.draft.seo.description}
            editMode={mode === 'edit'}
            selectedId={selectedId}
            onConfigValueChange={onConfigValueChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={attachHostWrapper}
      className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-2xl transition-[width] duration-200"
      style={{ width: viewportWidth * scale, height: contentHeight * scale }}
    >
      <iframe
        ref={frameRef}
        title={`Giao diện ${viewport}`}
        srcDoc="<!doctype html><html><head></head><body></body></html>"
        onLoad={handleFrameLoad}
        className="absolute left-0 top-0 border-0 bg-white"
        style={{
          width: viewportWidth,
          height: contentHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
      {frameBody &&
        createPortal(
          <div
            ref={attachRoot}
            onClickCapture={(event) => {
              if (mode !== 'edit') return;
              const target = event.target as HTMLElement;
              if (target.closest('[data-page-builder-native-editor], [data-page-builder-action]')) {
                return;
              }

              // Let native focus/caret work undisturbed inside inline-editable text!
              const editableTarget = target.closest<HTMLElement>(
                '[contenteditable="true"], [data-page-builder-inline-edit]'
              );
              if (editableTarget) {
                const sectionNode = editableTarget.closest<HTMLElement>(
                  '[data-page-builder-section-id]'
                );
                if (sectionNode?.dataset.pageBuilderSectionId) {
                  callbacksRef.current.onSelect(sectionNode.dataset.pageBuilderSectionId);
                }
                return;
              }

              // CTA button/link click -> open compact Link/Contact toolbar in header
              const ctaNode = target.closest<HTMLElement>(
                '[data-page-builder-cta-key], [data-page-builder-cta-edit]'
              );
              if (ctaNode && callbacksRef.current.onEditCta) {
                event.preventDefault();
                event.stopPropagation();
                const sectionNode = ctaNode.closest<HTMLElement>('[data-page-builder-section-id]');
                const sectionId = sectionNode?.dataset.pageBuilderSectionId ?? selectedId;
                callbacksRef.current.onSelect(sectionId);
                const nodeRect = ctaNode.getBoundingClientRect();
                const frameRect = frameRef.current?.getBoundingClientRect();
                const path = ctaNode.dataset.pageBuilderCtaKey
                  ? (JSON.parse(ctaNode.dataset.pageBuilderCtaKey) as Array<string | number>)
                  : [ctaNode.dataset.pageBuilderCtaEdit ?? 'primaryCtaId'];
                const labelSpan = ctaNode.querySelector('span');
                const currentLabel = normalizeText(
                  labelSpan?.textContent ?? ctaNode.textContent ?? ''
                );
                callbacksRef.current.onEditCta(sectionId, path, currentLabel, {
                  left: (frameRect?.left ?? 0) + nodeRect.left * scale,
                  top: (frameRect?.top ?? 0) + nodeRect.bottom * scale + 8,
                });
                return;
              }

              // Prevent accidental navigation on links inside edit canvas
              const anchor = target.closest('a');
              if (anchor) {
                event.preventDefault();
              }

              const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
              if (sectionNode?.dataset.pageBuilderSectionId) {
                callbacksRef.current.onSelect(sectionNode.dataset.pageBuilderSectionId);
              }
            }}
          >
            <WebsitePage
              page={{ ...page, draft: { ...page.draft, sections } }}
              workspaceLocale={workspaceLocale}
              activeHeroSlide={activeHeroSlide}
              editMode={mode === 'edit'}
              bindingRegistry={bindingRegistry}
              selectedId={selectedId}
              onConfigValueChange={mode === 'edit' ? onConfigValueChange : undefined}
            />
          </div>,
          frameBody
        )}
    </div>
  );
};
