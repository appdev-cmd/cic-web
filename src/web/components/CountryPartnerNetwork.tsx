import React, { useCallback, useMemo, useRef, useState } from 'react';
import { countryMarkerPositions, countryMarkers, partnerCurveBends, partnerLogoPositions, type NormalizedPoint } from '../data/countryMarkers';
import { representativePartnerCountries, type RepresentativePartner } from '../data/representativePartners';
import { worldMapPaths } from '../data/worldMapPaths';

// Keep the overall block shallow while reserving more partner space above the
// map than below it. The geographic map remains centered within the canvas.
const CANVAS = { width: 2000, height: 1060, mapX: 340, mapY: 185, mapWidth: 1320, mapHeight: 726 } as const;
const PARTNER_MAP_EDIT_MODE = false;
const PARTNER_MAP_LAYOUT_STORAGE_KEY = 'cic-partner-map-layout-v1';
const LOGO_BOUNDS = {
  compact: { width: 82, height: 58 },
  standard: { width: 106, height: 60 },
  wide: { width: 132, height: 56 },
} as const;
type Point = { x: number; y: number };
type Box = { x: number; y: number; width: number; height: number };
type Curve = { path: string; samples: Point[]; collisionScore: number };
type PartnerLayout = Record<string, NormalizedPoint>;
type CurveBends = Record<string, number>;
type StoredLayout = { positions: PartnerLayout; curveBends: CurveBends };
type DragState =
  | { kind: 'logo'; id: string; pointerId: number; offset: Point }
  | { kind: 'curve'; id: string; pointerId: number; marker: Point; end: Point };
const CONNECTOR_GAP = 14;
const MARKER_SCALE = 1.42;
const MARKER_CLEARANCE = 0;
const LOGO_OPTICAL_SCALE: Readonly<Record<string, number>> = {
  htri: 0.92,
  stx: 0.9,
  foxit: 0.84,
  dnv: 0.88,
};

const mapPoint = (point: Point): Point => ({ x: CANVAS.mapX + point.x / 100 * CANVAS.mapWidth, y: CANVAS.mapY + point.y / 100 * CANVAS.mapHeight });
const boxCenter = (box: Box): Point => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
const expandedBox = (box: Box, padding: number): Box => ({ x: box.x - padding, y: box.y - padding, width: box.width + padding * 2, height: box.height + padding * 2 });
const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const toCanvasPoint = (point: NormalizedPoint): Point => ({ x: point.x * CANVAS.width, y: point.y * CANVAS.height });
const toNormalizedPoint = (point: Point): NormalizedPoint => ({ x: Number((point.x / CANVAS.width).toFixed(6)), y: Number((point.y / CANVAS.height).toFixed(6)) });

// Aim at the logo center but stop exactly where that ray meets the logo box.
// This keeps the connector visually centered without drawing through the logo.
const logoConnectionPoint = (box: Box, marker: Point): Point => {
  const center = boxCenter(box);
  const dx = marker.x - center.x;
  const dy = marker.y - center.y;
  const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : box.width / 2 / Math.abs(dx);
  const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : box.height / 2 / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);
  return { x: center.x + dx * scale, y: center.y + dy * scale };
};

// The geographic coordinate is the pin tip; the connector targets the center
// of the pin head and is then covered by the filled pin artwork.
const pinConnectionPoint = (marker: Point): Point => ({ x: marker.x, y: marker.y - 12 * MARKER_SCALE });

const cubicPoint = (start: Point, controlA: Point, controlB: Point, end: Point, t: number): Point => {
  const inverse = 1 - t;
  return {
    x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * controlA.x + 3 * inverse * t ** 2 * controlB.x + t ** 3 * end.x,
    y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * controlA.y + 3 * inverse * t ** 2 * controlB.y + t ** 3 * end.y,
  };
};

const pointInBox = (point: Point, box: Box) => point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
const buildFanCurve = (marker: Point, end: Point, occupied: readonly Box[], fanIndex: number, fanCount: number, bend: number, includeFanOffset = true): Curve => {
  const markerAngle = Math.atan2(end.y - marker.y, end.x - marker.x);
  const anchor = { x: marker.x + Math.cos(markerAngle) * MARKER_CLEARANCE, y: marker.y + Math.sin(markerAngle) * MARKER_CLEARANCE };
  const dx = end.x - anchor.x;
  const dy = end.y - anchor.y;
  const length = Math.hypot(dx, dy) || 1;
  const tangent = { x: dx / length, y: dy / length };
  const normal = { x: -dy / length, y: dx / length };
  const centeredIndex = fanIndex - (fanCount - 1) / 2;
  const baseBow = clamp(length * 0.16, 34, 96);
  const bow = bend * baseBow + (includeFanOffset ? Math.sign(bend) * centeredIndex * 11 : 0);
  const controlA = { x: anchor.x + tangent.x * length * 0.3 + normal.x * bow, y: anchor.y + tangent.y * length * 0.3 + normal.y * bow };
  // Keep the final tangent on the center-to-center axis so the curve visibly
  // points into the middle of the logo instead of arriving at a sideways angle.
  const controlB = { x: end.x - tangent.x * length * 0.28, y: end.y - tangent.y * length * 0.28 };
  const samples = Array.from({ length: 49 }, (_, index) => cubicPoint(anchor, controlA, controlB, end, index / 48));
  const collisionScore = occupied.reduce((score, box) => score + (samples.slice(3, -3).some((point) => pointInBox(point, expandedBox(box, CONNECTOR_GAP))) ? 1 : 0), 0);
  return { path: `M ${anchor.x} ${anchor.y} C ${controlA.x} ${controlA.y} ${controlB.x} ${controlB.y} ${end.x} ${end.y}`, samples, collisionScore };
};

const outwardFanDirection = (marker: Point, endpoints: readonly Point[]): -1 | 1 => {
  const center = endpoints.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
  center.x /= Math.max(endpoints.length, 1);
  center.y /= Math.max(endpoints.length, 1);
  const dx = center.x - marker.x;
  const dy = center.y - marker.y;
  const normal = { x: -dy, y: dx };
  const towardCanvasCenter = { x: CANVAS.width / 2 - marker.x, y: CANVAS.height / 2 - marker.y };
  return normal.x * towardCanvasCenter.x + normal.y * towardCanvasCenter.y > 0 ? -1 : 1;
};

const logoBox = (partner: RepresentativePartner, positions: PartnerLayout): Box => {
  const position = positions[partner.id];
  if (!position) throw new Error(`Missing global partner-map position for ${partner.id}`);
  return { ...toCanvasPoint(position), ...LOGO_BOUNDS[partner.logo.visualWeight] };
};

const opticalLogoBox = (partner: RepresentativePartner, box: Box): Box => {
  const scale = LOGO_OPTICAL_SCALE[partner.id] ?? 1;
  const center = boxCenter(box);
  const width = box.width * scale;
  const height = box.height * scale;
  return { x: center.x - width / 2, y: center.y - height / 2, width, height };
};

const defaultPartnerLayout = Object.fromEntries(Object.entries(partnerLogoPositions).map(([id, point]) => [id, { ...point }])) as PartnerLayout;
const defaultCurveBends = { ...partnerCurveBends } as CurveBends;

// Supplementary maritime marks use the current artwork's projection and the
// official 1:9,000,000 administrative map published by Vietnam's national
// mapping authority (2025) as the geographic reference.
const vietnamMaritimeFeatures = [
  'M 808.0 258.8 l 1.8 -0.8 l 1.3 0.8 l -0.9 1.4 l -1.8 0.3 Z',
  'M 811.8 260.7 l 1.2 -0.5 l 0.9 0.8 l -0.8 1.0 l -1.2 -0.2 Z',
  'M 812.0 275.0 l 1.5 -0.6 l 1.1 0.7 l -0.8 1.2 l -1.5 0.2 Z',
  'M 815.5 278.1 l 1.2 -0.4 l 0.8 0.8 l -0.9 0.9 l -1.1 -0.2 Z',
] as const;

export const CountryPartnerNetwork: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [exportStatus, setExportStatus] = useState('');
  const [positions, setPositions] = useState<PartnerLayout>(() => {
    if (!PARTNER_MAP_EDIT_MODE || typeof window === 'undefined') return defaultPartnerLayout;
    try {
      const saved = JSON.parse(window.localStorage.getItem(PARTNER_MAP_LAYOUT_STORAGE_KEY) ?? '{}') as PartnerLayout | StoredLayout;
      const storedLayout = saved as Partial<StoredLayout>;
      const savedPositions: PartnerLayout = storedLayout.positions && typeof storedLayout.positions === 'object' ? storedLayout.positions : saved as PartnerLayout;
      return Object.keys(defaultPartnerLayout).every((id) => Number.isFinite(savedPositions[id]?.x) && Number.isFinite(savedPositions[id]?.y)) ? savedPositions : defaultPartnerLayout;
    } catch {
      return defaultPartnerLayout;
    }
  });
  const [curveBends, setCurveBends] = useState<CurveBends>(() => {
    if (!PARTNER_MAP_EDIT_MODE || typeof window === 'undefined') return defaultCurveBends;
    try {
      const saved = JSON.parse(window.localStorage.getItem(PARTNER_MAP_LAYOUT_STORAGE_KEY) ?? '{}') as Partial<StoredLayout>;
      return saved.curveBends ?? defaultCurveBends;
    } catch {
      return defaultCurveBends;
    }
  });
  const positionsRef = useRef(positions);
  const curveBendsRef = useRef(curveBends);

  const persistLayout = useCallback(() => {
    window.localStorage.setItem(PARTNER_MAP_LAYOUT_STORAGE_KEY, JSON.stringify({ positions: positionsRef.current, curveBends: curveBendsRef.current } satisfies StoredLayout));
  }, []);

  const updatePositions = useCallback((next: PartnerLayout) => {
    positionsRef.current = next;
    setPositions(next);
  }, []);

  const layout = useMemo(() => {
    const countries = countryMarkers.map((config) => ({ config, country: representativePartnerCountries.find((entry) => entry.id === config.countryId), marker: mapPoint(countryMarkerPositions[config.countryId]) })).filter((entry) => entry.country);
    const boxes = countries.flatMap((entry) => entry.country?.partners.map((partner) => logoBox(partner, positions)) ?? []);
    let boxOffset = 0;
    return countries.map((entry) => {
      const count = entry.country?.partners.length ?? 0;
      const countryBoxes = boxes.slice(boxOffset, boxOffset + count);
      boxOffset += count;
      const connectorStart = pinConnectionPoint(entry.marker);
      const endpoints = countryBoxes.map((box, index) => logoConnectionPoint(opticalLogoBox(entry.country!.partners[index], box), connectorStart));
      const fanOrder = endpoints.map((end, index) => ({ index, angle: Math.atan2(end.y - entry.marker.y, end.x - entry.marker.x) })).sort((a, b) => a.angle - b.angle);
      const rankByIndex = new Map(fanOrder.map((item, rank) => [item.index, rank]));
      const buildCountryFan = (direction: -1 | 1) => endpoints.map((end, index) => buildFanCurve(connectorStart, end, boxes.filter((box) => box !== countryBoxes[index]), rankByIndex.get(index) ?? index, count, direction));
      const negativeFan = buildCountryFan(-1);
      const positiveFan = buildCountryFan(1);
      const negativeScore = negativeFan.reduce((score, curve) => score + curve.collisionScore, 0);
      const positiveScore = positiveFan.reduce((score, curve) => score + curve.collisionScore, 0);
      const preferredDirection = outwardFanDirection(connectorStart, endpoints);
      const automaticDirection = Math.abs(negativeScore - positiveScore) >= 2 ? (negativeScore < positiveScore ? -1 : 1) : preferredDirection;
      const bends = Object.fromEntries((entry.country?.partners ?? []).map((partner) => [partner.id, curveBends[partner.id] ?? automaticDirection])) as CurveBends;
      const curves = (entry.country?.partners ?? []).map((partner, index) => curveBends[partner.id] === undefined
        ? (automaticDirection === -1 ? negativeFan[index] : positiveFan[index])
        : buildFanCurve(connectorStart, endpoints[index], boxes.filter((box) => box !== countryBoxes[index]), rankByIndex.get(index) ?? index, count, bends[partner.id], false));
      return { ...entry, boxes: countryBoxes, curves, endpoints, bends, connectorStart };
    });
  }, [curveBends, positions]);

  const clientToCanvas = useCallback((clientX: number, clientY: number): Point | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  }, []);

  const beginDrag = useCallback((event: React.PointerEvent<HTMLAnchorElement>, item: RepresentativePartner, box: Box) => {
    if (!PARTNER_MAP_EDIT_MODE) return;
    const point = clientToCanvas(event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setActivePartnerId(item.id);
    setDragging({ kind: 'logo', id: item.id, pointerId: event.pointerId, offset: { x: point.x - box.x, y: point.y - box.y } });
  }, [clientToCanvas]);

  const beginCurveDrag = useCallback((event: React.PointerEvent<SVGPathElement>, id: string, marker: Point, end: Point) => {
    if (!PARTNER_MAP_EDIT_MODE) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setActivePartnerId(id);
    setDragging({ kind: 'curve', id, pointerId: event.pointerId, marker, end });
  }, []);

  const moveDrag = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (!PARTNER_MAP_EDIT_MODE || !dragging || event.pointerId !== dragging.pointerId) return;
    const point = clientToCanvas(event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    if (dragging.kind === 'curve') {
      const dx = dragging.end.x - dragging.marker.x;
      const dy = dragging.end.y - dragging.marker.y;
      const length = Math.hypot(dx, dy) || 1;
      const normal = { x: -dy / length, y: dx / length };
      const midpoint = { x: (dragging.marker.x + dragging.end.x) / 2, y: (dragging.marker.y + dragging.end.y) / 2 };
      const baseBow = clamp(length * 0.16, 34, 96);
      const rawBend = ((point.x - midpoint.x) * normal.x + (point.y - midpoint.y) * normal.y) / baseBow;
      const bend = Math.abs(rawBend) < 0.08 ? 0 : Number(clamp(rawBend, -1.5, 1.5).toFixed(3));
      const next: CurveBends = { ...curveBendsRef.current, [dragging.id]: bend };
      curveBendsRef.current = next;
      setCurveBends(next);
      return;
    }
    const partner = representativePartnerCountries.flatMap((country) => country.partners).find((item) => item.id === dragging.id);
    if (!partner) return;
    const bounds = LOGO_BOUNDS[partner.logo.visualWeight];
    const nextPoint = toNormalizedPoint({ x: clamp(point.x - dragging.offset.x, 0, CANVAS.width - bounds.width), y: clamp(point.y - dragging.offset.y, 0, CANVAS.height - bounds.height) });
    updatePositions({ ...positionsRef.current, [dragging.id]: nextPoint });
  }, [clientToCanvas, dragging, updatePositions]);

  const endDrag = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (!PARTNER_MAP_EDIT_MODE || !dragging || event.pointerId !== dragging.pointerId) return;
    persistLayout();
    setDragging(null);
  }, [dragging, persistLayout]);

  /*
  const flipSelectedCurve = useCallback(() => {
    if (!selectedCurvePartnerId) return;
    const currentDirection = layout.find((entry) => entry.country?.partners.some((partner) => partner.id === selectedCurvePartnerId))?.directions[selectedCurvePartnerId] ?? 1;
    const flippedDirection: -1 | 1 = currentDirection === -1 ? 1 : -1;
    const next: CurveDirections = { ...curveDirectionsRef.current, [selectedCurvePartnerId]: flippedDirection };
    curveDirectionsRef.current = next;
    setCurveDirections(next);
    window.localStorage.setItem(PARTNER_MAP_LAYOUT_STORAGE_KEY, JSON.stringify({ positions: positionsRef.current, curveDirections: next } satisfies StoredLayout));
    setExportStatus('Đã đổi hướng cong');
  }, [layout, selectedCurvePartnerId]);
  */

  const resetLayout = useCallback(() => {
    window.localStorage.removeItem(PARTNER_MAP_LAYOUT_STORAGE_KEY);
    updatePositions(defaultPartnerLayout);
    curveBendsRef.current = defaultCurveBends;
    setCurveBends(defaultCurveBends);
    setExportStatus('Đã reset');
  }, [updatePositions]);

  const exportLayout = useCallback(async () => {
    const output = JSON.stringify({ positions: positionsRef.current, curveBends: curveBendsRef.current } satisfies StoredLayout, null, 2);
    console.info('Partner map normalized layout:', output);
    try {
      await navigator.clipboard.writeText(output);
      setExportStatus('Đã copy JSON');
    } catch {
      window.prompt('Copy normalized partner-map layout JSON:', output);
      setExportStatus('JSON đã mở');
    }
  }, []);

  const tooltipLayout = layout.find(({ country }) => country && (country.id === activeCountryId || country.partners.some((partner) => partner.id === activePartnerId)));
  const countryTooltip = tooltipLayout?.country ? (() => {
    const width = Math.min(220, Math.max(108, tooltipLayout.country.name.length * 7.8 + 30));
    return {
      country: tooltipLayout.country,
      width,
      x: Math.max(10, Math.min(CANVAS.width - width - 10, tooltipLayout.marker.x - width / 2)),
      y: Math.max(10, tooltipLayout.marker.y - 70),
    };
  })() : null;

  return (
    <div className="relative w-full min-w-0 overflow-hidden touch-pan-y" aria-label="Mạng lưới đối tác tiêu biểu theo quốc gia">
      {PARTNER_MAP_EDIT_MODE && <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded-lg bg-slate-950/90 p-1.5 text-[11px] text-white shadow-md"><span className="px-1 text-white/75">Kéo đường để uốn</span><button type="button" onClick={resetLayout} className="rounded-md px-2 py-1.5 font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">Reset Layout</button><button type="button" onClick={exportLayout} className="rounded-md bg-orange-500 px-2 py-1.5 font-bold text-white hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Export Layout</button>{exportStatus && <span className="px-1 text-white/80" aria-live="polite">{exportStatus}</span>}</div>}
      <svg ref={svgRef} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} preserveAspectRatio="xMidYMid meet" className="block h-auto max-w-full w-full" role="img" aria-labelledby="partner-map-title partner-map-desc" onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <style>{`
          foreignObject img { width: calc(100% - 4px); height: calc(100% - 4px); }
          .partner-map-connector { transition: opacity 160ms ease-out, stroke 160ms ease-out; }
          @media (max-width: 767px), (hover: none) {
            .partner-map-logo { filter: none !important; transition: none !important; }
            .partner-map-vietnam { filter: none !important; }
            .partner-map-connector { opacity: 0.5 !important; stroke-width: 0.74px !important; }
            .partner-map-connector[data-dimmed='true'] { opacity: 0.14 !important; }
            .partner-map-connector[data-active='true'] { opacity: 0.9 !important; stroke-width: 1.2px !important; }
          }
          .partner-map-logo[data-contrast='dark-outline'] { filter: drop-shadow(0 0 1px rgba(15, 23, 42, 0.95)) drop-shadow(0 1px 2px rgba(15, 23, 42, 0.72)) !important; }
          .partner-map-logo[data-contrast='dark-outline'][data-active='true'] { filter: drop-shadow(0 0 1px rgba(15, 23, 42, 0.95)) drop-shadow(0 1px 2px rgba(15, 23, 42, 0.72)) drop-shadow(0 3px 8px rgba(249, 115, 22, 0.4)) !important; }
        `}</style>
        <title id="partner-map-title">CIC tại Việt Nam kết nối với các đối tác công nghệ tiêu biểu trên thế giới</title>
        <desc id="partner-map-desc">Logo đối tác nằm trong khoảng trống đại dương và nối bằng đường cong tới map pin của quốc gia tương ứng. Việt Nam được tô màu cam.</desc>
        <defs>
          <linearGradient id="partner-map-surface" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f4f7fa" /><stop offset="60%" stopColor="#e7eef5" /><stop offset="100%" stopColor="#dbe5ee" /></linearGradient>
          <radialGradient id="partner-map-focus" cx="52%" cy="48%" r="62%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" /><stop offset="100%" stopColor="#cbd8e6" stopOpacity="0" /></radialGradient>
          <filter id="vietnam-territory-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={CANVAS.width} height={CANVAS.height} fill="url(#partner-map-surface)" /><rect width={CANVAS.width} height={CANVAS.height} fill="url(#partner-map-focus)" />
        <svg x={CANVAS.mapX} y={CANVAS.mapY} width={CANVAS.mapWidth} height={CANVAS.mapHeight} viewBox="0 0 1000 550" aria-hidden="true">
          <g fill="#9fb2c4" stroke="#ffffff" strokeWidth="0.72" strokeOpacity="0.56">{worldMapPaths.filter((path) => path.name !== 'Vietnam').map((path) => <path key={path.name} data-country={path.name} d={path.d} />)}</g>
          <g className="partner-map-vietnam" fill="#f97316" stroke="#fff7ed" strokeWidth="1.25" filter="url(#vietnam-territory-glow)">{worldMapPaths.filter((path) => path.name === 'Vietnam').map((path) => <path key={path.name} data-country={path.name} d={path.d} />)}{vietnamMaritimeFeatures.map((path, index) => <path key={`vietnam-maritime-${index}`} d={path} />)}</g>
        </svg>

        {layout.map(({ config, country, marker, boxes, curves, endpoints, connectorStart }) => {
          if (!country) return null;
          const markerActive = activeCountryId === country.id;
          const activeCountry = markerActive || country.partners.some((partner) => partner.id === activePartnerId);
          const relationshipFocused = activePartnerId !== null || activeCountryId !== null;
          return <g key={country.id} data-country-layout={config.countryId}>
            {country.partners.map((item, index) => {
              const emphasized = markerActive || activePartnerId === item.id;
              return <React.Fragment key={`${item.id}-curve`}>{PARTNER_MAP_EDIT_MODE && <path d={curves[index].path} fill="none" stroke="transparent" strokeWidth="16" pointerEvents="stroke" className="cursor-ns-resize" onPointerDown={(event) => beginCurveDrag(event, item.id, connectorStart, endpoints[index])} />}<path className="partner-map-connector" data-connector="direct-curve" data-active={emphasized} data-dimmed={!emphasized && relationshipFocused} data-country-id={country.id} data-partner-id={item.id} d={curves[index].path} fill="none" stroke={emphasized ? '#f97316' : '#587188'} strokeWidth={emphasized ? 1.2 : 0.86} strokeDasharray={emphasized ? undefined : '7 2'} opacity={emphasized ? 0.98 : relationshipFocused ? 0.14 : 0.68} strokeLinecap="round" vectorEffect="non-scaling-stroke" pointerEvents="none" /></React.Fragment>;
            })}
            {country.partners.map((item, index) => {
              const box = boxes[index]; const active = activePartnerId === item.id; const dimmed = (activePartnerId !== null && !active) || (activeCountryId !== null && !markerActive);
              const partnerTooltipWidth = Math.min(270, Math.max(112, item.name.length * 7.5 + 28));
              const partnerTooltipX = Math.max(10, Math.min(CANVAS.width - partnerTooltipWidth - 10, box.x + box.width / 2 - partnerTooltipWidth / 2)); const partnerTooltipY = box.y > 44 ? box.y - 36 : box.y + box.height + 8;
              return <g key={item.id}><foreignObject x={box.x} y={box.y} width={box.width} height={box.height} overflow="visible"><a href={PARTNER_MAP_EDIT_MODE ? undefined : item.website} target={PARTNER_MAP_EDIT_MODE ? undefined : '_blank'} rel={PARTNER_MAP_EDIT_MODE ? undefined : 'noreferrer'} aria-label={`${item.name}, ${country.name}`} aria-grabbed={PARTNER_MAP_EDIT_MODE ? dragging?.id === item.id : undefined} className={`relative flex h-full w-full items-center justify-center rounded-[8px] outline-none transition-[filter,opacity] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${PARTNER_MAP_EDIT_MODE ? 'cursor-grab touch-none active:cursor-grabbing' : 'touch-manipulation'}`} onClick={(event) => { if (PARTNER_MAP_EDIT_MODE) event.preventDefault(); }} onPointerDown={(event) => beginDrag(event, item, box)} onMouseEnter={() => setActivePartnerId(item.id)} onMouseLeave={() => { if (dragging?.id !== item.id) setActivePartnerId(null); }} onFocus={() => setActivePartnerId(item.id)} onBlur={() => setActivePartnerId(null)}>{item.logo.contrastAid === 'soft-light' && <span aria-hidden="true" className="absolute inset-x-1 inset-y-2 rounded-[50%] bg-white/45 blur-[10px]" />}{item.logo.contrastAid === 'soft-light-strong' && <span aria-hidden="true" className="absolute inset-0 rounded-[50%] bg-white/80 blur-[8px]" />}{item.logo.contrastAid === 'maptek-green' && <span aria-hidden="true" className="absolute inset-x-1 inset-y-1 rounded-md bg-[#00843d]" />}<img src={item.logo.src} alt="" draggable={false} data-contrast={item.id === 'lander' ? 'dark-outline' : undefined} data-active={active} style={{ transform: `scale(${LOGO_OPTICAL_SCALE[item.id] ?? 1})` }} className={`partner-map-logo pointer-events-none relative z-10 h-[calc(100%-4px)] w-[calc(100%-4px)] select-none object-contain transition-[filter,opacity,transform] ${dimmed ? 'opacity-40' : 'opacity-100'} ${active ? 'drop-shadow-[0_3px_8px_rgba(249,115,22,0.4)]' : 'drop-shadow-[0_2px_2px_rgba(255,255,255,0.42)]'}`} /></a></foreignObject>{active && <g pointerEvents="none"><rect x={partnerTooltipX} y={partnerTooltipY} width={partnerTooltipWidth} height="28" rx="7" fill="#0f172a" stroke="#fb923c" /><text x={partnerTooltipX + partnerTooltipWidth / 2} y={partnerTooltipY + 18.5} textAnchor="middle" fill="#fff7ed" fontSize="12.5" fontWeight="700">{item.name}</text></g>}</g>;
            })}
            <g data-country-id={country.id} transform={`translate(${marker.x} ${marker.y})`} tabIndex={0} aria-label={country.name} className="cursor-pointer outline-none" onMouseEnter={() => setActiveCountryId(country.id)} onMouseLeave={() => setActiveCountryId(null)} onFocus={() => setActiveCountryId(country.id)} onBlur={() => setActiveCountryId(null)}><path transform={`scale(${MARKER_SCALE})`} d="M 0 0 C -2 -3.5 -6.5 -7.5 -6.5 -12 A 6.5 6.5 0 1 1 6.5 -12 C 6.5 -7.5 2 -3.5 0 0 Z M 0 -14.2 A 2.2 2.2 0 1 0 0 -9.8 A 2.2 2.2 0 1 0 0 -14.2 Z" fill={activeCountry ? '#f97316' : '#334a61'} fillRule="evenodd" stroke="#f8fafc" strokeWidth={activeCountry ? 1.9 : 1.55} strokeLinejoin="round" /></g>
          </g>;
        })}
        {countryTooltip && <g pointerEvents="none" data-tooltip-layer="country"><rect x={countryTooltip.x} y={countryTooltip.y} width={countryTooltip.width} height="30" rx="7" fill="#0f172a" stroke="#f97316" /><text x={countryTooltip.x + countryTooltip.width / 2} y={countryTooltip.y + 20} textAnchor="middle" fill="#fff7ed" fontSize="13" fontWeight="750">{countryTooltip.country.name}</text></g>}
      </svg>
    </div>
  );
};
