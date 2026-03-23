import { motion } from "framer-motion";
import BackButton from "../../../../components/ui/BackButton";
import { css } from "../../../../lib/css";
import { colors } from "../../../../lib/tokens";

const heroSectionCss = css({
  position: "relative",
  height: "55vh",
  overflow: "hidden",
});

const heroImgCss = css({ width: "100%", height: "100%", objectFit: "cover" });

const heroOverlayCss = css({
  position: "absolute",
  inset: "0",
  background: "linear-gradient(to top, #0a0a0a, rgba(0,0,0,0.4), transparent)",
});

const heroBackBtnCss = css({
  position: "absolute",
  top: "24px",
  left: "24px",
  "@md": { left: "48px" },
});

const heroCategoryCss = css({
  display: "inline-block",
  backgroundColor: colors.brand,
  color: colors.bgPage,
  fontSize: "10px",
  fontWeight: "900",
  paddingInline: "12px",
  paddingBlock: "4px",
  borderRadius: "9999px",
  textTransform: "uppercase",
  marginBottom: "16px",
});

const heroTitleCss = css({
  fontSize: "36px",
  fontWeight: "900",
  color: colors.textPrimary,
  lineHeight: "1.25",
  maxWidth: "48rem",
  "@md": { fontSize: "60px" },
});

const heroBottomCss = css({
  position: "absolute",
  bottom: "40px",
  left: "24px",
  right: "24px",
  "@md": { left: "48px", right: "48px" },
});

export default function HeroSection({ item }) {
  return (
    <div className={heroSectionCss}>
      <motion.img
        src={item.img}
        alt={item.title}
        className={heroImgCss}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <div className={heroOverlayCss} />
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={heroBackBtnCss}
      >
        <BackButton label="Archive" />
      </motion.div>
      <div className={heroBottomCss}>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={heroCategoryCss}
        >
          {item.category}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className={heroTitleCss}
        >
          {item.title}
        </motion.h1>
      </div>
    </div>
  );
}
