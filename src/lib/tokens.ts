// ─── COCOC Design System — Warm & Soft / Editorial Tokens ──────
// Palette: cream paper + warm ink + a single rust accent.
// Token names are kept stable so existing call-sites cascade.

export const colors = {
  // Brand / accent (rust)
  brand:         '#C2603F',
  brandHover:    '#A94E30',

  // Surfaces (warm cream paper)
  bgPage:        '#F6EFE2', // primary page bg — warm cream
  bgCard:        '#FBF6EC', // card surface — slightly lighter than page
  bgSection:     '#F1E7D5', // section break — slightly deeper cream
  bgFooter:      '#EFE3CE', // footer — softest deeper cream
  bgBand:        '#EBDFC8', // marquee band — warm tan

  // Text (warm ink scale, dark-on-cream)
  textPrimary:   '#211B12', // near-black ink
  textSecondary: '#3D3325', // ink
  textMuted:     '#6B5C46', // muted ink
  textFaint:     '#897962', // softer ink
  textDimmer:    '#A8987F', // hairline label
  textDimmest:   '#C2B498', // barely-there

  // Borders (warm beige hairlines)
  borderFaint:   'rgba(60,40,15,0.06)',
  borderSubtle:  'rgba(60,40,15,0.08)',
  borderLight:   'rgba(60,40,15,0.10)',
  borderMedium:  'rgba(60,40,15,0.14)',
  borderStrong:  'rgba(60,40,15,0.18)',
  borderInput:   'rgba(60,40,15,0.16)',

  // Semantic
  danger:        '#B5392A',
  dangerHover:   '#CC4737',
  dangerMuted:   '#CC6B5C',
  dangerBg:      'rgba(181,57,42,0.10)',
  dangerShadow:  'rgba(181,57,42,0.18)',

  success:       '#5A7A4A',
  successHover:  '#6F9059',
  successMuted:  '#7A9966',
  successBg:     'rgba(90,122,74,0.10)',
  successShadow: 'rgba(90,122,74,0.18)',

  warning:       '#C68B2C',
  warningBg:     'rgba(198,139,44,0.10)',
};

export const shadows = {
  // Warm-tinted shadows (no flat black)
  amber:   '0 18px 36px -18px rgba(120,60,20,0.30), 0 2px 6px -2px rgba(120,60,20,0.10)',
  amberSm: '0 10px 22px -12px rgba(120,60,20,0.30)',
  amberMd: '0 14px 28px -14px rgba(120,60,20,0.30)',
  danger:  '0 14px 28px -14px rgba(181,57,42,0.30)',
  success: '0 14px 28px -14px rgba(90,122,74,0.30)',
  card:    '0 28px 60px -32px rgba(80,50,15,0.20), 0 2px 4px -2px rgba(80,50,15,0.08)',
};

export const fonts = {
  display: "'Newsreader', 'Iowan Old Style', 'Charter', Georgia, 'Times New Roman', serif",
  body:    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Söhne', 'Segoe UI', system-ui, sans-serif",
  mono:    "ui-monospace, 'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace",
};

export const radii = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '22px',
  pill: '9999px',
};
