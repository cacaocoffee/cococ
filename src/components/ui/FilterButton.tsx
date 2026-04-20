import { motion } from 'framer-motion';
import { css } from '@/lib/css';

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const baseBtnCss = css({
  paddingInline: '20px',
  paddingBlock: '8px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '700',
  transition: 'all 0.2s',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
});

const activeCss = css({
  backgroundColor: '#f59e0b',
  color: '#000',
});

const inactiveCss = css({
  backgroundColor: '#1a1a1a',
  color: '#9ca3af',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  _hover: {
    color: '#ffffff',
  },
});

export default function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`${baseBtnCss} ${active ? activeCss : inactiveCss}`}
    >
      {label}
    </motion.button>
  );
}
