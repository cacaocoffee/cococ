import {
  fieldGroupCss,
  stepTitleCss,
  inputCss,
  labelCss,
  sublabelCss,
} from "../styles";
import RadioGroup from "../components/RadioGroup";
import CheckGroup from "../components/CheckGroup";
import Scale from "../components/Scale";
import InterviewMatrix from "../components/InterviewMatrix";
import {
  loadInterviewSettings,
  DEFAULT_INTERVIEW_SETTINGS,
} from "../../../hooks/useApplications";

export default function Step2Activity({ form, set, setV }) {
  const settings = loadInterviewSettings() ?? DEFAULT_INTERVIEW_SETTINGS;
  const { mtDate, interviewDates, interviewTimes } = settings;

  return (
    <div className={fieldGroupCss}>
      <h3 className={stepTitleCss}>활동 &amp; 소통</h3>

      <div>
        <label className={labelCss}>면접 가능 시간 *</label>
        <span className={sublabelCss}>
          가능한 날짜와 시간대를 모두 선택해 주세요. (중복 선택 가능)
        </span>
        <InterviewMatrix
          dates={interviewDates}
          times={interviewTimes}
          value={form.interviewTimes}
          onChange={setV("interviewTimes")}
        />
      </div>

      <div>
        <label className={labelCss}>MT 참가 가능 여부 *</label>
        <span className={sublabelCss}>{mtDate}</span>
        <RadioGroup
          name="mt"
          options={["가능", "불가"]}
          value={form.mtAvailable}
          onChange={setV("mtAvailable")}
        />
      </div>

      <div>
        <label className={labelCss}>코콕을 알게 된 경로</label>
        <input
          value={form.howKnow}
          onChange={set("howKnow")}
          placeholder="(ex. 인스타그램, 에브리타임, 지인 소개, 기타 주류 관련 온/오프라인 커뮤니티 등)"
          className={inputCss}
        />
      </div>

      <div>
        <label className={labelCss}>주 활동지</label>
        <input
          value={form.mainContact}
          onChange={set("mainContact")}
          placeholder="(ex. 서울 합정, 경기 안양 등) 여러 곳 가능!"
          className={inputCss}
        />
      </div>

      <div>
        <label className={labelCss}>디자인 툴 활용 능력을 체크해주세요 *</label>
        <span className={sublabelCss}>
          결과에 영향을 미치지 않으며, 참고용이니 부담 없이 작성해 주세요!
        </span>
        <Scale
          min={1}
          max={5}
          minLabel="전혀 없어요"
          maxLabel="능숙하게 활용해요"
          value={form.scaleDesignTool}
          onChange={setV("scaleDesignTool")}
        />
      </div>

      <div>
        <label className={labelCss}>
          포토샵, 일러스트레이터 등, 활용할 수 있는 디자인 툴이 있다면
          알려주세요.{" "}
        </label>
        <input
          value={form.mainDesign}
          onChange={set("mainDesign")}
          className={inputCss}
        />
      </div>

      <div>
        <label className={labelCss}>사진 및 영상 촬영 능력 *</label>
        <span className={sublabelCss}>
          결과에 영향을 미치지 않으며, 참고용이니 부담 없이 작성해 주세요!
        </span>
        <Scale
          min={1}
          max={5}
          minLabel="전혀 없어요"
          maxLabel="능숙하게 활용해요"
          value={form.scaleCameraTool}
          onChange={setV("scaleCameraTool")}
        />
      </div>

      <div>
        <label className={labelCss}>프로젝트 기획 여부</label>
        <span className={sublabelCss}>
          학교, 회사, 단체 등 주도적으로 프로젝트를 기획 해본 사례가 있으면
          간단히 알려주세요. 결과에 영향을 미치지 않으며, 참고용이니 부담 없이
          작성해 주세요!
        </span>
        <textarea
          rows={3}
          value={form.mainProject}
          onChange={set("mainProject")}
          className={inputCss}
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
}
