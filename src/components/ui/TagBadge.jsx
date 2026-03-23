import { Tag } from 'lucide-react';
import { css, cx } from '../../lib/css';
import { colors } from '../../lib/tokens';

const baseCss = css({
  fontSize: '11px',
  fontWeight: '700',
  paddingInline: '12px',
  paddingBlock: '4px',
  borderRadius: '9999px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
});

const variantCss = {
  default: css({ backgroundColor: 'rgba(255,255,255,0.06)', color: colors.textSecondary }),
  amber:   css({ backgroundColor: 'rgba(245,158,11,0.1)',   color: colors.brand }),
};

export default function TagBadge({ label, variant = 'default' }) {
  return (
    <span className={cx(baseCss, variantCss[variant] ?? variantCss.default)}>
      <Tag size={10} /> {label}
    </span>
  );
}
