import { css } from '../../lib/css';
import { colors } from '../../lib/tokens';

const wrapperCss = css({ marginBottom: '40px' });

const titleCss = css({
  fontSize: '30px',
  fontWeight: '900',
  color: colors.textPrimary,
  marginBottom: '8px',
});

const accentCss = css({
  width: '48px',
  height: '3px',
  backgroundColor: colors.brand,
  marginBottom: '16px',
});

const subtitleCss = css({
  color: colors.textMuted,
  fontSize: '14px',
});

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className={wrapperCss}>
      <h3 className={titleCss}>{title}</h3>
      <div className={accentCss} />
      {subtitle && <p className={subtitleCss}>{subtitle}</p>}
    </div>
  );
}
