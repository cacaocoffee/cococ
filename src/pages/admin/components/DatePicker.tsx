import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

interface ParsedDate {
  y: number;
  m: number;
  d: number;
}

interface CalendarCell {
  d: number;
  outside: boolean;
  prev?: boolean;
  next?: boolean;
}

function getDaysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDay(y: number, m: number): number {
  return new Date(y, m, 1).getDay();
}
function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function parseDate(str: string): ParsedDate | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return { y, m: m - 1, d };
}
function todayStr(): string {
  const t = new Date();
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}

// ─── Trigger button ────────────────────────────────────────────
const triggerCss = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  backgroundColor: colors.bgSection,
  border: "1px solid transparent",
  borderRadius: "14px",
  paddingInline: "14px",
  paddingBlock: "11px",
  cursor: "pointer",
  transition: "border-color 0.2s",
  _hover: { borderColor: colors.borderStrong },
});
const triggerOpenCss = css({ borderColor: colors.textPrimary });
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
  // 그림자 대신 진한 가는 선으로 아래 내용과 나눈다
  border: `1px solid ${colors.borderStrong}`,
  borderRadius: "20px",
  padding: "20px",
  width: "300px",
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
  borderRadius: "10px",
  border: "none",
  background: "none",
  cursor: "pointer",
  color: colors.textMuted,
  transition: "all 0.15s",
  _hover: { backgroundColor: colors.bgSection, color: colors.textPrimary },
});
const calMonthCss = css({
  fontSize: "15px",
  fontWeight: "700",
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
const daySunCss = css({ color: colors.danger });
const daySatCss = css({ color: colors.info });
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
  _hover: { backgroundColor: colors.bgSection, color: colors.textPrimary },
});
const dateBtnTodayCss = css({
  border: `1.5px solid ${colors.textPrimary}`,
  color: colors.textPrimary,
  fontWeight: "700",
});
const dateBtnSelectedCss = css({
  backgroundColor: colors.brand,
  color: colors.onInk,
  fontWeight: "700",
  _hover: { backgroundColor: colors.brandHover },
});
const dateBtnOutsideCss = css({ color: colors.textDimmest, opacity: "0.35" });
const dateBtnSunCss = css({ color: colors.danger });
const dateBtnSatCss = css({ color: colors.info });

// ─── Clear button ──────────────────────────────────────────────
const clearBtnCss = css({
  width: "100%",
  marginTop: "12px",
  paddingBlock: "7px",
  borderRadius: "10px",
  border: `1px solid ${colors.borderInput}`,
  background: "none",
  color: colors.textFaint,
  fontSize: "12px",
  cursor: "pointer",
  transition: "all 0.15s",
  _hover: { borderColor: colors.danger, color: colors.danger },
});

// ─── Component ────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = "날짜 선택" }: Props) {
  const parsed = parseDate(value);
  const today = new Date();

  const [open, setOpen] = useState<boolean>(false);
  const [viewYear, setViewYear] = useState<number>(parsed?.y ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsed?.m ?? today.getMonth());

  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
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

  const select = (y: number, m: number, d: number) => {
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
  const cells: CalendarCell[] = [];
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

  const formatDisplay = (v: string): string | null => {
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
