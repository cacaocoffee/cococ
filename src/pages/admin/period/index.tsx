import { useState, useEffect } from "react";
import { ToggleLeft, ToggleRight, Calendar, Clock, Plus, X } from "lucide-react";

import { applyService } from "@/domain/apply/apply-service";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";
import LoadingButton from "@/components/ui/LoadingButton";
import { inputCss, scrollTableWrapCss } from "../styles";
import DatePicker from "../components/DatePicker";

// ─── Styles ────────────────────────────────────────────────────
const maxCss = css({ maxWidth: "36rem" });

const titleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
});

const sectionTitleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
  marginTop: "40px",
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
const badgeOpenCss = css({ backgroundColor: colors.successBg, color: colors.successMuted });
const badgeClosedCss = css({ backgroundColor: colors.dangerBg, color: colors.dangerMuted });

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
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

// Time input (for HH:MM below DatePicker)
const timeRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "8px",
  backgroundColor: "rgba(0,0,0,0.35)",
  border: `1px solid ${colors.borderInput}`,
  borderRadius: "0.75rem",
  paddingInline: "14px",
  paddingBlock: "10px",
  transition: "border-color 0.2s",
  ":focus-within": { borderColor: colors.brand },
});
const timeIconCss = css({ color: colors.textFaint, flexShrink: "0" });
const timeLabelSmCss = css({
  fontSize: "11px",
  fontWeight: "700",
  color: colors.textDimmer,
  flexShrink: "0",
});

// ─── Tag chip input ────────────────────────────────────────────
const addRowCss = css({
  display: "flex",
  gap: "8px",
  alignItems: "stretch",
});

const addInputCss = css({
  backgroundColor: "rgba(0,0,0,0.35)",
  border: `1px solid ${colors.borderInput}`,
  borderRadius: "0.75rem",
  paddingInline: "14px",
  paddingBlock: "11px",
  color: colors.textPrimary,
  fontSize: "13px",
  outline: "none",
  flex: "1 1 0%",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.brand },
});

const addBtnCss = css({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  backgroundColor: "rgba(245,158,11,0.08)",
  color: colors.brand,
  border: `1px solid rgba(245,158,11,0.18)`,
  paddingInline: "16px",
  paddingBlock: "11px",
  borderRadius: "0.75rem",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  flexShrink: "0",
  whiteSpace: "nowrap",
  transition: "all 0.2s",
  _hover: { backgroundColor: "rgba(245,158,11,0.16)" },
});

const chipsCss = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "10px",
  minHeight: "32px",
  alignItems: "center",
});

const chipCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  backgroundColor: "rgba(245,158,11,0.1)",
  border: "1px solid rgba(245,158,11,0.22)",
  color: colors.brand,
  fontSize: "12px",
  fontWeight: "700",
  paddingInline: "10px",
  paddingBlock: "5px",
  borderRadius: "9999px",
});

const chipXCss = css({
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "rgba(245,158,11,0.45)",
  display: "flex",
  alignItems: "center",
  padding: "0",
  lineHeight: "1",
  marginLeft: "1px",
  _hover: { color: colors.brand },
});

const emptyTagsCss = css({
  fontSize: "12px",
  color: colors.textDimmer,
  fontStyle: "italic",
});

// ─── 면접 그리드 ───────────────────────────────────────────────
const PRESET_TIMES = [
  "09:00-09:30", "09:30-10:00",
  "10:00-10:30", "10:30-11:00",
  "11:00-11:30", "11:30-12:00",
  "13:00-13:30", "13:30-14:00",
  "14:00-14:30", "14:30-15:00",
  "15:00-15:30", "15:30-16:00",
  "16:00-16:30", "16:30-17:00",
  "17:00-17:30", "17:30-18:00",
];

// ─── Toggle ────────────────────────────────────────────────────
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
const toggleBtnCss = css({ background: "none", border: "none", cursor: "pointer", color: colors.brand });

// ─── Preview ───────────────────────────────────────────────────
const previewCss = css({
  backgroundColor: "rgba(245,158,11,0.05)",
  border: "1px solid rgba(245,158,11,0.2)",
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

// ─── Save button ───────────────────────────────────────────────
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

const countCss = css({
  fontSize: "11px",
  color: colors.textDimmer,
  marginTop: "8px",
});

// ─── Helpers ──────────────────────────────────────────────────
const getDate = (v) => (v ? v.split("T")[0] : "");
const getTime = (v) => (v ? v.split("T")[1] ?? "" : "");
const combine = (d, t) => (d ? `${d}T${t || "00:00"}` : "");

// ─── Component ────────────────────────────────────────────────
export default function PeriodTab() {
  const [period, setPeriod] = useState<{ start: string; end: string; enabled?: boolean }>({
    start: "",
    end: "",
    enabled: true,
  });
  const [interview, setInterview] = useState(applyService.DEFAULT_INTERVIEW_SETTINGS);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    void (async () => {
      const [p, i, isOpen] = await Promise.all([
        applyService.loadApplyPeriod(),
        applyService.loadInterviewSettings(),
        applyService.isApplyOpen(),
      ]);
      if (p) setPeriod({ start: p.start ?? "", end: p.end ?? "", enabled: !p.forceClosed });
      if (i) setInterview(i);
      setOpen(isOpen);
    })();
  }, []);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await applyService.saveApplyPeriod({
        start: period.start,
        end: period.end,
        forceClosed: period.enabled === false,
      });
      await applyService.saveInterviewSettings(interview);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const addDate = () => {
    const v = dateInput.trim();
    if (!v || interview.interviewDates.includes(v)) return;
    setInterview((p) => ({ ...p, interviewDates: [...p.interviewDates, v] }));
    setDateInput("");
  };

  const removeDate = (i) =>
    setInterview((p) => ({
      ...p,
      interviewDates: p.interviewDates.filter((_, idx) => idx !== i),
    }));

  const toggleTime = (slot) =>
    setInterview((p) => ({
      ...p,
      interviewTimes: p.interviewTimes.includes(slot)
        ? p.interviewTimes.filter((t) => t !== slot)
        : [...p.interviewTimes, slot],
    }));

  return (
    <div className={maxCss}>
      <h2 className={titleCss}>접수 기간 설정</h2>

      <div className={cx(badgeBaseCss, open ? badgeOpenCss : badgeClosedCss)}>
        <span className={cx(dotBaseCss, open ? dotOpenCss : dotClosedCss, "animate-pulse")} />
        현재 접수 {open ? "진행 중" : "마감"}
      </div>

      <div className={cardCss}>
        <div className={grid2Css}>
          {/* 접수 시작 일시 */}
          <div>
            <label className={labelCss}>
              <Calendar size={12} />
              접수 시작 일시
            </label>
            <DatePicker
              value={getDate(period.start)}
              onChange={(d) =>
                setPeriod((p) => ({ ...p, start: combine(d, getTime(p.start)) }))
              }
              placeholder="날짜 선택"
            />
            <div className={timeRowCss}>
              <span className={timeIconCss}><Clock size={14} /></span>
              <span className={timeLabelSmCss}>시각</span>
              <input
                type="time"
                value={getTime(period.start)}
                onChange={(e) =>
                  setPeriod((p) => ({ ...p, start: combine(getDate(p.start), e.target.value) }))
                }
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: colors.textPrimary, fontSize: "14px", flex: "1 1 0%",
                  colorScheme: "dark", minWidth: 0,
                }}
              />
            </div>
          </div>

          {/* 접수 종료 일시 */}
          <div>
            <label className={labelCss}>
              <Calendar size={12} />
              접수 종료 일시
            </label>
            <DatePicker
              value={getDate(period.end)}
              onChange={(d) =>
                setPeriod((p) => ({ ...p, end: combine(d, getTime(p.end)) }))
              }
              placeholder="날짜 선택"
            />
            <div className={timeRowCss}>
              <span className={timeIconCss}><Clock size={14} /></span>
              <span className={timeLabelSmCss}>시각</span>
              <input
                type="time"
                value={getTime(period.end)}
                onChange={(e) =>
                  setPeriod((p) => ({ ...p, end: combine(getDate(p.end), e.target.value) }))
                }
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: colors.textPrimary, fontSize: "14px", flex: "1 1 0%",
                  colorScheme: "dark", minWidth: 0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className={toggleRowCss}>
          <div>
            <p className={toggleLabelCss}>접수 기간 외 강제 마감</p>
            <p className={toggleSubCss}>켜면 날짜 범위 밖에서 지원 폼이 잠깁니다.</p>
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

        {/* Preview */}
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

        <LoadingButton
          onClick={save}
          whileHover={saving ? undefined : { scale: 1.02 }}
          loading={saving}
          spinnerSize={14}
          className={cx(saveBtnBaseCss, saved ? saveBtnSavedCss : saveBtnNormalCss)}
        >
          {saving ? "저장 중…" : saved ? "✓ 저장 완료!" : "저장"}
        </LoadingButton>
      </div>

      {/* ─── 면접 / MT 설정 ─────────────────────────────────── */}
      <h2 className={sectionTitleCss}>면접 / MT 설정</h2>
      <div className={cardCss}>
        {/* MT 날짜 */}
        <div>
          <label className={labelCss}>MT 날짜</label>
          <input
            value={interview.mtDate}
            onChange={(e) => setInterview((p) => ({ ...p, mtDate: e.target.value }))}
            placeholder="ex) 11/23(토) ~ 11/24(일)"
            className={inputCss}
          />
        </div>

        {/* 면접 날짜 + 시간 그리드 */}
        <div>
          <label className={labelCss}>
            <Calendar size={12} />
            면접 날짜
          </label>
          <div className={addRowCss}>
            <input
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDate()}
              placeholder="ex) 3/22(토)"
              className={addInputCss}
            />
            <button onClick={addDate} className={addBtnCss}>
              <Plus size={14} />
              추가
            </button>
          </div>
          {interview.interviewDates.length > 0 && (
            <div className={chipsCss}>
              {interview.interviewDates.map((d, i) => (
                <span key={i} className={chipCss}>
                  {d}
                  <button onClick={() => removeDate(i)} className={chipXCss}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* when2meet 그리드 — 시간 행 클릭으로 토글 */}
        <div>
          <label className={labelCss}>
            <Clock size={12} />
            면접 시간대 <span style={{ fontWeight: "400", color: colors.textDimmest, marginLeft: "4px" }}>클릭해서 활성/비활성</span>
          </label>
          <div className={scrollTableWrapCss}>
            <table style={{ borderCollapse: "collapse", fontSize: "11px", width: "100%", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 12px 6px 0", color: colors.textDimmest, fontWeight: "700", textAlign: "left", whiteSpace: "nowrap", width: "90px", position: "sticky", left: 0, backgroundColor: colors.bgCard, zIndex: 1 }}>
                    시간대
                  </th>
                  {interview.interviewDates.length === 0 ? (
                    <th style={{ padding: "6px 10px", color: colors.textDimmest, fontWeight: "400", fontStyle: "italic", textAlign: "center" }}>
                      날짜를 추가하면 표시됩니다
                    </th>
                  ) : (
                    interview.interviewDates.map((d) => (
                      <th key={d} style={{ padding: "6px 10px", color: colors.textSecondary, fontWeight: "700", textAlign: "center", whiteSpace: "nowrap" }}>
                        {d}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {PRESET_TIMES.map((slot) => {
                  const active = interview.interviewTimes.includes(slot);
                  return (
                    <tr key={slot}>
                      <td style={{ padding: "3px 12px 3px 0", whiteSpace: "nowrap", position: "sticky", left: 0, backgroundColor: colors.bgCard, zIndex: 1 }}>
                        <button
                          onClick={() => toggleTime(slot)}
                          style={{
                            background: "none", border: "none", cursor: "pointer", padding: "0",
                            color: active ? "rgba(245,158,11,0.9)" : colors.textDimmest,
                            fontWeight: "700", fontSize: "11px",
                          }}
                        >
                          {slot}
                        </button>
                      </td>
                      {interview.interviewDates.length === 0 ? (
                        <td />
                      ) : (
                        interview.interviewDates.map((d) => (
                          <td key={d} style={{ padding: "3px 4px", textAlign: "center" }}>
                            <button
                              onClick={() => toggleTime(slot)}
                              style={{
                                width: "100%", minWidth: "64px", height: "26px",
                                borderRadius: "6px", border: "none", cursor: "pointer",
                                transition: "all 0.15s",
                                backgroundColor: active ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.03)",
                              }}
                            />
                          </td>
                        ))
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={countCss}>현재 {interview.interviewTimes.length}개 시간대 활성</p>
        </div>

        <LoadingButton
          onClick={save}
          whileHover={saving ? undefined : { scale: 1.02 }}
          loading={saving}
          spinnerSize={14}
          className={cx(saveBtnBaseCss, saved ? saveBtnSavedCss : saveBtnNormalCss)}
        >
          {saving ? "저장 중…" : saved ? "✓ 저장 완료!" : "저장"}
        </LoadingButton>
      </div>

      <p className={hintCss}>
        * 시작/종료 일시를 비워두면 기간 제한 없이 항상 열립니다.
        <br />* 설정 후 /apply 페이지에서 즉시 반영됩니다.
      </p>
    </div>
  );
}
