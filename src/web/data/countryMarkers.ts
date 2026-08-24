export type PercentagePoint = { x: number; y: number };

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
  { countryId: 'italy' }, { countryId: 'czechia' }, { countryId: 'sweden' }, { countryId: 'norway' },
  { countryId: 'israel' }, { countryId: 'china' }, { countryId: 'south-korea' }, { countryId: 'singapore' },
  { countryId: 'australia' },
] as const;

/**
 * Global ocean-layout result. Positions are canvas coordinates, deliberately
 * independent from country order and marker coordinates. The packing pass
 * rasterizes every land path, reserves a 150px Vietnam protection radius,
 * uses full 116x62 logo boxes, balances three horizontal density bands, and
 * rejects placements that touch land, another logo, a pin, or canvas bounds.
 */
export const partnerLogoPositions = {
  lantek: { x: 20, y: 30 }, roomvo: { x: 80, y: 125 }, stx: { x: 10, y: 220 },
  csi: { x: 110, y: 315 }, bentley: { x: 20, y: 410 }, kritikal: { x: 90, y: 505 },
  htri: { x: 45, y: 600 }, ansys: { x: 300, y: 650 }, agi: { x: 20, y: 800 },
  foxit: { x: 100, y: 870 }, autodesk: { x: 400, y: 900 }, seequent: { x: 350, y: 42 },
  metsims: { x: 660, y: 310 }, 'zx-lidar': { x: 620, y: 420 }, radiodetection: { x: 650, y: 500 },
  prokon: { x: 480, y: 840 }, graitec: { x: 690, y: 700 }, deltares: { x: 600, y: 40 },
  pytha: { x: 740, y: 780 }, allplan: { x: 1600, y: 72 }, ptv: { x: 1000, y: 50 },
  geosig: { x: 1080, y: 710 }, opera: { x: 880, y: 860 }, emmegi: { x: 1050, y: 820 },
  'idea-statica': { x: 1640, y: 142 }, hexagon: { x: 1128, y: 42 }, geoscanner: { x: 1320, y: 36 },
  dnv: { x: 900, y: 130 }, piletest: { x: 1200, y: 610 }, gstarsoft: { x: 1548, y: 458 },
  glodon: { x: 1630, y: 540 }, instral: { x: 1628, y: 320 }, bimage: { x: 1320, y: 750 },
  maptek: { x: 1650, y: 620 }, deswik: { x: 1430, y: 860 },
} as const satisfies Readonly<Record<string, { x: number; y: number }>>;

export const vietnamHub = {
  marker: { x: 79.45, y: 47.12 },
  label: { x: 85.5, y: 48.5 },
} as const;
