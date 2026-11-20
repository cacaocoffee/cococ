import { Tag } from 'lucide-react';
import { css, cx } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';

type TagBadgeVariant = 'default' | 'amber';

interface TagBadgeProps {
  label: string;
  variant?: TagBadgeVariant;
}

const baseCss = css({
  fontSize: "12px",
  fontWeight: '700',
  letterSpacing: "0",
  paddingInline: '10px',
  paddingBlock: '4px',
  borderRadius: '9999px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
});

const variantCss: Record<TagBadgeVariant, string> = {
  default: css({ backgroundColor: colors.bgSection, color: colors.textMuted }),
  // 강조 태그: 라임 바탕에 잉크 글자 (이름은 예전 그대로 둔다)
  amber:   css({ backgroundColor: colors.lime, color: colors.textPrimary }),
};

export default function TagBadge({ label, variant = 'default' }: TagBadgeProps) {
  return (
    <span className={cx(baseCss, variantCss[variant] ?? variantCss.default)}>
      <Tag size={10} /> {label}
    </span>
  );
}
