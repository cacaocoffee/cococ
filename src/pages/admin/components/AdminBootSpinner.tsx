import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const wrapCss = css({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  color: colors.textMuted,
});

const spinCss = css({
  animation: "boot-spin 0.9s linear infinite",
  color: colors.brand,
});

const labelCss = css({
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "1px",
});

const styleTag = `
@keyframes boot-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

export default function AdminBootSpinner() {
  return (
    <motion.div
      className={wrapCss}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.2 }}
    >
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />
      <Loader2 size={32} className={spinCss} />
      <span className={labelCss}>관리자 인증 중…</span>
    </motion.div>
  );
}
