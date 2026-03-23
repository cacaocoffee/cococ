import { css, cx } from "../../../lib/css";
import { radioBaseCss, radioActiveCss } from "../styles";

export default function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className={css({ display: "flex", flexWrap: "wrap", gap: "8px" })}>
      {options.map((opt) => (
        <label
          key={opt}
          className={cx(radioBaseCss, value === opt ? radioActiveCss : "")}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            style={{ display: "none" }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
