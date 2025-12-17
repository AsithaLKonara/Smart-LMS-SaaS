export const DESIGN_TOKENS = {
  colors: {
    backgroundPrimary: '#0B0F1A',
    backgroundSecondary: '#111827',
    backgroundCard: 'rgba(255, 255, 255, 0.03)',
    accentCyan: '#22D3EE',
    accentPurple: '#A855F7',
    textPrimary: '#EDEDED',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
  },
  radii: {
    card: '1rem',
    button: '0.5rem',
  },
  shadows: {
    card3d: '0 10px 30px rgba(0, 0, 0, 0.4)',
    cardHover: '0 15px 40px rgba(0, 0, 0, 0.5)',
  },
} as const;

export type ThemeName = 'dark' | 'light';


