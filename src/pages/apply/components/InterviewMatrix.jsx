import { cx } from "@/lib/css";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const wrapCss = css({ overflowX: "auto" });
const tableCss = css({
  width: "100%",
  fontSize: "12px",
  borderCollapse: "collapse",
  minWidth: "480px",
});
const thCss = css({
  textAlign: "center",
  color: colors.textMuted,
  fontWeight: "700",
  paddingBottom: "8px",
  paddingInline: "4px",
  whiteSpace: "nowrap",
});
const thDateCss = css({
  width: "100px",
  textAlign: "left",
  color: colors.textFaint,
  fontWeight: "700",
  paddingBottom: "8px",
});
const tdDateCss = css({
  color: colors.textFaint,
  paddingRight: "12px",
  paddingBlock: "6px",
  fontSize: "11px",
  whiteSpace: "nowrap",
  fontWeight: "700",
});
const tdCss = css({
  textAlign: "center",
  paddingBlock: "6px",
  paddingInline: "4px",
});

const btnBaseCss = css({
  width: "36px",
  height: "36px",
  borderRadius: "0.5rem",
  border: `1px solid ${colors.borderInput}`,
  transition: "all 0.2s",
  cursor: "pointer",
  background: "none",
  color: colors.textDimmer,
  fontSize: "13px",
  _hover: { borderColor: "rgba(245,158,11,0.4)" },
});

const btnActiveCss = css({
  backgroundColor: colors.brand,
  borderColor: colors.brand,
  color: colors.bgPage,
  fontWeight: "900",
});

const emptyMsgCss = css({
  color: colors.textDimmer,
  fontSize: "13px",
  paddingBlock: "16px",
  textAlign: "center",
  border: `1px dashed ${colors.borderInput}`,
  borderRadius: "0.75rem",
});

/**
 * 면접 가능 시간 매트릭스
 * @param {{ dates: string[], times: string[], value: string[], onChange: (v: string[]) => void }} props
 */
export default function InterviewMatrix({
  dates = [],
  times = [],
  value,
  onChange,
}) {
  if (!dates.length || !times.length) {
    return (
      <p className={emptyMsgCss}>
        면접 일정이 아직 설정되지 않았습니다. 추후 공지 예정입니다.
      </p>
    );
  }

  const toggle = (date, time) => {
    const key = `${date}__${time}`;
    const next = new Set(value);
    next.has(key) ? next.delete(key) : next.add(key);
    onChange([...next]);
  };
  const isChecked = (date, time) => value.includes(`${date}__${time}`);

  return (
    <div className={wrapCss}>
      <table className={tableCss}>
        <thead>
          <tr>
            <th className={thDateCss} />
            {times.map((t) => (
              <th key={t} className={thCss}>
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => (
            <tr key={date}>
              <td className={tdDateCss}>{date}</td>
              {times.map((time) => (
                <td key={time} className={tdCss}>
                  <button
                    type="button"
                    onClick={() => toggle(date, time)}
                    className={cx(
                      btnBaseCss,
                      isChecked(date, time) ? btnActiveCss : "",
                    )}
                  >
                    {isChecked(date, time) ? "✓" : ""}
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
