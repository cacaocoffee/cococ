import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { css } from "@/lib/css";
import { colors, fonts, radii } from "@/lib/tokens";
import CococLogo from "@/components/ui/CococLogo";

// 홈 첫 화면: 회색 바탕 위에 큰 검정 카드 하나. 라임은 강조 한 군데와 버튼에만 쓴다.
const heroSectionCss = css({
  paddingInline: "16px",
  paddingTop: "16px",
  paddingBottom: "24px",
  backgroundColor: colors.bgPage,
  "@md": { paddingInline: "32px", paddingTop: "24px", paddingBottom: "32px" },
});

const heroCardCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  backgroundColor: colors.bgInk,
  color: colors.onInk,
  borderRadius: radii.xl,
  padding: "28px 22px 22px",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "28px",
  overflow: "hidden",
  "@md": {
    gridTemplateColumns: "1.1fr 0.9fr",
    alignItems: "stretch",
    gap: "40px",
    padding: "48px",
  },
  "@lg": { padding: "64px", gap: "56px" },
});

const heroInnerCss = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "36px",
  minWidth: "0",
});

const topRowCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

const logoRowCss = css({ display: "flex", alignItems: "center", gap: "12px" });

const smallMutedCss = css({
  fontSize: "13px",
  fontWeight: "500",
  color: colors.onInkMuted,
});

const folioCss = css({
  fontSize: "12px",
  fontWeight: "700",
  color: colors.onInk,
  backgroundColor: colors.onInkLine,
  borderRadius: radii.pill,
  paddingInline: "10px",
  paddingBlock: "4px",
  whiteSpace: "nowrap",
});

const heroTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(48px, 8vw, 104px)",
  fontWeight: "700",
  color: colors.onInk,
  lineHeight: "1.02",
  letterSpacing: "-0.035em",
  marginTop: "14px",
});

// 라임 바탕에 잉크 글자: 화면에서 하나뿐인 라임 강조
const heroAccentCss = css({
  display: "inline-block",
  backgroundColor: colors.lime,
  color: colors.textPrimary,
  borderRadius: "14px",
  paddingInline: "0.14em",
  marginTop: "0.08em",
});

const heroSubCss = css({
  fontSize: "16px",
  color: colors.onInkMuted,
  fontWeight: "500",
  lineHeight: "1.7",
  maxWidth: "32rem",
  "@md": { fontSize: "17px" },
});

const heroActionRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
});

const heroCTACss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: colors.lime,
  color: colors.textPrimary,
  paddingInline: "24px",
  minHeight: "52px",
  borderRadius: radii.btn,
  fontWeight: "700",
  fontSize: "15px",
  textDecoration: "none",
  transition: "background-color 0.2s",
  _hover: { backgroundColor: colors.limeHover },
});

const heroSecondaryCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: colors.onInk,
  paddingInline: "20px",
  minHeight: "52px",
  borderRadius: radii.btn,
  border: `1px solid ${colors.onInkLine}`,
  fontSize: "15px",
  fontWeight: "700",
  textDecoration: "none",
  transition: "background-color 0.2s",
  _hover: { backgroundColor: colors.onInkLine },
});

const heroVisualCss = css({
  position: "relative",
  width: "100%",
  minHeight: "320px",
  borderRadius: radii.lg,
  overflow: "hidden",
  "@md": { minHeight: "520px" },
});

const heroImgCss = css({
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const heroCaptionCss = css({
  position: "absolute",
  left: "12px",
  bottom: "12px",
  fontSize: "12px",
  fontWeight: "700",
  color: colors.onInk,
  backgroundColor: "rgba(15,17,21,0.72)",
  borderRadius: radii.pill,
  paddingInline: "10px",
  paddingBlock: "5px",
});

export default function HeroSection() {
  return (
    <section className={heroSectionCss}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={heroCardCss}
      >
        <div className={heroInnerCss}>
          <div className={topRowCss}>
            <div className={logoRowCss}>
              <CococLogo size={44} color={colors.onInk} />
              <span className={smallMutedCss}>Cocktail Journal — Seoul</span>
            </div>
            <span className={folioCss}>Vol. 01 — 2026</span>
          </div>

          <div>
            <span className={smallMutedCss}>Creations Over Cocktail · Offbeat Culture</span>
            <h1 className={heroTitleCss}>
              아는 만큼,<br />
              <span className={heroAccentCss}>맛있으니까.</span>
            </h1>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <p className={heroSubCss}>
              코콕은 2030세대의 취향 있는 주류 생활을 기록하는 칵테일 저널입니다.
              경험을 지식으로, 지식은 미식으로 — 한 잔 한 잔 천천히 쌓아갑니다.
            </p>
            <div className={heroActionRowCss}>
              <Link to="/apply" className={heroCTACss}>
                코콕 합류하기 <ArrowRight size={18} />
              </Link>
              <Link to="/magazine" className={heroSecondaryCss}>
                이번 호 매거진 읽기
              </Link>
            </div>
          </div>
        </div>

        <div className={heroVisualCss}>
          <img
            src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1600"
            alt="A backlit cocktail glass on a softly-lit bar counter"
            className={heroImgCss}
          />
          <div className={heroCaptionCss}>Photograph — Negroni, Itaewon</div>
        </div>
      </motion.div>
    </section>
  );
}
