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
  lantek: { x: 0.413065, y: 0.874798 }, roomvo: { x: 0.12042, y: 0.923833 }, stx: { x: 0.03218, y: 0.65852 },
  csi: { x: 0.026624, y: 0.837461 }, bentley: { x: 0.013707, y: 0.380062 }, kritikal: { x: 0.089613, y: 0.409751 },
  htri: { x: 0.028572, y: 0.526019 }, ansys: { x: 0.377924, y: 0.926896 }, agi: { x: 0.097476, y: 0.811522 },
  foxit: { x: 0.20729, y: 0.729595 }, autodesk: { x: 0.2684, y: 0.820523 }, seequent: { x: 0.044806, y: 0.294795 },
  metsims: { x: 0.410027, y: 0.645258 }, 'zx-lidar': { x: 0.382036, y: 0.419445 }, radiodetection: { x: 0.390982, y: 0.478277 }, gigaton: { x: 0.393723, y: 0.348931 },
  prokon: { x: 0.033655, y: 0.197959 }, graitec: { x: 0.489826, y: 0.650586 }, deltares: { x: 0.064496, y: 0.062485 }, 'pre-sustainability': { x: 0.079287, y: 0.1409 },
  pytha: { x: 0.384489, y: 0.068612 }, allplan: { x: 0.185632, y: 0.014704 }, ptv: { x: 0.307933, y: 0.035531 }, lander: { x: 0.448519, y: 0.749685 },
  geosig: { x: 0.904984, y: 0.311985 }, opera: { x: 0.526553, y: 0.931398 }, emmegi: { x: 0.595239, y: 0.895568 },
  'idea-statica': { x: 0.848744, y: 0.23641 }, hexagon: { x: 0.920175, y: 0.180668 }, geoscanner: { x: 0.902164, y: 0.093346 },
  dnv: { x: 0.77208, y: 0.072325 }, piletest: { x: 0.652381, y: 0.600999 }, gstarsoft: { x: 0.876884, y: 0.571421 },
  glodon: { x: 0.764327, y: 0.507762 }, qysea: { x: 0.869713, y: 0.415731 }, chc: { x: 0.933047, y: 0.518639 }, bimage: { x: 0.721644, y: 0.904573 },
  'ai-architecture': { x: 0.226481, y: 0.905353 }, cype: { x: 0.317318, y: 0.8867 }, maptek: { x: 0.926667, y: 0.7529 }, deswik: { x: 0.85938, y: 0.93145 }, metron: { x: 0.923233, y: 0.843633 },
} as const satisfies Readonly<Record<string, NormalizedPoint>>;

export const partnerCurveBends = {
  ptv: 1.068, allplan: 1.203, 'pre-sustainability': 1.353, pytha: 1.073,
  lander: 0.558, metsims: -0.219, radiodetection: -0.739, 'zx-lidar': -1.058,
  gigaton: -1.032, graitec: 0, kritikal: 1.5, agi: 0.921, csi: 1.5,
  deltares: 1.374, geosig: 0.76, 'idea-statica': -1.038, seequent: 0.161,
  bentley: 1.5,
} as const satisfies Readonly<Record<string, number>>;

export const vietnamHub = {
  marker: { x: 79.45, y: 47.12 },
  label: { x: 85.5, y: 48.5 },
} as const;
