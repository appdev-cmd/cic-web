/**
 * CIC Technology & Engineering - Design Tokens: Border Radius
 * 
 * Standardized corner radii for interactive controls, cards, modals, and pills.
 * Enforces the brand rule: 8px for controls/tags, 10px for cards/containers, 9999px for pills/dots.
 */

export const radiusScale = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',     // Standard control radius (rounded-[8px])
  lg: '10px',    // Standard card/container radius (rounded-[10px])
  xl: '12px',    // Medium floating panel
  '2xl': '16px', // Large modal container
  '3xl': '24px', // Extra large backdrop card
  full: '9999px',// Circular badges, status dots, pills
} as const;

export const semanticRadius = {
  // Interactive Controls
  button: radiusScale.md,    // 8px
  input: radiusScale.md,     // 8px
  select: radiusScale.md,    // 8px
  checkbox: radiusScale.sm,  // 4px
  
  // Containers & Cards
  card: radiusScale.lg,      // 10px
  modal: radiusScale.lg,     // 10px
  drawer: radiusScale.lg,    // 10px
  image: radiusScale.lg,     // 10px
  banner: radiusScale.lg,    // 10px
  
  // Tags & Badges
  tag: radiusScale.md,       // 8px
  badge: radiusScale.md,     // 8px
  pill: radiusScale.full,    // 9999px
  avatar: radiusScale.full,  // 9999px
  statusDot: radiusScale.full, // 9999px
  
  // Sub-element Nesting Rule (Inner Radius = Outer Radius - Padding)
  calcInnerRadius: (outerRadiusPx: number, paddingPx: number): string => {
    const inner = Math.max(0, outerRadiusPx - paddingPx);
    return `${inner}px`;
  },
} as const;

export type RadiusScaleKey = keyof typeof radiusScale;
