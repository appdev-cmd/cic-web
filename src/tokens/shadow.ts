/**
 * CIC Technology & Engineering - Design Tokens: Elevation & Shadows
 * 
 * Elevation system providing depth, visual hierarchy, card lift states,
 * and high-tech orange brand glow effects.
 */

export const shadowScale = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

export const brandShadows = {
  // Brand Orange Accent Shadows & Glows
  buttonGlow: '0 20px 50px rgba(234, 88, 12, 0.3)',
  buttonGlowSm: '0 4px 14px rgba(234, 88, 12, 0.25)',
  cardGlow: '0 0 20px rgba(234, 88, 12, 0.15)',
  cardGlowHeavy: '0 0 30px rgba(234, 88, 12, 0.35)',
  textGlow: '0 0 10px rgba(234, 88, 12, 0.3)',
  heroCard: '0 40px 80px rgba(0, 0, 0, 0.15)',
  modalOverlay: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
} as const;

export const semanticShadows = {
  cardDefault: shadowScale.sm,
  cardHover: shadowScale.xl,
  dropdown: shadowScale.lg,
  modal: brandShadows.modalOverlay,
  buttonPrimary: brandShadows.buttonGlowSm,
  buttonPrimaryHover: brandShadows.buttonGlow,
  activeFilterTab: shadowScale.md,
  floatingWidget: shadowScale['2xl'],
} as const;

export type ShadowScaleKey = keyof typeof shadowScale;
