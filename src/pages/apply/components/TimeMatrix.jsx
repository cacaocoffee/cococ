import { cx } from "@/lib/css";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { DAYS, TIMES } from "../constants";

const matrixWrapCss = css({ overflowX: "auto" });
const matrixTableCss = css({
  width: "100%",
  fontSize: "12px",
  borderCollapse: "collapse",
});
const matrixThCss = css({
  textAlign: "center",
  color: colors.textMuted,
  fontWeight: "700",
  paddingBottom: "8px",
  paddingInline: "4px",
});
const matrixThLabelCss = css({
  width: "96px",
  textAlign: "left",
  color: colors.textFaint,
  fontWeight: "700",
  paddingBottom: "8px",
});
const matrixTdLabelCss = css({
  color: colors.textFaint,
  paddingRight: "12px",
  paddingBlock: "6px",
  fontSize: "11px",
  whiteSpace: "nowrap",
});
const matrixTdCss = css({
  textAlign: "center",
  paddingBlock: "6px",
  paddingInline: "4px",
});

const matrixBtnBaseCss = css({
  width: "32px",
  height: "32px",
  borderRadius: "0.5rem",
  border: `1px solid ${colors.borderInput}`,
  transition: "all 0.2s",
  cursor: "pointer",
  background: "none",
  color: colors.textDimmer,
  _hover: { borderColor: "rgba(245,158,11,0.4)" },
});

const matrixBtnActiveCss = css({
  backgroundColor: colors.brand,
  borderColor: colors.brand,
  color: colors.bgPage,
});

export default function TimeMatrix({ value, onChange }) {
  const toggle = (day, time) => {
    const key = `${day}_${time}`;
    const next = new Set(value);
    next.has(key) ? next.delete(key) : next.add(key);
    onChange([...next]);
  };
  const isChecked = (day, time) => value.includes(`${day}_${time}`);
  return (
    <div className={matrixWrapCss}>
      <table className={matrixTableCss}>
        <thead>
          <tr>
            <th className={matrixThLabelCss}></th>
            {DAYS.map((d) => (
              <th key={d} className={matrixThCss}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMES.map((time) => (
            <tr key={time}>
              <td className={matrixTdLabelCss}>{time}</td>
              {DAYS.map((day) => (
                <td key={day} className={matrixTdCss}>
                  <button
                    type="button"
                    onClick={() => toggle(day, time)}
                    className={cx(
                      matrixBtnBaseCss,
                      isChecked(day, time) ? matrixBtnActiveCss : "",
                    )}
                  >
                    {isChecked(day, time) ? "✓" : ""}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
