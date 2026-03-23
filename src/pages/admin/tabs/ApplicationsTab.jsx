import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
} from "lucide-react";
import {
  loadApplications,
  updateStatus,
  deleteApplication,
} from "../../../hooks/useApplications";
import { ConfirmModal, useConfirm } from "../../../components/ui/Modal";
import { css, cx } from "../../../lib/css";
import { colors } from "../../../lib/tokens";
import { STATUS_CFG } from "../constants";
import {
  listCss,
  tabHeaderRowCss,
  tabTitleCss,
  emptyStateCss,
  emptyIconCss,
  emptyTextCss,
} from "../styles";

// ─── Shared row styles ────────────────────────────────────────
const cardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  overflow: "hidden",
});
const headerCss = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "20px",
  cursor: "pointer",
});
const avatarCss = css({
  width: "40px",
  height: "40px",
  borderRadius: "9999px",
  backgroundColor: "rgba(245,158,11,0.1)",
  color: colors.brand,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "900",
  flexShrink: "0",
});
const infoCss = css({ flex: "1 1 0%", minWidth: "0" });
const nameRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});
const nameCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
  fontSize: "14px",
});
const genderCss = css({ color: colors.textFaint, fontSize: "12px" });
const metaRowCss = css({
  display: "flex",
  gap: "8px",
  marginTop: "4px",
  flexWrap: "wrap",
  fontSize: "12px",
  color: colors.textFaint,
});
const sepCss = css({ color: colors.textDimmest });
const actionsCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: "0",
});
const chevronCss = css({ color: colors.textDimmer, flexShrink: "0" });
const expandBodyCss = css({ overflow: "hidden" });
const expandInnerCss = css({
  paddingInline: "20px",
  paddingBottom: "24px",
  borderTop: `1px solid ${colors.borderSubtle}`,
  paddingTop: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const grid4Css = css({
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: "12px",
  "@md": { gridTemplateColumns: "repeat(4,1fr)" },
});
const infoItemCss = css({
  backgroundColor: "rgba(0,0,0,0.2)",
  borderRadius: "0.75rem",
  padding: "12px",
});
const infoItemLabelCss = css({
  color: colors.textDimmer,
  fontSize: "10px",
  fontWeight: "700",
  marginBottom: "4px",
});
const infoItemValueCss = css({
  color: colors.textPrimary,
  fontSize: "12px",
  fontWeight: "700",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const sectionLabelCss = css({
  fontSize: "11px",
  fontWeight: "900",
  color: colors.brand,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "8px",
});
const tagRowCss = css({ display: "flex", flexWrap: "wrap", gap: "8px" });
const timeTagCss = css({
  backgroundColor: "rgba(245,158,11,0.1)",
  color: "rgba(245,158,11,0.9)",
  fontSize: "12px",
  fontWeight: "700",
  paddingInline: "8px",
  paddingBlock: "4px",
  borderRadius: "0.5rem",
});

const scaleRowCss = css({ display: "flex", gap: "16px" });
const scaleCardCss = css({
  backgroundColor: "rgba(0,0,0,0.2)",
  borderRadius: "0.75rem",
  padding: "16px",
  flex: "1 1 0%",
  textAlign: "center",
});
const scaleLabelCss = css({
  color: colors.textFaint,
  fontSize: "12px",
  marginBottom: "4px",
});
const scaleValueCss = css({
  color: colors.brand,
  fontSize: "24px",
  fontWeight: "900",
});
const scaleUnitCss = css({ color: colors.textDimmer, fontSize: "10px" });
const scaleTextCss = css({
  color: colors.textPrimary,
  fontSize: "12px",
  fontWeight: "700",
  marginTop: "8px",
});

const qaBodyCss = css({
  color: colors.textSecondary,
  fontSize: "14px",
  lineHeight: "1.625",
  backgroundColor: "rgba(0,0,0,0.2)",
  borderRadius: "0.75rem",
  padding: "16px",
  whiteSpace: "pre-wrap",
});

const statusBtnBaseCss = css({
  fontSize: "10px",
  fontWeight: "900",
  paddingInline: "12px",
  paddingBlock: "6px",
  borderRadius: "9999px",
  border: "1px solid",
  transition: "all 0.2s",
  cursor: "pointer",
  background: "none",
});
const statusBtnInactiveCss = css({
  color: colors.textDimmer,
  borderColor: colors.borderStrong,
  _hover: { color: colors.textPrimary },
});
const deleteBtnCss = css({
  width: "32px",
  height: "32px",
  borderRadius: "9999px",
  backgroundColor: colors.dangerBg,
  color: colors.dangerMuted,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "4px",
  transition: "background-color 0.2s",
  _hover: { backgroundColor: "rgba(239,68,68,0.2)" },
});

// ─── ApplicationRow ───────────────────────────────────────────
function ApplicationRow({ app, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CFG[app.status];
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cardCss}
    >
      <div className={headerCss} onClick={() => setExpanded((prev) => !prev)}>
        <div className={avatarCss}>{app.name?.[0] ?? "?"}</div>
        <div className={infoCss}>
          <div className={nameRowCss}>
            <span className={nameCss}>{app.name || "이름 없음"}</span>
            <span className={genderCss}>{app.gender}</span>
            <span
              className={cx(
                statusBtnBaseCss,
                css({
                  backgroundColor: statusConfig.bg,
                  color: statusConfig.color,
                  borderColor: "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
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
        </div>
        <div className={actionsCss} onClick={(e) => e.stopPropagation()}>
          {["pending", "pass", "fail"].map((statusKey) => (
            <motion.button
              key={statusKey}
              whileTap={{ scale: 0.93 }}
              onClick={() => onStatusChange(app.id, statusKey)}
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
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => onDelete(app.id)}
            className={deleteBtnCss}
          >
            <Trash2 size={13} />
          </motion.button>
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
              <div className={grid4Css}>
                {[
                  ["이름", app.name],
                  ["성별", app.gender],
                  ["생년월일", app.birthdate],
                  ["연락처", app.phone],
                  ["이메일", app.email],
                  ["SNS", app.sns || "—"],
                  ["MT 참가", app.mtAvailable],
                  ["주 소통수단", app.mainContact],
                ].map(([label, value]) => (
                  <div key={label} className={infoItemCss}>
                    <p className={infoItemLabelCss}>{label}</p>
                    <p className={infoItemValueCss}>{value || "—"}</p>
                  </div>
                ))}
              </div>

              {app.availableTimes?.length > 0 && (
                <div>
                  <p className={sectionLabelCss}>활동 가능 시간</p>
                  <div className={tagRowCss}>
                    {app.availableTimes.map((timeKey) => {
                      const [day, time] = timeKey.split("_");
                      return (
                        <span key={timeKey} className={timeTagCss}>
                          {day} {time}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={scaleRowCss}>
                <div className={scaleCardCss}>
                  <p className={scaleLabelCss}>다식가 정도</p>
                  <p className={scaleValueCss}>{app.scaleGourmet ?? "—"}</p>
                  <p className={scaleUnitCss}>/ 5</p>
                </div>
                <div className={scaleCardCss}>
                  <p className={scaleLabelCss}>사람 됨됨이 중요도</p>
                  <p className={scaleValueCss}>{app.scalePeople ?? "—"}</p>
                  <p className={scaleUnitCss}>/ 5</p>
                </div>
                <div className={scaleCardCss}>
                  <p className={scaleLabelCss}>활동 스타일</p>
                  <p className={scaleTextCss}>{app.q3_1_style || "—"}</p>
                </div>
              </div>

              {[
                ["Q1. 자기소개 / 진로", app.q1_intro],
                ["Q2. 좋아하는 술", app.q2_drink],
                ["Q3-2. 지원 이유", app.q3_2_reason],
                ["기타 문의", app.qEtc],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <p className={sectionLabelCss}>{label}</p>
                    <p className={qaBodyCss}>{value}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── ApplicationsTab ──────────────────────────────────────────
const exportBtnCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderStrong}`,
  color: colors.textSecondary,
  paddingInline: "16px",
  paddingBlock: "10px",
  borderRadius: "0.75rem",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "color 0.2s",
  _hover: { color: colors.textPrimary },
});
const statsGridCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: "12px",
  marginBottom: "24px",
  "@md": { gridTemplateColumns: "repeat(4,1fr)" },
});
const statCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "20px",
});
const statLabelCss = css({
  color: colors.textFaint,
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "8px",
});
const statValueBaseCss = css({ fontSize: "30px", fontWeight: "900" });
const filterRowCss = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "20px",
  alignItems: "center",
});
const chipBaseCss = css({
  paddingInline: "16px",
  paddingBlock: "6px",
  borderRadius: "9999px",
  fontSize: "12px",
  fontWeight: "700",
  transition: "all 0.2s",
  border: "none",
  cursor: "pointer",
});
const chipActiveCss = css({
  backgroundColor: colors.brand,
  color: colors.bgPage,
});
const chipInactiveCss = css({
  backgroundColor: colors.bgCard,
  color: colors.textMuted,
  border: `1px solid ${colors.borderLight}`,
  _hover: { color: colors.textPrimary },
});
const searchWrapCss = css({ marginLeft: "auto", position: "relative" });
const searchInputCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  color: colors.textPrimary,
  fontSize: "12px",
  paddingBlock: "8px",
  paddingLeft: "36px",
  paddingRight: "16px",
  borderRadius: "0.5rem",
  outline: "none",
  width: "192px",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.brand },
});
const searchIconCss = css({
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: colors.textDimmer,
  pointerEvents: "none",
});

export default function ApplicationsTab() {
  const [apps, setApps] = useState(loadApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { confirmProps, openConfirm } = useConfirm();

  const counts = {
    total: apps.length,
    pending: apps.filter((app) => app.status === "pending").length,
    pass: apps.filter((app) => app.status === "pass").length,
    fail: apps.filter((app) => app.status === "fail").length,
  };

  const filteredApps = apps.filter((app) => {
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    const matchSearch =
      !search ||
      app.name?.includes(search) ||
      app.email?.includes(search) ||
      app.phone?.includes(search);
    return matchStatus && matchSearch;
  });

  const exportCSV = () => {
    const header = [
      "이름",
      "성별",
      "생년월일",
      "연락처",
      "이메일",
      "SNS",
      "MT참가",
      "주소통수단",
      "다식가점수",
      "됨됨이점수",
      "활동스타일",
      "자기소개",
      "좋아하는술",
      "지원이유",
      "기타",
      "상태",
      "접수일시",
    ];
    const rows = apps.map((app) => [
      app.name,
      app.gender,
      app.birthdate,
      app.phone,
      app.email,
      app.sns,
      app.mtAvailable,
      app.mainContact,
      app.scaleGourmet,
      app.scalePeople,
      app.q3_1_style,
      `"${(app.q1_intro || "").replace(/"/g, '""')}"`,
      `"${(app.q2_drink || "").replace(/"/g, '""')}"`,
      `"${(app.q3_2_reason || "").replace(/"/g, '""')}"`,
      `"${(app.qEtc || "").replace(/"/g, '""')}"`,
      STATUS_CFG[app.status].label,
      new Date(app.submittedAt).toLocaleString("ko-KR"),
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "cococ_지원서.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  const statColors = [
    colors.textPrimary,
    "#facc15",
    colors.successMuted,
    colors.dangerMuted,
  ];

  return (
    <div>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>지원서 목록</h2>
        <motion.button
          onClick={exportCSV}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={exportBtnCss}
        >
          <Download size={15} /> CSV 내보내기
        </motion.button>
      </div>

      <div className={statsGridCss}>
        {[
          ["전체", counts.total],
          ["검토 중", counts.pending],
          ["합격", counts.pass],
          ["불합격", counts.fail],
        ].map(([label, value], index) => (
          <div key={label} className={statCardCss}>
            <p className={statLabelCss}>{label}</p>
            <p className={cx(statValueBaseCss, css({ color: statColors[index] }))}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className={filterRowCss}>
        {[
          ["all", "전체"],
          ["pending", "검토 중"],
          ["pass", "합격"],
          ["fail", "불합격"],
        ].map(([statusKey, statusLabel]) => (
          <button
            key={statusKey}
            onClick={() => setStatusFilter(statusKey)}
            className={cx(
              chipBaseCss,
              statusFilter === statusKey ? chipActiveCss : chipInactiveCss,
            )}
          >
            {statusLabel}
          </button>
        ))}
        <div className={searchWrapCss}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 연락처"
            className={searchInputCss}
          />
          <span className={searchIconCss}>
            <Search size={14} />
          </span>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className={emptyStateCss}>
          <div className={emptyIconCss}>
            <Users size={40} />
          </div>
          <p className={emptyTextCss}>
            {apps.length === 0
              ? "아직 접수된 지원서가 없습니다."
              : "검색 결과가 없습니다."}
          </p>
        </div>
      ) : (
        <div className={listCss}>
          {filteredApps.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onStatusChange={(id, newStatus) => setApps(updateStatus(id, newStatus))}
              onDelete={(id) =>
                openConfirm({
                  title: "지원서를 삭제하시겠습니까?",
                  description: "삭제한 지원서는 복구할 수 없습니다.",
                  onConfirm: () => setApps(deleteApplication(id)),
                })
              }
            />
          ))}
        </div>
      )}
      <ConfirmModal {...confirmProps} />
    </div>
  );
}
