import { PARTNERS } from "@/data";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

const bandSectionCss = css({
  paddingBlock: "20px",
  backgroundColor: colors.bgBand,
  borderTop: `1px solid ${colors.borderFaint}`,
  borderBottom: `1px solid ${colors.borderFaint}`,
  overflow: "hidden",
  userSelect: "none",
  position: "relative",
});

const bandLabelCss = css({
  position: "absolute",
  top: "50%",
  left: "24px",
  transform: "translateY(-50%)",
  fontFamily: fonts.mono,
  fontSize: "10px",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.brand,
  backgroundColor: colors.bgBand,
  paddingRight: "16px",
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
  fontStyle: "italic",
  fontSize: "22px",
  fontWeight: "500",
  letterSpacing: "0.005em",
  color: colors.textMuted,
});

const partnerDotCss = css({
  width: "5px",
  height: "5px",
  borderRadius: "9999px",
  backgroundColor: colors.brand,
  flexShrink: "0",
});

export default function PartnerBand() {
  return (
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
  );
}
