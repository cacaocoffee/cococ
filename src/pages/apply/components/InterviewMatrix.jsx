import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";

const wrapCss = css({ overflowX: "auto" });

const tableCss = css({
  width: "100%",
  fontSize: "11px",
  borderCollapse: "collapse",
  tableLayout: "fixed",
});

const thTimeCss = css({
  width: "90px",
  textAlign: "left",
  color: colors.textFaint,
  fontWeight: "700",
  paddingBottom: "8px",
  whiteSpace: "nowrap",
});

const thDateCss = css({
  textAlign: "center",
  color: colors.textMuted,
  fontWeight: "700",
  paddingBottom: "8px",
  paddingInline: "4px",
  whiteSpace: "nowrap",
});

const tdTimeCss = css({
  color: colors.textFaint,
  paddingRight: "12px",
  paddingBlock: "4px",
  fontSize: "11px",
  fontWeight: "700",
  whiteSpace: "nowrap",
});

const tdCss = css({
  textAlign: "center",
  paddingBlock: "4px",
  paddingInline: "4px",
});

const btnBaseCss = css({
  width: "100%",
  height: "32px",
  borderRadius: "6px",
  border: `1px solid ${colors.borderInput}`,
  transition: "all 0.15s",
  cursor: "pointer",
  background: "none",
  fontSize: "11px",
  fontWeight: "800",
  color: "transparent",
  _hover: { borderColor: "rgba(245,158,11,0.5)", backgroundColor: "rgba(245,158,11,0.08)" },
});

const btnActiveCss = css({
  backgroundColor: "rgba(245,158,11,0.18)",
  borderColor: "rgba(245,158,11,0.5)",
  color: "rgba(245,158,11,0.9)",
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
 * 면접 가능 시간 매트릭스 (날짜=열, 시간=행)
 */
export default function InterviewMatrix({ dates = [], times = [], value, onChange }) {
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
            <th className={thTimeCss} />
            {dates.map((d) => (
              <th key={d} className={thDateCss}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td className={tdTimeCss}>{time}</td>
              {dates.map((date) => (
                <td key={date} className={tdCss}>
                  <button
                    type="button"
                    onClick={() => toggle(date, time)}
                    className={cx(btnBaseCss, isChecked(date, time) ? btnActiveCss : "")}
                  />

                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
