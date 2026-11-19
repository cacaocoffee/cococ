import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";
import type { ArchiveItem } from "@/domain/archive/archive-dto";

const heroSectionCss = css({
  position: "relative",
  height: "62vh",
  minHeight: "440px",
  overflow: "hidden",
});

const heroImgCss = css({ width: "100%", height: "100%", objectFit: "cover" });

const heroOverlayCss = css({
  position: "absolute",
  inset: "0",
  background: "linear-gradient(to top, rgba(33,27,18,0.78) 0%, rgba(33,27,18,0.32) 50%, rgba(33,27,18,0.18) 100%)",
});

const heroBackBtnCss = css({
  position: "absolute",
  top: "104px",
  left: "24px",
  color: colors.bgPage,
  "@md": { left: "48px" },
});

const heroCategoryCss = css({
  display: "inline-block",
  backgroundColor: "transparent",
  color: colors.bgPage,
  border: "1px solid rgba(251,246,236,0.55)",
  fontFamily: fonts.mono,
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.22em",
  paddingInline: "12px",
  paddingBlock: "4px",
  borderRadius: "9999px",
  textTransform: "uppercase",
  marginBottom: "20px",
});

const heroTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(36px, 6vw, 72px)",
  fontWeight: "500",
  color: colors.bgPage,
  lineHeight: "1.04",
  letterSpacing: "-0.014em",
  maxWidth: "48rem",
});

const heroBottomCss = css({
  position: "absolute",
  bottom: "48px",
  left: "24px",
  right: "24px",
  "@md": { left: "48px", right: "48px" },
});

interface HeroSectionProps {
  item: ArchiveItem;
}

export default function HeroSection({ item }: HeroSectionProps) {
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
        <BackButton label="Archive" tone="onDark" />
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
