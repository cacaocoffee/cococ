import { cx } from "@/lib/css";
import RadioGroup from "../components/RadioGroup";
import {
  fieldGroupCss,
  stepTitleCss,
  inputCss,
  inputErrorCss,
  labelCss,
  sublabelCss,
  errorTextCss,
} from "../styles";

const VISIONS = [
  "경험은 지식을, 지식은 미식을",
  "서로 밀접하게 연결되어 있는 공통된 느낌 추구",
  "콕나투스(코콕은 즐거움에 가까워지려고 한다)",
  "경험을 통한 개인 역량 강화",
];

function Err({ msg }) {
  if (!msg) return null;
  return <p className={errorTextCss}>⚠ {msg}</p>;
}

export default function Step3Introduction({ form, set, setV, errors = {} }) {
  return (
    <div className={fieldGroupCss}>
      <h3 className={stepTitleCss}>자기소개</h3>

      <div>
        <label className={labelCss}>
          Q1. 자기 소개 및 지원 동기를 알려주세요. *
        </label>
        <textarea
          rows={4}
          value={form.q1_intro}
          onChange={set("q1_intro")}
          className={cx(inputCss, errors.q1_intro ? inputErrorCss : "")}
          style={{ resize: "none" }}
        />
        <Err msg={errors.q1_intro} />
      </div>

      <div>
        <label className={labelCss}>
          Q2. 좋아하는 술과 그 이유를 알려주세요. *
        </label>
        <textarea
          rows={4}
          value={form.q2_motivation}
          onChange={set("q2_motivation")}
          placeholder="여러가지도 가능!"
          className={cx(inputCss, errors.q2_motivation ? inputErrorCss : "")}
          style={{ resize: "none" }}
        />
        <Err msg={errors.q2_motivation} />
      </div>

      <div>
        <label className={labelCss}>
          Q3-1. 코콕은 4가지의 비전을 추구하고 있습니다. 본인과 가장 어울리는
          하나를 선택해 주세요. *
        </label>
        <span className={sublabelCss}>
          4가지 비전은 모두 동등한 가치를 지니며, 정답은 없습니다.
        </span>
        <RadioGroup
          name="q3_vision"
          options={VISIONS}
          value={form.q3_drink}
          onChange={setV("q3_drink")}
        />
        <Err msg={errors.q3_drink} />
      </div>

      {form.q3_drink && (
        <div>
          <label className={labelCss}>Q3-2. 선택한 이유를 알려주세요. *</label>
          <textarea
            rows={4}
            value={form.q4_contribution}
            onChange={set("q4_contribution")}
            className={cx(inputCss, errors.q4_contribution ? inputErrorCss : "")}
            style={{ resize: "none" }}
          />
          <Err msg={errors.q4_contribution} />
        </div>
      )}

      <div>
        <label className={labelCss}>
          마지막으로 하고 싶은 말이 있다면 자유롭게 적어주세요.
        </label>
        <span className={sublabelCss}>
          추가로 궁금한 점은 인스타 DM이나 이메일 cococ@gmail.com으로 주셔도
          됩니다.
        </span>
        <textarea
          rows={3}
          value={form.qEtc}
          onChange={set("qEtc")}
          placeholder="자유롭게 작성해 주세요."
          className={inputCss}
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
}
