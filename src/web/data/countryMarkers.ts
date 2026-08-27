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
  lantek: { x: 0.392935, y: 0.831915 }, roomvo: { x: 0.068472, y: 0.813565 }, stx: { x: 0.033479, y: 0.507819 },
  csi: { x: 0.042858, y: 0.615698 }, bentley: { x: 0.107865, y: 0.285719 }, kritikal: { x: 0.086366, y: 0.350942 },
  htri: { x: 0.055196, y: 0.431678 }, ansys: { x: 0.338312, y: 0.763943 }, agi: { x: 0.038384, y: 0.720856 },
  foxit: { x: 0.118328, y: 0.885196 }, autodesk: { x: 0.256713, y: 0.799695 }, seequent: { x: 0.060391, y: 0.179624 },
  metsims: { x: 0.400936, y: 0.640357 }, 'zx-lidar': { x: 0.397622, y: 0.391265 }, radiodetection: { x: 0.389035, y: 0.470925 }, gigaton: { x: 0.421645, y: 0.734869 },
  prokon: { x: 0.399894, y: 0.314355 }, graitec: { x: 0.520346, y: 0.864998 }, deltares: { x: 0.308006, y: 0.024503 }, 'pre-sustainability': { x: 0.298121, y: 0.095565 },
  pytha: { x: 0.477997, y: 0.018378 }, allplan: { x: 0.383688, y: 0.05881 }, ptv: { x: 0.448845, y: 0.084539 }, lander: { x: 0.464754, y: 0.660243 },
  geosig: { x: 0.805632, y: 0.357317 }, opera: { x: 0.594736, y: 0.890966 }, emmegi: { x: 0.616668, y: 0.717913 },
  'idea-statica': { x: 0.857185, y: 0.281742 }, hexagon: { x: 0.918226, y: 0.191695 }, geoscanner: { x: 0.849566, y: 0.103148 },
  dnv: { x: 0.644156, y: 0.084577 }, piletest: { x: 0.649134, y: 0.604675 }, gstarsoft: { x: 0.87039, y: 0.549367 },
  glodon: { x: 0.755885, y: 0.515113 }, qysea: { x: 0.869064, y: 0.423082 }, chc: { x: 0.93045, y: 0.506387 }, bimage: { x: 0.721644, y: 0.904573 },
  'ai-architecture': { x: 0.185571, y: 0.855121 }, cype: { x: 0.28485, y: 0.736 }, maptek: { x: 0.913679, y: 0.729621 }, deswik: { x: 0.844445, y: 0.906946 }, metron: { x: 0.888167, y: 0.837507 },
} as const satisfies Readonly<Record<string, NormalizedPoint>>;

export const partnerCurveBends = {
  ptv: 1.068, allplan: 1.203, 'pre-sustainability': 1.5, pytha: 1.073,
  lander: -0.373, metsims: -0.994, radiodetection: -1.5, 'zx-lidar': -1.5,
  gigaton: 1.5, graitec: -1.5, kritikal: -1.5, agi: -0.697, csi: -1.5,
  deltares: 1.5, geosig: 1.5, 'idea-statica': -1.038, seequent: 1.5,
  bentley: -1.5, bimage: -1.5, piletest: -1.5, prokon: 1.393,
  htri: -0.754, stx: -1.291, 'ai-architecture': 1.453, autodesk: 0.51,
  ansys: 1.5, lantek: 1.5, hexagon: 1.5,
  roomvo: 0.481, chc: 1.254, gstarsoft: 0.462, glodon: 1.5, qysea: 1.5,
} as const satisfies Readonly<Record<string, number>>;

export const vietnamHub = {
  marker: { x: 79.45, y: 47.12 },
  label: { x: 85.5, y: 48.5 },
} as const;
