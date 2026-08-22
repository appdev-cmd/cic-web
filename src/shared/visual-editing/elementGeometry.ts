export interface ElementGeometry {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function readElementGeometry(node: Element): ElementGeometry {
  const rect = node.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function readTextContentGeometry(node: Element): ElementGeometry {
  const textNodes = Array.from(node.childNodes).filter((child) => child.nodeType === child.TEXT_NODE);
  if (textNodes.length === 0) return readElementGeometry(node);

  const range = node.ownerDocument.createRange();
  range.setStartBefore(textNodes[0]);
  range.setEndAfter(textNodes[textNodes.length - 1]);
  const rect = range.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0
    ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    : readElementGeometry(node);
}

export function observeElementGeometry(
  node: Element,
  onGeometryChange: (geometry: ElementGeometry) => void,
  readGeometry: (node: Element) => ElementGeometry = readElementGeometry,
): () => void {
  const ownerWindow = node.ownerDocument.defaultView;
  if (!ownerWindow) return () => undefined;

  let animationFrame = 0;
  const schedule = () => {
    ownerWindow.cancelAnimationFrame(animationFrame);
    animationFrame = ownerWindow.requestAnimationFrame(() => onGeometryChange(readGeometry(node)));
  };

  const ResizeObserverConstructor = ownerWindow.ResizeObserver;
  const resizeObserver = ResizeObserverConstructor ? new ResizeObserverConstructor(schedule) : null;
  resizeObserver?.observe(node);
  ownerWindow.addEventListener('resize', schedule);
  ownerWindow.addEventListener('scroll', schedule, true);
  schedule();

  return () => {
    ownerWindow.cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();
    ownerWindow.removeEventListener('resize', schedule);
    ownerWindow.removeEventListener('scroll', schedule, true);
  };
}
