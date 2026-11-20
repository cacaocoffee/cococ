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
  paddingBlock: "24px 72px",
  backgroundColor: colors.bgPage,
  "@md": { paddingBlock: "32px 104px" },
});

// 흰 카드 하나 안에 글과 표지 사진
const insightInnerCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  marginLeft: "16px",
  marginRight: "16px",
  backgroundColor: colors.bgCard,
  borderRadius: "28px",
  padding: "24px",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "48px",
  alignItems: "center",
  "@md": { padding: "48px", gridTemplateColumns: "1.05fr 0.95fr", gap: "64px", marginLeft: "32px", marginRight: "32px" },
  "@xl": { marginLeft: "auto", marginRight: "auto" },
});

const insightSideCss = css({
  display: "flex",
  flexDirection: "column",
});

const insightKickerCss = css({
  fontSize: "13px",
  fontWeight: "700",
  color: colors.textMuted,
  marginBottom: "16px",
});

const insightHeadlineCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(34px, 4.4vw, 56px)",
  fontWeight: "700",
  color: colors.textPrimary,
  lineHeight: "1.1",
  letterSpacing: "-0.03em",
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
  paddingInline: "24px",
  minHeight: "52px",
  backgroundColor: colors.bgInk,
  color: colors.onInk,
  fontWeight: "700",
  borderRadius: "16px",
  textDecoration: "none",
  transition: "background-color 0.2s",
  fontSize: "15px",
  alignSelf: "flex-start",
  _hover: { backgroundColor: colors.brandHover },
});

const insightCardLinkCss = css({
  display: "block",
  textDecoration: "none",
  color: "inherit",
});

const insightImgWrapCss = css({
  position: "relative",
  borderRadius: "20px",
  overflow: "hidden",
  aspectRatio: "4/5",
  backgroundColor: colors.bgInk,
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
  backgroundColor: colors.bgInk,
  color: colors.onInkMuted,
  fontFamily: fonts.display,
  fontSize: "20px",
});

// 사진 아래쪽에 검정 면을 깔아 흰 제목이 어떤 사진 위에서도 읽히게 한다
const insightOverlayCss = css({ display: "none" });

const insightCaptionCss = css({
  position: "absolute",
  bottom: "12px",
  left: "12px",
  right: "12px",
  color: colors.onInk,
  backgroundColor: colors.bgInk,
  borderRadius: "16px",
  padding: "16px 18px",
});

const insightBadgeCss = css({
  fontSize: "12px",
  fontWeight: "700",
  color: colors.textPrimary,
  backgroundColor: colors.lime,
  borderRadius: "9999px",
  paddingInline: "10px",
  paddingBlock: "3px",
  marginBottom: "10px",
  display: "inline-block",
});

const insightArticleTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "1.25",
  letterSpacing: "-0.02em",
  color: colors.onInk,
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
            <span className={insightKickerCss}>Insight — Latest Issue</span>
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
