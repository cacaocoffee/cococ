import { motion } from 'framer-motion';
import { css } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const baseBtnCss = css({
  paddingInline: '16px',
  paddingBlock: '8px',
  borderRadius: '9999px',
  fontFamily: fonts.mono,
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  transition: 'all 0.2s',
  cursor: 'pointer',
  border: '1px solid transparent',
  outline: 'none',
});

const activeCss = css({
  backgroundColor: colors.textPrimary,
  color: colors.bgPage,
  borderColor: colors.textPrimary,
});

const inactiveCss = css({
  backgroundColor: 'transparent',
  color: colors.textMuted,
  borderColor: colors.borderMedium,
  _hover: {
    color: colors.textPrimary,
    borderColor: colors.borderStrong,
  },
});

export default function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`${baseBtnCss} ${active ? activeCss : inactiveCss}`}
    >
      {label}
    </motion.button>
  );
}
