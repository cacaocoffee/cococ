import { Tag } from 'lucide-react';
import { css, cx } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';

type TagBadgeVariant = 'default' | 'amber';

interface TagBadgeProps {
  label: string;
  variant?: TagBadgeVariant;
}

const baseCss = css({
  fontFamily: fonts.mono,
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  paddingInline: '10px',
  paddingBlock: '4px',
  borderRadius: '9999px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  border: `1px solid ${colors.borderMedium}`,
});

const variantCss: Record<TagBadgeVariant, string> = {
  default: css({ backgroundColor: colors.bgCard, color: colors.textMuted }),
  amber:   css({ backgroundColor: 'rgba(194,96,63,0.10)', color: colors.brand, borderColor: 'rgba(194,96,63,0.30)' }),
};

export default function TagBadge({ label, variant = 'default' }: TagBadgeProps) {
  return (
    <span className={cx(baseCss, variantCss[variant] ?? variantCss.default)}>
      <Tag size={10} /> {label}
    </span>
  );
}
