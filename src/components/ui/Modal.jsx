import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { css, cx } from '@/lib/css';
import { colors, shadows } from '@/lib/tokens';

const BACKDROP = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};
const PANEL = {
  hidden:  { opacity: 0, scale: 0.93, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 24 } },
  exit:    { opacity: 0, scale: 0.95, y: 8,
    transition: { duration: 0.18 } },
};

const backdropCss = css({
  position: 'fixed',
  inset: '0',
  zIndex: '200',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: '16px',
});

const panelCss = css({
  width: '100%',
  maxWidth: '24rem',
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderStrong}`,
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: shadows.card,
});

const bodyPadCss = css({ padding: '28px' });

const iconWrapBaseCss = css({
  width: '48px',
  height: '48px',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
});

const modalTitleCss = css({
  color: colors.textPrimary,
  fontWeight: '900',
  fontSize: '18px',
  marginBottom: '8px',
});

const modalDescCss = css({
  color: colors.textMuted,
  fontSize: '14px',
  lineHeight: '1.625',
  marginBottom: '28px',
});

const btnRowCss = css({ display: 'flex', gap: '12px' });

const cancelBtnCss = css({
  flex: '1 1 0%',
  paddingBlock: '12px',
  borderRadius: '0.75rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: colors.textSecondary,
  fontWeight: '700',
  fontSize: '14px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  _hover: { color: colors.textPrimary, backgroundColor: 'rgba(255,255,255,0.1)' },
});

const fullBtnBaseCss = css({
  width: '100%',
  paddingBlock: '12px',
  borderRadius: '0.75rem',
  color: colors.textPrimary,
  fontWeight: '900',
  fontSize: '14px',
  border: 'none',
  cursor: 'pointer',
  transition: 'colors 0.2s',
});

// ─── Overlay ──────────────────────────────────────────────────
function Overlay({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={backdropCss}
          variants={BACKDROP} initial="hidden" animate="visible" exit="hidden"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            variants={PANEL} initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={panelCss}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────
const dangerBtnCss = css({
  flex: '1 1 0%',
  paddingBlock: '12px',
  borderRadius: '0.75rem',
  backgroundColor: colors.danger,
  color: colors.textPrimary,
  fontWeight: '900',
  fontSize: '14px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  boxShadow: shadows.danger,
  _hover: { backgroundColor: colors.dangerHover },
});

export function ConfirmModal({
  open, onClose, onConfirm,
  title = '정말 삭제하시겠습니까?',
  description = '이 작업은 되돌릴 수 없습니다.',
  confirmLabel = '삭제',
  cancelLabel = '취소',
}) {
  return (
    <Overlay open={open} onClose={onClose}>
      <div className={bodyPadCss}>
        <div className={cx(iconWrapBaseCss, css({ backgroundColor: colors.dangerBg }))}>
          <Trash2 size={22} color={colors.dangerMuted} />
        </div>
        <h3 className={modalTitleCss}>{title}</h3>
        <p className={modalDescCss}>{description}</p>
        <div className={btnRowCss}>
          <button onClick={onClose} className={cancelBtnCss}>{cancelLabel}</button>
          <motion.button
            onClick={() => { onConfirm(); onClose(); }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className={dangerBtnCss}
          >
            {confirmLabel}
          </motion.button>
        </div>
      </div>
    </Overlay>
  );
}

// ─── AlertModal ───────────────────────────────────────────────
const ALERT_CFG = {
  error: {
    icon: AlertCircle,
    iconColor: colors.dangerMuted,
    bgColor:   colors.dangerBg,
    btnCss: css({ backgroundColor: colors.danger,   boxShadow: shadows.danger,   _hover: { backgroundColor: colors.dangerHover  } }),
  },
  success: {
    icon: CheckCircle,
    iconColor: colors.successMuted,
    bgColor:   colors.successBg,
    btnCss: css({ backgroundColor: colors.success,  boxShadow: shadows.success,  _hover: { backgroundColor: colors.successHover } }),
  },
  info: {
    icon: Info,
    iconColor: colors.brand,
    bgColor:   'rgba(245,158,11,0.1)',
    btnCss: css({ backgroundColor: colors.brand,    boxShadow: shadows.amberSm,  _hover: { backgroundColor: colors.brandHover   } }),
  },
};

export function AlertModal({ open, onClose, title, description, type = 'error', confirmLabel = '확인' }) {
  const cfg = ALERT_CFG[type] ?? ALERT_CFG.error;
  const Icon = cfg.icon;
  return (
    <Overlay open={open} onClose={onClose}>
      <div className={bodyPadCss}>
        <div className={cx(iconWrapBaseCss, css({ backgroundColor: cfg.bgColor }))}>
          <Icon size={22} color={cfg.iconColor} />
        </div>
        <h3 className={modalTitleCss}>{title}</h3>
        {description && <p className={modalDescCss}>{description}</p>}
        {!description && <div style={{ marginBottom: '16px' }} />}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className={cx(fullBtnBaseCss, cfg.btnCss)}
        >
          {confirmLabel}
        </motion.button>
      </div>
    </Overlay>
  );
}

// ─── Hooks ────────────────────────────────────────────────────
export function useConfirm() {
  const [state, setState] = useState({ open: false, onConfirm: null, title: '', description: '' });
  const openConfirm = useCallback(({ onConfirm, title, description }) => {
    setState({ open: true, onConfirm, title, description });
  }, []);
  const closeConfirm = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const confirmProps = {
    open: state.open,
    onClose: closeConfirm,
    onConfirm: state.onConfirm ?? (() => {}),
    title: state.title,
    description: state.description,
  };
  return { confirmProps, openConfirm };
}

export function useAlert() {
  const [state, setState] = useState({ open: false, title: '', description: '', type: 'error' });
  const openAlert = useCallback(({ title, description, type = 'error' }) => {
    setState({ open: true, title, description, type });
  }, []);
  const closeAlert = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const alertProps = {
    open: state.open,
    onClose: closeAlert,
    title: state.title,
    description: state.description,
    type: state.type,
  };
  return { alertProps, openAlert };
}
