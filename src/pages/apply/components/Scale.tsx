import { cx } from "@/lib/css";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const scaleWrapCss = css({});
const scaleLabelRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "11px",
  color: colors.textFaint,
  marginBottom: "8px",
});
const scaleBtnRowCss = css({ display: "flex", gap: "8px" });

const scaleBtnBaseCss = css({
  flex: "1 1 0%",
  height: "40px",
  borderRadius: "0.75rem",
  border: `1px solid ${colors.borderMedium}`,
  fontSize: "14px",
  fontWeight: "900",
  transition: "all 0.2s",
  cursor: "pointer",
  background: "none",
  _hover: { borderColor: "rgba(245,158,11,0.4)" },
});

const scaleBtnActiveCss = css({
  borderColor: colors.brand,
  backgroundColor: colors.brand,
  color: colors.bgPage,
});
const scaleBtnInactiveCss = css({ color: colors.textMuted });

export default function Scale({
  min = 1,
  max = 5,
  minLabel,
  maxLabel,
  value,
  onChange,
}) {
  return (
    <div className={scaleWrapCss}>
      <div className={scaleLabelRowCss}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <div className={scaleBtnRowCss}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cx(
              scaleBtnBaseCss,
              value === n ? scaleBtnActiveCss : scaleBtnInactiveCss,
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
