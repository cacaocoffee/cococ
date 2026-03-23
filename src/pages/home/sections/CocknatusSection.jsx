import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { css } from "../../../lib/css";
import { colors } from "../../../lib/tokens";

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const bannerSectionCss = css({
  marginInline: "24px",
  marginBottom: "96px",
  borderRadius: "1.5rem",
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderSubtle}`,
  paddingInline: "40px",
  paddingBlock: "56px",
  textAlign: "center",
  maxWidth: "80rem",
  position: "relative",
  overflow: "hidden",
  "@md": { marginInline: "48px" },
  "@xl": { marginInline: "auto" },
});

const bannerBgCss = css({
  position: "absolute",
  inset: "0",
  background:
    "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(245,158,11,0.08), transparent)",
});

const bannerEyebrowCss = css({
  color: colors.brand,
  fontSize: "11px",
  fontWeight: "900",
  letterSpacing: "4px",
  textTransform: "uppercase",
  marginBottom: "16px",
  position: "relative",
  zIndex: "10",
});

const bannerTitleCss = css({
  fontSize: "30px",
  fontWeight: "900",
  color: colors.textPrimary,
  lineHeight: "1.25",
  marginBottom: "24px",
  position: "relative",
  zIndex: "10",
  "@md": { fontSize: "48px" },
});

const bannerAccentCss = css({ color: colors.brand });

const bannerDescCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.625",
  maxWidth: "36rem",
  marginInline: "auto",
  position: "relative",
  zIndex: "10",
});

export default function CocknatusSection() {
  return (
    <FadeUp>
      <section className={bannerSectionCss}>
        <div className={bannerBgCss} />
        <p className={bannerEyebrowCss}>콕나투스 — Cocknatus</p>
        <h2 className={bannerTitleCss}>
          "즐겁게 임하는 것"
          <br />
          <span className={bannerAccentCss}>COCOC의 가장 핵심적인 가치.</span>
        </h2>
        <p className={bannerDescCss}>
          스피노자의 코나투스에서 비롯된 코콕의 철학.
          <br />
          지식과 미식, 실무 경험, 사람과 소속감 — 모든 것은 결국 즐거움이 바탕이
          되어야 합니다.
        </p>
      </section>
    </FadeUp>
  );
}
