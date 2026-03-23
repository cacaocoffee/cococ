import { AlertCircle } from "lucide-react";
import { cx } from "../../../lib/css";
import { css } from "../../../lib/css";
import { colors } from "../../../lib/tokens";
import {
  fieldGroupCss,
  stepTitleCss,
  sublabelCss,
  summaryBoxCss,
  summaryRowCss,
  summaryLabelCss,
  summaryValueCss,
  privacyCss,
  privacyTitleCss,
  privacyDescCss,
  privacyCheckRowCss,
  checkboxBaseCss,
  checkboxActiveCss,
  checkboxInactiveCss,
  checkboxLabelCss,
  warningBoxCss,
  warningTextCss,
} from "../styles";

export default function Step4Confirm({ form, setForm }) {
  return (
    <div className={fieldGroupCss}>
      <h3 className={stepTitleCss}>최종 확인</h3>
      <div className={summaryBoxCss}>
        {[
          ["이름", form.name],
          ["성별", form.gender],
          ["생년월일", form.birthdate],
          ["연락처", form.phone],
          ["이메일", form.email],
          ["MT 참가", form.mtAvailable],
        ].map(([l, v]) => (
          <div key={l} className={summaryRowCss}>
            <span className={summaryLabelCss}>{l}</span>
            <span className={summaryValueCss}>{v || "—"}</span>
          </div>
        ))}
      </div>
      <div className={summaryBoxCss}>
        {[
          ["Q1. 자기소개", form.q1_intro],
          ["Q2. 지원 동기", form.q2_motivation],
          ["Q3. 닮은 술", form.q3_drink],
          ["Q4. 기여 가능한 것", form.q4_contribution],
        ].map(([l, v]) => (
          <div key={l}>
            <p className={sublabelCss} style={{ marginBottom: "4px" }}>
              {l}
            </p>
            <p
              className={css({
                color: colors.textPrimary,
                fontSize: "14px",
                lineHeight: "1.625",
              })}
            >
              {v || "—"}
            </p>
          </div>
        ))}
      </div>
      <div className={privacyCss}>
        <p className={privacyTitleCss}>개인정보 수집 및 이용 동의</p>
        <p className={privacyDescCss}>
          수집 항목: 이름, 성별, 생년월일, 연락처, 이메일, SNS 계정
          <br />
          수집 목적: COCOC 회원 선발 및 활동 운영
          <br />
          보유 기간: 선발 완료 후 1년, 미선발 시 즉시 파기
        </p>
        <label className={privacyCheckRowCss}>
          <div
            onClick={() =>
              setForm((f) => ({ ...f, privacyAgree: !f.privacyAgree }))
            }
            className={cx(
              checkboxBaseCss,
              form.privacyAgree ? checkboxActiveCss : checkboxInactiveCss,
            )}
          >
            {form.privacyAgree && (
              <span
                style={{
                  color: colors.bgPage,
                  fontSize: "12px",
                  fontWeight: "900",
                }}
              >
                ✓
              </span>
            )}
          </div>
          <span className={checkboxLabelCss}>
            개인정보 수집 및 이용에 동의합니다. *
          </span>
        </label>
      </div>
      <div className={warningBoxCss}>
        <AlertCircle
          size={15}
          color={colors.brand}
          style={{ flexShrink: 0, marginTop: "2px" }}
        />
        <p className={warningTextCss}>
          최종 제출 후에는 수정이 어렵습니다. 내용을 다시 한번 확인해 주세요.
          <br />
          최종 결과는 발표일에 지원 시 기재한 연락처로 개별 안내드립니다.
        </p>
      </div>
    </div>
  );
}
