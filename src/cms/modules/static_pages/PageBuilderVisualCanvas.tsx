/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { registerEntityOptions } from '../../../shared/page-content/resolveReferenceEntity';
import { ElementBindingRegistry } from '../../../shared/visual-editing/elementBindingRegistry';
import { VisualEditingOverlay } from './VisualEditingOverlay';
import { reorderHomeStatsItems } from './homeStatsElementEditing';
import { resolveVisualElementEdit } from './visualElementEditingAdapters';
import type { CommitElementEditRequest } from '../../../shared/visual-editing/inlineTextEditing';
import { sortableDescriptorFromBinding, type SortableReorderRequest } from '../../../shared/visual-editing/sortableBoundCollection';
import { sectionDefinitions } from './pageBuilderRegistry';
import { isCapabilityEnabled } from '../../../shared/visual-editing/editableSectionContract';
import type { PageBuilderConfigValue, PageBuilderEntityOption, PageBuilderPage, PageBuilderSection } from './pageBuilderTypes';
import { reorderReferenceItems, resolveReferenceItem } from './referenceSectionInteractions';

import { useCanvasIframe } from './visual-canvas/useCanvasIframe';
import { WebsitePage, LegalPage } from './visual-canvas/WebsitePageRenderer';
import { setupCanvasDomEnhancements, normalizeText } from './visual-canvas/canvasDomInjector';

export interface PageBuilderVisualCanvasProps {
  mode?: 'edit' | 'preview';
  page: PageBuilderPage;
  sections: PageBuilderSection[];
  selectedId: string;
  issueIds: Set<string>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onSelect: (id: string) => void;
  onTextChange?: (sectionId: string, path: Array<string | number>, value: string) => void;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => void;
  entityOptions?: PageBuilderEntityOption[];
  onEditMedia?: (sectionId: string, path: Array<string | number>, currentId: string) => void;
  onEditVideo?: (sectionId: string, path: Array<string | number>, currentUrl: string, anchor: { left: number; top: number }) => void;
  onEditCta?: (sectionId: string, path: Array<string | number>, currentLabel: string, anchor: { left: number; top: number }) => void;
  activeHeroSlide?: number;
  onSectionAction?: (sectionId: string, action: 'toggle' | 'up' | 'down') => void;
  onReferenceSourceChange?: (sectionId: string, entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'], source: NonNullable<NonNullable<PageBuilderSection['references']>[number]['source']>) => void;
  onPickReference?: (sectionId: string, entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'], replaceIndex?: number) => void;
  onReferenceItemsChange?: (sectionId: string, entityType: NonNullable<PageBuilderSection['references']>[number]['entityType'], ids: string[]) => void;
  onCollectionAction?: (sectionId: string, path: string, action: 'add' | 'duplicate' | 'remove' | 'previous' | 'next', index: number) => void;
  onHeroAction?: (sectionId: string, action: 'select' | 'add' | 'duplicate' | 'delete' | 'previous' | 'next' | 'movePrevious' | 'moveNext', index?: number) => void;
}

export const PageBuilderVisualCanvas: React.FC<PageBuilderVisualCanvasProps> = ({
  mode = 'preview',
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
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bindingRegistry = useMemo(() => new ElementBindingRegistry(), []);

  if (entityOptions && entityOptions.length > 0) {
    registerEntityOptions(entityOptions);
  }

  const [interactionRoot, setInteractionRoot] = useState<HTMLDivElement | null>(null);
  const [domVersion, setDomVersion] = useState(0);

  const attachRoot = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    setInteractionRoot(node);
  }, []);

  const {
    frameRef,
    frameBody,
    contentHeight,
    viewportWidth,
    scale,
    handleFrameLoad,
  } = useCanvasIframe({
    page,
    mode,
    viewport,
    rootElement: rootRef.current,
  });

  const resolveElementEdit = useCallback((bindingId: string) => {
    const node = bindingRegistry.getNode(bindingId);
    const binding = node && bindingRegistry.getBindings(node).find((candidate) => candidate.bindingId === bindingId);
    return binding ? resolveVisualElementEdit(sections, binding)?.descriptor ?? null : null;
  }, [bindingRegistry, sections]);

  const commitElementEdit = useCallback((request: CommitElementEditRequest) => {
    const target = resolveVisualElementEdit(sections, request.binding);
    if (!target || !target.accepts(request) || !onConfigValueChange) return false;
    onConfigValueChange(target.sectionId, target.path, request.after);
    return true;
  }, [onConfigValueChange, sections]);

  const resolveSortableItem = useCallback((bindingId: string) => {
    const node = bindingRegistry.getNode(bindingId);
    const binding = node && bindingRegistry.getBindings(node).find((candidate) => candidate.bindingId === bindingId);
    if (!binding) return null;
    const descriptor = sortableDescriptorFromBinding(binding);
    const capability = descriptor
      ? sectionDefinitions[descriptor.sectionKey]?.editableContract?.collections?.[descriptor.collectionPath]?.capabilities.reorder
        ?? sectionDefinitions[descriptor.sectionKey]?.editableContract?.references?.[descriptor.collectionPath]?.capabilities.reorder
      : undefined;
    return isCapabilityEnabled(capability) ? descriptor : null;
  }, [bindingRegistry]);

  const commitItemReorder = useCallback((request: SortableReorderRequest) => {
    const definition = sectionDefinitions[request.sectionKey]?.editableContract;
    const capability = definition?.collections?.[request.collectionPath]?.capabilities.reorder
      ?? definition?.references?.[request.collectionPath]?.capabilities.reorder;
    if (!isCapabilityEnabled(capability)) return false;
    if (definition?.references?.[request.collectionPath]) {
      const result = reorderReferenceItems(sections, request);
      if (!result || !onReferenceItemsChange) return false;
      onReferenceItemsChange(result.sectionId, result.entityType, result.entityIds);
      return true;
    }
    if (!onConfigValueChange) return false;
    const result = reorderHomeStatsItems(sections, request);
    if (!result) return false;
    onConfigValueChange(result.sectionId, result.path, result.items);
    return true;
  }, [onConfigValueChange, onReferenceItemsChange, sections]);

  const resolveReferenceItemByBindingId = useCallback((bindingId: string) => {
    const node = bindingRegistry.getNode(bindingId);
    const binding = node && bindingRegistry.getBindings(node).find((candidate) => candidate.bindingId === bindingId);
    return binding ? resolveReferenceItem(binding) : null;
  }, [bindingRegistry]);

  const replaceReferenceItem = useCallback((descriptor: import('../../../shared/visual-editing/referenceItemInteraction').ReferenceItemDescriptor) => {
    const section = sections.find((candidate) => candidate.sectionKey === descriptor.sectionKey);
    const reference = section?.references?.find((candidate) => candidate.entityType === descriptor.entityType);
    const index = reference?.entityIds.indexOf(descriptor.entityId) ?? -1;
    if (section && index >= 0) onPickReference?.(section.id, reference!.entityType, index);
  }, [onPickReference, sections]);

  useEffect(() => {
    const refresh = () => setDomVersion((version) => version + 1);
    window.addEventListener('page-builder-dom-updated', refresh);
    return () => window.removeEventListener('page-builder-dom-updated', refresh);
  }, []);

  useEffect(() => {
    return setupCanvasDomEnhancements({
      root: rootRef.current,
      frame: frameRef.current,
      scale,
      page,
      sections,
      selectedId,
      issueIds,
      viewport,
      mode,
      activeHeroSlide,
      entityOptions,
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
    });
  }, [
    activeHeroSlide,
    domVersion,
    entityOptions,
    frameBody,
    issueIds,
    mode,
    onCollectionAction,
    onConfigValueChange,
    onEditCta,
    onEditMedia,
    onEditVideo,
    onHeroAction,
    onPickReference,
    onReferenceItemsChange,
    onReferenceSourceChange,
    onSectionAction,
    onSelect,
    onTextChange,
    page,
    scale,
    sections,
    selectedId,
    viewport,
  ]);

  if (page.pageType === 'legal') {
    return (
      <div
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
            if (sectionId && sectionId !== selectedId) onSelect(sectionId);
          }}
          onClickCapture={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('[data-page-builder-native-editor]')) return;
            const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
            if (!sectionNode) {
              onSelect('');
              return;
            }
            const sectionId = sectionNode.dataset.pageBuilderSectionId ?? '';
            if (sectionId && sectionId !== selectedId) onSelect(sectionId);
          }}
        >
          <LegalPage
            sections={sections}
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
      className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-2xl transition-[width] duration-200"
      style={{ width: viewportWidth * scale, height: contentHeight * scale }}
    >
      <iframe
        ref={frameRef}
        title={`Giao diện ${viewport}`}
        srcDoc="<!doctype html><html><head></head><body></body></html>"
        onLoad={handleFrameLoad}
        className="absolute left-0 top-0 border-0 bg-white"
        style={{ width: viewportWidth, height: contentHeight, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      />
      {frameBody && createPortal(
        <>
          <div
            ref={attachRoot}
            onClickCapture={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest('[data-page-builder-native-editor]')) return;

              const ctaNode = target.closest<HTMLElement>('[data-page-builder-cta-key], [data-page-builder-cta-edit]');
              if (ctaNode && onEditCta) {
                event.preventDefault();
                event.stopPropagation();
                const sectionNode = ctaNode.closest<HTMLElement>('[data-page-builder-section-id]');
                const sectionId = sectionNode?.dataset.pageBuilderSectionId ?? selectedId;
                onSelect(sectionId);
                const nodeRect = ctaNode.getBoundingClientRect();
                const frameRect = frameRef.current?.getBoundingClientRect();
                const path = ctaNode.dataset.pageBuilderCtaKey
                  ? (JSON.parse(ctaNode.dataset.pageBuilderCtaKey) as Array<string | number>)
                  : [ctaNode.dataset.pageBuilderCtaEdit ?? 'primaryCtaId'];
                const labelSpan = ctaNode.querySelector('span');
                const currentLabel = normalizeText(labelSpan?.textContent ?? ctaNode.textContent ?? '');
                onEditCta(sectionId, path, currentLabel, {
                  left: (frameRect?.left ?? 0) + nodeRect.left * scale,
                  top: (frameRect?.top ?? 0) + nodeRect.bottom * scale + 8,
                });
                return;
              }

              const mediaNode = target.closest<HTMLElement>('[data-page-builder-media-path]');
              if (mediaNode && onEditMedia) {
                event.preventDefault();
                event.stopPropagation();
                const sectionNode = mediaNode.closest<HTMLElement>('[data-page-builder-section-id]');
                const sectionId = sectionNode?.dataset.pageBuilderSectionId ?? selectedId;
                onSelect(sectionId);
                onEditMedia(sectionId, JSON.parse(mediaNode.dataset.pageBuilderMediaPath ?? '[]') as Array<string | number>, mediaNode.dataset.pageBuilderMediaId ?? '');
                return;
              }

              if (mode === 'edit' && target.closest('[data-ve-semantic~="reference-item"]')) return;
              const sectionNode = target.closest<HTMLElement>('[data-page-builder-section-id]');
              if (!sectionNode) {
                onSelect('');
                return;
              }
              if (!onTextChange) return;
              if (target.closest('[data-page-builder-action]')) return;
              const sectionId = sectionNode.dataset.pageBuilderSectionId ?? '';
              onSelect(sectionId);
              if (target.closest('[data-page-builder-preview-control]')) {
                onSelect('');
                window.setTimeout(() => onSelect(sectionId), 50);
                return;
              }
              event.stopPropagation();
              if (!target.closest('[data-page-builder-inline-edit], [contenteditable="true"], [data-ve-editable="true"]')) event.preventDefault();
            }}
          >
            <WebsitePage
              page={{ ...page, draft: { ...page.draft, sections } }}
              activeHeroSlide={activeHeroSlide}
              editMode={mode === 'edit'}
              bindingRegistry={bindingRegistry}
              selectedId={selectedId}
              onConfigValueChange={onConfigValueChange}
            />
          </div>
          <VisualEditingOverlay
            enabled={mode === 'edit'}
            root={interactionRoot}
            registry={bindingRegistry}
            resolveElementEdit={resolveElementEdit}
            commitElementEdit={commitElementEdit}
            resolveSortableItem={resolveSortableItem}
            commitItemReorder={commitItemReorder}
            resolveReferenceItem={resolveReferenceItemByBindingId}
            replaceReferenceItem={replaceReferenceItem}
          />
        </>,
        frameBody
      )}
    </div>
  );
};
