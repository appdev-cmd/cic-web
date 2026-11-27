/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { PageBuilderPage } from '../pageBuilderTypes';

interface UseCanvasIframeParams {
  page: PageBuilderPage;
  mode?: 'edit' | 'preview';
  viewport: 'desktop' | 'tablet' | 'mobile';
  rootElement: HTMLDivElement | null;
  containerElement?: HTMLElement | null;
}

export function useCanvasIframe({
  page,
  mode = 'preview',
  viewport,
  rootElement,
  containerElement,
}: UseCanvasIframeParams) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameBody, setFrameBody] = useState<HTMLElement | null>(null);
  const [frameDocument, setFrameDocument] = useState<Document | null>(null);
  const [contentHeight, setContentHeight] = useState(1200);
  const [availableWidth, setAvailableWidth] = useState<number>(1440);
  const [stylesLoadedTick, setStylesLoadedTick] = useState(0);

  const viewportWidth = viewport === 'mobile' ? 412 : viewport === 'tablet' ? 820 : 1440;

  useEffect(() => {
    const host = containerElement ?? frameRef.current?.parentElement?.parentElement ?? null;
    if (!host) return;
    const syncWidth = () => {
      const rectWidth = Math.max(320, host.clientWidth - 16);
      setAvailableWidth(rectWidth);
    };
    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(host);
    return () => observer.disconnect();
  }, [containerElement]);

  const rawScale = availableWidth >= viewportWidth ? 1 : availableWidth / viewportWidth;
  const scale = Number(Math.max(0.55, Math.min(1, rawScale)).toFixed(3));

  const initializeIframeDoc = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc || !doc.body || !doc.head) return;

    doc.documentElement.lang = document.documentElement.lang || 'vi';
    doc.body.className = document.body.className;
    doc.body.style.margin = '0';

    if (!doc.head.dataset.pbInitialized) {
      doc.head.innerHTML = '';
      doc.head.dataset.pbInitialized = 'true';
      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        const cloned = node.cloneNode(true) as HTMLElement;
        if (cloned.tagName === 'LINK') {
          cloned.addEventListener('load', () => {
            setStylesLoadedTick((t) => t + 1);
            window.dispatchEvent(new Event('page-builder-dom-updated'));
          });
        }
        doc.head.appendChild(cloned);
      });
    }

    setFrameBody(doc.body);
    setFrameDocument(doc);
  }, []);

  const handleFrameLoad = useCallback(() => {
    initializeIframeDoc();
  }, [initializeIframeDoc]);

  // Fallback if srcDoc load fired before onLoad attached
  useEffect(() => {
    const doc = frameRef.current?.contentDocument;
    if (doc && doc.readyState === 'complete' && !frameBody) {
      initializeIframeDoc();
    }
  }, [frameBody, initializeIframeDoc]);

  // Inject clean edit-mode styles (hover/focus cues + hover color support, freeze animations)
  useEffect(() => {
    if (!frameDocument) return;
    const existing = frameDocument.head.querySelector('style[data-page-builder-edit-mode="true"]');
    if (mode === 'edit') {
      if (!existing) {
        const editModeStyles = frameDocument.createElement('style');
        editModeStyles.dataset.pageBuilderEditMode = 'true';
        editModeStyles.textContent = `
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: smooth !important;
            transition-duration: 0.001ms !important;
          }
          video { animation-play-state: paused !important; }
          [data-page-builder-action] { animation: none !important; transition: opacity 120ms ease !important; }
          [data-cms-hover="1"]:hover { color: var(--cms-hover-color) !important; }
          [contenteditable="true"] {
            cursor: text !important;
            border-radius: 4px;
          }
          [contenteditable="true"]:hover:not(:focus) {
            outline: 2px dashed rgba(234, 88, 12, 0.72) !important;
            outline-offset: 3px !important;
          }
          [contenteditable="true"]:focus {
            outline: 2px solid #ea580c !important;
            outline-offset: 3px !important;
            background-color: rgba(251, 146, 60, 0.08);
          }
        `;
        frameDocument.head.appendChild(editModeStyles);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [frameDocument, mode]);

  useEffect(() => {
    if (!frameBody || !rootElement) return;
    let animationFrame = 0;
    const updateHeight = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const nextHeight = Math.max(800, rootElement.scrollHeight || frameBody.scrollHeight || 0);
        setContentHeight((current) => (Math.abs(current - nextHeight) >= 6 ? nextHeight : current));
      });
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rootElement);
    updateHeight();
    const timer = window.setTimeout(updateHeight, 220);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [frameBody, page, rootElement, stylesLoadedTick, viewport]);

  return {
    frameRef,
    frameBody,
    frameDocument,
    contentHeight,
    viewportWidth,
    scale,
    handleFrameLoad,
  };
}
