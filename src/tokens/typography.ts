/**
 * CIC Technology & Engineering - Design Tokens: Typography
 * 
 * Typographic system defining font families, font scale ratios, weights,
 * line heights, letter spacings, and semantic usage rules.
 */

export const fontFamilies = {
  sans: '"Roboto", "Be Vietnam Pro", system-ui, -apple-system, sans-serif',
  display: '"Roboto", "Be Vietnam Pro", system-ui, -apple-system, sans-serif',
  mono: '"Roboto", "Be Vietnam Pro", monospace',
} as const;

export const fontSizes = {
  micro: {
    fontSize: '10px',
    lineHeight: '1.4',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
  },
  xs: {
    fontSize: '12px',
    lineHeight: '1.5',
    letterSpacing: '0.05em',
  },
  sm: {
    fontSize: '14px',
    lineHeight: '1.5',
    letterSpacing: '0em',
  },
  base: {
    fontSize: '16px',
    lineHeight: '1.6',
    letterSpacing: '0em',
  },
  lg: {
    fontSize: '18px',
    lineHeight: '1.5',
    letterSpacing: '-0.01em',
  },
  xl: {
    fontSize: '20px',
    lineHeight: '1.4',
    letterSpacing: '-0.01em',
  },
  '2xl': {
    fontSize: '24px',
    lineHeight: '1.3',
    letterSpacing: '-0.02em',
  },
  '3xl': {
    fontSize: '30px',
    lineHeight: '1.25',
    letterSpacing: '-0.02em',
  },
  '4xl': {
    fontSize: '36px',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
  },
  '5xl': {
    fontSize: '48px',
    lineHeight: '1.1',
    letterSpacing: '-0.025em',
  },
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.05em',
  wider: '0.1em',
  widest: '0.2em',
  ultra: '0.3em',
} as const;

export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

export const semanticTypography = {
  // Page Headings
  heroHeading: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['5xl'].fontSize,
    lineHeight: fontSizes['5xl'].lineHeight,
    fontWeight: fontWeights.black,
    letterSpacing: fontSizes['5xl'].letterSpacing,
  },
  h1: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['4xl'].fontSize,
    lineHeight: fontSizes['4xl'].lineHeight,
    fontWeight: fontWeights.black,
    letterSpacing: fontSizes['4xl'].letterSpacing,
  },
  h2: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['3xl'].fontSize,
    lineHeight: fontSizes['3xl'].lineHeight,
    fontWeight: fontWeights.black,
    letterSpacing: fontSizes['3xl'].letterSpacing,
  },
  h3: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['2xl'].fontSize,
    lineHeight: fontSizes['2xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: fontSizes['2xl'].letterSpacing,
  },
  h4: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xl.fontSize,
    lineHeight: fontSizes.xl.lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: fontSizes.xl.letterSpacing,
  },

  // Body & Content
  bodyLead: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg.fontSize,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.medium,
  },
  bodyStandard: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base.fontSize,
    lineHeight: fontSizes.base.lineHeight,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm.fontSize,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.medium,
  },

  // Interactive UI Elements
  buttonText: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm.fontSize,
    fontWeight: fontWeights.black,
    letterSpacing: letterSpacings.widest,
    textTransform: 'uppercase' as const,
  },
  badgeText: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.micro.fontSize,
    fontWeight: fontWeights.black,
    letterSpacing: letterSpacings.ultra,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase' as const,
  },
} as const;

export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;
