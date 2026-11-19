import { css } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  kicker?: string;
}

const wrapperCss = css({
  marginBottom: '48px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

const kickerCss = css({
  fontFamily: fonts.mono,
  fontSize: '11px',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: colors.brand,
});

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: 'clamp(32px, 3.6vw, 48px)',
  fontWeight: '500',
  color: colors.textPrimary,
  lineHeight: '1.08',
  letterSpacing: '-0.014em',
  marginTop: '4px',
});

const subtitleCss = css({
  color: colors.textMuted,
  fontSize: '15px',
  lineHeight: '1.65',
  maxWidth: '38rem',
});

export default function SectionTitle({ title, subtitle, kicker }: SectionTitleProps) {
  return (
    <div className={wrapperCss}>
      {kicker && <span className={kickerCss}>§ {kicker}</span>}
      <h3 className={titleCss}>{title}</h3>
      {subtitle && <p className={subtitleCss}>{subtitle}</p>}
    </div>
  );
}
