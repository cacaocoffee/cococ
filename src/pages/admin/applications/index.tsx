import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Trash2, ChevronDown, ChevronUp,
  Download, Search, ArrowUpDown, Calendar,
} from "lucide-react";
import { applyService } from "@/domain/apply/apply-service";
import type { ApplicationItem } from "@/domain/apply/apply-dto";
import { ConfirmModal, useConfirm } from "@/components/ui/Modal";
import LoadingButton from "@/components/ui/LoadingButton";
import TabSkeleton from "../components/TabSkeleton";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { STATUS_CFG } from "../constants";
import {
  listCss, tabHeaderRowCss, tabTitleCss,
  emptyStateCss, emptyIconCss, emptyTextCss,
  scrollTableWrapCss,
} from "../styles";

// Admin view uses the persisted ApplicationItem shape — extend with admin-only fields
interface AdminApplicationItem {
  id: string;
  submittedAt: string;
  status: string;
  generation?: number;
  name: string;
  gender: string;
  birthdate: string;
  phone: string;
  email: string;
  sns?: string;
  mtAvailable: string;
  howKnow?: string;
  mainContact: string;
  interviewTimes: string[];
  interviewSchedule?: string | null;
  scaleDesignTool?: number | null;
  scaleCameraTool?: number | null;
  mainDesign?: string;
  mainProject?: string;
  q1_intro?: string;
  q2_motivation?: string;
  q3_drink?: string;
  q4_contribution?: string;
  qEtc?: string;
}

// ─── Styles ───────────────────────────────────────────────────
const cardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  overflow: "hidden",
});
const headerCss = css({
  display: "flex", alignItems: "flex-start",
  gap: "16px", padding: "20px", cursor: "pointer",
});
const avatarCss = css({
  width: "40px", height: "40px", borderRadius: "9999px",
  backgroundColor: "rgba(245,158,11,0.1)", color: colors.brand,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "14px", fontWeight: "900", flexShrink: "0",
});
const infoCss = css({ flex: "1 1 0%", minWidth: "0" });
const nameRowCss = css({ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" });
const nameCss = css({ color: colors.textPrimary, fontWeight: "700", fontSize: "14px" });
const genderCss = css({ color: colors.textFaint, fontSize: "12px" });
const genChipCss = css({
  display: "inline-flex", alignItems: "center",
  backgroundColor: "rgba(245,158,11,0.12)",
  color: colors.brand,
  fontSize: "11px", fontWeight: "900",
  paddingInline: "8px", paddingBlock: "2px",
  borderRadius: "9999px",
  border: "1px solid rgba(245,158,11,0.22)",
});
const metaRowCss = css({
  display: "flex", gap: "8px", marginTop: "4px",
  flexWrap: "wrap", fontSize: "12px", color: colors.textFaint,
});
const sepCss = css({ color: colors.textDimmest });

// 확정 면접 일정 배지
const confirmedBadgeCss = css({
  display: "inline-flex", alignItems: "center", gap: "5px",
  backgroundColor: "rgba(52,211,153,0.12)",
  color: "#34d399", fontSize: "11px", fontWeight: "700",
  paddingInline: "8px", paddingBlock: "3px", borderRadius: "0.5rem",
  marginTop: "6px",
});

const actionsCss = css({ display: "flex", alignItems: "center", gap: "6px", flexShrink: "0" });
const chevronCss = css({ color: colors.textDimmer, flexShrink: "0" });
const expandBodyCss = css({ overflow: "hidden" });
const expandInnerCss = css({
  paddingInline: "20px", paddingBottom: "24px",
  borderTop: `1px solid ${colors.borderSubtle}`, paddingTop: "20px",
  display: "flex", flexDirection: "column", gap: "20px",
});

const grid4Css = css({
  display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px",
  "@md": { gridTemplateColumns: "repeat(4,1fr)" },
});
const grid2Css = css({
  display: "grid", gridTemplateColumns: "1fr", gap: "10px",
  "@md": { gridTemplateColumns: "repeat(2,1fr)" },
});
const infoItemCss = css({
  backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0.75rem", padding: "12px",
});
const infoItemLabelCss = css({
  color: colors.textDimmer, fontSize: "10px", fontWeight: "700", marginBottom: "4px",
});
const infoItemValueCss = css({
  color: colors.textPrimary, fontSize: "12px", fontWeight: "700",
  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
});
const infoItemValueWrapCss = css({
  color: colors.textPrimary, fontSize: "12px", fontWeight: "700",
  whiteSpace: "pre-wrap", wordBreak: "break-all",
});
const sectionLabelCss = css({
  fontSize: "11px", fontWeight: "900", color: colors.brand,
  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px",
});
const scaleRowCss = css({ display: "flex", gap: "12px" });
const scaleCardCss = css({
  backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0.75rem",
  padding: "16px", flex: "1 1 0%", textAlign: "center",
});
const scaleLabelCss = css({ color: colors.textFaint, fontSize: "12px", marginBottom: "4px" });
const scaleValueCss = css({ color: colors.brand, fontSize: "24px", fontWeight: "900" });
const scaleUnitCss = css({ color: colors.textDimmer, fontSize: "10px" });
const qaBodyCss = css({
  color: colors.textSecondary, fontSize: "13px", lineHeight: "1.7",
  backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0.75rem",
  padding: "14px", whiteSpace: "pre-wrap",
});
const visionTagCss = css({
  display: "inline-block",
  backgroundColor: "rgba(245,158,11,0.12)", color: colors.brand,
  fontSize: "12px", fontWeight: "700",
  paddingInline: "10px", paddingBlock: "5px", borderRadius: "0.5rem",
});
const statusBtnBaseCss = css({
  fontSize: "10px", fontWeight: "900",
  paddingInline: "10px", paddingBlock: "5px",
  borderRadius: "9999px", border: "1px solid",
  transition: "all 0.2s", cursor: "pointer", background: "none", whiteSpace: "nowrap",
});
const statusBtnInactiveCss = css({
  color: colors.textDimmer, borderColor: colors.borderStrong,
  _hover: { color: colors.textPrimary },
});
const deleteBtnCss = css({
  width: "30px", height: "30px", borderRadius: "9999px",
  backgroundColor: colors.dangerBg, color: colors.dangerMuted,
  border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  marginLeft: "4px", transition: "background-color 0.2s",
  _hover: { backgroundColor: "rgba(239,68,68,0.2)" },
});


// ─── 면접 일정 그리드 (when2meet 스타일) ──────────────────────
interface InterviewScheduleEditorProps {
  app: AdminApplicationItem;
  onSave: (value: string | null) => void;
  settings: { interviewDates: string[]; interviewTimes: string[] };
}

function InterviewScheduleEditor({ app, onSave, settings }: InterviewScheduleEditorProps) {
  const { interviewDates: dates, interviewTimes: times } = settings;
  const available = new Set(app.interviewTimes ?? []);
  const confirmed = app.interviewSchedule;

  const handleClick = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (!available.has(key)) return;
    onSave(confirmed === key ? null : key);
  };

  return (
    <div
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      className={scrollTableWrapCss}
    >
      <table className={css({ borderCollapse: "collapse", fontSize: "11px", width: "100%", tableLayout: "fixed" })}>
        <thead>
          <tr>
            <th className={css({ padding: "6px 10px", color: colors.textDimmest, fontWeight: "700", textAlign: "left", whiteSpace: "nowrap", width: "90px", position: "sticky", left: 0, backgroundColor: colors.bgCard, zIndex: 1 })} />
            {dates.map((d) => (
              <th key={d} className={css({ padding: "6px 10px", color: colors.textSecondary, fontWeight: "700", textAlign: "center", whiteSpace: "nowrap" })}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((t) => (
            <tr key={t}>
              <td className={css({ padding: "3px 10px 3px 0", color: colors.textDimmer, fontWeight: "700", whiteSpace: "nowrap", paddingRight: "12px", position: "sticky", left: 0, backgroundColor: colors.bgCard, zIndex: 1 })}>
                {t}
              </td>
              {dates.map((d) => {
                const key = `${d}__${t}`;
                const isAvail = available.has(key);
                const isConfirmed = confirmed === key;
                return (
                  <td key={d} className={css({ padding: "3px 4px", textAlign: "center" })}>
                    <button
                      onClick={(e: React.MouseEvent) => handleClick(e, key)}
                      title={isAvail ? (isConfirmed ? "확정 해제" : "확정") : "지원자 불가"}
                      className={css({
                        width: "100%", minWidth: "64px", height: "28px",
                        borderRadius: "6px", border: "none",
                        cursor: isAvail ? "pointer" : "default",
                        transition: "all 0.15s",
                        fontWeight: "800", fontSize: "10px",
                        backgroundColor: isConfirmed
                          ? "rgba(52,211,153,0.3)"
                          : isAvail
                          ? "rgba(245,158,11,0.18)"
                          : "rgba(255,255,255,0.03)",
                        color: isConfirmed
                          ? "#34d399"
                          : isAvail
                          ? "rgba(245,158,11,0.85)"
                          : "transparent",
                        outline: isConfirmed ? "1.5px solid #34d399" : "none",
                        _hover: isAvail && !isConfirmed ? { backgroundColor: "rgba(245,158,11,0.32)" } : {},
                      })}
                    >
                      {isConfirmed ? "✓ 확정" : isAvail ? "가능" : ""}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ApplicationRow ───────────────────────────────────────────
interface ApplicationRowProps {
  app: AdminApplicationItem;
  onStatusChange: (id: string, status: string) => void;
  onSaveField: (id: string, fields: Partial<AdminApplicationItem>) => void;
  onDelete: (id: string) => void;
  settings: { interviewDates: string[]; interviewTimes: string[] };
  pending?: boolean;
}

function ApplicationRow({ app, onStatusChange, onSaveField, onDelete, settings, pending = false }: ApplicationRowProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const statusConfig = STATUS_CFG[app.status] ?? STATUS_CFG.pending;
  const StatusIcon = statusConfig.icon;
  const isPass1 = app.status === "pass1";

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cardCss}>
      <div className={headerCss} onClick={() => setExpanded((p) => !p)}>
        <div className={avatarCss}>{app.name?.[0] ?? "?"}</div>
        <div className={infoCss}>
          <div className={nameRowCss}>
            {app.generation ? (
              <span className={genChipCss}>{app.generation}기</span>
            ) : null}
            <span className={nameCss}>{app.name || "이름 없음"}</span>
            <span className={genderCss}>{app.gender}</span>
            <span
              className={cx(
                statusBtnBaseCss,
                css({
                  backgroundColor: statusConfig.bg,
                  color: statusConfig.color,
                  borderColor: "transparent",
                  display: "inline-flex", alignItems: "center", gap: "4px",
                }),
              )}
            >
              <StatusIcon size={10} /> {statusConfig.label}
            </span>
          </div>
          <div className={metaRowCss}>
            <span>{app.phone}</span>
            <span className={sepCss}>·</span>
            <span>{app.email}</span>
            <span className={sepCss}>·</span>
            <span>{new Date(app.submittedAt).toLocaleString("ko-KR")}</span>
          </div>
          {/* 확정 면접 일정 배지 (pass1만) */}
          {isPass1 && app.interviewSchedule && (
            <div className={confirmedBadgeCss}>
              <Calendar size={11} />
              {app.interviewSchedule.replace("__", " ")}
            </div>
          )}
        </div>
        <div className={actionsCss} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          {["pending", "pass1", "pass2", "fail"].map((statusKey) => (
            <LoadingButton
              key={statusKey}
              onClick={() => onStatusChange(app.id, statusKey)}
              loading={pending && app.status !== statusKey}
              spinnerSize={9}
              className={cx(
                statusBtnBaseCss,
                app.status === statusKey
                  ? css({
                      backgroundColor: STATUS_CFG[statusKey].bg,
                      color: STATUS_CFG[statusKey].color,
                      borderColor: "transparent",
                    })
                  : statusBtnInactiveCss,
              )}
            >
              {STATUS_CFG[statusKey].label}
            </LoadingButton>
          ))}
          <LoadingButton
            onClick={() => onDelete(app.id)}
            className={deleteBtnCss}
            loading={pending}
            spinnerSize={11}
          >
            <Trash2 size={13} />
          </LoadingButton>
        </div>
        <div className={chevronCss}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={expandBodyCss}
          >
            <div className={expandInnerCss}>
              {/* 1차 합격자: 면접 일정 설정 */}
              {isPass1 && (
                <div>
                  <p className={sectionLabelCss}>면접 일정 (확정)</p>
                  <InterviewScheduleEditor
                    app={app}
                    settings={settings}
                    onSave={(v) => onSaveField(app.id, { interviewSchedule: v || null })}
                  />
                </div>
              )}

              {/* 인적사항 */}
              <div>
                <p className={sectionLabelCss}>인적사항</p>
                <div className={grid4Css}>
                  {([
                    ["이름", app.name],
                    ["성별", app.gender],
                    ["생년월일", app.birthdate],
                    ["연락처", app.phone],
                    ["이메일", app.email],
                    ["SNS", app.sns || "—"],
                    ["MT 참가", app.mtAvailable],
                    ["코콕 알게 된 경로", app.howKnow],
                    ["주 소통수단", app.mainContact],
                  ] as [string, string | undefined][]).map(([label, value]) => (
                    <div key={label} className={infoItemCss}>
                      <p className={infoItemLabelCss}>{label}</p>
                      <p className={infoItemValueCss}>{value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 역량 */}
              <div>
                <p className={sectionLabelCss}>역량</p>
                <div className={scaleRowCss}>
                  <div className={scaleCardCss}>
                    <p className={scaleLabelCss}>디자인 툴 활용 능력</p>
                    <p className={scaleValueCss}>{app.scaleDesignTool ?? "—"}</p>
                    <p className={scaleUnitCss}>/ 5</p>
                  </div>
                  <div className={scaleCardCss}>
                    <p className={scaleLabelCss}>사진/영상 촬영 능력</p>
                    <p className={scaleValueCss}>{app.scaleCameraTool ?? "—"}</p>
                    <p className={scaleUnitCss}>/ 5</p>
                  </div>
                </div>
                <div className={css({ marginTop: "10px" })}>
                  <div className={grid2Css}>
                    <div className={infoItemCss}>
                      <p className={infoItemLabelCss}>주로 활용하는 디자인 툴</p>
                      <p className={infoItemValueWrapCss}>{app.mainDesign || "—"}</p>
                    </div>
                    <div className={infoItemCss}>
                      <p className={infoItemLabelCss}>사진/영상 프로젝트 기획 경험</p>
                      <p className={infoItemValueWrapCss}>{app.mainProject || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 자기소개 - 순서: Q1 → Q2 → Q3-1 → Q3-2 → 기타 */}
              {app.q1_intro && (
                <div>
                  <p className={sectionLabelCss}>Q1. 자기소개</p>
                  <p className={qaBodyCss}>{app.q1_intro}</p>
                </div>
              )}
              {app.q2_motivation && (
                <div>
                  <p className={sectionLabelCss}>Q2. 코콕 지원 동기 / 좋아하는 술</p>
                  <p className={qaBodyCss}>{app.q2_motivation}</p>
                </div>
              )}
              {app.q3_drink && (
                <div>
                  <p className={sectionLabelCss}>Q3-1. 공감하는 코콕 비전</p>
                  <span className={visionTagCss}>{app.q3_drink}</span>
                </div>
              )}
              {app.q4_contribution && (
                <div>
                  <p className={sectionLabelCss}>Q3-2. 코콕에서의 기여 방향</p>
                  <p className={qaBodyCss}>{app.q4_contribution}</p>
                </div>
              )}
              {app.qEtc && (
                <div>
                  <p className={sectionLabelCss}>기타 문의</p>
                  <p className={qaBodyCss}>{app.qEtc}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── ApplicationsTab ──────────────────────────────────────────
const exportBtnCss = css({
  display: "flex", alignItems: "center", gap: "8px",
  backgroundColor: colors.bgCard, border: `1px solid ${colors.borderStrong}`,
  color: colors.textSecondary, paddingInline: "16px", paddingBlock: "10px",
  borderRadius: "0.75rem", fontSize: "14px", fontWeight: "700",
  cursor: "pointer", transition: "color 0.2s",
  _hover: { color: colors.textPrimary },
});
const statsGridCss = css({
  display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px", marginBottom: "24px",
  "@md": { gridTemplateColumns: "repeat(5,1fr)" },
});
const statCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem", padding: "20px",
});
const statLabelCss = css({ color: colors.textFaint, fontSize: "12px", fontWeight: "700", marginBottom: "8px" });
const statValueBaseCss = css({ fontSize: "28px", fontWeight: "900" });
const filterRowCss = css({
  display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", alignItems: "center",
});
const chipBaseCss = css({
  paddingInline: "14px", paddingBlock: "6px", borderRadius: "9999px",
  fontSize: "12px", fontWeight: "700", transition: "all 0.2s", border: "none", cursor: "pointer",
});
const chipActiveCss = css({ backgroundColor: colors.brand, color: colors.bgPage });
const chipInactiveCss = css({
  backgroundColor: colors.bgCard, color: colors.textMuted,
  border: `1px solid ${colors.borderLight}`,
  _hover: { color: colors.textPrimary },
});
const searchWrapCss = css({
  marginLeft: "auto",
  position: "relative",
  flex: "1 1 200px",
  maxWidth: "240px",
});
const searchInputCss = css({
  backgroundColor: colors.bgCard, border: `1px solid ${colors.borderLight}`,
  color: colors.textPrimary, fontSize: "12px",
  paddingBlock: "8px", paddingLeft: "36px", paddingRight: "16px",
  borderRadius: "0.5rem", outline: "none", width: "100%",
  transition: "border-color 0.2s", _focus: { borderColor: colors.brand },
});
const searchIconCss = css({
  position: "absolute", left: "12px", top: "50%",
  transform: "translateY(-50%)", color: colors.textDimmer, pointerEvents: "none",
});
const sortBtnCss = css({
  display: "flex", alignItems: "center", gap: "6px",
  backgroundColor: colors.bgCard, border: `1px solid ${colors.borderStrong}`,
  color: colors.textMuted, paddingInline: "12px", paddingBlock: "6px",
  borderRadius: "0.5rem", fontSize: "12px", fontWeight: "700",
  cursor: "pointer", transition: "color 0.2s",
  _hover: { color: colors.textPrimary },
});
const sortActiveCss = css({ color: "#34d399", borderColor: "#34d399" });

export default function ApplicationsTab() {
  const [apps, setApps] = useState<AdminApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<{ interviewDates: string[]; interviewTimes: string[] }>(
    () => applyService.DEFAULT_INTERVIEW_SETTINGS,
  );
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genFilter, setGenFilter] = useState<number | "all">("all");
  // sort: null | "asc" | "desc" — 면접일 기준, pass1+interviewSchedule 있는 사람에게만 적용
  const [interviewSort, setInterviewSort] = useState<"asc" | "desc" | null>(null);
  // 진행 중인 행 ID — 같은 row 의 모든 액션 버튼을 disabled + spinner 처리
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const { confirmProps, openConfirm } = useConfirm();

  const withPending = useCallback(async (id: string, fn: () => Promise<void>) => {
    setPendingIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      await fn();
    } finally {
      setPendingIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const refreshApps = useCallback(async () => {
    const data = await applyService.loadApplications();
    setApps(data as unknown as AdminApplicationItem[]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void Promise.all([
      applyService.loadApplications(),
      applyService.loadInterviewSettings(),
    ])
      .then(([data, s]) => {
        if (cancelled) return;
        setApps(data as unknown as AdminApplicationItem[]);
        if (s) setSettings(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // 기수 필터 적용된 베이스 — 통계/CSV/목록 모두 이걸 기반으로
  const byGen = genFilter === "all"
    ? apps
    : apps.filter((a) => a.generation === genFilter);

  // 등록된 모든 기수(내림차순) — 칩으로 표시
  const generations = [
    ...new Set(
      apps
        .map((a) => a.generation)
        .filter((g): g is number => typeof g === "number" && g > 0),
    ),
  ].sort((a, b) => b - a);

  const counts = {
    total: byGen.length,
    pending: byGen.filter((a) => a.status === "pending").length,
    pass1: byGen.filter((a) => a.status === "pass1").length,
    pass2: byGen.filter((a) => a.status === "pass2").length,
    fail: byGen.filter((a) => a.status === "fail").length,
  };

  const cycleInterviewSort = () => {
    setInterviewSort((prev) =>
      prev === null ? "desc" : prev === "desc" ? "asc" : null
    );
  };

  const sortLabel =
    interviewSort === "desc" ? "면접일 내림차순"
    : interviewSort === "asc" ? "면접일 오름차순"
    : "면접일 정렬";

  const filtered = byGen.filter((app) => {
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    const matchSearch =
      !search ||
      app.name?.includes(search) ||
      app.email?.includes(search) ||
      app.phone?.includes(search);
    return matchStatus && matchSearch;
  });

  const sorted = (() => {
    if (!interviewSort) return filtered;
    // 확정 면접 일정 있는 pass1만 앞으로, 나머지 뒤
    const withSchedule = filtered.filter((a) => a.status === "pass1" && a.interviewSchedule);
    const without = filtered.filter((a) => !(a.status === "pass1" && a.interviewSchedule));
    withSchedule.sort((a, b) => {
      const cmp = (a.interviewSchedule ?? "").localeCompare(b.interviewSchedule ?? "");
      return interviewSort === "desc" ? -cmp : cmp;
    });
    return [...withSchedule, ...without];
  })();

  const exportCSV = () => {
    // RFC 4180: 모든 셀을 큰따옴표로 감싸고 내부 따옴표는 두 번 반복
    const escape = (v: unknown): string => {
      if (v === null || v === undefined) return "";
      return `"${String(v).replace(/"/g, '""')}"`;
    };
    const header = [
      "기수", "제출일시", "이름", "성별", "생년월일", "전화", "이메일", "SNS",
      "MT가능", "코콕알게된경로", "주연락수단",
      "가능시간", "확정면접시간",
      "디자인툴능력", "주활용디자인툴",
      "사진영상능력", "프로젝트기획경험",
      "자기소개", "지원동기", "비전선택", "기여방향", "기타",
      "상태",
    ];
    // 제출일시 내림차순(최신순) — 현재 선택된 기수 필터를 따름
    const ordered = [...byGen].sort((a, b) =>
      (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""),
    );
    const rows = ordered.map((app) => [
      app.generation ?? "",
      new Date(app.submittedAt).toLocaleString("ko-KR"),
      app.name, app.gender, app.birthdate, app.phone, app.email, app.sns,
      app.mtAvailable, app.howKnow, app.mainContact,
      (app.interviewTimes || []).map((k) => k.replace("__", " ")).join(", "),
      app.interviewSchedule ? app.interviewSchedule.replace("__", " ") : "",
      app.scaleDesignTool, app.mainDesign,
      app.scaleCameraTool, app.mainProject,
      app.q1_intro, app.q2_motivation, app.q3_drink, app.q4_contribution, app.qEtc,
      STATUS_CFG[app.status]?.label ?? app.status,
    ]);
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    a.download = `applications-${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statItems: [string, number, string][] = [
    ["전체", counts.total, colors.textPrimary],
    ["검토 중", counts.pending, "#facc15"],
    ["1차 합격", counts.pass1, "#34d399"],
    ["2차 합격", counts.pass2, "#10b981"],
    ["불합격", counts.fail, colors.dangerMuted],
  ];

  if (loading) {
    return (
      <div>
        <div className={tabHeaderRowCss}>
          <h2 className={tabTitleCss}>지원서 목록</h2>
        </div>
        <TabSkeleton variant="cards" count={5} />
      </div>
    );
  }

  return (
    <div>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>지원서 목록</h2>
        <div className={css({ display: "flex", gap: "8px" })}>
          <motion.button
            onClick={cycleInterviewSort}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cx(sortBtnCss, interviewSort && sortActiveCss)}
          >
            <ArrowUpDown size={13} /> {sortLabel}
          </motion.button>
          <motion.button
            onClick={exportCSV}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={exportBtnCss}
          >
            <Download size={15} /> CSV
          </motion.button>
        </div>
      </div>

      <div className={statsGridCss}>
        {statItems.map(([label, value, color]) => (
          <div key={label} className={statCardCss}>
            <p className={statLabelCss}>{label}</p>
            <p className={cx(statValueBaseCss, css({ color }))}>{value}</p>
          </div>
        ))}
      </div>

      {generations.length > 0 && (
        <div className={cx(filterRowCss, css({ marginBottom: "8px" }))}>
          <button
            onClick={() => setGenFilter("all")}
            className={cx(chipBaseCss, genFilter === "all" ? chipActiveCss : chipInactiveCss)}
          >
            전체 기수
          </button>
          {generations.map((g) => (
            <button
              key={g}
              onClick={() => setGenFilter(g)}
              className={cx(chipBaseCss, genFilter === g ? chipActiveCss : chipInactiveCss)}
            >
              {g}기
            </button>
          ))}
        </div>
      )}

      <div className={filterRowCss}>
        {(
          [
            ["all", "전체"],
            ["pending", "검토 중"],
            ["pass1", "1차 합격"],
            ["pass2", "2차 합격"],
            ["fail", "불합격"],
          ] as [string, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cx(chipBaseCss, statusFilter === key ? chipActiveCss : chipInactiveCss)}
          >
            {label}
          </button>
        ))}
        <div className={searchWrapCss}>
          <input
            type="text"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 연락처"
            className={searchInputCss}
          />
          <span className={searchIconCss}>
            <Search size={14} />
          </span>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className={emptyStateCss}>
          <div className={emptyIconCss}><Users size={40} /></div>
          <p className={emptyTextCss}>
            {apps.length === 0 ? "아직 접수된 지원서가 없습니다." : "검색 결과가 없습니다."}
          </p>
        </div>
      ) : (
        <div className={listCss}>
          {sorted.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              settings={settings}
              pending={pendingIds.has(app.id)}
              onStatusChange={(id, newStatus) => {
                if (pendingIds.has(id)) return;
                if (apps.find((a) => a.id === id)?.status === newStatus) return;
                void withPending(id, async () => {
                  await applyService.updateStatus(id, newStatus as ApplicationItem["status"]);
                  await refreshApps();
                });
              }}
              onSaveField={(id, fields) => {
                if (pendingIds.has(id)) return;
                void withPending(id, async () => {
                  await applyService.updateFields(
                    id,
                    fields as Parameters<typeof applyService.updateFields>[1],
                  );
                  await refreshApps();
                });
              }}
              onDelete={(id) => {
                if (pendingIds.has(id)) return;
                openConfirm({
                  title: "지원서를 삭제하시겠습니까?",
                  description: "삭제한 지원서는 복구할 수 없습니다.",
                  onConfirm: () => {
                    void withPending(id, async () => {
                      await applyService.deleteApplication(id);
                      await refreshApps();
                    });
                  },
                });
              }}
            />
          ))}
        </div>
      )}
      <ConfirmModal {...confirmProps} />
    </div>
  );
}
