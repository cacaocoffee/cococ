import { PARTNERS } from "@/data";
import { css } from "@/lib/css";
import { colors, fonts, radii } from "@/lib/tokens";

const bandSectionCss = css({
  paddingBlock: "20px",
  // 검정 띠 위로 협업처 이름이 흘러간다. 앞뒤 섹션과 같은 여백 안에 둥근 띠로 둔다
  backgroundColor: colors.bgBand,
  borderRadius: radii.lg,
  maxWidth: "80rem",
  marginInline: "auto",
  overflow: "hidden",
  userSelect: "none",
  position: "relative",
});

const bandLabelCss = css({
  position: "absolute",
  top: "50%",
  left: "24px",
  transform: "translateY(-50%)",
  fontSize: "12px",
  letterSpacing: "0",
  fontWeight: "700",
  color: colors.onInkMuted,
  backgroundColor: colors.bgBand,
  borderRadius: radii.pill,
  paddingInline: "10px",
  paddingBlock: "4px",
  boxShadow: `0 0 0 16px ${colors.bgBand}`,
  paddingLeft: "0",
  zIndex: "2",
  "@md": { left: "48px" },
});

const marqueeCss = css({
  display: "flex",
  whiteSpace: "nowrap",
  gap: "72px",
  width: "fit-content",
  alignItems: "center",
});

const partnerNameCss = css({
  fontFamily: fonts.display,
  fontSize: "22px",
  fontWeight: "700",
  letterSpacing: "-0.01em",
  color: colors.onInk,
});

const partnerDotCss = css({
  width: "5px",
  height: "5px",
  borderRadius: "9999px",
  backgroundColor: colors.lime,
  flexShrink: "0",
});

const bandOuterCss = css({
  paddingInline: "16px",
  "@md": { paddingInline: "32px" },
});

export default function PartnerBand() {
  return (
    <div className={bandOuterCss}>
    <section className={bandSectionCss}>
      <span className={bandLabelCss}>In partnership</span>
      <div className={`${marqueeCss} animate-marquee`}>
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "72px" }}>
            <span className={partnerNameCss}>{p}</span>
            <span className={partnerDotCss} />
          </span>
        ))}
      </div>
    </section>
    </div>
  );
}
