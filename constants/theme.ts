// FocusFit Color Palette - Designed for ADHD-friendly UI
export const Colors = {
  // Primary - Deep Navy
  primary: '#1a2d3d',
  primaryDark: '#0f1a24',

  // Secondary - Soft Mint/Calm Teal
  secondary: '#a8e6cf',
  secondaryLight: '#d4f5e9',
  secondaryDark: '#6ec4a7',

  // Background - Off-White/Cream
  background: '#f5f5f0',
  surface: '#ffffff',
  surfaceSecondary: '#e8e8e0',

  // Accents - Vibrant Coral/Golden Yellow for "Dopamine Hits"
  accent: '#ff6b6b',
  accentSecondary: '#ffd93d',
  accentTertiary: '#ff8e72',

  // Text
  text: '#1a2d3d',
  textSecondary: '#6b7c8c',
  textLight: '#9eaab5',
  textInverse: '#ffffff',

  // Status
  success: '#6ec4a7',
  warning: '#ffd93d',
  error: '#ff6b6b',

  // Neutral
  gray100: '#f5f5f0',
  gray200: '#e8e8e0',
  gray300: '#d1d1c7',
  gray400: '#9eaab5',
  gray500: '#6b7c8c',
  gray600: '#4a5c6c',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

export const Typography = {
  hero: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  button: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
