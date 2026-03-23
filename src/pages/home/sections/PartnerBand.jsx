import { PARTNERS } from "@/data";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const bandSectionCss = css({
  paddingBlock: "28px",
  backgroundColor: colors.bgBand,
  borderTop: `1px solid ${colors.borderFaint}`,
  borderBottom: `1px solid ${colors.borderFaint}`,
  overflow: "hidden",
  userSelect: "none",
});

const marqueeCss = css({
  display: "flex",
  whiteSpace: "nowrap",
  gap: "80px",
  width: "fit-content",
});

const partnerNameCss = css({
  fontSize: "26px",
  fontWeight: "900",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.08)",
});

export default function PartnerBand() {
  return (
    <section className={bandSectionCss}>
      <div className={`${marqueeCss} animate-marquee`}>
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <span key={i} className={partnerNameCss}>
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}
