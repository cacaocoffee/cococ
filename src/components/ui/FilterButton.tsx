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
  fontSize: "14px",
  fontWeight: '700',
  transition: 'all 0.2s',
  cursor: 'pointer',
  border: '1px solid transparent',
  outline: 'none',
});

const activeCss = css({
  backgroundColor: colors.textPrimary,
  color: colors.onInk,
  borderColor: colors.textPrimary,
});

const inactiveCss = css({
  backgroundColor: colors.bgCard,
  color: colors.textMuted,
  _hover: {
    color: colors.textPrimary,
    backgroundColor: colors.bgPressed,
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
