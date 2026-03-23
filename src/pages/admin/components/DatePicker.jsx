import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { css, cx } from "../../../lib/css";
import { colors } from "../../../lib/tokens";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

function getDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDay(y, m) {
  return new Date(y, m, 1).getDay();
}
function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return { y, m: m - 1, d };
}
function todayStr() {
  const t = new Date();
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}

// ─── Trigger button ────────────────────────────────────────────
const triggerCss = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.35)",
  border: `1px solid ${colors.borderInput}`,
  borderRadius: "0.75rem",
  paddingInline: "14px",
  paddingBlock: "11px",
  cursor: "pointer",
  transition: "border-color 0.2s",
  _hover: { borderColor: "rgba(245,158,11,0.4)" },
});
const triggerOpenCss = css({ borderColor: colors.brand });
const triggerIconCss = css({ color: colors.textFaint, flexShrink: "0" });
const triggerTextCss = css({
  flex: "1 1 0%",
  textAlign: "left",
  fontSize: "14px",
  color: colors.textPrimary,
});
const triggerPlaceholderCss = css({ color: colors.textDimmer });

// ─── Dropdown wrapper ──────────────────────────────────────────
const dropWrapCss = css({ position: "relative" });
const dropCss = css({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: "0",
  zIndex: "100",
  backgroundColor: colors.bgCard,
  border: `1px solid rgba(255,255,255,0.08)`,
  borderRadius: "1rem",
  padding: "20px",
  width: "300px",
  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
});

// ─── Calendar header ───────────────────────────────────────────
const calHeaderCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
});
const calNavBtnCss = css({
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.5rem",
  border: "none",
  background: "none",
  cursor: "pointer",
  color: colors.textMuted,
  transition: "all 0.15s",
  _hover: { backgroundColor: "rgba(255,255,255,0.06)", color: colors.textPrimary },
});
const calMonthCss = css({
  fontSize: "15px",
  fontWeight: "900",
  color: colors.textPrimary,
  letterSpacing: "-0.01em",
});

// ─── Day headers ───────────────────────────────────────────────
const dayHeaderGridCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  marginBottom: "6px",
});
const dayHeaderCss = css({
  textAlign: "center",
  fontSize: "11px",
  fontWeight: "700",
  paddingBlock: "4px",
});
const daySunCss = css({ color: "rgba(239,68,68,0.6)" });
const daySatCss = css({ color: "rgba(96,165,250,0.6)" });
const dayWeekCss = css({ color: colors.textDimmer });

// ─── Date grid ─────────────────────────────────────────────────
const dateGridCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "2px",
});
const dateCellCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "1",
});
const dateBtnBaseCss = css({
  width: "34px",
  height: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9999px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  color: colors.textSecondary,
  transition: "all 0.15s",
  _hover: { backgroundColor: "rgba(245,158,11,0.1)", color: colors.brand },
});
const dateBtnTodayCss = css({
  border: `1.5px solid rgba(245,158,11,0.5)`,
  color: colors.brand,
  fontWeight: "700",
});
const dateBtnSelectedCss = css({
  backgroundColor: colors.brand,
  color: colors.bgPage,
  fontWeight: "900",
  _hover: { backgroundColor: colors.brandHover },
});
const dateBtnOutsideCss = css({ color: colors.textDimmest, opacity: "0.35" });
const dateBtnSunCss = css({ color: "rgba(239,68,68,0.55)" });
const dateBtnSatCss = css({ color: "rgba(96,165,250,0.55)" });

// ─── Clear button ──────────────────────────────────────────────
const clearBtnCss = css({
  width: "100%",
  marginTop: "12px",
  paddingBlock: "7px",
  borderRadius: "0.5rem",
  border: `1px solid ${colors.borderInput}`,
  background: "none",
  color: colors.textFaint,
  fontSize: "12px",
  cursor: "pointer",
  transition: "all 0.15s",
  _hover: { borderColor: colors.danger, color: "rgba(239,68,68,0.7)" },
});

// ─── Component ────────────────────────────────────────────────
export default function DatePicker({ value, onChange, placeholder = "날짜 선택" }) {
  const parsed = parseDate(value);
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.y ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.m ?? today.getMonth());

  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const select = (y, m, d) => {
    onChange(toDateStr(y, m, d));
    setOpen(false);
  };

  // Build calendar grid (include leading/trailing days for full rows)
  const firstDay = getFirstDay(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const daysInPrev = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1,
  );
  const cells = [];
  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ d: daysInPrev - i, outside: true, prev: true });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ d, outside: false });
  }
  // Trailing days to fill last row
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= remaining; d++) {
    cells.push({ d, outside: true, next: true });
  }

  const todayVal = todayStr();
  const selectedVal = value || "";

  const formatDisplay = (v) => {
    if (!v) return null;
    const p = parseDate(v);
    if (!p) return null;
    const dayName = new Date(p.y, p.m, p.d).toLocaleDateString("ko-KR", { weekday: "short" });
    return `${p.y}. ${p.m + 1}. ${p.d}. (${dayName})`;
  };

  return (
    <div className={dropWrapCss} ref={wrapRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(triggerCss, open && triggerOpenCss)}
      >
        <span className={triggerIconCss}><Calendar size={15} /></span>
        <span className={cx(triggerTextCss, !value && triggerPlaceholderCss)}>
          {formatDisplay(value) ?? placeholder}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className={dropCss}>
          {/* Header */}
          <div className={calHeaderCss}>
            <button type="button" onClick={prevMonth} className={calNavBtnCss}>
              <ChevronLeft size={16} />
            </button>
            <span className={calMonthCss}>
              {viewYear}년 {MONTHS[viewMonth]}
            </span>
            <button type="button" onClick={nextMonth} className={calNavBtnCss}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className={dayHeaderGridCss}>
            {DAYS.map((d, i) => (
              <div
                key={i}
                className={cx(
                  dayHeaderCss,
                  i === 0 ? daySunCss : i === 6 ? daySatCss : dayWeekCss,
                )}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className={dateGridCss}>
            {cells.map((cell, idx) => {
              const col = idx % 7; // 0=Sun, 6=Sat
              let y = viewYear, m = viewMonth;
              if (cell.prev) {
                m = viewMonth === 0 ? 11 : viewMonth - 1;
                y = viewMonth === 0 ? viewYear - 1 : viewYear;
              } else if (cell.next) {
                m = viewMonth === 11 ? 0 : viewMonth + 1;
                y = viewMonth === 11 ? viewYear + 1 : viewYear;
              }
              const cellStr = toDateStr(y, m, cell.d);
              const isToday = !cell.outside && cellStr === todayVal;
              const isSelected = cellStr === selectedVal;

              return (
                <div key={idx} className={dateCellCss}>
                  <button
                    type="button"
                    onClick={() => select(y, m, cell.d)}
                    className={cx(
                      dateBtnBaseCss,
                      isSelected && dateBtnSelectedCss,
                      !isSelected && isToday && dateBtnTodayCss,
                      !isSelected && cell.outside && dateBtnOutsideCss,
                      !isSelected && !cell.outside && col === 0 && dateBtnSunCss,
                      !isSelected && !cell.outside && col === 6 && dateBtnSatCss,
                    )}
                  >
                    {cell.d}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Clear */}
          {value && (
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className={clearBtnCss}
            >
              선택 초기화
            </button>
          )}
        </div>
      )}
    </div>
  );
}
