import React, { useMemo, useState } from 'react';
import { countryMarkerPositions, countryMarkers, partnerLogoPositions } from '../data/countryMarkers';
import { representativePartnerCountries, type RepresentativePartner } from '../data/representativePartners';
import { worldMapPaths } from '../data/worldMapPaths';

const CANVAS = { width: 1800, height: 1120, mapX: 120, mapY: 120, mapWidth: 1560, mapHeight: 858 } as const;
const LOGO_BOUNDS = {
  compact: { width: 82, height: 58 },
  standard: { width: 106, height: 60 },
  wide: { width: 132, height: 56 },
} as const;
type Point = { x: number; y: number };
type Box = { x: number; y: number; width: number; height: number };
type Curve = { path: string; samples: Point[] };
const CURVE_RATIO = 0.1;
const MIN_CURVATURE = 12;
const MAX_CURVATURE = 52;
const CONNECTOR_CLEARANCE = 7;
const CONNECTOR_GAP = 14;
const CONNECTOR_ENDPOINT_TUNING: Readonly<Record<string, { gap: number; x?: number; y?: number }>> = {
  prokon: { gap: 6, x: 10 },
  deltares: { gap: 6, x: 8 },
  piletest: { gap: 5 },
};

const mapPoint = (point: Point): Point => ({ x: CANVAS.mapX + point.x / 100 * CANVAS.mapWidth, y: CANVAS.mapY + point.y / 100 * CANVAS.mapHeight });
const boxCenter = (box: Box): Point => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
const expandedBox = (box: Box, padding: number): Box => ({ x: box.x - padding, y: box.y - padding, width: box.width + padding * 2, height: box.height + padding * 2 });

const logoConnectionPoint = (box: Box, marker: Point, partnerId: string): Point => {
  const tuning = CONNECTOR_ENDPOINT_TUNING[partnerId];
  const exclusion = expandedBox(box, tuning?.gap ?? CONNECTOR_GAP);
  const center = boxCenter(box);
  const dx = marker.x - center.x;
  const dy = marker.y - center.y;
  if (Math.abs(dx) >= Math.abs(dy)) return { x: dx < 0 ? exclusion.x : exclusion.x + exclusion.width, y: center.y + (tuning?.y ?? 0) };
  return { x: center.x + (tuning?.x ?? 0), y: dy < 0 ? exclusion.y : exclusion.y + exclusion.height };
};

const quadraticPoint = (start: Point, control: Point, end: Point, t: number): Point => {
  const inverse = 1 - t;
  return {
    x: inverse ** 2 * start.x + 2 * inverse * t * control.x + t ** 2 * end.x,
    y: inverse ** 2 * start.y + 2 * inverse * t * control.y + t ** 2 * end.y,
  };
};

const pointInBox = (point: Point, box: Box) => point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
const pointDistance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const buildCurve = (marker: Point, end: Point, occupied: readonly Box[], otherMarkers: readonly Point[], existing: readonly Curve[]): Curve => {
  const markerAngle = Math.atan2(end.y - marker.y, end.x - marker.x);
  const anchorRadius = 20;
  const anchor = { x: marker.x + Math.cos(markerAngle) * anchorRadius, y: marker.y + Math.sin(markerAngle) * anchorRadius };
  const dx = end.x - anchor.x;
  const dy = end.y - anchor.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length };
  const midpoint = { x: (anchor.x + end.x) / 2, y: (anchor.y + end.y) / 2 };
  const baseCurvature = Math.max(MIN_CURVATURE, Math.min(MAX_CURVATURE, length * CURVE_RATIO));
  const candidates = ([-1, 1] as const).flatMap((direction) => [0.88, 1, 1.12].map((variation) => {
    const bow = baseCurvature * variation * direction;
    const control = { x: midpoint.x + normal.x * bow, y: midpoint.y + normal.y * bow };
    const samples = Array.from({ length: 49 }, (_, index) => quadraticPoint(anchor, control, end, index / 48));
    const logoHits = occupied.reduce((hits, box) => hits + (samples.slice(2, -2).some((point) => pointInBox(point, expandedBox(box, CONNECTOR_GAP))) ? 1 : 0), 0);
    const markerHits = otherMarkers.reduce((hits, point) => hits + (samples.slice(3, -3).some((sample) => pointDistance(sample, point) < 18) ? 1 : 0), 0);
    const clearanceHits = existing.reduce((hits, curve) => hits + (samples.slice(3, -3).some((point) => curve.samples.slice(3, -3).some((sample) => pointDistance(point, sample) < CONNECTOR_CLEARANCE)) ? 1 : 0), 0);
    const score = logoHits * 100000 + markerHits * 80000 + clearanceHits * 60000 + Math.abs(variation - 1) * 100;
    return { path: `M ${anchor.x} ${anchor.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`, samples, score };
  }));
  return candidates.sort((a, b) => a.score - b.score)[0];
};

const logoBox = (partner: RepresentativePartner): Box => {
  const position = partnerLogoPositions[partner.id as keyof typeof partnerLogoPositions];
  if (!position) throw new Error(`Missing global partner-map position for ${partner.id}`);
  return { ...position, ...LOGO_BOUNDS[partner.logo.visualWeight] };
};

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
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const layout = useMemo(() => {
    const countries = countryMarkers.map((config) => ({ config, country: representativePartnerCountries.find((entry) => entry.id === config.countryId), marker: mapPoint(countryMarkerPositions[config.countryId]) })).filter((entry) => entry.country);
    const markers = countries.map((entry) => entry.marker);
    const boxes = countries.flatMap((entry) => entry.country?.partners.map(logoBox) ?? []);
    const acceptedCurves: Curve[] = [];
    let boxOffset = 0;
    return countries.map((entry) => {
      const count = entry.country?.partners.length ?? 0;
      const countryBoxes = boxes.slice(boxOffset, boxOffset + count);
      boxOffset += count;
      const countryCurves = countryBoxes.map((box, index) => {
        const partner = entry.country?.partners[index];
        const curve = buildCurve(entry.marker, logoConnectionPoint(box, entry.marker, partner?.id ?? ''), boxes.filter((candidate) => candidate !== box), markers.filter((candidate) => candidate !== entry.marker), acceptedCurves);
        acceptedCurves.push(curve);
        return curve;
      });
      return { ...entry, boxes: countryBoxes, curves: countryCurves };
    });
  }, []);
  return (
    <div className="relative w-full overflow-x-auto" aria-label="Mạng lưới đối tác tiêu biểu theo quốc gia">
      <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} className="block h-auto w-full min-w-[1180px] lg:min-w-0" role="img" aria-labelledby="partner-map-title partner-map-desc">
        <style>{`foreignObject img { width: calc(100% - 4px); height: calc(100% - 4px); }`}</style>
        <title id="partner-map-title">CIC tại Việt Nam kết nối với các đối tác công nghệ tiêu biểu trên thế giới</title>
        <desc id="partner-map-desc">Logo đối tác nằm trong khoảng trống đại dương và nối bằng đường cong tới map pin của quốc gia tương ứng. Việt Nam được tô màu cam.</desc>
        <defs>
          <linearGradient id="partner-map-surface" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f4f7fa" /><stop offset="60%" stopColor="#e7eef5" /><stop offset="100%" stopColor="#dbe5ee" /></linearGradient>
          <radialGradient id="partner-map-focus" cx="52%" cy="48%" r="62%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" /><stop offset="100%" stopColor="#cbd8e6" stopOpacity="0" /></radialGradient>
          <filter id="vietnam-territory-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={CANVAS.width} height={CANVAS.height} fill="url(#partner-map-surface)" /><rect width={CANVAS.width} height={CANVAS.height} fill="url(#partner-map-focus)" />
        <svg x={CANVAS.mapX} y={CANVAS.mapY} width={CANVAS.mapWidth} height={CANVAS.mapHeight} viewBox="0 0 1000 550" aria-hidden="true">
          <g fill="#aebdcb" stroke="#587087" strokeWidth="0.78" strokeOpacity="0.88">{worldMapPaths.filter((path) => path.name !== 'Vietnam').map((path) => <path key={path.name} data-country={path.name} d={path.d} />)}</g>
          <g fill="#f97316" stroke="#fff7ed" strokeWidth="1.25" filter="url(#vietnam-territory-glow)">{worldMapPaths.filter((path) => path.name === 'Vietnam').map((path) => <path key={path.name} data-country={path.name} d={path.d} />)}{vietnamMaritimeFeatures.map((path, index) => <path key={`vietnam-maritime-${index}`} d={path} />)}</g>
        </svg>

        {layout.map(({ config, country, marker, boxes, curves }) => {
          if (!country) return null;
          const markerActive = activeCountryId === country.id;
          const activeCountry = markerActive || country.partners.some((partner) => partner.id === activePartnerId);
          const tooltipWidth = Math.min(220, Math.max(108, country.name.length * 7.8 + 30));
          const tooltipX = Math.max(10, Math.min(CANVAS.width - tooltipWidth - 10, marker.x - tooltipWidth / 2));
          const tooltipY = Math.max(10, marker.y - 58);
          return <g key={country.id} data-country-layout={config.countryId}>
            {country.partners.map((item, index) => { const emphasized = markerActive || activePartnerId === item.id; return <path key={`${item.id}-curve`} data-connector="direct-curve" data-country-id={country.id} data-partner-id={item.id} d={curves[index].path} fill="none" stroke={emphasized ? '#f97316' : '#60778d'} strokeWidth={emphasized ? 2 : 1.25} opacity={emphasized ? 0.92 : 0.58} strokeLinecap="round" />; })}
            {country.partners.map((item, index) => {
              const box = boxes[index]; const active = activePartnerId === item.id; const dimmed = (activePartnerId !== null && !active) || (activeCountryId !== null && !markerActive);
              const partnerTooltipWidth = Math.min(270, Math.max(112, item.name.length * 7.5 + 28));
              const partnerTooltipX = Math.max(10, Math.min(CANVAS.width - partnerTooltipWidth - 10, box.x + box.width / 2 - partnerTooltipWidth / 2)); const partnerTooltipY = box.y > 44 ? box.y - 36 : box.y + box.height + 8;
              return <g key={item.id}><foreignObject x={box.x} y={box.y} width={box.width} height={box.height} overflow="visible"><a href={item.website} target="_blank" rel="noreferrer" aria-label={`${item.name}, ${country.name}`} className="relative flex h-full w-full items-center justify-center rounded-md outline-none transition-[filter,opacity] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2" onMouseEnter={() => setActivePartnerId(item.id)} onMouseLeave={() => setActivePartnerId(null)} onFocus={() => setActivePartnerId(item.id)} onBlur={() => setActivePartnerId(null)}>{item.logo.contrastAid === 'soft-light' && <span aria-hidden="true" className="absolute inset-x-1 inset-y-2 rounded-[50%] bg-white/45 blur-[10px]" />}{item.logo.contrastAid === 'soft-light-strong' && <span aria-hidden="true" className="absolute inset-0 rounded-[50%] bg-white/80 blur-[8px]" />}{item.logo.contrastAid === 'maptek-green' && <span aria-hidden="true" className="absolute inset-x-1 inset-y-1 rounded-md bg-[#00843d]" />}<img src={item.logo.src} alt="" className={`relative z-10 h-[calc(100%-4px)] w-[calc(100%-4px)] object-contain transition-[filter,opacity] ${dimmed ? 'opacity-40' : 'opacity-100'} ${active ? 'drop-shadow-[0_3px_8px_rgba(249,115,22,0.4)]' : 'drop-shadow-[0_2px_2px_rgba(255,255,255,0.42)]'}`} /></a></foreignObject>{active && <g pointerEvents="none"><rect x={partnerTooltipX} y={partnerTooltipY} width={partnerTooltipWidth} height="28" rx="7" fill="#0f172a" stroke="#fb923c" /><text x={partnerTooltipX + partnerTooltipWidth / 2} y={partnerTooltipY + 18.5} textAnchor="middle" fill="#fff7ed" fontSize="12.5" fontWeight="700">{item.name}</text></g>}</g>;
            })}
            <g data-country-id={country.id} transform={`translate(${marker.x} ${marker.y})`} tabIndex={0} aria-label={country.name} className="cursor-pointer outline-none" onMouseEnter={() => setActiveCountryId(country.id)} onMouseLeave={() => setActiveCountryId(null)} onFocus={() => setActiveCountryId(country.id)} onBlur={() => setActiveCountryId(null)}><path d="M 0 0 C -2 -3.5 -6.5 -7.5 -6.5 -12 A 6.5 6.5 0 1 1 6.5 -12 C 6.5 -7.5 2 -3.5 0 0 Z M 0 -14.2 A 2.2 2.2 0 1 0 0 -9.8 A 2.2 2.2 0 1 0 0 -14.2 Z" fill={activeCountry ? '#f97316' : '#334a61'} fillRule="evenodd" stroke="#f8fafc" strokeWidth={activeCountry ? 1.9 : 1.55} strokeLinejoin="round" /></g>
            {activeCountry && <g pointerEvents="none"><rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="30" rx="7" fill="#0f172a" stroke="#f97316" /><text x={tooltipX + tooltipWidth / 2} y={tooltipY + 20} textAnchor="middle" fill="#fff7ed" fontSize="13" fontWeight="750">{country.name}</text></g>}
          </g>;
        })}
      </svg>
    </div>
  );
};
