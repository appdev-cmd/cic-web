/**
 * CIC Technology & Engineering - Design Tokens: Spacing
 * 
 * Standardized pixel & rem scale for consistent layouts, padding, margins,
 * section rhythms, and element gaps across mobile and desktop interfaces.
 */

export const spacingScale = {
  none: '0px',
  '3xs': '2px',   // 0.125rem - scale 0.5
  '2xs': '4px',   // 0.25rem  - scale 1
  xs: '6px',      // 0.375rem - scale 1.5
  sm: '8px',      // 0.5rem   - scale 2
  md: '12px',     // 0.75rem  - scale 3
  lg: '16px',     // 1rem     - scale 4
  xl: '20px',     // 1.25rem  - scale 5
  '2xl': '24px',  // 1.5rem   - scale 6
  '3xl': '32px',  // 2rem     - scale 8
  '4xl': '40px',  // 2.5rem   - scale 10
  '5xl': '48px',  // 3rem     - scale 12
  '6xl': '64px',  // 4rem     - scale 16
  '7xl': '80px',  // 5rem     - scale 20
  '8xl': '96px',  // 6rem     - scale 24
} as const;

export const semanticSpacing = {
  // Container Padding
  containerPadding: {
    mobile: '16px',   // px-4
    tablet: '24px',   // px-6
    desktop: '32px',  // px-8
    maxWidth: '1280px', // max-w-7xl
  },

  // Vertical Rhythm for Page Sections
  sectionPadding: {
    compact: '24px',   // py-6
    standard: '48px',  // py-12
    spacious: '64px',  // py-16
    hero: '96px',      // py-24
  },

  // Card Inner Padding
  cardPadding: {
    compact: '16px',   // p-4
    standard: '24px',  // p-6
    spacious: '32px',  // p-8
  },

  // Component Gaps
  gap: {
    tight: '8px',       // gap-2
    standard: '16px',    // gap-4
    wide: '24px',        // gap-6
    extraWide: '32px',   // gap-8
    hero: '48px',        // gap-12
  },

  // Form Controls Padding
  inputPadding: {
    compact: { x: '12px', y: '6px' },   // px-3 py-1.5
    standard: { x: '16px', y: '10px' }, // px-4 py-2.5
    large: { x: '24px', y: '16px' },    // px-6 py-4
  },

  // Button Action Padding
  buttonPadding: {
    sm: { x: '12px', y: '6px' },   // px-3 py-1.5
    md: { x: '16px', y: '8px' },   // px-4 py-2
    lg: { x: '20px', y: '10px' },  // px-5 py-2.5
    xl: { x: '24px', y: '12px' },  // px-6 py-3
  },
} as const;

export type SpacingScaleKey = keyof typeof spacingScale;
