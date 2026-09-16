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
}

export function useCanvasIframe({ page, mode = 'preview', viewport, rootElement }: UseCanvasIframeParams) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameBody, setFrameBody] = useState<HTMLElement | null>(null);
  const [contentHeight, setContentHeight] = useState(900);

  const viewportWidth = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : 1440;
  const scale = viewport === 'desktop' ? 0.9 : viewport === 'tablet' ? 0.88 : 0.96;

  const handleFrameLoad = () => {
    const frameDocument = frameRef.current?.contentDocument;
    if (!frameDocument) return;
    frameDocument.documentElement.lang = document.documentElement.lang || 'vi';
    frameDocument.body.className = document.body.className;
    frameDocument.body.style.margin = '0';
    frameDocument.head.innerHTML = '';
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => frameDocument.head.appendChild(node.cloneNode(true)));
    if (mode === 'edit') {
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
    setFrameBody(frameDocument.body);
  };

  useEffect(() => {
    if (!frameBody || !rootElement) return;
    let animationFrame = 0;
    const updateHeight = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const nextHeight = Math.max(600, rootElement.scrollHeight ?? 0);
        setContentHeight((current) => Math.abs(current - nextHeight) >= 8 ? nextHeight : current);
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
    contentHeight,
    viewportWidth,
    scale,
    handleFrameLoad,
  };
}
