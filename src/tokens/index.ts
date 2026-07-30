/**
 * CIC Technology & Engineering - Design Token System
 * 
 * Central index exporting design tokens:
 * - colors.ts (primitive palettes & semantic colors)
 * - spacing.ts (spacing scale & semantic paddings/gaps)
 * - radius.ts (corner radii scale & semantic application rules)
 * - shadow.ts (elevation scale & brand orange glow effects)
 * - typography.ts (fonts, sizes, weights, line heights, letter spacings)
 */

import { primitiveColors, semanticColors } from './colors';
import { spacingScale, semanticSpacing } from './spacing';
import { radiusScale, semanticRadius } from './radius';
import { shadowScale, brandShadows, semanticShadows } from './shadow';
import { fontFamilies, fontSizes, fontWeights, letterSpacings, lineHeights, semanticTypography } from './typography';

export * from './colors';
export * from './spacing';
export * from './radius';
export * from './shadow';
export * from './typography';

export const designTokens = {
  colors: {
    primitive: primitiveColors,
    semantic: semanticColors,
  },
  spacing: {
    scale: spacingScale,
    semantic: semanticSpacing,
  },
  radius: {
    scale: radiusScale,
    semantic: semanticRadius,
  },
  shadow: {
    scale: shadowScale,
    brand: brandShadows,
    semantic: semanticShadows,
  },
  typography: {
    fontFamilies,
    fontSizes,
    fontWeights,
    letterSpacings,
    lineHeights,
    semantic: semanticTypography,
  },
} as const;

export type DesignTokenSystem = typeof designTokens;

/**
 * Generate CSS Custom Properties (Variables) from design tokens for root injection
 */
export const generateCssVariables = (): string => {
  return `
    :root {
      /* Colors - Brand Primary */
      --token-color-brand-primary: ${semanticColors.brand.primary};
      --token-color-brand-hover: ${semanticColors.brand.hover};
      --token-color-brand-active: ${semanticColors.brand.active};
      --token-color-brand-light: ${semanticColors.brand.light};
      --token-color-brand-navy: ${semanticColors.brand.navy};

      /* Colors - Surfaces & Neutrals */
      --token-color-surface-page: ${semanticColors.surface.page};
      --token-color-surface-card: ${semanticColors.surface.card};
      --token-color-surface-card-dark: ${semanticColors.surface.cardDark};
      --token-color-text-primary: ${semanticColors.text.primary};
      --token-color-text-secondary: ${semanticColors.text.secondary};
      --token-color-text-muted: ${semanticColors.text.muted};
      --token-color-border-default: ${semanticColors.border.default};

      /* Radius Scale */
      --token-radius-control: ${semanticRadius.button}; /* 8px */
      --token-radius-card: ${semanticRadius.card};     /* 10px */
      --token-radius-pill: ${semanticRadius.pill};     /* 9999px */

      /* Shadows */
      --token-shadow-sm: ${shadowScale.sm};
      --token-shadow-md: ${shadowScale.md};
      --token-shadow-lg: ${shadowScale.lg};
      --token-shadow-brand-glow: ${brandShadows.buttonGlow};

      /* Typography */
      --token-font-sans: ${fontFamilies.sans};
      --token-font-mono: ${fontFamilies.mono};
    }
  `.trim();
};

export default designTokens;
