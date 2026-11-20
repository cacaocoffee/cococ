import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";
import type { ArchiveItem } from "@/domain/archive/archive-dto";

// 큰 검정 카드 안에 사진을 두고, 제목은 사진 위가 아니라 사진 아래 검정 면에 쓴다.
// 사진의 밝기와 상관없이 글자가 읽히고, 그라데이션을 깔 필요가 없다.
const heroSectionCss = css({
  position: "relative",
  marginInline: "16px",
  marginTop: "8px",
  backgroundColor: colors.bgInk,
  borderRadius: "28px",
  padding: "10px",
  "@md": { marginInline: "32px", padding: "12px" },
});

const heroPhotoCss = css({
  position: "relative",
  height: "44vh",
  minHeight: "280px",
  borderRadius: "20px",
  overflow: "hidden",
  backgroundColor: colors.onInkLine,
  "@md": { height: "56vh", minHeight: "420px" },
});

const heroImgCss = css({ width: "100%", height: "100%", objectFit: "cover" });

const heroOverlayCss = css({ display: "none" });

// 사진 위의 뒤로 가기: 흰 알약
const heroBackBtnCss = css({
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: colors.bgCard,
  borderRadius: "9999px",
  paddingInline: "14px",
  paddingBlock: "4px",
});

const heroCategoryCss = css({
  display: "inline-block",
  backgroundColor: colors.lime,
  color: colors.textPrimary,
  fontSize: "12px",
  fontWeight: "700",
  paddingInline: "12px",
  paddingBlock: "4px",
  borderRadius: "9999px",
  marginBottom: "16px",
});

const heroTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(36px, 6vw, 72px)",
  fontWeight: "700",
  color: colors.onInk,
  lineHeight: "1.08",
  letterSpacing: "-0.035em",
  maxWidth: "48rem",
});

const heroBottomCss = css({
  padding: "24px 14px 18px",
  "@md": { padding: "36px 36px 32px" },
});

interface HeroSectionProps {
  item: ArchiveItem;
}

export default function HeroSection({ item }: HeroSectionProps) {
  return (
    <div className={heroSectionCss}>
      <div className={heroPhotoCss}>
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
      </div>
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
