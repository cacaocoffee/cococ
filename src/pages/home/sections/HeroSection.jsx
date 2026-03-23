import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { css } from "@/lib/css";
import { colors, shadows } from "@/lib/tokens";

const heroSectionCss = css({
  position: "relative",
  minHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  paddingInline: "24px",
  overflow: "hidden",
});

const heroBgCss = css({ position: "absolute", inset: "0" });

const heroImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.4",
});

const heroGradCss = css({
  position: "absolute",
  inset: "0",
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65), #0a0a0a)",
});

const heroContentCss = css({
  position: "relative",
  zIndex: "10",
  maxWidth: "56rem",
});

const heroEyebrowCss = css({
  color: colors.brand,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "4px",
  textTransform: "uppercase",
  marginBottom: "24px",
});

const heroTitleCss = css({
  fontSize: "clamp(52px,10vw,96px)",
  fontWeight: "900",
  color: colors.textPrimary,
  lineHeight: "1.02",
  marginBottom: "24px",
});

const heroAccentCss = css({ color: colors.brand });

const heroSubCss = css({
  fontSize: "18px",
  color: colors.textSecondary,
  marginBottom: "40px",
  fontWeight: "300",
  lineHeight: "1.625",
  maxWidth: "36rem",
  marginInline: "auto",
});

const heroCTACss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  backgroundColor: colors.brand,
  color: colors.bgPage,
  paddingInline: "40px",
  paddingBlock: "20px",
  borderRadius: "9999px",
  fontWeight: "900",
  fontSize: "16px",
  textDecoration: "none",
  transition: "background-color 0.2s",
  boxShadow: shadows.amber,
  _hover: { backgroundColor: colors.brandHover },
});

const scrollHintCss = css({
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
});

const scrollLineCss = css({
  width: "1px",
  height: "40px",
  background: `linear-gradient(to bottom, rgba(245,158,11,0.6), transparent)`,
});

export default function HeroSection() {
  return (
    <section className={heroSectionCss}>
      <div className={heroBgCss}>
        <img
          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1600"
          alt="Hero"
          className={heroImgCss}
        />
        <div className={heroGradCss} />
      </div>
      <div className={heroContentCss}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={heroEyebrowCss}
        >
          Creations Over Cocktail &amp; Offbeat Culture
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: 0.25,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className={heroTitleCss}
        >
          아는 만큼
          <br />
          <span className={heroAccentCss}>맛있으니까.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className={heroSubCss}
        >
          경험을 지식을, 지식은 미식을.
          <br />
          코콕은 2030세대의 취향 있는 주류 생활을 함께 만들어갑니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block" }}
          >
            <Link to="/apply" className={heroCTACss}>
              코콕 합류하기 <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={scrollHintCss}
      >
        <div className={`${scrollLineCss} animate-pulse`} />
      </motion.div>
    </section>
  );
}
