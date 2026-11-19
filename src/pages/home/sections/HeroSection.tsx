import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { css } from "@/lib/css";
import { colors, shadows, fonts } from "@/lib/tokens";
import CococLogo from "@/components/ui/CococLogo";

const heroSectionCss = css({
  position: "relative",
  minHeight: "92vh",
  display: "grid",
  gridTemplateColumns: "1fr",
  alignItems: "center",
  paddingInline: "24px",
  paddingTop: "40px",
  paddingBottom: "80px",
  backgroundColor: colors.bgPage,
  overflow: "hidden",
  "@md": { paddingInline: "64px", gridTemplateColumns: "1.05fr 0.95fr", gap: "56px" },
  "@lg": { paddingInline: "88px", gap: "88px" },
});

const heroInnerCss = css({
  maxWidth: "780px",
  marginInline: "auto",
  width: "100%",
  position: "relative",
  zIndex: "10",
  "@md": { marginInline: "0" },
});

const heroEyebrowRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "32px",
});

const heroEyebrowLineCss = css({
  width: "48px",
  height: "1px",
  backgroundColor: colors.brand,
});

const heroEyebrowCss = css({
  color: colors.brand,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  fontFamily: fonts.mono,
});

const heroTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(56px, 8.6vw, 112px)",
  fontWeight: "500",
  color: colors.textPrimary,
  lineHeight: "0.96",
  letterSpacing: "-0.018em",
  marginBottom: "32px",
  textWrap: "balance",
} as Parameters<typeof css>[0]);

const heroAccentCss = css({
  color: colors.brand,
  fontStyle: "italic",
});

const heroSubCss = css({
  fontSize: "18px",
  color: colors.textMuted,
  marginBottom: "44px",
  fontWeight: "400",
  lineHeight: "1.65",
  maxWidth: "32rem",
});

const heroActionRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
});

const heroCTACss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  backgroundColor: colors.textPrimary,
  color: colors.bgPage,
  paddingInline: "32px",
  paddingBlock: "18px",
  borderRadius: "9999px",
  fontWeight: "600",
  fontSize: "15px",
  letterSpacing: "0.01em",
  textDecoration: "none",
  transition: "background-color 0.2s, transform 0.2s",
  boxShadow: shadows.card,
  _hover: { backgroundColor: colors.brand },
});

const heroSecondaryCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: colors.textPrimary,
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  paddingBlock: "8px",
  borderBottom: `1px solid ${colors.textPrimary}`,
  transition: "color 0.2s, border-color 0.2s",
  _hover: { color: colors.brand, borderColor: colors.brand },
});

const heroVisualCss = css({
  position: "relative",
  width: "100%",
  height: "62vh",
  minHeight: "440px",
  marginTop: "48px",
  borderRadius: "2px",
  overflow: "hidden",
  "@md": { marginTop: "0", height: "78vh" },
});

const heroImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "saturate(1.05) contrast(0.98)",
});

const heroCaptionCss = css({
  position: "absolute",
  bottom: "20px",
  right: "20px",
  fontSize: "10px",
  fontFamily: fonts.mono,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(251,246,236,0.85)",
  textShadow: "0 1px 2px rgba(0,0,0,0.35)",
});

const heroFolioCss = css({
  position: "absolute",
  top: "32px",
  right: "32px",
  fontSize: "10px",
  fontFamily: fonts.mono,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: colors.textFaint,
  zIndex: "10",
  display: "none",
  "@md": { display: "block" },
});

const heroLogoRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "28px",
});

const heroLogoLabelCss = css({
  fontFamily: fonts.mono,
  fontSize: "10px",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.textMuted,
});

export default function HeroSection() {
  return (
    <section className={heroSectionCss}>
      <div className={heroFolioCss}>Vol. 01 — 2026</div>

      <div className={heroInnerCss}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={heroLogoRowCss}
        >
          <CococLogo size={56} color={colors.textPrimary} />
          <span className={heroLogoLabelCss}>Cocktail Journal — Seoul</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className={heroEyebrowRowCss}
        >
          <span className={heroEyebrowLineCss} />
          <span className={heroEyebrowCss}>Creations Over Cocktail · Offbeat Culture</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          className={heroTitleCss}
        >
          아는 만큼,<br />
          <span className={heroAccentCss}>맛있으니까.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className={heroSubCss}
        >
          코콕은 2030세대의 취향 있는 주류 생활을 기록하는 칵테일 저널입니다.
          경험을 지식으로, 지식은 미식으로 — 한 잔 한 잔 천천히 쌓아갑니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className={heroActionRowCss}
        >
          <Link to="/apply" className={heroCTACss}>
            코콕 합류하기 <ArrowRight size={18} />
          </Link>
          <Link to="/magazine" className={heroSecondaryCss}>
            이번 호 매거진 읽기
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className={heroVisualCss}
      >
        <img
          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1600"
          alt="A backlit cocktail glass on a softly-lit bar counter"
          className={heroImgCss}
        />
        <div className={heroCaptionCss}>Photograph — Negroni, Itaewon</div>
      </motion.div>
    </section>
  );
}
