export type PercentagePoint = { x: number; y: number };
export type NormalizedPoint = { x: number; y: number };

export const countryMarkerPositions = {
  usa: { x: 22.8, y: 35.3 },
  canada: { x: 24.505, y: 18.391 },
  uk: { x: 49.1, y: 25.955 },
  ireland: { x: 47.85, y: 26.5 },
  france: { x: 51.1, y: 32.4 },
  netherlands: { x: 51.55, y: 27.53 },
  germany: { x: 52.95, y: 28.27 },
  switzerland: { x: 52.31, y: 31.21 },
  italy: { x: 53.46, y: 34.11 },
  czechia: { x: 54.42, y: 29.26 },
  spain: { x: 48.72, y: 36.9 },
  sweden: { x: 54.68, y: 18.25 },
  norway: { x: 53.5, y: 15.5 },
  israel: { x: 59.72, y: 39.791 },
  china: { x: 79.46, y: 36.95 },
  'south-korea': { x: 85.44, y: 37.2 },
  singapore: { x: 78.82, y: 54.55 },
  australia: { x: 87.29, y: 66.5 },
} as const satisfies Readonly<Record<string, PercentagePoint>>;

export type PartnerCountryId = keyof typeof countryMarkerPositions;

export type CountryMarkerConfig = {
  countryId: PartnerCountryId;
};

/**
 * Geographic marker coordinates are percentages of the fixed 1000 × 550
 * world-map artwork. Labels and partner groups are deliberately independent.
 * Marker values were checked against the matching country polygons in
 * worldMapPaths; they must never be derived from labels or partner layout.
 */
export const countryMarkers: readonly CountryMarkerConfig[] = [
  { countryId: 'usa' }, { countryId: 'canada' }, { countryId: 'uk' }, { countryId: 'ireland' },
  { countryId: 'france' }, { countryId: 'netherlands' }, { countryId: 'germany' }, { countryId: 'switzerland' },
  { countryId: 'italy' }, { countryId: 'czechia' }, { countryId: 'spain' }, { countryId: 'sweden' }, { countryId: 'norway' },
  { countryId: 'israel' }, { countryId: 'china' }, { countryId: 'singapore' },
  { countryId: 'australia' },
] as const;

/**
 * Global ocean-layout result. Positions are normalized against the full SVG
 * canvas so exported edit-mode layouts remain responsive. They are deliberately
 * independent from country order and marker coordinates. The packing pass
 * rasterizes every land path, reserves a 150px Vietnam protection radius,
 * uses full 116x62 logo boxes, balances three horizontal density bands, and
 * rejects placements that touch land, another logo, a pin, or canvas bounds.
 */
export const partnerLogoPositions = {
  lantek: { x: 0.091631, y: 0 }, roomvo: { x: 0.031457, y: 0.069863 }, stx: { x: 0.025037, y: 0.139031 },
  csi: { x: 0, y: 0.647554 }, bentley: { x: 0.002669, y: 0.201182 }, kritikal: { x: 0.016884, y: 0.286004 },
  htri: { x: 0.003247, y: 0.35204 }, ansys: { x: 0.251948, y: 0.583837 }, agi: { x: 0.024747, y: 0.708604 },
  foxit: { x: 0.082612, y: 0.803107 }, autodesk: { x: 0.189178, y: 0.798469 }, seequent: { x: 0.166667, y: 0.0375 },
  metsims: { x: 0.393145, y: 0.474955 }, 'zx-lidar': { x: 0.377491, y: 0.321429 }, radiodetection: { x: 0.347474, y: 0.382711 }, gigaton: { x: 0.378138, y: 0.290121 },
  prokon: { x: 0.259632, y: 0.038682 }, graitec: { x: 0.465151, y: 0.048489 }, deltares: { x: 0.393722, y: 0.008166 }, 'pre-sustainability': { x: 0.368253, y: 0.047716 },
  pytha: { x: 0.340981, y: 0.926021 }, allplan: { x: 0.912266, y: 0.165003 }, ptv: { x: 0.517676, y: 0 }, lander: { x: 0.415404, y: 0.578156 },
  geosig: { x: 0.557576, y: 0.875581 }, opera: { x: 0.425902, y: 0.850535 }, emmegi: { x: 0.488744, y: 0.916397 },
  'idea-statica': { x: 0.926667, y: 0.229059 }, hexagon: { x: 0.867577, y: 0.115732 }, geoscanner: { x: 0.832684, y: 0.056591 },
  dnv: { x: 0.73117, y: 0.020866 }, piletest: { x: 0.622511, y: 0.572819 }, gstarsoft: { x: 0.919092, y: 0.455026 },
  glodon: { x: 0.924719, y: 0.545744 }, qysea: { x: 0.862885, y: 0.311588 }, chc: { x: 0.892786, y: 0.37529 }, bimage: { x: 0.728787, y: 0.900897 },
  'ai-architecture': { x: 0.129726, y: 0.715445 }, cype: { x: 0.218615, y: 0.731099 }, maptek: { x: 0.926667, y: 0.7529 }, deswik: { x: 0.812626, y: 0.925324 }, metron: { x: 0.874531, y: 0.860786 },
} as const satisfies Readonly<Record<string, NormalizedPoint>>;

export const vietnamHub = {
  marker: { x: 79.45, y: 47.12 },
  label: { x: 85.5, y: 48.5 },
} as const;
