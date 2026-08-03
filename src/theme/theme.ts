import { createTheme, type ThemeOptions, type PaletteMode } from '@mui/material/styles';

/**
 * Design tokens — "Signal" system.
 * Primary: Signal Blue (#3B5BFD) — the connective thread between builder & analyzer.
 * Secondary: Teal Mint (#14B8A6) — used for scores / success states.
 * Accent: Amber (#F59E0B) — warnings & highlights.
 * Display font: Sora (geometric, techy) — Body: Inter — Data/mono: JetBrains Mono.
 */

export const tokens = {
  signalBlue: '#3B5BFD',
  signalBlueDark: '#2544D9',
  teal: '#14B8A6',
  amber: '#F59E0B',
  crimson: '#EF4444',
  ink: '#0B1120',
  inkElevated: '#131B2E',
  paper: '#F7F8FB',
  paperElevated: '#FFFFFF',
  slate: '#64748B',
};

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: tokens.signalBlue,
      dark: tokens.signalBlueDark,
      light: '#6E85FF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tokens.teal,
      contrastText: '#FFFFFF',
    },
    warning: { main: tokens.amber },
    error: { main: tokens.crimson },
    success: { main: tokens.teal },
    background: {
      default: mode === 'light' ? tokens.paper : tokens.ink,
      paper: mode === 'light' ? tokens.paperElevated : tokens.inkElevated,
    },
    text: {
      primary: mode === 'light' ? '#0F172A' : '#E7EAF3',
      secondary: mode === 'light' ? '#475569' : '#9AA5C0',
    },
    divider: mode === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(231, 234, 243, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Sora", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Sora", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Sora", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    button: { fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none' },
    overline: { fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 18, paddingBlock: 9 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: mode === 'light' ? '1px solid rgba(15,23,42,0.06)' : '1px solid rgba(231,234,243,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
  },
});

export const buildTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
