/**
 * CIC Technology & Engineering - Design Tokens: Colors
 * 
 * Scalable color system containing primitive palettes, semantic functional mappings,
 * and brand-specific accent definitions.
 */

export const primitiveColors = {
  // Brand Orange Scale
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c', // Primary CIC Brand Accent
    700: '#c2410c', // Brand Hover / Dark Accent
    800: '#9a3412', // Brand Deep
    900: '#7c2d12',
    950: '#431407',
  },

  // Slate Neutrals (Corporate Light / Technical Dark)
  slate: {
    50: '#f8fafc',  // Off-white canvas / card light
    100: '#f1f5f9', // Light border / subtle surface
    200: '#e2e8f0', // Standard light border
    300: '#cbd5e1', // Hover border / muted divider
    400: '#94a3b8', // Muted text / placeholder
    500: '#64748b', // Secondary body text
    600: '#475569', // Main body text
    700: '#334155', // Dark label / subtle heading
    800: '#1e293b', // Sub-heading dark
    900: '#0f172a', // Primary dark text & dark surface
    950: '#020617', // Hero dark canvas
  },

  // Deep Corporate Navy
  navy: {
    main: '#0b1b36',  // Deep CIC Navy (used in buttons & footers)
    dark: '#060f20',
    light: '#152a4d',
  },

  // Secondary Accents
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },

  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a', // Success & status online
    700: '#15803d',
  },

  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626', // Alert & hot tags
    700: '#b91c1c',
  },

  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // Transparent / Alpha Overlays
  alpha: {
    white5: 'rgba(255, 255, 255, 0.05)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white40: 'rgba(255, 255, 255, 0.4)',
    white60: 'rgba(255, 255, 255, 0.6)',
    white80: 'rgba(255, 255, 255, 0.8)',
    slate950_20: 'rgba(2, 6, 23, 0.2)',
    slate950_40: 'rgba(2, 6, 23, 0.4)',
    slate950_80: 'rgba(2, 6, 23, 0.8)',
    orange10: 'rgba(234, 88, 12, 0.1)',
    orange20: 'rgba(234, 88, 12, 0.2)',
    orange30: 'rgba(234, 88, 12, 0.3)',
  },
} as const;

export const semanticColors = {
  // Brand Role Definitions
  brand: {
    primary: primitiveColors.orange[600],
    hover: primitiveColors.orange[700],
    active: primitiveColors.orange[800],
    light: primitiveColors.orange[50],
    border: primitiveColors.orange[300],
    navy: primitiveColors.navy.main,
  },

  // Surface & Background Layers
  surface: {
    page: '#ffffff',
    pageAlt: primitiveColors.slate[50],
    card: primitiveColors.slate[50],
    cardHover: '#ffffff',
    cardDark: primitiveColors.slate[900],
    modal: '#ffffff',
    overlay: primitiveColors.alpha.slate950_80,
    subtle: primitiveColors.slate[100],
    accent: primitiveColors.orange[50],
    darkCanvas: primitiveColors.slate[950],
  },

  // Typography Colors
  text: {
    primary: primitiveColors.slate[900],
    secondary: primitiveColors.slate[600],
    muted: primitiveColors.slate[500],
    subtle: primitiveColors.slate[400],
    inverse: '#ffffff',
    inverseMuted: 'rgba(255, 255, 255, 0.7)',
    brand: primitiveColors.orange[600],
    brandHover: primitiveColors.orange[700],
  },

  // Border & Divider States
  border: {
    default: primitiveColors.slate[200],
    subtle: primitiveColors.slate[100],
    emphasis: primitiveColors.slate[300],
    brand: primitiveColors.orange[600],
    brandSubtle: 'rgba(234, 88, 12, 0.2)',
    dark: primitiveColors.slate[800],
    darkSubtle: 'rgba(255, 255, 255, 0.1)',
  },

  // Feedback & Interactive States
  feedback: {
    success: primitiveColors.green[600],
    successBg: primitiveColors.green[50],
    warning: primitiveColors.amber[600],
    warningBg: primitiveColors.amber[50],
    error: primitiveColors.red[600],
    errorBg: primitiveColors.red[50],
    info: primitiveColors.blue[600],
    infoBg: primitiveColors.blue[50],
  },
} as const;

export type PrimitiveColorKey = keyof typeof primitiveColors;
export type SemanticColorKey = keyof typeof semanticColors;
