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
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0",
  color: colors.textMuted,
});

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: 'clamp(32px, 3.6vw, 48px)',
  fontWeight: "700",
  color: colors.textPrimary,
  lineHeight: '1.1',
  letterSpacing: '-0.03em',
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
      {kicker && <span className={kickerCss}>{kicker}</span>}
      <h3 className={titleCss}>{title}</h3>
      {subtitle && <p className={subtitleCss}>{subtitle}</p>}
    </div>
  );
}
