import {
  fieldGroupCss,
  gridCols2Css,
  stepTitleCss,
  inputCss,
  labelCss,
  sublabelCss,
} from "../styles";
import RadioGroup from "../components/RadioGroup";

export default function Step1Personal({ form, set, setV }) {
  return (
    <div className={fieldGroupCss}>
      <h3 className={stepTitleCss}>인적사항</h3>
      <div className={gridCols2Css}>
        <div>
          <label className={labelCss}>이름 *</label>
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="홍길동"
            className={inputCss}
          />
        </div>
        <div>
          <label className={labelCss}>성별 *</label>
          <RadioGroup
            name="gender"
            options={["남성", "여성"]}
            value={form.gender}
            onChange={setV("gender")}
          />
        </div>
      </div>
      <div className={gridCols2Css}>
        <div>
          <label className={labelCss}>생년월일 *</label>
          <input
            value={form.birthdate}
            onChange={set("birthdate")}
            placeholder="ex) 001231 (6자리)"
            className={inputCss}
          />
        </div>
        <div>
          <label className={labelCss}>연락처 *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="ex) 010-1234-5678"
            className={inputCss}
          />
        </div>
      </div>
      <div>
        <label className={labelCss}>SNS 주소</label>
        <span className={sublabelCss}>
          인스타그램 등 SNS 계정 주소를 알려주세요.
        </span>
        <input
          value={form.sns}
          onChange={set("sns")}
          placeholder="@cococ_official"
          className={inputCss}
        />
      </div>
      <div>
        <label className={labelCss}>이메일 주소 *</label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="example@email.com"
          className={inputCss}
        />
      </div>
    </div>
  );
}
