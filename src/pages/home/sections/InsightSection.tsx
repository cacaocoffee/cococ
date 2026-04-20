import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useMagazineList } from "@/domain/magazine/magazine-query-options";
import SectionTitle from "@/components/ui/SectionTitle";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
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

const insightSectionCss = css({
  paddingBlock: "96px",
  backgroundColor: colors.bgPage,
  borderTop: `1px solid ${colors.borderFaint}`,
});

const insightInnerCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  paddingInline: "24px",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "64px",
  alignItems: "center",
  "@md": { paddingInline: "48px", gridTemplateColumns: "repeat(2,1fr)" },
});

const insightImgWrapCss = css({
  position: "relative",
  borderRadius: "1.5rem",
  overflow: "hidden",
  aspectRatio: "16/9",
});

const insightImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const insightPlaceholderCss = css({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.bgSection,
  fontSize: "48px",
});

const insightGradCss = css({
  position: "absolute",
  inset: "0",
  background: "linear-gradient(to top, #000000, transparent)",
});

const insightBottomCss = css({
  position: "absolute",
  bottom: "32px",
  left: "32px",
  right: "32px",
});

const insightBadgeCss = css({
  backgroundColor: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(12px)",
  color: colors.textPrimary,
  fontSize: "10px",
  fontWeight: "700",
  paddingInline: "12px",
  paddingBlock: "4px",
  borderRadius: "9999px",
  marginBottom: "12px",
  display: "inline-block",
  textTransform: "uppercase",
});

const insightTitleCss = css({
  fontSize: "24px",
  fontWeight: "900",
  color: colors.textPrimary,
  lineHeight: "1.375",
});

const insightDescCss = css({
  color: colors.textMuted,
  marginBottom: "32px",
  lineHeight: "1.625",
  fontSize: "14px",
});

const insightBtnCss = css({
  display: "inline-block",
  paddingInline: "32px",
  paddingBlock: "12px",
  border: `1.5px solid ${colors.brand}`,
  color: colors.brand,
  fontWeight: "700",
  borderRadius: "9999px",
  textDecoration: "none",
  transition: "all 0.2s",
  fontSize: "14px",
  _hover: { backgroundColor: colors.brand, color: colors.bgPage },
});

export default function InsightSection() {
  const { data: items = [] } = useMagazineList();
  const latest = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!latest) return null;

  return (
    <section className={insightSectionCss}>
      <div className={insightInnerCss}>
        <FadeUp>
          <Link to="/magazine/$id" params={{ id: String(latest.id) }} style={{ display: 'block', textDecoration: 'none' }}>
            <div className={insightImgWrapCss}>
              {latest.img ? (
                <img src={latest.img} alt={latest.title} className={insightImgCss} />
              ) : (
                <div className={insightPlaceholderCss}>📰</div>
              )}
              <div className={insightGradCss} />
              <div className={insightBottomCss}>
                <span className={insightBadgeCss}>New Magazine</span>
                <h4 className={insightTitleCss}>{latest.title}</h4>
              </div>
            </div>
          </Link>
        </FadeUp>
        <FadeUp delay={0.15}>
          <SectionTitle
            title="COCOC Insight"
            subtitle="주류 전문가들과 운영진이 전하는 깊이 있는 지식"
          />
          <p className={insightDescCss}>
            단순한 음주 모임이 아닙니다. 코콕은 미식의 가치를 전파합니다.
            위스키부터 칵테일, 전통주까지 — 코콕만의 인사이트를 통해 더 맛있게
            마실 수 있습니다.
          </p>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block" }}
          >
            <Link to="/magazine" className={insightBtnCss}>
              매거진 읽기
            </Link>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}
