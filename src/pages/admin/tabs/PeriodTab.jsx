import { useState } from "react";
import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight } from "lucide-react";
import {
  loadApplyPeriod,
  saveApplyPeriod,
  isApplyOpen,
  loadInterviewSettings,
  saveInterviewSettings,
  DEFAULT_INTERVIEW_SETTINGS,
} from "../../../hooks/useApplications";
import { css, cx } from "../../../lib/css";
import { colors } from "../../../lib/tokens";
import { inputCss } from "../styles";

const maxCss = css({ maxWidth: "36rem" });
const titleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
});

const badgeBaseCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  paddingInline: "16px",
  paddingBlock: "8px",
  borderRadius: "9999px",
  fontSize: "14px",
  fontWeight: "900",
  marginBottom: "32px",
});
const badgeOpenCss = css({
  backgroundColor: colors.successBg,
  color: colors.successMuted,
});
const badgeClosedCss = css({
  backgroundColor: colors.dangerBg,
  color: colors.dangerMuted,
});

const dotBaseCss = css({ width: "8px", height: "8px", borderRadius: "9999px" });
const dotOpenCss = css({ backgroundColor: colors.successMuted });
const dotClosedCss = css({ backgroundColor: colors.dangerMuted });

const cardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});
const grid2Css = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});
const labelCss = css({
  fontSize: "11px",
  fontWeight: "700",
  color: colors.textMuted,
  marginBottom: "6px",
  display: "block",
});

const toggleRowCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  backgroundColor: "rgba(0,0,0,0.2)",
  borderRadius: "0.75rem",
});
const toggleLabelCss = css({
  color: colors.textPrimary,
  fontSize: "14px",
  fontWeight: "700",
  marginBottom: "2px",
});
const toggleSubCss = css({ color: colors.textFaint, fontSize: "12px" });
const toggleBtnCss = css({
  background: "none",
  border: "none",
  cursor: "pointer",
  color: colors.brand,
});

const previewCss = css({
  backgroundColor: "rgba(245,158,11,0.05)",
  border: `1px solid rgba(245,158,11,0.2)`,
  borderRadius: "0.75rem",
  padding: "16px",
  fontSize: "14px",
});
const previewLabelCss = css({
  color: "rgba(245,158,11,0.9)",
  fontWeight: "700",
  marginBottom: "4px",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});
const previewDateCss = css({ color: colors.textPrimary });
const previewSepCss = css({ color: colors.textFaint, marginInline: "8px" });

const saveBtnBaseCss = css({
  width: "100%",
  paddingBlock: "12px",
  borderRadius: "0.75rem",
  fontWeight: "900",
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
});
const saveBtnNormalCss = css({
  backgroundColor: colors.brand,
  color: colors.bgPage,
  _hover: { backgroundColor: colors.brandHover },
});
const saveBtnSavedCss = css({
  backgroundColor: colors.success,
  color: colors.textPrimary,
});

const hintCss = css({
  color: colors.textDimmer,
  fontSize: "12px",
  marginTop: "16px",
  lineHeight: "1.625",
});

export default function PeriodTab() {
  const [period, setPeriod] = useState(
    () => loadApplyPeriod() || { start: "", end: "", enabled: true },
  );
  const [interview, setInterview] = useState(
    () => loadInterviewSettings() ?? DEFAULT_INTERVIEW_SETTINGS,
  );
  const [saved, setSaved] = useState(false);
  const open = isApplyOpen();

  // interview helpers
  const setMtDate = (v) => setInterview((p) => ({ ...p, mtDate: v }));
  const setDatesText = (v) =>
    setInterview((p) => ({
      ...p,
      interviewDates: v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  const setTimesText = (v) =>
    setInterview((p) => ({
      ...p,
      interviewTimes: v
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    }));

  const save = () => {
    saveApplyPeriod(period);
    saveInterviewSettings(interview);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={maxCss}>
      <h2 className={titleCss}>접수 기간 설정</h2>

      <div className={cx(badgeBaseCss, open ? badgeOpenCss : badgeClosedCss)}>
        <span
          className={cx(
            dotBaseCss,
            open ? dotOpenCss : dotClosedCss,
            "animate-pulse",
          )}
        />
        현재 접수 {open ? "진행 중" : "마감"}
      </div>

      <div className={cardCss}>
        <div className={grid2Css}>
          <div>
            <label className={labelCss}>접수 시작 일시</label>
            <input
              type="datetime-local"
              value={period.start}
              onChange={(e) =>
                setPeriod((p) => ({ ...p, start: e.target.value }))
              }
              className={inputCss}
              style={{ colorScheme: "dark" }}
            />
          </div>
          <div>
            <label className={labelCss}>접수 종료 일시</label>
            <input
              type="datetime-local"
              value={period.end}
              onChange={(e) =>
                setPeriod((p) => ({ ...p, end: e.target.value }))
              }
              className={inputCss}
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <div className={toggleRowCss}>
          <div>
            <p className={toggleLabelCss}>접수 기간 외 강제 마감</p>
            <p className={toggleSubCss}>
              켜면 날짜 범위 밖에서 지원 폼이 잠깁니다.
            </p>
          </div>
          <button
            onClick={() => setPeriod((p) => ({ ...p, enabled: !p.enabled }))}
            className={toggleBtnCss}
          >
            {period.enabled ? (
              <ToggleRight size={36} />
            ) : (
              <ToggleLeft size={36} color={colors.textDimmer} />
            )}
          </button>
        </div>

        {period.start && period.end && (
          <div className={previewCss}>
            <p className={previewLabelCss}>미리보기</p>
            <p className={previewDateCss}>
              {new Date(period.start).toLocaleString("ko-KR")}
              <span className={previewSepCss}>~</span>
              {new Date(period.end).toLocaleString("ko-KR")}
            </p>
          </div>
        )}

        <motion.button
          onClick={save}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cx(
            saveBtnBaseCss,
            saved ? saveBtnSavedCss : saveBtnNormalCss,
          )}
        >
          {saved ? "✓ 저장 완료!" : "저장"}
        </motion.button>
      </div>

      {/* ─── 면접 / MT 설정 ───────────────────────────── */}
      <h2 className={titleCss} style={{ marginTop: "40px" }}>
        면접 / MT 설정
      </h2>
      <div className={cardCss}>
        <div>
          <label className={labelCss}>MT 날짜</label>
          <input
            value={interview.mtDate}
            onChange={(e) => setMtDate(e.target.value)}
            placeholder="ex) 11/23(토) ~ 11/24(일)"
            className={inputCss}
          />
        </div>

        <div>
          <label className={labelCss}>면접 날짜 (쉼표로 구분)</label>
          <input
            value={interview.interviewDates.join(", ")}
            onChange={(e) => setDatesText(e.target.value)}
            placeholder="ex) 3/22(토), 3/23(일)"
            className={inputCss}
          />
          {interview.interviewDates.length > 0 && (
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {interview.interviewDates.map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    backgroundColor: "rgba(245,158,11,0.1)",
                    color: "#f59e0b",
                    paddingInline: "10px",
                    paddingBlock: "4px",
                    borderRadius: "9999px",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelCss}>면접 시간대 (줄바꿈으로 구분)</label>
          <textarea
            rows={5}
            value={interview.interviewTimes.join("\n")}
            onChange={(e) => setTimesText(e.target.value)}
            placeholder={"10:00-10:30\n10:30-11:00\n11:00-11:30"}
            className={inputCss}
            style={{
              resize: "none",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          />
          <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
            현재 {interview.interviewTimes.length}개 시간대 설정됨
          </p>
        </div>

        <motion.button
          onClick={save}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cx(
            saveBtnBaseCss,
            saved ? saveBtnSavedCss : saveBtnNormalCss,
          )}
        >
          {saved ? "✓ 저장 완료!" : "저장"}
        </motion.button>
      </div>

      <p className={hintCss}>
        * 시작/종료 일시를 비워두면 기간 제한 없이 항상 열립니다.
        <br />* 설정 후 /apply 페이지에서 즉시 반영됩니다.
      </p>
    </div>
  );
}
