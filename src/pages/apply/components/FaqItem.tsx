import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";

const faqItemBaseCss = css({
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "20px",
  cursor: "pointer",
  transition: "border-color 0.2s",
});

const faqItemActiveCss = css({ borderColor: "rgba(245,158,11,0.3)" });
const faqHeaderRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
});
const faqQuestionCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
  fontSize: "14px",
});
const faqAnswerCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.625",
  overflow: "hidden",
});

export default function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      onClick={() => setOpen((o) => !o)}
      whileHover={{ borderColor: "rgba(245,158,11,0.25)" }}
      className={cx(faqItemBaseCss, open ? faqItemActiveCss : "")}
    >
      <div className={faqHeaderRowCss}>
        <h5 className={faqQuestionCss}>{q}</h5>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown
            size={18}
            color={open ? colors.brand : colors.textFaint}
          />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className={faqAnswerCss}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
