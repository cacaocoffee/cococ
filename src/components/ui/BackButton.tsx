import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { css, cx } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';

type BackButtonTone = 'default' | 'onDark';

interface BackButtonProps {
  label?: string;
  tone?: BackButtonTone;
}

const btnBaseCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: "14px",
  fontWeight: '700',
  letterSpacing: "0",
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  paddingBlock: '4px',
  transition: 'color 0.2s, opacity 0.2s',
});

const toneDefaultCss = css({
  color: colors.textMuted,
  _hover: { color: colors.textPrimary },
});

const toneOnDarkCss = css({
  color: colors.onInk,
  _hover: { opacity: '0.8' },
});

export default function BackButton({ label = '뒤로가기', tone = 'default' }: BackButtonProps) {
  const router = useRouter();
  return (
    <motion.button
      onClick={() => router.history.back()}
      whileHover={{ x: -4 }}
      className={cx(btnBaseCss, tone === 'onDark' ? toneOnDarkCss : toneDefaultCss)}
    >
      <ArrowLeft size={14} /> {label}
    </motion.button>
  );
}
