/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
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
  const [contentHeight, setContentHeight] = useState(900);
  const [availableWidth, setAvailableWidth] = useState<number>(1440);

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

  const handleFrameLoad = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    doc.documentElement.lang = document.documentElement.lang || 'vi';
    doc.body.className = document.body.className;
    doc.body.style.margin = '0';
    doc.head.innerHTML = '';
    document.head
      .querySelectorAll('style, link[rel="stylesheet"]')
      .forEach((node) => doc.head.appendChild(node.cloneNode(true)));
    setFrameBody(doc.body);
    setFrameDocument(doc);
  };

  // Dynamically toggle edit-mode animation freeze when switching between 'edit' and 'preview'
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
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
          video { animation-play-state: paused !important; }
          [data-page-builder-action] { animation: none !important; transition: none !important; }
          [data-ve-editable="true"][data-ve-semantic~="text"] { cursor: text; }
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
        const nextHeight = Math.max(600, rootElement.scrollHeight ?? 0);
        setContentHeight((current) => (Math.abs(current - nextHeight) >= 8 ? nextHeight : current));
      });
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rootElement);
    updateHeight();
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [frameBody, page, rootElement]);

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
