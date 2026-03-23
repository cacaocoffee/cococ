import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { css } from '../../lib/css';
import { colors } from '../../lib/tokens';

const btnCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: colors.brand,
  fontWeight: '700',
  fontSize: '14px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  _hover: { textDecoration: 'underline' },
});

export default function BackButton({ label = '뒤로가기' }) {
  const router = useRouter();
  return (
    <motion.button
      onClick={() => router.history.back()}
      whileHover={{ x: -4 }}
      className={btnCss}
    >
      <ArrowLeft size={16} /> {label}
    </motion.button>
  );
}
