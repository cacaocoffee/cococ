import { css, cx } from "../../../lib/css";
import {
  checkBtnBaseCss,
  checkBtnActiveCss,
  checkBtnInactiveCss,
} from "../styles";

export default function CheckGroup({ options, values, onChange }) {
  const toggle = (opt) =>
    onChange(
      values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt],
    );
  return (
    <div className={css({ display: "flex", flexWrap: "wrap", gap: "8px" })}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cx(
            checkBtnBaseCss,
            values.includes(opt) ? checkBtnActiveCss : checkBtnInactiveCss,
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
