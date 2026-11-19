import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMagazineList } from "@/domain/magazine/magazine-query-options";
import { MAGAZINE_DATA } from "@/data";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const insightSectionCss = css({
  paddingBlock: "112px",
  backgroundColor: colors.bgSection,
  borderTop: `1px solid ${colors.borderFaint}`,
});

const insightInnerCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  paddingInline: "24px",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "48px",
  alignItems: "center",
  "@md": { paddingInline: "48px", gridTemplateColumns: "1.05fr 0.95fr", gap: "80px" },
});

const insightSideCss = css({
  display: "flex",
  flexDirection: "column",
});

const insightKickerCss = css({
  fontFamily: fonts.mono,
  fontSize: "11px",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.brand,
  marginBottom: "24px",
});

const insightHeadlineCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(34px, 4.4vw, 56px)",
  fontWeight: "500",
  color: colors.textPrimary,
  lineHeight: "1.06",
  letterSpacing: "-0.014em",
  marginBottom: "24px",
  textWrap: "balance",
} as Parameters<typeof css>[0]);

const insightDescCss = css({
  color: colors.textMuted,
  marginBottom: "36px",
  lineHeight: "1.7",
  fontSize: "16px",
  maxWidth: "32rem",
});

const insightBtnCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  paddingInline: "28px",
  paddingBlock: "14px",
  border: `1px solid ${colors.textPrimary}`,
  color: colors.textPrimary,
  fontWeight: "600",
  borderRadius: "9999px",
  textDecoration: "none",
  transition: "background-color 0.2s, color 0.2s",
  fontSize: "14px",
  alignSelf: "flex-start",
  _hover: { backgroundColor: colors.textPrimary, color: colors.bgPage },
});

const insightCardLinkCss = css({
  display: "block",
  textDecoration: "none",
  color: "inherit",
});

const insightImgWrapCss = css({
  position: "relative",
  borderRadius: "4px",
  overflow: "hidden",
  aspectRatio: "4/5",
  border: `1px solid ${colors.borderSubtle}`,
});

const insightImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.8s",
  _groupHover: { transform: "scale(1.04)" },
});

const insightPlaceholderCss = css({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.bgCard,
  color: colors.textFaint,
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontSize: "20px",
});

const insightOverlayCss = css({
  position: "absolute",
  inset: "0",
  background: "linear-gradient(to top, rgba(33,27,18,0.62), rgba(33,27,18,0) 55%)",
});

const insightCaptionCss = css({
  position: "absolute",
  bottom: "24px",
  left: "24px",
  right: "24px",
  color: colors.bgPage,
});

const insightBadgeCss = css({
  fontFamily: fonts.mono,
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.bgPage,
  borderTop: "1px solid rgba(251,246,236,0.55)",
  paddingTop: "10px",
  marginBottom: "10px",
  display: "inline-block",
});

const insightArticleTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "22px",
  fontWeight: "500",
  lineHeight: "1.18",
  letterSpacing: "-0.005em",
  color: colors.bgPage,
});

export default function InsightSection() {
  const { data: items = [] } = useMagazineList();
  const source = items.length > 0 ? items : MAGAZINE_DATA;
  const latest = [...source].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!latest) return null;

  return (
    <section className={insightSectionCss}>
      <div className={insightInnerCss}>
        <FadeUp>
          <div className={insightSideCss}>
            <span className={insightKickerCss}>§ Insight — Latest Issue</span>
            <h3 className={insightHeadlineCss}>
              주류 전문가들이 한 잔의 술 너머를 이야기합니다.
            </h3>
            <p className={insightDescCss}>
              단순한 음주 모임이 아닙니다. 위스키부터 칵테일, 전통주까지 —
              코콕만의 시선으로 풀어낸 글들을 천천히 읽어보세요.
            </p>
            <Link to="/magazine" className={insightBtnCss}>
              매거진 읽기 <ArrowRight size={15} />
            </Link>
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <Link
            to="/magazine/$id"
            params={{ id: String(latest.id) }}
            className={`group ${insightCardLinkCss}`}
          >
            <div className={insightImgWrapCss}>
              {latest.img ? (
                <img src={latest.img} alt={latest.title} className={insightImgCss} />
              ) : (
                <div className={insightPlaceholderCss}>No image</div>
              )}
              <div className={insightOverlayCss} />
              <div className={insightCaptionCss}>
                <span className={insightBadgeCss}>New Issue</span>
                <h4 className={insightArticleTitleCss}>{latest.title}</h4>
              </div>
            </div>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
