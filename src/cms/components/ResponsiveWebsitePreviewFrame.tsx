import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  device: 'desktop' | 'tablet' | 'mobile';
}

export const ResponsiveWebsitePreviewFrame: React.FC<Props> = ({ children, device }) => {
  const [body, setBody] = useState<HTMLElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const scale = device === 'desktop' ? 0.8 : 1;
  const width = device === 'desktop' ? 1024 : device === 'tablet' ? 768 : 390;

  const prepareFrame = useCallback((frame: HTMLIFrameElement | null) => {
    if (!frame?.contentDocument) return;
    const document = frame.contentDocument;
    document.head.replaceChildren();
    window.document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
      document.head.appendChild(node.cloneNode(true));
    });
    document.documentElement.lang = 'vi';
    document.documentElement.style.background = '#fff';
    document.body.className = 'min-h-screen bg-white font-sans text-slate-900';
    document.body.style.margin = '0';
    setBody(document.body);
  }, []);

  return (
    <div className="relative mx-auto h-full max-h-full shrink-0 overflow-hidden rounded-xl bg-white shadow-2xl" style={{ width }}>
      <iframe
        ref={frameRef}
        onLoad={() => prepareFrame(frameRef.current)}
        title={`Xem trước Website - ${device}`}
        srcDoc="<!doctype html><html><head></head><body></body></html>"
        className="absolute left-0 top-0 border-0 bg-white"
        style={{ width: `${100 / scale}%`, height: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      />
      {body && createPortal(children, body)}
    </div>
  );
};
